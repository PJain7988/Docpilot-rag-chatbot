import {
  LayoutDashboard,
  FileText,
  Search,
  Cpu,
  Users,
  Settings,
  LogOut,
  Globe
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: FileText, label: 'My Documents' },
    { icon: Search, label: 'Search' },
    { icon: Cpu, label: 'AI Tools' },
    { icon: Users, label: 'Teams' },
    { icon: Settings, label: 'Settings' },
  ];

  const projects = [
    { name: 'Alpha', color: 'bg-blue-500', initial: 'A' },
    { name: 'Beta', color: 'bg-teal-500', initial: 'S' },
    { name: 'Delta', color: 'bg-pink-500', initial: 'R' },
  ];

  return (
    <div className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col pt-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        {/* Logo placeholder */}
        <div className="text-cyan-500 flex items-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 22 12 2l10 20-10-4z" /></svg>
        </div>
        <span className="text-xl font-bold tracking-wide text-white">DocPilot AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item, idx) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={idx}
              onClick={() => setActiveTab(item.label)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-panel-gradient border border-cyan-500/30 text-cyan-400 shadow-glow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <item.icon size={18} className={isActive ? "text-cyan-400" : "text-slate-400"} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 mb-6">
        <div className="bg-slate-850 rounded-xl p-4 border border-slate-800/50">
          <div className="flex items-center justify-between mb-4 text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span className="flex items-center gap-2"><Globe size={14} /> Multi-tenant workspace</span>
          </div>
          <div className="space-y-3">
            <div className="text-xs text-slate-500 mb-2">Projects</div>
            {projects.map((proj, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white cursor-pointer transition-colors">
                <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white ${proj.color}`}>
                  {proj.initial}
                </div>
                {proj.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center gap-3 w-full px-2 py-2 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
            {/* Profile Pic Placeholder */}
            <img src="https://i.pravatar.cc/150?u=sarah" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-white">Sarah J.</div>
            <div className="text-xs text-slate-500">Admin</div>
          </div>
          <LogOut size={16} className="text-slate-500 hover:text-slate-300" />
        </div>
      </div>
    </div>
  );
};
