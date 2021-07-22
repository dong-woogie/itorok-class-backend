import { Field, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@ObjectType()
export class RefreshTokenType {
  userId: string;
  tokenId: string;
  exp: number;
  iat: number;
}
@Entity()
@ObjectType()
export class AuthToken extends CoreEntity {
  @OneToOne((type) => User, (user) => user.token, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
