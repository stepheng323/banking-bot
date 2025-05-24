import { Controller, Get, Req, Res, Post, Body, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { WhatsappService } from './whatsapp.service';
import { WhatsAppWebhookPayload } from '@bank-bot/types';
import { QueueClient } from '@bank-bot/aws';
import logger from '@vendia/serverless-express/src/logger';

@Controller('whatsapp-webhook')
export class WhatsAppController {
  constructor(
    private readonly sqsService: QueueClient,
    private whatsAppService: WhatsappService
  ) {}

  @Get('')
  auth(@Req() req: Request, @Res() res: Response) {
    try {
      if (
        req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === process.env.WHATSAPP_SECRET_TOKEN
      ) {
        res.send(req.query['hub.challenge']);
      } else {
        res.sendStatus(400);
      }
    } catch (error) {
      console.error('Error in WhatsApp Webhook Auth', error);
      res.sendStatus(400);
    }
  }

  @Post('')
  async handleMessage(
    @Res() res: Response,
    @Body() body: WhatsAppWebhookPayload
  ) {
    try {
      const parsedMessage = this.whatsAppService.parseWhatsAppMessage(body);
      if (!parsedMessage) return res.sendStatus(400);
      Logger.log(
        `Received WhatsApp message from ${parsedMessage.from}: ${parsedMessage.content}`
      );
      await this.sqsService.enqueue({
        queueUrl: process.env.AWS_QUEUE_URL,
        messageBody: JSON.stringify(parsedMessage),
      });
      return res.sendStatus(200);
    } catch (error) {
      console.error('Error in WhatsApp Webhook Message Handling', error);
      res.sendStatus(500);
    }
  }
}
