import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getApi(): string {
    return 'welcome api';
  }

  getEnv() {
    return {
      NODE_ENV: process.env.NODE_ENV,
      DB_NAME: process.env.DB_NAME,
      DB_PORT: process.env.DB_PORT,
    };
  }
}
