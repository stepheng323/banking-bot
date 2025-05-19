import { Module } from '@nestjs/common';
import { PollMessages } from './message/pollMessages';
import { QueueClient } from '@bank-bot/aws';
import { RepoModule } from '@bank-bot/db';
import  { UserRepo } from '@bank-bot/db';
import { ProcessMessage } from './message/messageHandler';
import { OpenAiService } from '@bank-bot/nlp';


@Module({
  imports: [RepoModule],
  controllers: [],
  providers: [
    ...process.env.NODE_ENV !== 'production' ? [PollMessages] : [],
    QueueClient,
    UserRepo,
    ProcessMessage,
    OpenAiService
   ],
})
export class AppModule {}
