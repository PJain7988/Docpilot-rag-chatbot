import { useState } from 'react';
import { Cpu, FileText, Bot, BarChart3, ChevronRight, Zap, Filter, Loader2, X, Play, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export const AIToolsPanel = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [launchingTool, setLaunchingTool] = useState<number | null>(null);
  const [selectedTool, setSelectedTool] = useState<any | null>(null);

  const handleLaunch = (toolId: number) => {
    if (launchingTool) return;
    setLaunchingTool(toolId);
    setTimeout(() => {
      setLaunchingTool(null);
      setSelectedTool(null);
    }, 2000);
  };
  const tools = [
    {
      id: 1,
      title: 'Document Summarization',
      description: 'Automatically generate concise summaries of long PDFs, extracting key entities and action items.',
      icon: FileText,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'group-hover:border-cyan-500/50',
      shadow: 'group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
      category: 'Generation'
    },
    {
      id: 2,
      title: 'Custom RAG Agents',
      description: 'Build specialized conversational agents restricted to specific document collections or workspaces.',
      icon: Bot,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'group-hover:border-emerald-500/50',
      shadow: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
      category: 'Agents'
    },
    {
      id: 3,
      title: 'Entity Extraction Pipeline',
      description: 'Run batch jobs to identify people, organizations, dates, and custom regex patterns across documents.',
      icon: Zap,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'group-hover:border-purple-500/50',
      shadow: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]',
      category: 'Extraction'
    },
    {
      id: 4,
      title: 'Query Analytics',
      description: 'Analyze search trends, common questions, and knowledge gaps within your organization.',
      icon: BarChart3,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'group-hover:border-pink-500/50',
      shadow: 'group-hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)]',
      category: 'Analytics'
    }
  ];

  const filteredTools = activeFilter === 'All' ? tools : tools.filter(t => t.category === activeFilter);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-8 overflow-y-auto relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="mb-10 relative z-10">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Cpu className="text-cyan-500" size={32} />
          AI Workflows & Tools
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Supercharge your document intelligence with automated pipelines and specialized agents. 
          Configure these tools to run in the background or interact with them directly.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        <span className="text-slate-500 flex items-center gap-1.5 font-medium mr-2"><Filter size={14} /> Filter Tools:</span>
        {['All', 'Generation', 'Extraction', 'Agents', 'Analytics'].map(category => (
          <button 
            key={category}
            onClick={() => setActiveFilter(category)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
              activeFilter === category 
                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]" 
                : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-600"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 max-w-5xl pb-10">
        {filteredTools.map((tool) => (
          <div 
            key={tool.id} 
            onClick={() => setSelectedTool(tool)}
            className={clsx(
            "group bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col",
            tool.border,
            tool.shadow
          )}>
            <div className="flex justify-between items-start mb-6">
              <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                <tool.icon size={24} />
              </div>
              <span className="text-xs font-medium px-2.5 py-1 bg-slate-800 text-slate-300 rounded-full border border-slate-700">
                Configurable
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-200 mb-3 group-hover:text-white transition-colors">
              {tool.title}
            </h3>
            
            <p className="text-sm text-slate-400 leading-relaxed mb-8 flex-1">
              {tool.description}
            </p>
            
              <span className="text-slate-500 group-hover:text-cyan-400 transition-colors">Configure & Launch</span>
              <ChevronRight size={16} className="ml-1 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Configuration Modal */}
      {selectedTool && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-850/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center", selectedTool.bg, selectedTool.color)}>
                  <selectedTool.icon size={18} />
                </div>
                {selectedTool.title}
              </h2>
              <button 
                onClick={() => setSelectedTool(null)} 
                className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-400 mb-6 text-sm leading-relaxed">{selectedTool.description}</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Target Document Scope</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors">
                    <option>All Uploaded Documents</option>
                    <option>Recently Added (Past 7 Days)</option>
                    <option>Selected Tags Only...</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Execution Mode</label>
                  <select className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 outline-none focus:border-cyan-500 transition-colors">
                    <option>Run Immediately</option>
                    <option>Schedule Background Job (Off-peak)</option>
                  </select>
                </div>
                <div className="pt-2">
                  <div className="flex items-center gap-2 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400 text-sm">
                    <Settings size={16} />
                    <span>Advanced parameters will be applied automatically based on scope.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-850/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedTool(null)} 
                className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                disabled={launchingTool === selectedTool.id}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleLaunch(selectedTool.id)} 
                disabled={launchingTool === selectedTool.id}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-glow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {launchingTool === selectedTool.id ? (
                  <><Loader2 size={16} className="animate-spin" /> Processing...</>
                ) : (
                  <><Play size={16} /> Initialize Workflow</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
