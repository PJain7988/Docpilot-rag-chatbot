import { useState } from 'react';
import { Cpu, FileText, Bot, BarChart3, ChevronRight, Zap, Filter } from 'lucide-react';
import { clsx } from 'clsx';

export const AIToolsPanel = () => {
  const [activeFilter, setActiveFilter] = useState('All');
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
            onClick={() => alert(`Launching ${tool.title} workflow...`)}
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
            
            <div className="flex items-center text-sm font-semibold text-slate-500 group-hover:text-cyan-400 transition-colors mt-auto">
              Launch Workflow <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
