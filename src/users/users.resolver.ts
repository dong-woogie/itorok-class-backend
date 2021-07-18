import { Response } from 'express';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetCookies } from 'src/auth/get-cookies.decorator';
import { GqlResponse } from 'src/auth/gql-response.decorator';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { GetSocialProfileOutput } from './dtos/get-social-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => GetSocialProfileOutput)
  getSocialProfile(@GetCookies() cookies) {
    return this.usersService.getSocialProfile(cookies);
  }

  }
}
