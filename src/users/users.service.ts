import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { REGISTER_TOKEN } from 'src/common/constants';
import { ErrorMessage } from 'src/common/dtos/output.dto';
import { Repository } from 'typeorm';
import {
  GetSocialProfileOutput,
  SocialProfile,
} from './dtos/get-social-profile.dto';
import { LoginWithSocialInput } from './dtos/login-with-social.dto';
import { RegisterWithSocialInput } from './dtos/register-with-social.dto';
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
  ) {}


    console.log(users);
    return { ok: true };
  }
  async getSocialProfile(cookies): Promise<GetSocialProfileOutput> {
    try {
      const token = cookies[REGISTER_TOKEN];
      if (!token) throw new Error(ErrorMessage.NOT_FOUND_REGISTER_TOKEN);

      const profile = (await this.authService.decodedToken<SocialProfile>(
        token,
      )) as SocialProfile;
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
}
