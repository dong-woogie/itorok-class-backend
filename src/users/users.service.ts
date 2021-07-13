import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async findAllUser() {
    const users = await this.users.find({
      relations: ['profile'],
    });

    console.log(users);
    return { ok: true };
  }
}
