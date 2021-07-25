import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/catrgory.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  async getPopularCategories(): Promise<Category[]> {
    const categories = await this.categories.find({
      where: {},
    });
    return categories;
  }
}
