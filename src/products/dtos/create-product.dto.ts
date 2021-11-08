import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Product } from '../entities/product.entity';

@InputType()
export class CreateProductInput extends PickType(Product, [
  'title',
  'thumbnail',
  'address',
  'detailAddress',
  'photos',
  'learningTime',
  'daysOfActive',
  'introduce',
  'curriculum',
  'minPerson',
  'maxPerson',
  'price',
]) {
  @Field((type) => String)
  category: string;
}

@ObjectType()
export class CreateProductOutput extends CoreOutput {}
