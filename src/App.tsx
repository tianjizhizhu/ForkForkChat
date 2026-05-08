import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { useConfigStore } from './stores/configStore';
import { useConversationStore } from './stores/conversationStore';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { loadConfig, isConfigured } = useConfigStore();
  const { loadConversations, createConversation } = useConversationStore();

  useEffect(() => {
    loadConfig();
    loadConversations();
  }, []);

  useEffect(() => {
    if (!isConfigured) {
      setIsSettingsOpen(true);
    }
  }, [isConfigured]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ChatArea onSettingsClick={() => setIsSettingsOpen(true)} />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
