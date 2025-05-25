import { Injectable } from '@nestjs/common';
import { AnthropicService } from './anthropic';
import { OpenAiService } from './openai';

@Injectable()
export class NlpService {
  constructor(
    private anthropicService: AnthropicService,
    private openAiService: OpenAiService
  ) {}

  async generateReply(
    userInput: string,
    systemPrompt: string,
    provider: 'openai' | 'anthropic' = 'anthropic'
  ): Promise<string> {
    if (provider === 'openai') {
      return this.openAiService.generateReply(userInput, systemPrompt);
    } else if (provider === 'anthropic') {
      return this.anthropicService.generateReply(userInput, systemPrompt);
    } else {
      throw new Error('Invalid provider specified');
    }
  }
}
