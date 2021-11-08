import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/catrgory.entity';
import { Product } from './entities/product.entity';
import { Schedule } from './entities/schedule.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Schedule])],
  providers: [ProductsResolver, ProductsService],
  exports: [],
})
export class ProductsModule {}
