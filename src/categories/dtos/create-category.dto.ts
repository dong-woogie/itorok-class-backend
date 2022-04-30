import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Category } from '../entities/catrgory.entity';

@InputType()
export class CreateCategoryInput extends PickType(Category, [
  'name',
  'slug',
  'coverImg',
]) {}

@ObjectType()
export class CreateCategoryOutput extends CoreOutput {
  @Field((type) => Category)
  category: Category;
}
