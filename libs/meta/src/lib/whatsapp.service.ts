import { Injectable } from '@nestjs/common';
import {ConfigService} from '@bank-bot/config'

interface WhatsAppMessage {
  type: 'text' | 'interactive';
  text?: {
    body: string;
    preview_url: boolean;
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
      type: 'text',
      text: {
        preview_url: true,
        body: text,
      },
    };

    return this.sendMessage(to, message);
  }

  async sendIntroMessage(to: string, content: string) {
    const message = {
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: content,
        },
        action: {
          buttons: [
            {
              type: 'reply',
              reply: {
                id: 'start_onboarding',
                title: 'Start Onboarding',
              },
            },
          ],
        },
      },
    };

    await this.sendMessage(to, message);
  }

  async sendMessage(to: string, message: any): Promise<void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...message,
            messaging_product: 'whatsapp',
            to,
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        console.log(JSON.stringify(error, null, 2));
        throw new Error(`WhatsApp API Error: ${error}`);
      }
      return response.json();
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  }

   async sendOnboardingFlow(to: string) {
    const payload = {
      recipient_type: 'individual',
      messaging_product: 'whatsapp',
      to,
      type: 'interactive',
      interactive: {
        type: 'flow',
        header: {
          type: 'text',
          text: 'Flow message header',
        },
        body: {
          text: 'Flow message body',
        },
        footer: {
          text: 'Flow message footer',
        },
        action: {
          name: 'flow',
          parameters: {
            flow_message_version: '3',
            // flow_token: 'A.',
            flow_id: '1212187900453009',
            flow_cta: 'Book!',
            flow_action: 'data_exchange',
            flow_action_payload: {
              screen: 'RECOMMEND',
              data: {
                type: "dynamic_object"

              },
            },
          },
        },
      },
    };
    await this.sendMessage(to, payload);
  }
}
