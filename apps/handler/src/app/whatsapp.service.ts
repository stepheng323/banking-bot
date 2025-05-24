import {
  ParsedWhatsAppMessage,
  WhatsAppWebhookPayload,
} from '@bank-bot/types';

export class WhatsappService {
  parseWhatsAppMessage(
    payload: WhatsAppWebhookPayload,
  ): ParsedWhatsAppMessage | null {
    const entry = payload?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (!message) return null;

    const base = {
      from: message.from,
      senderName: contact?.profile?.name,
      messageId: message.id,
      timestamp: message.timestamp,
    };
    switch (message.type) {
      case 'text':
        return {
          kind: 'text',
          ...base,
          content: message.text?.body || '',
        };
      case 'image':
        return {
          kind: 'image',
          ...base,
          content: message.image?.id || '',
          mimeType: message.image?.mime_type || '',
          caption: message.image?.caption,
        };
      case 'audio':
        return {
          kind: 'audio',
          ...base,
          content: message.audio?.id || '',
          mimeType: message.audio?.mime_type || '',
        };
      default:
        return null;
    }
  }
}
