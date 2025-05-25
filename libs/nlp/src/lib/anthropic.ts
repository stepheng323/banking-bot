import Anthropic from '@anthropic-ai/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@bank-bot/config';

@Injectable()
export class AnthropicService {
  private client: Anthropic | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.getConfig('ANTHROPIC_API_KEY');
    this.client = new Anthropic({
      apiKey,
    });
  }

  async generateReply(
    userInput: string,
    systemPrompt: string
  ): Promise<string> {
    const response = await this.client?.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1024,
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: userInput },
      ],
    });

    if (!response || !response.content || response.content.length === 0) {
      throw new Error('No response content from Anthropic API');
    }

    const firstContent = response.content[0];
    if (firstContent.type === 'text' && 'text' in firstContent) {
      return firstContent.text.trim();
    }
    throw new Error('Unexpected response content type from Anthropic API');
  }
}
