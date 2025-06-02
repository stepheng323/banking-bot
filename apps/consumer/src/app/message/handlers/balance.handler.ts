import { Injectable } from '@nestjs/common';
import { UserRepo } from '@bank-bot/db';
import { WhatsAppService } from '@bank-bot/meta';

@Injectable()
export class BalanceHandler {
  constructor(private userRepo: UserRepo, private whatsapp: WhatsAppService) {}
}
