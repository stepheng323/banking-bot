import { Logger } from '@nestjs/common';

async function bootstrap() {
  const { createNestApplication } = await import('./app');
  const app = await createNestApplication();
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
};

bootstrap()
