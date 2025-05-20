import { createNestApplication } from './app';

const isLambda = process.env.NODE_ENV === "production"

if (isLambda) {
  require('./main.lambda.ts');
}else {
  async function bootstrap() {
   await createNestApplication();
  }

  bootstrap();

}
