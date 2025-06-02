import { Inject, Injectable } from '@nestjs/common';
import { ParsedWhatsAppMessage, ActiveSession } from '@bank-bot/types';
import { UserRepo } from '@bank-bot/db';
import { WhatsAppService } from '@bank-bot/meta';
import { Mono } from '@bank-bot/banking';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OnboardingHandler {
  constructor(
    private userRepo: UserRepo,
    private whatsapp: WhatsAppService,
    private mono: Mono,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  private async handleBvn(
    message: ParsedWhatsAppMessage,
    activeSession: ActiveSession
  ) {
    const input = message.content;

    if (input.length !== 10) {
      return this.whatsapp.sendTextMessage(
        message.from,
        'Please provide your BVN.'
      );
    }
    const bvnLookup = await this.mono.initiateBvnLookup(input);
    if (bvnLookup.status !== 'success') {
      console.log('BVN lookup failed', bvnLookup);
    }

    const {
      data: { bvn, session_id: sessionId },
    } = bvnLookup;

    await this.mono.verifyBvn(sessionId, { method: 'phone' });

    await this.cacheManager.set(
      `${message.from}-session`,
      JSON.stringify({
        ...activeSession,
        missingFields: ['otp'],
        entities: {
          bvn,
          sessionId,
        },
        stage: 'otp_input',
      })
    );
    return this.whatsapp.sendTextMessage(message.from, 'BVN provided.');
  }

  private async handleOtp(
    message: ParsedWhatsAppMessage,
    activeSession: ActiveSession
  ) {
    const otp = message.content;
    const result = await this.mono.verifyOtp(activeSession.entities.sessionId, {
      otp,
    });
    if (result.status === 'successful') {
      await this.cacheManager.set(
        `${message.from}-session`,
        JSON.stringify({
          ...activeSession,
          stage: 'account_selection',
          entities: {
            ...activeSession.entities,
            accounts: result.data.data,
          },
        })
      );
      // send account selection message to user
      return this.whatsapp.sendTextMessage(
        message.from,
        'Please select an account.'
      );
    }
  }

  async handle(message: ParsedWhatsAppMessage, activeSession: ActiveSession) {
    switch (activeSession.stage) {
      case 'bvn_input':
        return this.handleBvn(message, activeSession);
      case 'otp_input':
        return this.handleOtp(message, activeSession);
    }
  }
}
