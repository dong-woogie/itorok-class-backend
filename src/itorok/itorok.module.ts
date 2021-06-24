import { Module } from '@nestjs/common';
import { ItorokResolver } from './itorok.resolver';

@Module({
  providers: [ItorokResolver],
})
export class ItorokModule {}
