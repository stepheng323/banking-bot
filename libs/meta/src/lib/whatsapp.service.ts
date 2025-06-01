import { ConfigService } from '@bank-bot/config';
import { Injectable } from '@nestjs/common';

interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  recipient_type: 'individual' | '';
  to: string;
  type: 'text' | 'template';
  text?: {
    body: string;
    preview_url: boolean;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
        currency?: {
          fallback_value: string;
          code: string;
          amount_1000: number;
        };
      }>;
    }>;
  };
}

@Injectable()
export class WhatsAppService {
  private readonly apiVersion = 'v22.0';
  private readonly baseUrl: string;
  private readonly phoneNumberId: string;
  private readonly accessToken: string;

  constructor(private readonly config: ConfigService) {
    this.phoneNumberId = this.config.getConfig('META_PHONE_NUMBER_ID');
    this.accessToken = this.config.getConfig('META_ACCESS_TOKEN');
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  async sendTextMessage(to: string, text: string): Promise<any> {
    const message: WhatsAppMessage = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: {
        preview_url: true,
        body: text,
      },
    };

    return this.sendMessage(message);
  }

  private async sendMessage(message: WhatsAppMessage): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`WhatsApp API Error: ${error}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }
}
