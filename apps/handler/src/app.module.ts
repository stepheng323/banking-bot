import { Module } from '@nestjs/common';
import { WhatsAppController } from './app/whatsspp.controller';
import { ConfigModule } from '@nestjs/config';
import { WhatsappService } from './app/whatsapp.service';
import { RedisModule } from '@bank-bot/cache';
import { QueueClient } from '@bank-bot/aws';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WhatsAppController],
  providers: [QueueClient, WhatsappService, RedisModule],
})
export class AppModule {}
