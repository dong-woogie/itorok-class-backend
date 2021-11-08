import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { TimeType } from '../entities/product.entity';

@InputType()
export class GetProductSchedulesInput {
  @Field((type) => String)
  scheduleId: string;
}

@ObjectType()
export class ScheduleTime {
  @Field((type) => TimeType)
  learningTime: TimeType;
  @Field((type) => Number)
  minPerson: number;
  @Field((type) => Number)
  maxPerson: number;
  @Field((type) => Number)
  applyPerson: number;
  @Field((type) => String)
  date: string;
}

@ObjectType()
export class GetProductSchedulesOutput extends CoreOutput {
  @Field((type) => [ScheduleTime], { nullable: true })
  scheduleTimes?: ScheduleTime[];
}
