import { Module } from '@nestjs/common';
import { KyselyService } from './kysely.service';
import { ConfigModule } from '@bank-bot/config';

@Module({
  imports: [ConfigModule], 
  providers: [KyselyService],
  exports: [KyselyService],
})
export class KyselyModule {}
