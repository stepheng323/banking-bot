import { Module } from '@nestjs/common';
import { ConfigService } from './config';

@Module({
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
