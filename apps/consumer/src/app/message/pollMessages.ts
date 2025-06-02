import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { QueueClient } from '@bank-bot/aws';
import { ProcessMessage } from './messageHandler';

@Injectable()
export class PollMessages implements OnModuleInit {
  private readonly logger = new Logger(PollMessages.name);

  constructor(
    private client: QueueClient,
    private handleUserMessage: ProcessMessage
  ) {}

  onModuleInit() {
    if (process.env.NODE_ENV === 'production') return;
    this.logger.log('Starting SQS polling for development...');
    this.poll();
  }

  async poll() {
    const queueUrl = process.env.AWS_QUEUE_URL;
    while (true) {
      try {
        const messages = await this.client.receiveMessages({
          queueUrl,
          maxMessages: 10,
          waitTimeSeconds: 20,
        });

        for (const msg of messages) {
          const parsedMessage = JSON.parse(msg.Body);

          await this.handleUserMessage.handleMessage(parsedMessage);
          await this.client.deleteMessage({
            queueUrl,
            receiptHandle: msg.ReceiptHandle,
          });
        }
      } catch (err) {
        console.error('Error receiving messages:', err);
        this.logger.error('Error processing message', err);
      }
    }
  }
}
