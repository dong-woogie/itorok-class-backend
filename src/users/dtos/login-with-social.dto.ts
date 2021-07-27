import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { SocialProvider } from '../entities/social-account.entity';
import { User } from '../entities/user.entity';

@InputType()
export class LoginWithSocialInput {
  @Field((type) => String)
  code: string;

  @Field((type) => SocialProvider)
  state: SocialProvider;
}

@ObjectType()
export class LoginWithSocialOutput extends CoreOutput {
  @Field((type) => String, { nullable: true })
  accessToken?: string;

  @Field((type) => User, { nullable: true })
  user?: User;
}
