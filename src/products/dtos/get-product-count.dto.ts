import { Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';

@ObjectType()
export class GetProductCountOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  productCount?: number;
}
