// import { Logger } from '@nestjs/common';

// import { createNestApplication } from './app';

// const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// if(isLambda) {
//   require('./main.lambda');
// }else{
//   async function bootstrap() {
//     const app = await createNestApplication();
//     const globalPrefix = 'api';
//     app.setGlobalPrefix(globalPrefix);
//     const port = process.env.PORT || 4000;
//     await app.listen(port);
//     Logger.log(
//       `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
//     );
//   }
//   bootstrap();

// }


import { Handler } from 'aws-lambda';
import { createNestApplication } from './app';
import serverlessExpress from '@vendia/serverless-express';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await createNestApplication();
  await app.init();

  return serverlessExpress({ app: app.getHttpAdapter().getInstance() });
}

export const handler: Handler = async (event, context, callback) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(event, context, callback);
};

