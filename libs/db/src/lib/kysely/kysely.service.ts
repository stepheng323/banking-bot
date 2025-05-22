import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './types/types';
import { ConfigService } from '@bank-bot/config';

@Injectable()
export class KyselyService implements OnModuleInit {
  private db!: Kysely<DB>;
  public static instance: KyselyService;

  constructor() {
    if (!KyselyService.instance) {
      KyselyService.instance = this;
    }
    return KyselyService.instance;
  }

  async onModuleInit() {
    const config = ConfigService.getInstance();
    const databaseUrl = await config.getConfig(
      ConfigService.ConfigKey.DATABASE_URL
    );

    this.db = new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: databaseUrl,
          ssl:
            process.env['NODE_ENV'] === 'production'
              ? {
                  rejectUnauthorized: true,
                }
              : false,
        }),
      }),
    });
  }

  getDb() {
    return this.db;
  }
}

export const db = KyselyService.instance?.getDb();
