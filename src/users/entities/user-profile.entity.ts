import { Field } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserProfile extends CoreEntity {
  @Field((type) => String)
  @Column({ length: 255, nullable: true })
  shortBio: string | null;

  @Field((type) => String)
  @Column({ nullable: true })
  thumbnail: string | null;

  @Field((type) => String)
  @Column()
  displayName: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  user: User;
}
