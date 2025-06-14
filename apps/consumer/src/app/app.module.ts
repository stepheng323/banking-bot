import { Module } from '@nestjs/common';
import { PollMessages } from './message/pollMessages';
import { QueueClient } from '@bank-bot/aws';
import { KyselyModule, RepoModule } from '@bank-bot/db';
import { UserRepo } from '@bank-bot/db';
import { ProcessMessage } from './message/messageHandler';
import { NlpModule } from '@bank-bot/nlp';
import { ConfigModule, ConfigService } from '@bank-bot/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { OnboardingHandler } from './message/handlers/onboarding.handler';
import { MetaModule } from '@bank-bot/meta';
import { BankingModule } from '@bank-bot/banking';

@Module({
  imports: [
    RepoModule,
    KyselyModule,
    NlpModule,
    MetaModule,
    BankingModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (secrets: ConfigService) => {
        return {
          stores: [createKeyv(secrets.getConfig('REDIS_URL'))],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    ...(process.env.NODE_ENV !== 'production' ? [PollMessages] : []),
    QueueClient,
    UserRepo,
    ProcessMessage,
    OnboardingHandler,
  ],
})
export class AppModule {}
