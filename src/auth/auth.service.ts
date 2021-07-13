import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { KAKAO_API_URI, SECRET_KEY } from 'src/common/constants';
import { SocialProvider } from 'src/users/entities/social-account.entity';
import * as qs from 'querystring';

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(payload: any, options?: jwt.SignOptions): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        this.configService.get(SECRET_KEY),
        {
          expiresIn: '7d',
          ...options,
        },
        (err, encoded) => {
          if (err) reject(err);
          resolve(encoded);
        },
      );
    });
  }

  // refreshToken() {}

  async getSocialToken(code: string) {
    const { data } = await axios({
      url: 'https://kauth.kakao.com/oauth/token',
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_CLIENT_ID,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
        code,
      },
    });

    return {
      access_token: data.access_token as string,
      refresh_token: data.refresh_token as string,
    };
  }

  async getSocialProfile(accessToken: string, provider: SocialProvider) {
    const { data } = await axios({
      method: 'GET',
      url: `${this.configService.get(KAKAO_API_URI)}/v2/user/me`,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      socialId: data.id.toString(),
      displayName: data.properties.nickname,
      thumbnail: data.properties.thumbnail_image,
      provider,
    };
  }

  getCookieValue(req: Request, cookieName: string): string {
    const cookies = qs.parse(req.headers.cookie);
    return cookies[cookieName] as string;
  }

  decodedToken(token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.configService.get(SECRET_KEY), (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }
}
