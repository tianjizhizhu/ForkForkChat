import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useConversationStore } from '../stores/conversationStore';
import { useConfigStore } from '../stores/configStore';

interface MessageInputProps {
  onSettingsClick: () => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSettingsClick }) => {
  const [input, setInput] = useState('');
  const { sendMessage, isTyping, createConversation } = useConversationStore();
  const { isConfigured } = useConfigStore();

  const handleSubmit = async () => {
    if (!input.trim() || isTyping) return;

    if (!isConfigured) {
      onSettingsClick();
      return;
    }

    try {
      await sendMessage(input.trim());
      setInput('');
    } catch (error) {
      alert(error instanceof Error ? error.message : '发送失败，请重试');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleNewChat = () => {
    createConversation();
  };

  return (
    <div className="p-4 bg-white border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        {!isConfigured && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              请先{' '}
              <button
                onClick={onSettingsClick}
                className="underline font-medium hover:text-amber-900"
              >
                配置API密钥
              </button>{' '}
              以开始对话
            </p>
          </div>
        )}

        <div className="relative flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-3 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Enter发送，Shift+Enter换行..."
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-gray-800 placeholder-gray-400 max-h-40"
            style={{
              height: 'auto',
              minHeight: '24px',
            }}
          />

          <button
            onClick={handleNewChat}
            className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            title="新建对话"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isTyping}
            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-2">
          按 Enter 发送消息，按 Shift + Enter 换行
        </p>
      </div>
    </div>
  );
};
