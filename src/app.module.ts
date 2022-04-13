import { AppService } from './app.service';
import { AppController } from './app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { UserProfile } from './users/entities/user-profile.entity';
import { SocialAccount } from './users/entities/social-account.entity';
import { AuthModule } from './auth/auth.module';
import { AuthToken } from './users/entities/auth-token.entity';
import { Apimodule } from './api/api.module';
import { Category } from './categories/entities/catrgory.entity';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { Schedule } from './products/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.development.env'
          : '.env.prod',

      // ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        PORT: Joi.string(),
        DB_NAME: Joi.string(),
        DB_HOST: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_PORT: Joi.string(),
        KAKAO_CLIENT_ID: Joi.string(),
        KAKAO_REDIRECT_URI: Joi.string(),
        SECRET_KEY: Joi.string(),
        REDIRECT_URI: Joi.string(),
        KAKAO_API_URI: Joi.string(),
        NAVER_API_SERVICE_ID: Joi.string(),
        NAVER_API_SEVICE_SECRET_KEY: Joi.string(),
        NAVER_API_ACCESS_KEY: Joi.string(),
        NAVER_API_SECRET_KEY: Joi.string(),
        NAVER_MESSAGE_API_URL: Joi.string(),
        CALLER_NUMBER: Joi.string(),
        AWS_ACCESS_KEY: Joi.string(),
        AWS_SECRET_KEY: Joi.string(),
        BUCKET_NAME: Joi.string(),
      }),
    }),
    //   GraphQLModule.forRoot({
    //     autoSchemaFile: true,
    //     context: ({ req, res, connection }) => {
    //       if (req) {
    //         const accessToken = req.headers?.authorization?.substr(7) || '';
    //         return { cookies: req.cookies, res: res, access_token: accessToken };
    //       } else {
    //         return {
    //           access_token: connection.context?.authorization?.substr(7) || '',
    //         };
    //       }
    //     },
    //     installSubscriptionHandlers: true,
    //     cors: false,
    //   }),
    //   TypeOrmModule.forRoot({
    //     type: 'postgres',
    //     host: process.env.DB_HOST,
    //     database: process.env.DB_NAME,
    //     port: +process.env.DB_PORT,
    //     username: process.env.DB_USERNAME,
    //     password: process.env.DB_PASSWORD,
    //     entities: [
    //       User,
    //       UserProfile,
    //       SocialAccount,
    //       AuthToken,
    //       Category,
    //       Product,
    //       Schedule,
    //     ],
    //     synchronize: true,
    //     logging: true,
    //     keepConnectionAlive: true,
    //   }),
    //   UsersModule,
    //   AuthModule,
    //   Apimodule,
    //   CategoriesModule,
    //   ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
