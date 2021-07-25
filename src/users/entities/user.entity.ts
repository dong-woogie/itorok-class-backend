import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, OneToOne } from 'typeorm';
import { AuthToken } from './auth-token.entity';
import { UserProfile } from './user-profile.entity';

export enum UserRole {
  client = 'client',
  author = 'author',
  manager = 'manager',
  admin = 'admin',
}

export enum Gender {
  male = 'male',
  female = 'female',
}

registerEnumType(UserRole, {
  name: 'UserRole',
});

registerEnumType(Gender, {
  name: 'Gender',
});

@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field((type) => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Field((type) => String)
  @Column({ unique: true })
  username: string;

  @Field((type) => Gender, { nullable: true })
  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender?: Gender;

  @Field((type) => UserProfile)
  @OneToOne((type) => UserProfile, (profile) => profile.user)
  profile: UserProfile;

  @Field((type) => AuthToken)
  @OneToOne((type) => AuthToken, (token) => token.user)
  token: AuthToken;
}
