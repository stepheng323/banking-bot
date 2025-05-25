import {OpenAI} from 'openai';
import {  unifiedSystemPrompt } from './constants';
import { ConfigService } from '@bank-bot/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAiService {
    private openai: OpenAI;

constructor(
      private configService: ConfigService

) {
    this.openai = new OpenAI({
      apiKey: this.configService.getConfig('OPENAI_API_KEY'),
    });
  }

  async generateReply(userInput: string, prompt: string = unifiedSystemPrompt): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: "o4-mini",
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: userInput },
      ],
    });

    return chatCompletion.choices[0].message.content?.trim() || '';
}

}
