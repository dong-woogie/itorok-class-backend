import { CacheModule, Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';

@Module({
  imports: [CacheModule.register()],
  providers: [ApiService],
  controllers: [ApiController],
})
export class Apimodule {}
