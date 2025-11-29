export type MessageSender = 'user' | 'luna' | 'system';
export type MessageType = 'text' | 'card' | 'quick-response';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
  type: MessageType;
  cardData?: {
    image?: string;
    name: string;
    price: number;
    details: string;
    type: 'flight' | 'hotel' | 'activity' | 'restaurant';
  };
}

export interface QuickResponse {
  label: string;
  value: string;
}
