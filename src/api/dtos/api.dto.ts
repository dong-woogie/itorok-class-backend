import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SendCodeInput {
  phoneNumber: string;
}

@ObjectType()
export class VerifyCodeInput {
  code: string;
  phoneNumber: string;
}
