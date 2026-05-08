import React from 'react';
import { Plus, Trash2, MessageSquare } from 'lucide-react';
import { useConversationStore } from '../stores/conversationStore';
import { formatTime, truncateText } from '../utils/helpers';

export const Sidebar: React.FC = () => {
  const {
    conversations,
    currentConversation,
    createConversation,
    selectConversation,
    deleteConversation,
  } = useConversationStore();

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个对话吗？')) {
      deleteConversation(id);
    }
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-100 flex flex-col h-full">
      <div className="p-4">
        <button
          onClick={createConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">新对话</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">暂无对话记录</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => selectConversation(conversation.id)}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all ${
                  currentConversation?.id === conversation.id
                    ? 'bg-white shadow-sm border border-gray-200'
                    : 'hover:bg-white/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {conversation.title || '新对话'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(conversation.updatedAt)}
                    </p>
                    {conversation.messages.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {truncateText(
                          conversation.messages[conversation.messages.length - 1].content,
                          40
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDelete(e, conversation.id)}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
