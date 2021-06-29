import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import Joi from 'joi';
import { Repository } from 'typeorm';
import { LoginWithSocialInput, LoginWithSocialOutput } from './dtos/login.dto';
import { SocialAccount } from './entities/social-account.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(SocialAccount)
    private readonly socialAccounts: Repository<SocialAccount>,
  ) {}

  async loginWithSocial({
    code,
    provider,
  }: LoginWithSocialInput): Promise<LoginWithSocialOutput> {
    try {
      const { access_token } = await this.getSocialToken(code);
      const profile = await this.getSocialProfile(access_token);

      const socialAccount = await this.socialAccounts.findOne({
        where: {
          socialId: profile.socialId,
          provider,
        },
      });

      console.log(socialAccount);

      // when the social account does not exist
      if (!socialAccount) {
        return {
          ok: false,
          error: 'should register a social account',
          data: profile,
        };
      }

      // correct login
      return {
        ok: true,
        data: { ...profile },
      };
    } catch (e) {
      return {
        ok: false,
      };
    }
  }

  async getSocialToken(code: string) {
    type responseDataType = {
      access_token: string;
      token_type: string;
      refresh_token: string;
      expires_in: number;
      scope: string;
      refresh_token_expires_in: number;
    };

    const { data }: { data: responseDataType } = await axios({
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

    return data;
  }

  async getSocialProfile(accessToken: string) {
    const { data } = await axios({
      method: 'GET',
      url: 'https://kapi.kakao.com/v2/user/me',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      socialId: data.id.toString(),
      displayName: data.properties.nickname,
      thumbnail: data.properties.thumbnail_image,
    };
  }
}
