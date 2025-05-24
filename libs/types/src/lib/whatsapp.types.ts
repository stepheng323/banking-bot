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
    | 'onboarding'; // Current intent
  missingFields?: string[]; // List of fields that are still missing
  entities?: {
    amount?: number; // For transfer_money
    recipient_account?: string; // For transfer_money
    recipient_bank?: string; // For transfer_money
    source_account?: string; // For transfer_money
    account_type?: string; // For check_balance and transaction_history
    time_range?: string; // For transaction_history
    name?: string; // For onboarding
    bank?: string; // For onboarding
    account_number?: string; // For onboarding
    [key: string]: string | number | null | undefined; // Additional entities extracted from the user's input
  };
}
