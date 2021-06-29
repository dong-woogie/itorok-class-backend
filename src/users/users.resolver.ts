import { Query } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { LoginWithSocialInput, LoginWithSocialOutput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation((type) => LoginWithSocialOutput)
  loginWithSocial(@Args('input') loginWithSocialInput: LoginWithSocialInput) {
    return this.usersService.loginWithSocial(loginWithSocialInput);
  }
}
