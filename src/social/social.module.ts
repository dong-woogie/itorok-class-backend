import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SocialAccount } from 'src/users/entities/social-account.entity';
import { UserProfile } from 'src/users/entities/user-profile.entity';
import { User } from 'src/users/entities/user.entity';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserProfile, SocialAccount]),
    AuthModule,
  ],
  controllers: [SocialController],
  providers: [SocialService],
})
export class SocialModule {}
