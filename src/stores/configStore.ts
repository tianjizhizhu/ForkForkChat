import { create } from 'zustand';
import { APIConfig, DEFAULT_MODEL, DEFAULT_BASE_URL } from '../types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';

interface ConfigState {
  config: APIConfig;
  isConfigured: boolean;
  setConfig: (config: APIConfig) => void;
  loadConfig: () => void;
  clearConfig: () => void;
  testConnection: () => Promise<{ success: boolean; message: string }>;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: {
    apiKey: '',
    model: DEFAULT_MODEL,
    baseUrl: DEFAULT_BASE_URL,
  },
  isConfigured: false,

  setConfig: (config: APIConfig) => {
    storageService.saveConfig(config);
    apiService.setConfig(config);
    set({ config, isConfigured: !!config.apiKey });
  },

  loadConfig: () => {
    const savedConfig = storageService.loadConfig();
    if (savedConfig) {
      apiService.setConfig(savedConfig);
      set({ config: savedConfig, isConfigured: !!savedConfig.apiKey });
    }
  },

  clearConfig: () => {
    storageService.clearConfig();
    const defaultConfig = {
      apiKey: '',
      model: DEFAULT_MODEL,
      baseUrl: DEFAULT_BASE_URL,
    };
    apiService.setConfig(defaultConfig);
    set({ config: defaultConfig, isConfigured: false });
  },

  testConnection: async () => {
    const { config } = get();
    if (!config.apiKey) {
      return { success: false, message: '请先输入API密钥' };
    }
    const testConfig = { ...config };
    apiService.setConfig(testConfig);
    return apiService.testConnection();
  },
}));
