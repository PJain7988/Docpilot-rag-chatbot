import { useState } from 'react';
import { Settings, Key, Database, Shield, Monitor, Save, CheckCircle2, X } from 'lucide-react';
import { clsx } from 'clsx';

export const SettingsPanel = () => {
  const [activeMenu, setActiveMenu] = useState('LLM Providers');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const menuItems = [
    { name: 'General', icon: Monitor },
    { name: 'LLM Providers', icon: Key },
    { name: 'Vector Database', icon: Database },
    { name: 'Security', icon: Shield },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto relative">
      <div className="p-8 pb-6 shrink-0 border-b border-slate-800">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="text-cyan-500" size={32} />
          Platform Settings
        </h1>
        <p className="text-slate-400 text-sm">Configure system preferences, API keys, and database connections.</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-4 shrink-0 md:overflow-y-auto">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible space-y-0 md:space-y-1 text-sm font-medium pb-2 md:pb-0">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={clsx(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  activeMenu === item.name 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                )}
              >
                <item.icon size={18} className={activeMenu === item.name ? "text-cyan-400" : "text-slate-500"} />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-3xl relative z-10">
            {activeMenu === 'LLM Providers' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">OpenAI Integration</h3>
                      <p className="text-xs text-slate-400 mt-1">Used for high-accuracy reasoning and generation tasks.</p>
                    </div>
                    <div className="h-6 w-12 bg-cyan-600 rounded-full relative cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">API Key</label>
                      <input 
                        type="password" 
                        defaultValue="sk-................................................" 
                        className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors font-mono text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary Model</label>
                        <select className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors appearance-none">
                          <option>gpt-4o</option>
                          <option>gpt-4-turbo</option>
                          <option>gpt-3.5-turbo</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Temperature</label>
                        <input 
                          type="number" 
                          defaultValue={0.2}
                          step={0.1}
                          className="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl opacity-60 hover:opacity-100 transition-opacity">
                  <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Google Gemini</h3>
                      <p className="text-xs text-slate-400 mt-1">Alternative provider for multimodal capabilities.</p>
                    </div>
                    <div className="h-6 w-12 bg-slate-700 rounded-full relative cursor-pointer border border-slate-600">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-4 pointer-events-none">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">API Key</label>
                      <input 
                        type="password" 
                        placeholder="Enter API Key" 
                        className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl px-4 py-3"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => {
                      setSuccessMessage("Settings saved successfully!");
                      setTimeout(() => setSuccessMessage(null), 3000);
                    }}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors shadow-glow"
                  >
                    <Save size={18} />
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
            
            {activeMenu !== 'LLM Providers' && (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                <p className="mb-2">Configuration options for <strong>{activeMenu}</strong></p>
                <p className="text-xs">Coming in next update</p>
              </div>
            )}
            
          </div>
        </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-[200] bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CheckCircle2 size={20} />
          <span className="font-medium text-sm">{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="ml-2 text-emerald-500/50 hover:text-emerald-400 transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
