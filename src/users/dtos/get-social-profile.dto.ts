import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SocialProvider } from '../entities/social-account.entity';

@ObjectType()
export class SocialProfile {
  @Field((type) => String, { nullable: true })
  socialId?: string;
  @Field((type) => String, { nullable: true })
  displayName?: string;
  @Field((type) => String, { nullable: true })
  thumbnail?: string;
  @Field((type) => String, { nullable: true })
  username?: string;
  @Field((type) => String, { nullable: true })
  shortBio?: string;
  @Field((type) => SocialProvider, { nullable: true })
  provider?: SocialProvider;
}

@ObjectType()
export class GetSocialProfileOutput extends CoreOutput {
  @Field((type) => SocialProfile, { nullable: true })
  profile?: SocialProfile;
}
