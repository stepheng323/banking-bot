export type WhatsAppWebhookPayload = {
  object: string;
  entry: {
    id: string;
    changes: {
      field: string;
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: {
          profile: { name: string };
          wa_id: string;
        }[];
        messages?: WhatsAppMessage[];
      };
    }[];
  }[];
};

type WhatsAppMessage = {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
  image?: { id: string; mime_type: string; caption?: string };
  audio?: { id: string; mime_type: string };
};

export type ParsedWhatsAppMessage =
  | {
      kind: 'text';
      from: string;
      senderName?: string;
      messageId: string;
      content: string;
      timestamp: string;
    }
  | {
      kind: 'image';
      from: string;
      senderName?: string;
      messageId: string;
      content: string;
      mimeType: string;
      caption?: string;
      timestamp: string;
    }
  | {
      kind: 'audio';
      from: string;
      senderName?: string;
      messageId: string;
      content: string;
      mimeType: string;
      timestamp: string;
    };

export interface ActiveSession {
  intent?:
    | 'transfer_money'
    | 'check_balance'
    | 'transaction_history'
    | 'onboarding';
  stage?: 'bvn_input' | 'otp_input' | 'complete';
  missingFields?: string[];
  entities?: {
    amount?: number;
    recipient_account?: string;
    recipient_bank?: string;
    source_account?: string;
    account_type?: string;
    time_range?: string;
    name?: string;
    bank?: string;
    account_number?: string;
    [key: string]: any;
  };
}
