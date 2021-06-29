import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SocialAccount } from './entities/social-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, SocialAccount])],
  providers: [UsersResolver, UsersService],
  exports: [],
})
export class UsersModule {}
