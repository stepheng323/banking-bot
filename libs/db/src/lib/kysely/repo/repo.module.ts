import { Global, Module } from '@nestjs/common';
import { KyselyService } from '../kysely.service';
import { UserRepo } from './user.repo';
import { ConfigModule, ConfigService } from '@bank-bot/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [KyselyService, UserRepo],
  exports: [UserRepo],
})
export class RepoModule {}
