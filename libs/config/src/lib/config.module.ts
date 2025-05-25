import { Module } from '@nestjs/common';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { ConfigService } from './config';

@Module({
  providers: [
    {
      provide: SecretsManagerClient,
      useValue: new SecretsManagerClient(),
    },
    ConfigService,
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
