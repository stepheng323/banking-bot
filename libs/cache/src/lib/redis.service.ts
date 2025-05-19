import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  onModuleInit() {
    this.client = new Redis(process.env['REDIS_URL'] || 'redis://localhost:6379');
    this.client.on('connect', () => console.log('[Redis] Connected'));
    this.client.on('error', err => console.error('[Redis] Error', err));
  }

  onModuleDestroy() {
    this.client.quit();
  }

  async get(key: string): Promise<string> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : '';
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, data);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}