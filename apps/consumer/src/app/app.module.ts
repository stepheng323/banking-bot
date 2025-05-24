import { Module } from '@nestjs/common';
import { PollMessages } from './message/pollMessages';
import { QueueClient } from '@bank-bot/aws';
import { KyselyModule, RepoModule } from '@bank-bot/db';
import { UserRepo } from '@bank-bot/db';
import { ProcessMessage } from './message/messageHandler';
import { OpenAiService } from '@bank-bot/nlp';
import { ConfigModule, ConfigService } from '@bank-bot/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';


@Module({
  imports: [
    RepoModule,
    KyselyModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      isGlobal: true,
      useFactory: async (secrets: ConfigService) => {
        return {
          stores: [createKeyv(await secrets.getConfig('REDIS_URL'))],
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
    OpenAiService,
  ],
})
export class AppModule {}
