import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

// import { ExpressAdapter } from '@nestjs/platform-express';

export async function createNestApplication() {
  // const expressApp = express();
  return await NestFactory.createApplicationContext(AppModule);
}
