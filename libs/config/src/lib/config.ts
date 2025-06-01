import * as dotenv from 'dotenv';
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { Injectable, OnModuleInit } from '@nestjs/common';

dotenv.config();

@Injectable()
export class ConfigService implements OnModuleInit {
  private secrets: Record<string, string> | null = null;
  private secretsManagerClient = new SecretsManagerClient({});

  private static readonly configKeys = {
    WHATSAPP_SECRET_TOKEN: 'WHATSAPP_SECRET_TOKEN',
    AWS_QUEUE_URL: 'AWS_QUEUE_URL',
    OPENAI_API_KEY: 'OPENAI_API_KEY',
    REDIS_URL: 'REDIS_URL',
    DATABASE_URL: 'DATABASE_URL',
    SECRET_NAME: 'SECRET_NAME',
    ANTHROPIC_API_KEY: 'ANTHROPIC_API_KEY',
    META_PHONE_NUMBER_ID: 'META_PHONE_NUMBER_ID',
    META_ACCESS_TOKEN: 'META_ACCESS_TOKEN',
    MONO_SECRET_KEY: 'MONO_SECRET_KEY',
  } as const;

  public static readonly ConfigKey = ConfigService.configKeys;

  async fetchSecrets(secretName: string): Promise<Record<string, string>> {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await this.secretsManagerClient.send(command);
    return JSON.parse(response.SecretString || '{}');
  }

  async onModuleInit(): Promise<void> {
    const secretName = process.env['SECRET_NAME'];
    if (secretName) {
      this.secrets = await this.fetchSecrets(secretName);
    }
  }

  public getConfig(key: keyof typeof ConfigService.configKeys): string {
    if (process.env['NODE_ENV'] === 'production') {
      if (!this.secrets) {
        throw new Error('Secrets have not been initialized yet.');
      }
      return this.secrets[key] || '';
    } else {
      return process.env[key] || '';
    }
  }
}
