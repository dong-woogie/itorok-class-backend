import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Category } from 'src/categories/entities/catrgory.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

export enum ScheduleType {
  repeatDay = 'repeatDay',
}

registerEnumType(ScheduleType, { name: 'ScheduleType' });

@InputType('TypeTypeInput')
@ObjectType()
export class TimeType {
  @Field((type) => Number)
  hour: number;
  @Field((type) => Number)
  minute: number;
}

@InputType('DaysOfActiveInput', { isAbstract: true })
@ObjectType()
export class DaysOfActive {
  @Field((type) => [String])
  sun: string[];
  @Field((type) => [String])
  mon: string[];
  @Field((type) => [String])
  tue: string[];
  @Field((type) => [String])
  wed: string[];
  @Field((type) => [String])
  thu: string[];
  @Field((type) => [String])
  fri: string[];
  @Field((type) => [String])
  sat: string[];
}

@InputType('ProductInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Product extends CoreEntity {
  @Field((type) => String)
  @Column()
  title: string;

  @Field((type) => String)
  @Column()
  address: string;

  @Field((type) => String)
  @Column()
  detailAddress: string;

  @Field((type) => String)
  @Column()
  thumbnail: string;

  @Field((type) => [String])
  @Column({ type: 'simple-array', default: [] })
  photos: string[];

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.products, { onDelete: 'CASCADE' })
  mentor: User;

  @Field((type) => TimeType)
  @Column({ type: 'json' })
  learningTime: TimeType;

  @Field((type) => DaysOfActive)
  @Column({ type: 'json' })
  daysOfActive: DaysOfActive;

  @Field((type) => String)
  @Column('text')
  introduce: string;

  @Field((type) => String)
  @Column('text')
  curriculum: string;

  @Field((type) => Category)
  @ManyToOne((type) => Category, { onDelete: 'SET NULL' })
  category: Category;

  @Field((type) => Number)
  @Column()
  minPerson: number;

  @Field((type) => Number)
  @Column()
  maxPerson: number;

  @Field((type) => Boolean, { defaultValue: false })
  @Column({ default: false })
  isParking: boolean;

  @Field((type) => [Schedule])
  @OneToMany((type) => Schedule, (schedule) => schedule.product)
  schedules: Schedule[];

  @Field((type) => Number)
  @Column()
  price: number;
}
