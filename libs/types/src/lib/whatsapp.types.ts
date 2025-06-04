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
  interactive?: {
    type: 'list_reply' | 'button_reply';
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
    button_reply?: {
      id: string;
      title: string;
    };
  };
};

export type ParsedWhatsAppMessage =
  | {
      type: 'text' |  'interactive';
      from: string;
      senderName?: string;
      messageId: string;
      content: string;
      timestamp: string;
      interactive?: {
        type: 'list_reply' | 'button_reply' | 'flow_reply';
        list_reply?: {
          id: string;
          title: string;
          description?: string;
        };
        button_reply?: {
          id: string;
          title: string;
        };
        flow_reply?: {
          flow_token: string;
          flow_action: string;
          field_values: Record<string, string>;
        };
      };
    }
  | {
      type: 'image';
      from: string;
      senderName?: string;
      messageId: string;
      content: string;
      mimeType: string;
      caption?: string;
      timestamp: string;
    }
  | {
      type: 'audio';
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
  stage?:
    | 'bvn_input'
    | 'bvn_verification'
    | 'otp_input'
    | 'account_selection'
    | 'account_confirmation'
    | 'complete'
    | undefined;
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

export function isInteractiveMessage(message: ParsedWhatsAppMessage): message is {
  type: 'interactive';
  from: string;
  senderName?: string;
  messageId: string;
  content: string;
  timestamp: string;
  interactive?: {
    type: 'list_reply' | 'button_reply' | 'flow_reply';
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
    button_reply?: {
      id: string;
      title: string;
    };
    flow_reply?: {
      flow_token: string;
      flow_action: string;
      field_values: Record<string, string>;
    };
  };
} {
  return message.type === 'interactive';
}

export function isTextMessage(message: ParsedWhatsAppMessage): message is {
  type: 'text';
  from: string;
  senderName?: string;
  messageId: string;
  content: string;
  timestamp: string;
} {
  return message.type === 'text';
}

