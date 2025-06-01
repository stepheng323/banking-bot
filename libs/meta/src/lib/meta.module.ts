import { Module } from '@nestjs/common';
import { ConfigModule } from '@bank-bot/config';
import { WhatsAppService } from './whatsapp.service';

@Module({
  imports: [ConfigModule],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class MetaModule {}
