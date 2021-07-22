import { Response } from 'express';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetCookies } from 'src/auth/get-cookies.decorator';
import { GqlResponse } from 'src/auth/gql-response.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { GetSocialProfileOutput } from './dtos/get-social-profile.dto';
import {
  LoginWithSocialInput,
  LoginWithSocialOutput,
} from './dtos/login-with-social.dto';
import {
  RegisterWithSocialInput,
  RegisterWithSocialOutput,
} from './dtos/register-with-social.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => GetSocialProfileOutput)
  getSocialProfile(@GetCookies() cookies) {
    return this.usersService.getSocialProfile(cookies);
  }

  @Mutation((returns) => LoginWithSocialOutput)
  loginWithSocial(
    @GqlResponse() res: Response,
    @Args('input') loginWithsocialInput: LoginWithSocialInput,
  ) {
    return this.usersService.loginWithSocial(res, loginWithsocialInput);
  }

  @Mutation((returns) => RegisterWithSocialOutput)
  registerWithSocial(
    @GqlResponse() res: Response,
    @GetCookies() cookies,
    @Args('input') registerWithSocialInput: RegisterWithSocialInput,
  ) {
    return this.usersService.registerWithSocial(
      res,
      cookies,
      registerWithSocialInput,
    );
  }

  }
}
