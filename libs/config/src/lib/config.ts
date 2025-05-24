import * as dotenv from 'dotenv';
import { SecretsManager } from 'aws-sdk';
import { Injectable } from '@nestjs/common';

dotenv.config();

@Injectable()
export class ConfigService {
  private static instance: ConfigService;
  private secrets: Record<string, string> | null = null;

  private static readonly configKeys = {
    WHATSAPP_SECRET_TOKEN: 'WHATSAPP_SECRET_TOKEN',
    AWS_QUEUE_URL: 'AWS_QUEUE_URL',
    OPENAI_API_KEY: 'OPENAI_API_KEY',
    REDIS_URL: 'REDIS_URL',
    DATABASE_URL: 'DATABASE_URL',
    SECRET_NAME: 'SECRET_NAME',
  } as const;

  public static readonly ConfigKey = ConfigService.configKeys;
  public ConfigKeyType!: keyof typeof ConfigService.configKeys;

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public async getConfig(key: keyof typeof ConfigService.configKeys): Promise<string> {
    if (process.env['NODE_ENV'] === 'production') {
      if (!this.secrets) {
        const secretsManager = new SecretsManager();
        const secretValue = await secretsManager
          .getSecretValue({ SecretId: process.env['SECRET_NAME'] as string })
          .promise();
        this.secrets = JSON.parse(secretValue.SecretString || '{}');
      }
      return this.secrets?.[key] || '';
    } else {
      return process.env[key] || '';
    }
  }
}
