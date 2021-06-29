import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class LoginWithSocialInput {
  @Field((type) => String)
  provider: string;

  @Field((type) => String)
  code: string;
}

@ObjectType()
export class SocialProfile {
  @Field((type) => String)
  socialId: string;

  @Field((type) => String)
  thumbnail: string;

  @Field((type) => String)
  displayName: string;
}

@ObjectType()
export class LoginWithSocialOutput extends CoreOutput {
  @Field((type) => SocialProfile, { nullable: true })
  data?: SocialProfile;
}
