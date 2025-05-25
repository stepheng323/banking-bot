import { Injectable } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './types/types';
import { ConfigService } from '@bank-bot/config';

@Injectable()
export class KyselyService {
  private db: Kysely<DB>;

  constructor(private readonly config: ConfigService) {
    const databaseUrl = this.config.getConfig('DATABASE_URL');

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
