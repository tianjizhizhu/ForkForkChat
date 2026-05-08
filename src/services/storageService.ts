import { Conversation, Branch, APIConfig, DEFAULT_MODEL, DEFAULT_BASE_URL, STORAGE_KEYS } from '../types';

class StorageService {
  saveConversations(conversations: Conversation[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (error) {
      console.error('Failed to save conversations:', error);
    }
  }

  loadConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load conversations:', error);
      return [];
    }
  }

  saveBranches(branches: Record<string, Branch>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
    } catch (error) {
      console.error('Failed to save branches:', error);
    }
  }

  loadBranches(): Record<string, Branch> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRANCHES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Failed to load branches:', error);
      return {};
    }
  }

  saveConfig(config: APIConfig): void {
    try {
      const encoded = btoa(config.apiKey);
      const dataToSave = { ...config, apiKey: encoded };
      localStorage.setItem(STORAGE_KEYS.API_CONFIG, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  loadConfig(): APIConfig | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.API_CONFIG);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        apiKey: atob(parsed.apiKey),
      };
    } catch (error) {
      console.error('Failed to load config:', error);
      return null;
    }
  }

  clearConfig(): void {
    localStorage.removeItem(STORAGE_KEYS.API_CONFIG);
  }

  saveCurrentConversationId(id: string | null): void {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CONVERSATION, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_CONVERSATION);
    }
  }

  loadCurrentConversationId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_CONVERSATION);
  }

  getDefaultConfig(): APIConfig {
    return {
      apiKey: '',
      model: DEFAULT_MODEL,
      baseUrl: DEFAULT_BASE_URL,
    };
  }
}

export const storageService = new StorageService();
