import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Roles } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CreateProductInput,
  CreateProductOutput,
} from './dtos/create-product.dto';
import { GetProductCountOutput } from './dtos/get-product-count.dto';
import {
  GetProductSchedulesInput,
  GetProductSchedulesOutput,
} from './dtos/get-product-schedules.dto';
import { GetProductInput, GetProductOutput } from './dtos/get-product.dto';
import { GetProductsOutput } from './dtos/get-products.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver((of) => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation((returns) => CreateProductOutput)
  @Roles(['mentor'])
  createProduct(
    @AuthUser() user: User,
    @Args('input') createProductInput: CreateProductInput,
  ) {
    return this.productsService.createProduct(user, createProductInput);
  }

  @Query((returns) => GetProductOutput)
  getProduct(@Args('input') getProductInput: GetProductInput) {
    return this.productsService.getProduct(getProductInput);
  }

  @Query((returns) => GetProductSchedulesOutput)
  getProductSchedules(
    @Args('input') getProductSchedulesInput: GetProductSchedulesInput,
  ) {
    return this.productsService.getProductSchedules(getProductSchedulesInput);
  }

  @Query((returns) => GetProductCountOutput)
  @Roles(['mentor'])
  getProductCount(@AuthUser() user: User) {
    return this.productsService.getProductCount(user);
  }

  @Query((returns) => GetProductsOutput)
  getProducts() {
    return this.productsService.getProducts();
  }
}
