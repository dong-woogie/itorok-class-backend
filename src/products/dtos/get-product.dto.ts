import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Product } from '../entities/product.entity';

@InputType()
export class GetProductInput {
  @Field((type) => String)
  productId: string;
}

@ObjectType()
export class GetProductOutput extends CoreOutput {
  @Field((type) => Product)
  product?: Product;
}
