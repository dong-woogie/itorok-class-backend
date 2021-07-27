import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

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

  @Field((type) => User, { nullable: true })
  user?: User;
}
