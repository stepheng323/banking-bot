import { ConfigService } from '@bank-bot/config';
import { BvnLookupData, BvnVerifyRequest } from '@bank-bot/types';
import { Injectable } from '@nestjs/common';

interface BvnLookupRequest {
  bvn: string;
  scope?: 'bank_accounts' | 'identity';
}

@Injectable()
export class Mono {
  private readonly baseUrl = 'https://api.withmono.com/v2';

  constructor(private readonly configService: ConfigService) {}

  private async monoFetch<TRequest = unknown, TResponse = unknown>(
    endpoint: string,
    body?: TRequest
  ): Promise<TResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'mono-sec-key': this.configService.getConfig('MONO_SECRET_KEY'),
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mono API Error: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error(`Error calling Mono API ${endpoint}:`, error);
      throw error;
    }
  }

  async initiateBvnLookup(bvn: string): Promise<BvnLookupData> {
    return this.monoFetch<BvnLookupRequest, BvnLookupData>(
      '/lookup/bvn/initiate',
      {
        bvn,
        scope: 'bank_accounts',
      }
    );
  }

  async verifyBvn(data: BvnVerifyRequest): Promise<null> {
    return this.monoFetch<BvnVerifyRequest, null>('/lookup/bvn/verify', data);
  }
}
