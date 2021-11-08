import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@InputType('ScheduleInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Schedule extends CoreEntity {
  @Field((type) => String)
  @Column({ type: 'date' })
  date: Date;

  @Field((type) => [String])
  @Column({ type: 'simple-array' })
  activeTimes: string[];

  @ManyToOne((type) => Product, (product) => product.schedules, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
