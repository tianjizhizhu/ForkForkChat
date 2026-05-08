import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Send, ChevronDown, ChevronUp, ArrowLeftRight, Trash2, User, Bot, Loader2 } from 'lucide-react';
import { useConversationStore } from '../stores/conversationStore';
import { Branch, Message } from '../types';

interface BranchPanelProps {
  branch: Branch;
  onClose: () => void;
}

export const BranchPanel: React.FC<BranchPanelProps> = ({ branch, onClose }) => {
  const [input, setInput] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { sendBranchMessage, syncBranch, deleteBranch, isTyping, streamingContent } = useConversationStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [branch.messages, isTyping]);

  const handleSubmit = async () => {
    if (!input.trim() || isTyping) return;

    try {
      await sendBranchMessage(branch.id, input.trim());
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

  const handleSync = () => {
    syncBranch(branch.id);
    onClose();
  };

  const handleDelete = () => {
    if (confirm('确定要删除这个分支吗？')) {
      deleteBranch(branch.id);
      onClose();
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-transparent">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">分支讨论</h3>
            <p className="text-xs text-gray-500">锚定式对话</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div
        className="border-b border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-emerald-600">锚定的原文</span>
            {branch.isSynced && (
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded">
                已同步
              </span>
            )}
          </div>
          {isCollapsed ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          )}
        </div>
        {!isCollapsed && (
          <div className="px-4 pb-3">
            <blockquote className="text-sm text-gray-600 italic border-l-3 border-emerald-300 pl-3 line-clamp-3">
              {branch.anchorText}
            </blockquote>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {branch.messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">开始针对这段内容展开讨论吧</p>
          </div>
        ) : (
          <>
            {branch.messages.map((message) => (
              <BranchMessageItem key={message.id} message={message} />
            ))}
            {isTyping && streamingContent && (
              <div className="flex gap-3 p-3 bg-emerald-50 rounded-2xl">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">AI助手 正在输入...</div>
                  <div className="text-sm text-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {streamingContent}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-100 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={handleSync}
            disabled={branch.messages.length === 0 || branch.isSynced}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{branch.isSynced ? '已同步' : '同步到主对话'}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 px-3 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="在分支中提问..."
            rows={1}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 resize-none outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all text-sm"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const BranchMessageItem: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div
      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
          message.role === 'user'
            ? 'bg-indigo-500 text-white'
            : 'bg-emerald-500 text-white'
        }`}
      >
        {message.role === 'user' ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      <div
        className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : ''}`}
      >
        <div
          className={`inline-block px-4 py-2 rounded-2xl text-sm ${
            message.role === 'user'
              ? 'bg-indigo-500 text-white rounded-tr-sm'
              : 'bg-emerald-50 text-gray-700 rounded-tl-sm'
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
