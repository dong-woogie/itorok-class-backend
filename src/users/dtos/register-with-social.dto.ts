import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Gender, User, UserRole } from '../entities/user.entity';

@InputType()
export class RegisterWithSocialInput {
  @Field((type) => String)
  displayName: string;

  @Field((type) => String)
  username: string;

  @Field((type) => UserRole)
  role: UserRole;

  @Field((type) => String, { nullable: true })
  address?: string;

  @Field((type) => String, { nullable: true })
  detailAddress?: string;

  @Field((type) => Gender, { nullable: true })
  gender?: Gender;

  @Field((type) => String, { nullable: true })
  phoneNumber?: string;

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
