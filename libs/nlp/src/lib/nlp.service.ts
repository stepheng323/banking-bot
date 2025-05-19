import {OpenAI} from 'openai';
import {  defaultSystemPrompt } from './constants';


export class OpenAiService {
    private openai: OpenAI;

constructor() {
    this.openai = new OpenAI({
      apiKey: process.env['OPENAI_API_KEY'],
    });
  }

  async generateReply(prompt: string, systemPrompt: string = defaultSystemPrompt): Promise<string> {
    const chatCompletion = await this.openai.chat.completions.create({
      model: "o4-mini",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });

    return chatCompletion.choices[0].message.content?.trim() || '';
}

}
