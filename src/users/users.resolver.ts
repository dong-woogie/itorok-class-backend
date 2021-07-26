import { Response } from 'express';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { GetCookies } from 'src/auth/get-cookies.decorator';
import { GqlResponse } from 'src/auth/gql-response.decorator';
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
import { Roles } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';

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

  @Query((returns) => User)
  @Roles(['any'])
  getUserOnLoad(@AuthUser() user: User) {
    return this.usersService.getUserOnLoad(user.id);
  }

  @Mutation((returns) => Boolean)
  @Roles(['any'])
  logout(@AuthUser() user: User, @GqlResponse() res: Response) {
    return this.usersService.logout(user, res);
  }
}
