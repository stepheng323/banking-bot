import { SQSEvent, SQSHandler } from 'aws-lambda';
import { QueueClient } from '@bank-bot/aws';

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      // handleUserMessage(body);
    } catch (error) {
      console.error('Error processing SQS message', error);
      throw error;
    }
  }
};
