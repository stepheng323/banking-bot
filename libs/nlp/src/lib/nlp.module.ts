import { Module } from '@nestjs/common';
import { AnthropicService } from './anthropic';
import { OpenAiService } from './openai';
import { NlpService } from './nlp.service';
import { ConfigModule } from '@bank-bot/config';

@Module({
  imports: [ConfigModule],
  providers: [AnthropicService, OpenAiService, NlpService],
  exports: [NlpService],
})
export class NlpModule {}
