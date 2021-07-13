import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import {
  ACCESS_TOKEN,
  REDIRECT_URI,
  REGISTER_TOKEN,
} from 'src/common/constants';
import {
  SocialAccount,
  SocialProvider,
} from 'src/users/entities/social-account.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SocialRegisterInputType } from './dto/register.dto';

@Injectable()
export class SocialService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfiles: Repository<UserProfile>,
    @InjectRepository(SocialAccount)
    private readonly socialAccounts: Repository<SocialAccount>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async kakaoLogin(
    res: Response,
    query: { code: string; state: SocialProvider },
  ) {
    if (!query.code) {
      return res.redirect(`${this.configService.get(REDIRECT_URI)}/login`);
    }
    const { access_token } = await this.authService.getSocialToken(query.code);
    const profile = await this.authService.getSocialProfile(
      access_token,
      query.state,
    );
    const exist = await this.socialAccounts.findOne({
      where: {
        socialId: profile.socialId,
        provider: query.state,
      },
      relations: ['user'],
    });

    // redirect register page
    if (!exist) {
      const registerToken = await this.authService.generateToken(profile, {
        expiresIn: '1h',
      });

      res.cookie('register_token', registerToken, { maxAge: 1000 * 60 * 60 });
      return res.redirect(
        `${this.configService.get(REDIRECT_URI)}/social/register`,
      );
    }

    // collect login
    const token = await this.authService.generateToken({ id: exist.user.id });
    res.cookie('access_token', token);
    res.redirect(this.configService.get(REDIRECT_URI));
  }

  async getSocialProfileWhenRegister(req: Request, res: Response) {
    const token = this.authService.getCookieValue(req, 'register_token');
    if (!token) return res.status(401).send('Unauthorized');

    try {
      const profile = await this.authService.decodedToken(token);
      res.json(profile);
    } catch (e) {
      res.status(400).send(e?.messagee || 'error');
    }
  }

  async socialRegister(
    req: Request,
    res: Response,
    body: SocialRegisterInputType,
  ) {
    try {
      const token = await this.authService.getCookieValue(req, REGISTER_TOKEN);
      if (!token) throw new Error('expired token');

      const socialProfile = await this.authService.decodedToken(token);
      const { displayName, shortBio, username } = body;

      const user = new User();
      const profile = new UserProfile();
      const socialAccount = new SocialAccount();

      profile.displayName = displayName;
      profile.shortBio = shortBio;
      profile.thumbnail = socialProfile.thumbnail;
      const newProfile = await this.userProfiles.save(profile);

      user.username = username;
      user.role = UserRole.client;
      user.profile = newProfile;
      await this.users.save(user);

      newProfile.user = user;
      await this.userProfiles.save(newProfile);

      socialAccount.provider = socialProfile.provider;
      socialAccount.socialId = socialProfile.socialId;
      socialAccount.user = user;

      await this.socialAccounts.save(socialAccount);

      const accessToken = await this.authService.generateToken(
        { id: user.id },
        { expiresIn: '1d' },
      );

      res.clearCookie(REGISTER_TOKEN);
      res.cookie(ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
      });
      res.json({ ok: true });
    } catch (e) {
      res.json({
        ok: false,
        error: e?.message || 'error',
      });
    }
  }
}
