import { Module } from '@nestjs/common';
import { OauthsController } from './oauths.controller';

@Module({
  controllers: [OauthsController],
})
export class OauthsModule {}
