import { Global, Module } from '@nestjs/common';
import { KyselyService } from '../kysely.service';
import { UserRepo } from './user.repo';

@Global()
@Module({
  providers: [KyselyService, UserRepo],
  exports: [UserRepo],
})
export class RepoModule {}
