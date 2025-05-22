import { createNestApplication } from './app';

async function bootstrap() {
  await createNestApplication();
}

bootstrap();
