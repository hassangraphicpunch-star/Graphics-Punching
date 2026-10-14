export type ChatRole = 'user' | 'assistant' | 'admin' | 'system';

export type ChatEventType =
  | 'user_message'
  | 'quick_reply'
  | 'quick_action'
  | 'message_click'
  | 'quote_request'
  | 'lead_submission'
  | 'admin_reply';

export interface ChatMessageItem {
  id: string;
  role: ChatRole;
  senderName?: string;
  content: string;
  timestamp: string;
  createdAt?: string;
  type?: ChatEventType;
  status?: 'sending' | 'sent' | 'failed';
  suggestedAction?: {
    type: string;
    label: string;
    url?: string;
  };
  actionDetails?: any;
}

export interface ChatConversation {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorEmail?: string;
  visitorPhone?: string;
  startedAt: string;
  lastUpdatedAt: string;
  status: 'open' | 'in_progress' | 'resolved' | 'archived' | 'active';
  unreadForAdmin: number;
  unreadForVisitor: number;
  lastMessage: string;
  lastEventType: ChatEventType | string;
  needsAdminFollowUp?: boolean;
  sessionInfo?: {
    url?: string;
    platform?: string;
    viewport?: string;
  };
  messages: ChatMessageItem[];
}

export interface ChatConversationsResponse {
  success: boolean;
  conversations: ChatConversation[];
  totalUnread: number;
}
