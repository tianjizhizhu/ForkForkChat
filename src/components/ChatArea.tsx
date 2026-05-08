import React, { useRef, useEffect, useState } from 'react';
import { Message } from './Message';
import { MessageInput } from './MessageInput';
import { BranchPanel } from './BranchPanel';
import { useConversationStore } from '../stores/conversationStore';
import { MessageSquare, Menu, ChevronRight, ChevronLeft } from 'lucide-react';

interface ChatAreaProps {
  onSettingsClick: () => void;
  onMenuClick: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ onSettingsClick, onMenuClick }) => {
  const {
    currentConversation,
    branches,
    activeBranchId,
    isTyping,
    streamingContent,
    createBranch,
    toggleBranch,
  } = useConversationStore();

  const [isBranchExpanded, setIsBranchExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isTyping, streamingContent]);

  useEffect(() => {
    if (activeBranchId) {
      setIsBranchExpanded(true);
    }
  }, [activeBranchId]);

  const activeBranch = activeBranchId ? branches[activeBranchId] : null;

  const handleCreateBranch = (messageId: string) => {
    const message = currentConversation?.messages.find((m) => m.id === messageId);
    if (message) {
      createBranch(messageId, message.content.slice(0, 200));
      setIsBranchExpanded(true);
    }
  };

  const handleToggleBranch = (messageId: string) => {
    toggleBranch(messageId);
    if (activeBranchId === messageId) {
      setIsBranchExpanded(!isBranchExpanded);
    } else {
      setIsBranchExpanded(true);
    }
  };

  const handleCloseBranch = () => {
    setIsBranchExpanded(false);
  };

  const handleOpenBranch = () => {
    if (activeBranchId) {
      setIsBranchExpanded(true);
    }
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <button
          onClick={onMenuClick}
          className="absolute top-4 left-4 p-2 bg-white rounded-xl shadow-md md:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center max-w-md px-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">欢迎使用 ForkForkChat</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            这是一款支持锚定式分支对话的AI聊天产品。您可以针对AI回复中的特定片段创建分支讨论，
            像Word批注一样精准地展开细节讨论，完成后可顺畅回归主对话。
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
            <span>配置API后即可开始使用</span>
          </div>
        </div>
      </div>
    );
  }

  const hasBranches = Object.keys(branches).length > 0;

  return (
    <div className="flex-1 flex overflow-hidden relative">
      <div className="flex-1 flex flex-col relative">
        <div className="flex items-center gap-2 p-4 md:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-50"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="font-medium text-gray-800 truncate flex-1">
            {currentConversation.title || '新对话'}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-4">
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
                <div className="flex gap-4 p-4 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm">
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

          {activeBranch && (
            <div className="relative mt-6 flex items-start">
              {isBranchExpanded ? (
                <>
                  <button
                    onClick={handleCloseBranch}
                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mr-4 hover:shadow-xl transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <BranchPanel branch={activeBranch} onClose={handleCloseBranch} />
                  </div>
                </>
              ) : (
                <button
                  onClick={handleOpenBranch}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-md hover:shadow-lg hover:from-indigo-100 hover:to-purple-100 transition-all duration-200 border-2 border-dashed border-indigo-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-indigo-700">分支讨论</div>
                    <div className="text-xs text-indigo-500">点击展开分支对话</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-400 ml-auto" />
                </button>
              )}
            </div>
          )}
        </div>

        <MessageInput onSettingsClick={onSettingsClick} />
      </div>
    </div>
  );
};
