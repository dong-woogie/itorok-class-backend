import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Product } from '../entities/product.entity';

@ObjectType()
export class GetProductsOutput extends CoreOutput {
  @Field((type) => [Product])
  products: Product[];
}
