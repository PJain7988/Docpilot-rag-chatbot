import { useState } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { MainPanel } from '../MainPanel/MainPanel';
import { ChatPanel } from '../ChatPanel/ChatPanel';
import { MyDocuments } from '../MyDocuments/MyDocuments';
import { SearchPanel } from '../SearchPanel/SearchPanel';
import { AIToolsPanel } from '../AIToolsPanel/AIToolsPanel';
import { TeamsPanel } from '../TeamsPanel/TeamsPanel';
import { SettingsPanel } from '../SettingsPanel/SettingsPanel';
import { Menu, MessageSquare } from 'lucide-react';

export const Layout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <MainPanel />;
      case 'My Documents':
        return <MyDocuments />;
      case 'Search':
        return <SearchPanel />;
      case 'AI Tools':
        return <AIToolsPanel />;
      case 'Teams':
        return <TeamsPanel />;
      case 'Settings':
        return <SettingsPanel />;
      default:
        return <MainPanel />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans relative">
      {/* Mobile Topbar */}
      <div className="md:hidden absolute top-0 left-0 w-full h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="text-slate-400 hover:text-white">
          <Menu size={24} />
        </button>
        <span className="font-bold text-white text-lg">DocPilot</span>
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="text-cyan-500 hover:text-cyan-400">
          <MessageSquare size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex w-full h-full pt-14 md:pt-0">
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 overflow-hidden relative">
          {renderActivePanel()}
        </div>
        <ChatPanel isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      </div>
      
      {/* Mobile Backdrop for Sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

