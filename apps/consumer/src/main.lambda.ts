import { SQSEvent, SQSHandler } from 'aws-lambda';
import { QueueClient } from '@bank-bot/aws';
import { Logger } from '@nestjs/common';

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      console.log({ record });

      // handleUserMessage(record.body);
      // const queueClient = new QueueClient();
      // const queueUrl = process.env.AWS_QUEUE_URL;

      const body = JSON.parse(record.body);
      console.log('Received SQS message:', { body });
      // await queueClient.deleteMessage({ queueUrl, receiptHandle: msg.ReceiptHandle });
    } catch (error) {
      console.error('Error processing SQS message', error);
      throw error;
    }
  }
};
