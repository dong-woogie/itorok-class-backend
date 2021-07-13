import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => CoreOutput)
  findUser() {
    return this.usersService.findAllUser();
  }
}
