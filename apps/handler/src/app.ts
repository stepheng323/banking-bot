import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

export async function createNestApplication() {
  const expressApp = express();
  return await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
}
