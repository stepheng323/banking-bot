import { Inject, Injectable } from '@nestjs/common';
import {
  ParsedWhatsAppMessage,
  ActiveSession,
  isInteractiveMessage,
  isTextMessage,
} from '@bank-bot/types';
import { UserRepo } from '@bank-bot/db';
import { WhatsAppService } from '@bank-bot/meta';
import { Mono } from '@bank-bot/banking';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { getOnboardingMessage } from '../constants';

@Injectable()
export class OnboardingHandler {
  constructor(
    private userRepo: UserRepo,
    private whatsapp: WhatsAppService,
    private mono: Mono,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  private async handleOnboardingFlow(
    message: ParsedWhatsAppMessage,
    activeSession: ActiveSession
  ) {
    return this.whatsapp.sendOnboardingFlow(message.from);
  }

  async handle(message: ParsedWhatsAppMessage, activeSession: ActiveSession) {
    if (
      isInteractiveMessage(message) &&
      message.content === 'start_onboarding'
    ) {
      return this.handleOnboardingFlow(message, activeSession);
    }

    if (activeSession.stage) {
      switch (activeSession.stage) {
        case 'bvn_input':
          if (isTextMessage(message) && /^\d{11}$/.test(message.content)) {
            const bvnLookup = await this.mono.initiateBvnLookup(
              message.content
            );
            if (bvnLookup.status !== 'success') {
              return this.whatsapp
                .sendTextMessage(
                  message.from,
                  '❌ BVN verification failed. Please try again with a valid BVN.'
                )
                .then(() => this.handleOnboardingFlow(message, activeSession));
            }

            const {
              data: { bvn, session_id: sessionId },
            } = bvnLookup;
            await this.mono.verifyBvn(sessionId, { method: 'phone' });

            // Update session
            await this.cacheManager.set(
              `${message.from}-session`,
              JSON.stringify({
                ...activeSession,
                stage: 'otp_input',
                entities: {
                  ...activeSession.entities,
                  bvn,
                  sessionId,
                },
              })
            );
          }
          return this.handleOnboardingFlow(message, activeSession);

        default:
          return this.handleOnboardingFlow(message, activeSession);
      }
    }

    return this.handleOnboardingFlow(message, activeSession);
  }
}
