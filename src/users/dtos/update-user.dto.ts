import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PickType(User, [
  'address',
  'detailAddress',
]) {}

@ObjectType()
export class UpdateUserOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
