import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCategoryInput,
  CreateCategoryOutput,
} from './dtos/create-category.dto';
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

  async createCategory(
    createCategoryInput: CreateCategoryInput,
  ): Promise<CreateCategoryOutput> {
    const { coverImg, slug, name } = createCategoryInput;

    const category = new Category();

    category.coverImg = coverImg;
    category.slug = slug;
    category.name = name;

    const newCategory = await this.categories.save(category);

    return { ok: true, category: newCategory };
  }

  async removeAllCategory() {
    try {
      const cateogories = await this.categories.find();
      await this.categories.remove(cateogories);
      return true;
    } catch {
      return false;
    }
  }
}
