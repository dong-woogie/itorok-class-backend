import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SocialAccount } from './entities/social-account.entity';
import { UserProfile } from './entities/user-profile.entity';
import { AuthToken } from './entities/auth-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, SocialAccount, UserProfile, AuthToken]),
  ],
  providers: [UsersResolver, UsersService],
  exports: [],
})
export class UsersModule {}
