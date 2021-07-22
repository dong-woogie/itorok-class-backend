import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN,
  KAKAO_API_URI,
  ONE_DAY,
  ONE_HOUR,
  REFRESH_TOKEN,
  SECRET_KEY,
} from 'src/common/constants';
import { SocialProvider } from 'src/users/entities/social-account.entity';
import * as qs from 'querystring';
import { AuthToken } from 'src/users/entities/auth-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(AuthToken)
    private readonly authTokens: Repository<AuthToken>,
  ) {}

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
      socialId: data.id.toString() as string,
      displayName: data.properties.nickname as string,
      thumbnail: data.properties.thumbnail_image as string,
      provider,
    };
  }

  decodedToken<T = any>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.configService.get(SECRET_KEY), (err, decoded) => {
        if (err) reject(err);
        resolve(decoded as any);
      });
    });
  }

  setCookies(
    res: Response,
    {
      accessToken,
      refreshToken,
    }: {
      accessToken: string;
      refreshToken: string;
    },
  ) {
    res.cookie(ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      // 1h
      maxAge: ONE_HOUR,
    });

    res.cookie(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      // 30d
      maxAge: ONE_DAY * 30,
    });
  }

  async generateUserToken(user: User) {
    let authToken = await this.authTokens.findOne({
      user,
    });
    if (authToken) {
      await this.authTokens.remove(authToken);
    }

    authToken = new AuthToken();
    authToken.user = user;
    await this.authTokens.save(authToken);

    const accessToken = await this.generateToken(
      { userId: user.id },
      { expiresIn: '1h' },
    );

    const refreshToken = await this.generateToken(
      {
        userId: user.id,
        tokenId: authToken.id,
      },
      {
        expiresIn: '30d',
      },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
