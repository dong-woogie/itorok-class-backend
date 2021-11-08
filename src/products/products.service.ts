import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/catrgory.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dtos/create-product.dto';
import {
  GetProductSchedulesInput,
  GetProductSchedulesOutput,
} from './dtos/get-product-schedules.dto';
import { GetProductInput } from './dtos/get-product.dto';
import { Product } from './entities/product.entity';
import { Schedule } from './entities/schedule.entity';

const daysLabel = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    @InjectRepository(Schedule)
    private readonly schedules: Repository<Schedule>,
  ) {}

  async createProduct(user: User, createProductInput: CreateProductInput) {
    const {
      title,
      category,
      address,
      detailAddress,
      learningTime,
      thumbnail,
      photos,
      daysOfActive,
      introduce,
      curriculum,
      minPerson,
      maxPerson,
    } = createProductInput;

    const product = new Product();

    const findCategory = await this.categories.findOne({
      slug: category,
    });

    product.title = title;
    product.category = findCategory;
    product.address = address;
    product.detailAddress = detailAddress;
    product.learningTime = learningTime;
    product.thumbnail = thumbnail;
    product.photos = photos;
    product.daysOfActive = daysOfActive;
    product.introduce = introduce;
    product.curriculum = curriculum;
    product.minPerson = minPerson;
    product.maxPerson = maxPerson;

    // product.price = price

    product.mentor = user;

    const newProduct = await this.products.save(product);

    Array.from({ length: 14 }).forEach(async (_, index) => {
      const date = new Date();

      // 클래스 생성 후 2일 후부터 예약가능
      date.setDate(date.getDate() + index + 2);
      const startTimes = daysOfActive[daysLabel[date.getDay()]] as string[];

      if (startTimes.length === 0) return;

      const schedule = new Schedule();

      schedule.product = newProduct;
      schedule.activeTimes = startTimes;
      schedule.date = date;

      await this.schedules.save(schedule);
    });

    return { ok: true };
  }

  async getProduct({ productId }: GetProductInput) {
    try {
      const product = await this.products
        .createQueryBuilder('product')
        .where('product.id = :productId', { productId })
        .innerJoinAndSelect('product.schedules', 'schedules')
        .innerJoinAndSelect('product.category', 'category')
        .orderBy('schedules.date', 'ASC')
        .getOne();

      return { ok: true, product };
    } catch (e) {
      return { ok: false };
    }
  }

  async getProductSchedules({
    scheduleId,
  }: GetProductSchedulesInput): Promise<GetProductSchedulesOutput> {
    try {
      const schedule = await this.schedules.findOne(scheduleId, {
        relations: ['product'],
      });
      const product = schedule.product;

      const scheduleTimes = schedule.activeTimes.map((time) => {
        return {
          learningTime: product.learningTime,
          minPerson: product.minPerson,
          maxPerson: product.maxPerson,
          date: time,
          applyPerson: 0,
        };
      });

      return { ok: true, scheduleTimes };
    } catch {
      return { ok: false };
    }
  }

  async getProductCount(user: User) {
    try {
      const productCount = await this.products.count({
        where: { mentor: user },
      });
      return { ok: true, productCount };
    } catch {
      return { ok: false };
    }
  }

  async getProducts() {
    try {
      const products = await this.products
        .createQueryBuilder('product')
        .innerJoinAndSelect('product.category', 'category')
        .innerJoinAndSelect('product.mentor', 'mentor')
        .innerJoinAndSelect('mentor.profile', 'profile')
        .take(4)
        .getMany();

      return { ok: true, products };
    } catch {
      return { ok: false };
    }
  }
}
