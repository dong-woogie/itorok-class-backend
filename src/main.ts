import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { REDIRECT_URI } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env[REDIRECT_URI],
    credentials: true,
  });
  await app.listen(4000);
}
bootstrap();
