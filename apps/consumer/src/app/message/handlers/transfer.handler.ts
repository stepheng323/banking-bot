import { Injectable } from '@nestjs/common';
import { ParsedWhatsAppMessage, ActiveSession } from '@bank-bot/types';
import { UserRepo } from '@bank-bot/db';
import { Cache } from 'cache-manager';
import { WhatsAppService } from '@bank-bot/meta';

@Injectable()
export class TransferHandler {
  constructor(
    private userRepo: UserRepo,
    private cacheManager: Cache,
    private whatsapp: WhatsAppService
  ) {}

  async handle(message: ParsedWhatsAppMessage, activeSession: ActiveSession) {}
}
