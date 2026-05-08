import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { useConfigStore } from './stores/configStore';
import { useConversationStore } from './stores/conversationStore';

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { loadConfig, config, isConfigured } = useConfigStore();
  const { loadConversations } = useConversationStore();

  useEffect(() => {
    loadConfig();
    loadConversations();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isLoaded && !config.apiKey) {
      setIsSettingsOpen(true);
    }
  }, [isLoaded, config.apiKey]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header onSettingsClick={() => setIsSettingsOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        />
        <ChatArea 
          onSettingsClick={() => setIsSettingsOpen(true)} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
