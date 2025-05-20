import { Logger } from '@nestjs/common';

import { createNestApplication } from './app';

const isLambda = process.env.NODE_ENV === 'production';

if(isLambda) {
  require('./main.lambda');
}else{
  async function bootstrap() {
    const app = await createNestApplication();
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 4000;
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  }
  bootstrap();

}

