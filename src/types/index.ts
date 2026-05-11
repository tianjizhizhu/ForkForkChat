export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: number;
  anchorText?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Branch {
  id: string;
  messageId: string;
  anchorText: string;
  messages: Message[];
  isExpanded: boolean;
  isSynced: boolean;
  createdAt: number;
}

export interface APIConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export interface ChatRequest {
  model: string;
  messages: { role: string; content: string }[];
  stream?: boolean;
}

export interface ChatResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const STORAGE_KEYS = {
  CONVERSATIONS: 'forkforkchat_conversations',
  BRANCHES: 'forkforkchat_branches',
  API_CONFIG: 'forkforkchat_api_config',
  CURRENT_CONVERSATION: 'forkforkchat_current_conversation',
} as const;

export const DEFAULT_MODEL = 'gpt-4o-mini';
export const DEFAULT_BASE_URL = 'https://api.openai.com/v1';
