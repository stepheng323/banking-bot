import {
  SQSClient,
  SendMessageCommand,
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from '@aws-sdk/client-sqs';

export class QueueClient {
  private client: SQSClient;

  constructor(region?: string) {
    this.client = new SQSClient({ region });
  }

  async enqueue(params: { queueUrl: string; messageBody: string; delaySeconds?: number }) {    
    const command = new SendMessageCommand({
      QueueUrl: params.queueUrl,
      MessageBody: params.messageBody,
      DelaySeconds: params.delaySeconds || 0,
    });
    return this.client.send(command);
  }

  async deleteMessage(params: { queueUrl: string; receiptHandle: string }) {
    const command = new DeleteMessageCommand({
      QueueUrl: params.queueUrl,
      ReceiptHandle: params.receiptHandle,
    });
    return this.client.send(command);
  }

  async receiveMessages(params: {
    queueUrl: string;
    maxMessages?: number;
    waitTimeSeconds?: number;
    visibilityTimeout?: number;
  }) {
    const command = new ReceiveMessageCommand({
      QueueUrl: params.queueUrl,
      MaxNumberOfMessages: params.maxMessages || 5,
      WaitTimeSeconds: params.waitTimeSeconds || 20,
      VisibilityTimeout: params.visibilityTimeout || 30,
    });
    const result = await this.client.send(command);
    return result.Messages || [];
  }
}
