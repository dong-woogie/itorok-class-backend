import {
  CreateCategoryOutput,
  CreateCategoryInput,
} from './dtos/create-category.dto';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/catrgory.entity';
import { CategoriesService } from './categories.service';

@Resolver((of) => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category])
  getPopularCategories() {
    return this.categoriesService.getPopularCategories();
  }

  @Mutation(() => CreateCategoryOutput)
  createCategory(@Args('input') createCategoryInput: CreateCategoryInput) {
    return this.categoriesService.createCategory(createCategoryInput);
  }
}
