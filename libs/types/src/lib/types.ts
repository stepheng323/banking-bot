export interface ParsedWhatsAppMessage {
  from: string;
  content: string;
  timestamp: number;
}

export interface ActiveSession {
  intent?: string;
  missingFields?: string[];
  amount?: number;
  recipient?: string;
  collectingAmount?: boolean;
  collectingRecipient?: boolean;
  bvn?: string;
}
