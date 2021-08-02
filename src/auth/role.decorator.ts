import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/entities/user.entity';

export type RoleType = keyof typeof UserRole | 'any';

export const Roles = (roles: RoleType[]) => SetMetadata('roles', roles);
