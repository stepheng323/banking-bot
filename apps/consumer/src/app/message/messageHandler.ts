import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from '@bank-bot/db';
import { ActiveSession, ParsedWhatsAppMessage } from '@bank-bot/types';
import { NlpService, unifiedSystemPrompt } from '@bank-bot/nlp';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProcessMessage {
  constructor(
    private userRepo: UserRepo,
    private llm: NlpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async handleMessage(message: ParsedWhatsAppMessage) {
    const returningUser = await this.userRepo.findUserByPhoneNumber(
      message.from
    );
    const sessionData = await this.cacheManager.get<string>(
      `${message.from}-session`
    );
    const activeSession = sessionData
      ? (JSON.parse(sessionData) as ActiveSession)
      : ({} as ActiveSession);

    const context = returningUser
      ? `The user's name is ${returningUser.firstname}. Refer to them by their first name in replies.`
      : `This is the user's first interaction. Greet them warmly and guide them through onboarding.`;

    const sessionContext = activeSession
      ? `The user has already provided the following details: ${JSON.stringify(
          activeSession
        )}.`
      : '';

    const nlpResponse = await this.llm.generateReply(
      message.content,
      `${unifiedSystemPrompt} ${context} ${sessionContext}`
    );

    const { intent, entities, missing_fields, reply } = JSON.parse(nlpResponse);

    if (intent === 'onboarding') {
      if (missing_fields.length > 0) {
        const updatedSession = { ...activeSession, ...entities };
        await this.cacheManager.set(`${message.from}-session`, updatedSession);
        console.log('Response: ', reply);
      } else {
        console.log('Response: Thank you! Your onboarding is complete.');
      }
    } else {
      console.log('Response: ', reply);
    }
  }
}
