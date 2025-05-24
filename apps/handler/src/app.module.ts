import { Module } from '@nestjs/common';
import { WhatsAppController } from './app/whatsspp.controller';
import { WhatsappService } from './app/whatsapp.service';
import { QueueClient } from '@bank-bot/aws';

@Module({
  imports: [],
  controllers: [WhatsAppController],
  providers: [QueueClient, WhatsappService],
})
export class AppModule {}
