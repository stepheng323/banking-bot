import { Module } from '@nestjs/common';
import { Mono } from './providers/mono.service';
import { ConfigService } from '@bank-bot/config';

@Module({
  controllers: [],
  providers: [Mono, ConfigService],
  exports: [Mono],
})
export class BankingModule {}
