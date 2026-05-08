import { create } from 'zustand';
import { Conversation, Message, Branch } from '../types';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  branches: Record<string, Branch>;
  activeBranchId: string | null;
  isLoading: boolean;
  isTyping: boolean;
  streamingContent: string;

  createConversation: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  sendBranchMessage: (branchId: string, content: string) => Promise<void>;
  createBranch: (messageId: string, anchorText: string) => void;
  toggleBranch: (messageId: string) => void;
  syncBranch: (branchId: string) => void;
  deleteBranch: (branchId: string) => void;
  updateStreamingContent: (content: string) => void;
  loadConversations: () => void;
  getBranchesForMessage: (messageId: string) => Branch[];
}

const generateId = () => Math.random().toString(36).substring(2, 15);

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  branches: {},
  activeBranchId: null,
  isLoading: false,
  isTyping: false,
  streamingContent: '',

  createConversation: () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    set((state) => {
      const updated = [newConversation, ...state.conversations];
      storageService.saveConversations(updated);
      storageService.saveCurrentConversationId(newConversation.id);
      return {
        conversations: updated,
        currentConversation: newConversation,
        activeBranchId: null,
      };
    });
  },

  selectConversation: (id: string) => {
    const { conversations } = get();
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      storageService.saveCurrentConversationId(id);
      set({ currentConversation: conversation, activeBranchId: null });
    }
  },

  deleteConversation: (id: string) => {
    set((state) => {
      const updated = state.conversations.filter((c) => c.id !== id);
      storageService.saveConversations(updated);
      const newCurrent = updated[0] || null;
      storageService.saveCurrentConversationId(newCurrent?.id || null);
      return {
        conversations: updated,
        currentConversation: newCurrent,
        activeBranchId: null,
      };
    });
  },

  sendMessage: async (content: string) => {
    const { currentConversation, activeBranchId, branches } = get();

    if (!currentConversation) {
      get().createConversation();
    }

    const conversation = get().currentConversation!;
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === conversation.id
          ? { ...c, messages: [...c.messages, userMessage], updatedAt: Date.now() }
          : c
      );
      const updatedConversation = updated.find((c) => c.id === conversation.id)!;
      storageService.saveConversations(updated);
      return {
        conversations: updated,
        currentConversation: updatedConversation,
      };
    });

    set({ isTyping: true, streamingContent: '' });

    try {
      const messagesForAPI = conversation.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      messagesForAPI.push({ role: 'user', content });

      let assistantContent = '';
      assistantContent = await apiService.sendMessage(messagesForAPI, (chunk) => {
        set((state) => ({ streamingContent: state.streamingContent + chunk }));
      });

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        createdAt: Date.now(),
      };

      set((state) => {
        const updated = state.conversations.map((c) =>
          c.id === conversation.id
            ? {
                ...c,
                messages: [...c.messages, assistantMessage],
                title: c.messages.length === 0 ? content.slice(0, 20) + (content.length > 20 ? '...' : '') : c.title,
                updatedAt: Date.now(),
              }
            : c
        );
        const updatedConversation = updated.find((c) => c.id === conversation.id)!;
        storageService.saveConversations(updated);
        return {
          conversations: updated,
          currentConversation: updatedConversation,
          isTyping: false,
          streamingContent: '',
        };
      });
    } catch (error) {
      set({ isTyping: false, streamingContent: '' });
      throw error;
    }
  },

  sendBranchMessage: async (branchId: string, content: string) => {
    const { branches } = get();
    const branch = branches[branchId];
    if (!branch) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: Date.now(),
    };

    set((state) => ({
      branches: {
        ...state.branches,
        [branchId]: {
          ...state.branches[branchId],
          messages: [...state.branches[branchId].messages, userMessage],
        },
      },
    }));

    set({ isTyping: true, streamingContent: '' });

    try {
      const messagesForAPI = branch.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      messagesForAPI.push({ role: 'user', content: `以下是被锚定的原文片段：\n${branch.anchorText}\n\n用户的新问题：${content}` });

      let assistantContent = '';
      assistantContent = await apiService.sendMessage(messagesForAPI, (chunk) => {
        set((state) => ({ streamingContent: state.streamingContent + chunk }));
      });

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        createdAt: Date.now(),
      };

      set((state) => ({
        branches: {
          ...state.branches,
          [branchId]: {
            ...state.branches[branchId],
            messages: [...state.branches[branchId].messages, assistantMessage],
          },
        },
        isTyping: false,
        streamingContent: '',
      }));
    } catch (error) {
      set({ isTyping: false, streamingContent: '' });
      throw error;
    }
  },

  createBranch: (messageId: string, anchorText: string) => {
    const { currentConversation, branches } = get();
    if (!currentConversation) return;

    const message = currentConversation.messages.find((m) => m.id === messageId);
    if (!message || message.role !== 'assistant') return;

    const newBranch: Branch = {
      id: generateId(),
      messageId,
      anchorText: anchorText || message.content.slice(0, 200),
      messages: [],
      isExpanded: true,
      isSynced: false,
      createdAt: Date.now(),
    };

    set((state) => {
      const updatedBranches = { ...state.branches, [messageId]: newBranch };
      storageService.saveBranches(updatedBranches);
      return {
        branches: updatedBranches,
        activeBranchId: messageId,
      };
    });
  },

  toggleBranch: (messageId: string) => {
    set((state) => {
      const branch = state.branches[messageId];
      if (!branch) return state;

      const updatedBranches = {
        ...state.branches,
        [messageId]: { ...branch, isExpanded: !branch.isExpanded },
      };
      storageService.saveBranches(updatedBranches);

      return {
        branches: updatedBranches,
        activeBranchId: !branch.isExpanded ? messageId : null,
      };
    });
  },

  syncBranch: (branchId: string) => {
    const { branches, currentConversation } = get();
    const branch = branches[branchId];
    if (!branch || !currentConversation) return;

    const syncContent = branch.messages
      .filter((m) => m.role === 'user')
      .map((m) => `【分支讨论】\n问题：${m.content}`)
      .join('\n\n');

    const summaryMessage: Message = {
      id: generateId(),
      role: 'system',
      content: `【分支同步】针对"${branch.anchorText.slice(0, 50)}..."的分支讨论结论：\n\n${syncContent}\n\n已将讨论精华同步到主对话中。`,
      createdAt: Date.now(),
    };

    set((state) => {
      const updated = state.conversations.map((c) =>
        c.id === currentConversation.id
          ? { ...c, messages: [...c.messages, summaryMessage] }
          : c
      );
      const updatedConversation = updated.find((c) => c.id === currentConversation.id)!;
      storageService.saveConversations(updated);

      const updatedBranches = {
        ...state.branches,
        [branchId]: { ...state.branches[branchId], isSynced: true },
      };
      storageService.saveBranches(updatedBranches);

      return {
        conversations: updated,
        currentConversation: updatedConversation,
        branches: updatedBranches,
        activeBranchId: null,
      };
    });
  },

  deleteBranch: (branchId: string) => {
    set((state) => {
      const { [branchId]: _, ...remaining } = state.branches;
      storageService.saveBranches(remaining);
      return {
        branches: remaining,
        activeBranchId: state.activeBranchId === branchId ? null : state.activeBranchId,
      };
    });
  },

  updateStreamingContent: (content: string) => {
    set({ streamingContent: content });
  },

  loadConversations: () => {
    const conversations = storageService.loadConversations();
    const branches = storageService.loadBranches();
    const currentId = storageService.loadCurrentConversationId();
    const currentConversation = currentId
      ? conversations.find((c) => c.id === currentId)
      : conversations[0] || null;

    set({ conversations, branches, currentConversation });
  },

  getBranchesForMessage: (messageId: string) => {
    const branch = get().branches[messageId];
    return branch ? [branch] : [];
  },
}));
