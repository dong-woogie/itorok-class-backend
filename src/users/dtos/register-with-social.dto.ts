import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class RegisterWithSocialInput {
  @Field((type) => String)
  username: string;

  @Field((type) => String)
  displayName: string;

  @Field((type) => String, { nullable: true })
  shortBio?: string;
}

@ObjectType()
export class RegisterWithSocialOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  accessToken?: string;
}
