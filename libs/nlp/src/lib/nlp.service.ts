import {OpenAI} from 'openai';
import {  unifiedSystemPrompt } from './constants';


export class OpenAiService {
    private openai: OpenAI;

constructor() {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
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
