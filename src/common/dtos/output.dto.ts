import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ErrorMessage {
  NOT_REGISTER = 'NOT_REGISTER',
  NOT_FOUND_REGISTER_TOKEN = 'NOT_FOUND_REGISTER_TOKEN',
  EXPIRED_ACCESS_TOKEN = 'EXPIRED_ACCESS_TOKEN',
  EXPIRED_REFRESH_TOKEN = 'EXPIRED_REFRESH_TOKEN',
  NOT_FOUND_ACCESS_TOKEN = 'NOT_FOUND_ACCESS_TOKEN',
  DO_LOGOUT = 'DO_LOGOUT',
  FORBIDDEN_RESOURCE = 'Forbidden resource',
}

registerEnumType(ErrorMessage, {
  name: 'ErrorMessage',
});

@ObjectType()
export class CoreOutput {
  @Field((type) => Boolean)
  ok: boolean;

  @Field((type) => ErrorMessage, { nullable: true })
  error?: ErrorMessage;
}
