import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CoreEntity {
  @Index()
  @Field((type) => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field((type) => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field((type) => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}
