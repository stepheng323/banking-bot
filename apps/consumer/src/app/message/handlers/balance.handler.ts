import { Injectable } from '@nestjs/common';
import { ParsedWhatsAppMessage, ActiveSession } from '@bank-bot/types';
import { UserRepo } from '@bank-bot/db';
import { WhatsAppService } from '@bank-bot/meta';

@Injectable()
export class BalanceHandler {
  constructor(private userRepo: UserRepo, private whatsapp: WhatsAppService) {}
}
