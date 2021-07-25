import { Resolver, Query } from '@nestjs/graphql';
import { Category } from 'src/categories/entities/catrgory.entity';
import { CategoriesService } from './categories.service';

@Resolver((of) => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category])
  getPopularCategories() {
    return this.categoriesService.getPopularCategories();
  }
}
