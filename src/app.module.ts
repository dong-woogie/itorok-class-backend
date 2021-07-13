import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialModule } from './social/social.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { UserProfile } from './users/entities/user-profile.entity';
import { SocialAccount } from './users/entities/social-account.entity';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      cors: false,
    }),
    SocialModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: '.development.env',
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test'),
        DB_NAME: Joi.string(),
        DB_HOST: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_PORT: Joi.string(),
        SECRET_KEY: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: +process.env.DB_PORT,
      entities: [User, UserProfile, SocialAccount],
      synchronize: true,
      logging: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
