import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ONE_DAY, REFRESH_TOKEN, REGISTER_TOKEN } from 'src/common/constants';
import { ErrorMessage } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import {
  GetSocialProfileOutput,
  SocialProfile,
} from './dtos/get-social-profile.dto';
import {
  LoginWithSocialInput,
  LoginWithSocialOutput,
} from './dtos/login-with-social.dto';
import {
  RegisterWithSocialInput,
  RegisterWithSocialOutput,
} from './dtos/register-with-social.dto';
import { UpdateUserInput } from './dtos/update-user.dto';
import { AuthToken } from './entities/auth-token.entity';
import { SocialAccount } from './entities/social-account.entity';
import { UserProfile } from './entities/user-profile.entity';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(SocialAccount)
    private readonly socialAccounts: Repository<SocialAccount>,
    @InjectRepository(UserProfile)
    private readonly profiles: Repository<UserProfile>,
    private readonly authService: AuthService,
    @InjectRepository(AuthToken)
    private readonly authTokens: Repository<AuthToken>,
  ) {}

  async loginWithSocial(
    res: Response,
    { code, provider, role }: LoginWithSocialInput,
  ): Promise<LoginWithSocialOutput> {
    const { access_token } = await this.authService.getSocialToken(code);
    const socialProfile = await this.authService.getSocialProfile(
      access_token,
      provider,
    );

    const exist = await this.socialAccounts
      .createQueryBuilder('socialAccount')
      .where('socialAccount.socialId = :socialId', {
        socialId: socialProfile.socialId,
      })
      .andWhere('socialAccount.provider = :provider', { provider })
      .innerJoinAndSelect('socialAccount.user', 'user')
      .andWhere('user.role = :role', { role })
      .getOne();

    // when account is not created
    if (!exist) {
      res.cookie(
        REGISTER_TOKEN,
        await this.authService.generateToken(socialProfile),
        {
          maxAge: 1000 * 60 * 30,
          httpOnly: true,
        },
      );
      if (role === UserRole.mentor) {
        return {
          ok: false,
          error: ErrorMessage.NOT_REGISTER_MENTOR,
        };
      }
      return {
        ok: false,
        error: ErrorMessage.NOT_REGISTER_CLIENT,
      };
    }

    // correct login
    // set cookie refresh_token, response access_token

    const user = await this.users.findOne(exist.user.id, {
      relations: ['profile'],
    });
    const tokens = await this.authService.generateUserToken(user);
    res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      // 30d
      maxAge: ONE_DAY * 30,
    });
    return { ok: true, accessToken: tokens.accessToken, user };
  }

  async registerWithSocial(
    res: Response,
    cookies,
    registerWithSocialInput: RegisterWithSocialInput,
  ): Promise<RegisterWithSocialOutput> {
    try {
      const token = cookies[REGISTER_TOKEN];

      if (!token) throw new Error(ErrorMessage.NOT_FOUND_REGISTER_TOKEN);

      const {
        shortBio,
        displayName,
        username,
        phoneNumber,
        role,
        address,
        detailAddress,
        gender,
      } = registerWithSocialInput;
      const decoded = await this.authService.decodedToken(token);

      const user = new User();
      const profile = new UserProfile();
      const socialAccount = new SocialAccount();

      user.username = username;
      user.role = role;
      user.phoneNumber = phoneNumber;
      user.address = address;
      user.detailAddress = detailAddress;
      user.gender = gender;
      await this.users.save(user);

      profile.displayName = displayName;
      profile.shortBio = shortBio;
      profile.thumbnail = decoded.thumbnail;
      profile.user = user;
      await this.profiles.save(profile);

      socialAccount.provider = decoded.provider;
      socialAccount.socialId = decoded.socialId;
      socialAccount.user = user;
      await this.socialAccounts.save(socialAccount);

      // correct register
      res.clearCookie(REGISTER_TOKEN);
      const tokens = await this.authService.generateUserToken(user);

      res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        // 30d
        maxAge: ONE_DAY * 30,
      });

      return {
        ok: true,
        accessToken: tokens.accessToken,
        user: { ...user, profile },
      };
    } catch (e) {
      return {
        ok: false,
        error: e?.message,
      };
    }
  }

  async getSocialProfile(cookies): Promise<GetSocialProfileOutput> {
    try {
      const token = cookies[REGISTER_TOKEN];
      if (!token) throw new Error(ErrorMessage.NOT_FOUND_REGISTER_TOKEN);

      const profile = await this.authService.decodedToken<SocialProfile>(token);
      return {
        ok: true,
        profile,
      };
    } catch (e) {
      return {
        ok: false,
        error: e?.message,
      };
    }
  }

  async getUserOnLoad(userId: string) {
    const user = await this.users.findOne(userId, {
      relations: ['profile'],
    });

    return user;
  }

  async logout(user: User, res: Response) {
    const token = await this.authTokens.findOne({
      where: {
        user,
      },
    });
    if (token) await this.authTokens.remove([token]);
    res.clearCookie(REFRESH_TOKEN);
    return true;
  }

  async updateUser(userId: string, updateUserInput: UpdateUserInput) {
    try {
      const user = await this.users.findOne(userId, {
        relations: ['profile'],
      });

      user.address = updateUserInput.address;
      user.detailAddress = updateUserInput.detailAddress;

      const updateUser = await this.users.save({
        ...user,
        ...updateUserInput,
      });

      return { ok: true, user: updateUser };
    } catch {
      return { ok: false };
    }
  }
}
