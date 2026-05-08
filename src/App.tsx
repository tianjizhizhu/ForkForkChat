import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { SettingsModal } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';
import { useConfigStore } from './stores/configStore';
import { useConversationStore } from './stores/conversationStore';

function App() {
  const [showLanding, setShowLanding] = useState(true);
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
    if (isLoaded && !config.apiKey && !showLanding) {
      setIsSettingsOpen(true);
    }
  }, [isLoaded, config.apiKey, showLanding]);

  const handleEnterApp = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
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
