import React, { useRef, useEffect } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { BranchPanel } from './BranchPanel';
import { useConversationStore } from '../stores/conversationStore';
import { Send, MessageSquare } from 'lucide-react';

interface ChatAreaProps {
  onSettingsClick: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onSettingsClick }) => {
  const {
    currentConversation,
    branches,
    activeBranchId,
    isTyping,
    streamingContent,
    createBranch,
    toggleBranch,
  } = useConversationStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isTyping, streamingContent]);

  const activeBranch = activeBranchId ? branches[activeBranchId] : null;

  const handleCreateBranch = (messageId: string) => {
    const message = currentConversation?.messages.find((m) => m.id === messageId);
    if (message) {
      createBranch(messageId, message.content.slice(0, 200));
    }
  };

  const handleToggleBranch = (messageId: string) => {
    toggleBranch(messageId);
  };

  const handleCloseBranch = () => {
    if (activeBranchId) {
      toggleBranch(activeBranchId);
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">欢迎使用 AnchorChat</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            这是一款支持锚定式分支对话的AI聊天产品。您可以针对AI回复中的特定片段创建分支讨论，
            像Word批注一样精准地展开细节讨论，完成后可顺畅回归主对话。
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>配置API后即可开始使用</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 flex flex-col">
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
        >
          {currentConversation.messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">开始发送消息进行对话吧</p>
            </div>
          ) : (
            <>
              {currentConversation.messages
                .filter((msg) => msg.role !== 'system')
                .map((message) => (
                <div key={message.id} className="relative">
                  <Message
                    message={message}
                    onCreateBranch={handleCreateBranch}
                    onToggleBranch={handleToggleBranch}
                  />
                </div>
              ))}

              {isTyping && streamingContent && (
                <div className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-700 mb-2">AI助手 正在输入...</div>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      {streamingContent}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <MessageInput onSettingsClick={onSettingsClick} />
      </div>

      {activeBranch && (
        <BranchPanel branch={activeBranch} onClose={handleCloseBranch} />
      )}
    </div>
  );
};
