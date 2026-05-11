import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Settings } from 'lucide-react';
import { useConfigStore } from '../stores/configStore';
import { DEFAULT_MODEL, DEFAULT_BASE_URL } from '../types';
import { apiService } from '../services/apiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { config, setConfig, testConnection, clearConfig } = useConfigStore();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(DEFAULT_MODEL);
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setApiKey(config.apiKey);
      setModel(config.model || DEFAULT_MODEL);
      setBaseUrl(config.baseUrl || DEFAULT_BASE_URL);
      setTestResult(null);
    }
  }, [isOpen, config]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const tempConfig = { apiKey, model, baseUrl };
    apiService.setConfig(tempConfig);
    const result = await apiService.testConnection();
    setTestResult(result);
    setIsTesting(false);
  };

  const handleClear = () => {
    clearConfig();
    setApiKey('');
    setModel(DEFAULT_MODEL);
    setBaseUrl(DEFAULT_BASE_URL);
    setTestResult(null);
  };

  const handleSave = () => {
    setConfig({ apiKey, model, baseUrl });
    handleClose();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">API配置</h2>
              <p className="text-xs text-gray-500">配置你的 AI 连接</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"/>
              API 地址
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white group-hover:border-indigo-200"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"/>
              API 密钥
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all group-hover:border-indigo-200"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              >
                {showApiKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full"/>
              模型名称
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="例如: gpt-4o-mini"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white group-hover:border-indigo-200"
            />
            <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"/>
              支持 OpenAI 兼容格式的 API
            </p>
          </div>

          {testResult && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl animate-fadeInScale ${
                testResult.success
                  ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
                  : 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200'
              }`}
            >
              {testResult.success ? (
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
              )}
              <span className={`text-sm font-medium ${
                testResult.success ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {testResult.message}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleTest}
              disabled={!apiKey || isTesting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>测试中...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"/>
                  <span>测试连接</span>
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-3 text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-all duration-200 font-medium"
            >
              清除配置
            </button>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 bg-gradient-to-r from-gray-50 to-indigo-50/30 border-t border-gray-100">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-white transition-all duration-200 font-medium text-gray-600"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-indigo-500/30 font-medium"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
};
