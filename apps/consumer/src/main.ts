// import { createNestApplication } from './app';

// const isLambda = process.env.NODE_ENV === "production"

// if (isLambda) {
//   require('./main.lambda.ts');
// }else {
//   async function bootstrap() {
//    await createNestApplication();

//   }

//   bootstrap();

// }



import { SQSEvent, SQSHandler } from 'aws-lambda';
import { QueueClient } from '@bank-bot/aws';

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      // handleUserMessage(record.body);
      const queueClient = new QueueClient();
      const queueUrl = process.env.AWS_QUEUE_URL;
      const msg = JSON.parse(record.body);
      await queueClient.deleteMessage({ queueUrl, receiptHandle: msg.ReceiptHandle });
    } catch (error) {
      console.error('Error processing SQS message', error);
      throw error;
    }

  }
};
