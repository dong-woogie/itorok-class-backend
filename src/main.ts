import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { REDIRECT_URI } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env[REDIRECT_URI],
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT || 4000);
}
bootstrap();
