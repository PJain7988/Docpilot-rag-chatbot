import { useState } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import { MainPanel } from '../MainPanel/MainPanel';
import { ChatPanel } from '../ChatPanel/ChatPanel';
import { MyDocuments } from '../MyDocuments/MyDocuments';
import { SearchPanel } from '../SearchPanel/SearchPanel';
import { AIToolsPanel } from '../AIToolsPanel/AIToolsPanel';
import { TeamsPanel } from '../TeamsPanel/TeamsPanel';
import { SettingsPanel } from '../SettingsPanel/SettingsPanel';

export const Layout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

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
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderActivePanel()}
      <ChatPanel />
    </div>
  );
};

