import { Inject, Injectable } from '@nestjs/common';
import { UserRepo } from '@bank-bot/db';
import { ActiveSession, ParsedWhatsAppMessage } from '@bank-bot/types';
import { NlpService, unifiedSystemPrompt } from '@bank-bot/nlp';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OnboardingHandler } from './handlers/onboarding.handler';
import { WhatsAppService } from '@bank-bot/meta';
import { getOnboardingMessage } from './constants';

@Injectable()
export class ProcessMessage {
  constructor(
    private userRepo: UserRepo,
    private llm: NlpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private onboardingHandler: OnboardingHandler,
    private whatsappService: WhatsAppService
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

    if (activeSession.intent) {
      return this.routeToIntentHandler(activeSession.intent, message, activeSession);
    }

    if (!returningUser && !activeSession.intent) {
      await this.whatsappService.sendIntroMessage(
        message.from,
        getOnboardingMessage(message.senderName)
      );

      return this.cacheManager.set(
        `${message.from}-session`,
        JSON.stringify({
          ...activeSession,
          intent: 'onboarding',
          entities: {},
          stage: 'bvn_input',
        }),
        600000
      );
    }

    const sessionContext = activeSession
      ? `The user is already onboarded and has already provided the following details: ${JSON.stringify(
          activeSession
        )}.`
      : '';

    const nlpResponse = await this.llm.generateReply(
      message.content,
      sessionContext
        ? `${unifiedSystemPrompt} ${sessionContext}`
        : unifiedSystemPrompt
    );

    const { intent, entities, missing_fields, reply } = JSON.parse(nlpResponse);

    return this.routeToIntentHandler(intent, message, activeSession, {
      entities,
      missing_fields,
      reply,
    });
  }

  private async routeToIntentHandler(
    intent: string,
    message: ParsedWhatsAppMessage,
    activeSession: ActiveSession,
    nlpResponse?: {
      entities: unknown;
      missing_fields: string[];
      reply: string;
    }
  ) {
    console.log({intent, message, activeSession});
    switch (intent) {
      case 'onboarding':
        return this.onboardingHandler.handle(message, activeSession);
      case 'balance':
        return 'balance';
      case 'transfer':
        return 'transfer';
      default:
        return {
          success: true,
          message:
            "I'm not sure how to help with that. You can ask about your balance, make a transfer, or get help with onboarding.",
        };
    }
  }
}
