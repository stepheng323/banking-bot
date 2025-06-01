import { Injectable } from '@nestjs/common';
import { ParsedWhatsAppMessage, ActiveSession } from '@bank-bot/types';
import { UserRepo } from '@bank-bot/db';
import { WhatsAppService } from '@bank-bot/meta';
import { Mono } from '@bank-bot/banking';

@Injectable()
export class OnboardingHandler {
  constructor(
    private userRepo: UserRepo,
    private whatsapp: WhatsAppService,
    private mono: Mono
  ) {}

  async handle(message: ParsedWhatsAppMessage, activeSession: ActiveSession) {
    const input = message.content;

    if (!input) {
      return this.whatsapp.sendTextMessage(
        message.from,
        'Please provide your BVN.'
      );
    }
    const bvnLookup = await this.mono.initiateBvnLookup(input);
    console.log({ bvnLookup });

    const { methods } = bvnLookup;
    // const phoneMethod = methods.find((m) => m.method === 'phone')?.hint;
    // await this.mono.verifyBvn({
    //   method: 'phone',
    //   phone_number: phoneMethod,
    // });

    return this.whatsapp.sendTextMessage(message.from, 'BVN provided.');
  }
}
