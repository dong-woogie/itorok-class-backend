import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

export enum SocialProvider {
  kakao = 'kakao',
  google = 'google',
  facebook = 'facebook',
}

registerEnumType(SocialProvider, {
  name: 'SocialProvider',
});

@Index(['socialId', 'provider'])
@ObjectType()
@InputType('SocialAccountInputType', { isAbstract: true })
@Entity()
export class SocialAccount extends CoreEntity {
  @Field((type) => SocialProvider)
  @Column({ type: 'enum', enum: SocialProvider })
  provider: SocialProvider;

  @Field((type) => String)
  @Column()
  socialId: string;

  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
