import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserProfile } from './user-profile.entity';

export enum UserRole {
  client = 'client',
  owner = 'owner',
}

registerEnumType(UserRole, {
  name: 'UserRole',
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

  @Field((type) => UserProfile)
  @OneToOne((type) => UserProfile, (profile) => profile.user)
  @JoinColumn()
  profile: UserProfile;
}
