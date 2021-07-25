import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Field((type) => String)
  @Column()
  name: string;

  @Field((type) => String)
  @Column()
  slug: string;

  @Field((type) => String)
  @Column()
  coverImg: string;
}
