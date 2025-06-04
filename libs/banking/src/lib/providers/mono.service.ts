import { ConfigService } from '@bank-bot/config';
import {
  BankAccountsMonoResponse,
  BvnLookupData,
  BvnVerifyRequest,
  MonoResponse,
  OtpVerifyRequest,
} from '@bank-bot/types';
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
    body?: TRequest,
    xSessionId?: string
  ): Promise<TResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'mono-sec-key': this.configService.getConfig('MONO_SECRET_KEY'),
          ...(xSessionId && { 'x-session-id': xSessionId }),
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Mono API Error: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`Error calling Mono API ${endpoint}:`, error);
      throw error;
    }
  }

  async initiateBvnLookup(bvn: string): Promise<BvnLookupData> {
    if (process.env['MOCK_MONO'] == 'true')
      return {
        status: 'success',
        message: 'BVN lookup successful',
        data: {
          session_id: '74c8fe70-ea2c-458e-a99f-3f7a6061632c',
          bvn: '01234567891',
          methods: [
            {
              method: 'email',
              hint: 'An email with a verification code will be sent to tomi***jr@gmail.com',
            },
            {
              method: 'phone',
              hint: 'Sms with a verification code will be sent to phone 0818***6496',
            },
            {
              method: 'phone_1',
              hint: 'Sms with a verification code will be sent to phone 0818***9343',
            },
            {
              method: 'alternate_phone',
              hint: 'Sms with a verification code will be sent to your alternate phone number',
            },
          ],
        },
      };

    return this.monoFetch<BvnLookupRequest, BvnLookupData>(
      '/lookup/bvn/initiate',
      {
        bvn,
        scope: 'bank_accounts',
      }
    );
  }

  async verifyBvn(
    sessionId: string,
    body: BvnVerifyRequest
  ): Promise<MonoResponse<null>> {
    if (process.env['MOCK_MONO'] == 'true')
      return {
        status: 'success',
        message: 'BVN verification successful',
        data: null,
      };
    return this.monoFetch<BvnVerifyRequest, MonoResponse<null>>(
      '/lookup/bvn/verify',
      body,
      sessionId
    );
  }
  async verifyOtp(
    sessionId: string,
    body: OtpVerifyRequest
  ): Promise<BankAccountsMonoResponse> {
    if (process.env['MOCK_MONO'] == 'true')
      return {
        status: 'successful',
        message: 'BVN bank accounts successfully fetched.',
        data: [
          {
            account_name: 'Samuel Olamide',
            account_number: '1234567890',
            account_type: 'SAVINGS',
            account_designation: 'OTHERS',
            institution: {
              name: 'First Bank',
              branch: '4659818',
              bank_code: '011',
            },
          },
          {
            account_name: 'Olamide Samuel',
            account_number: '1234509384',
            account_type: 'CURRENT',
            account_designation: 'OTHERS',
            institution: {
              name: 'Zenith Bank',
              branch: '4661483',
              bank_code: '00711',
            },
          },
        ],
      };
    return this.monoFetch<OtpVerifyRequest, BankAccountsMonoResponse>(
      '/lookup/bvn/details',
      body,
      sessionId
    );
  }
}
