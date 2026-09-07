import { useState } from 'react';
import { Search, Filter, FileText, Calendar, Tag, ChevronDown, Clock, Star } from 'lucide-react';

export const SearchPanel = () => {
  const [query, setQuery] = useState('');

  const mockResults = [
    {
      id: 1,
      title: 'Q3 Technical Report: Cloud Security and Compliance',
      snippet: '...the new compliance framework requires all cloud infrastructure to undergo quarterly security audits and continuous monitoring for vulnerabilities...',
      score: 98,
      type: 'PDF',
      date: '2023-10-15',
      tags: ['Security', 'Q3', 'Compliance']
    },
    {
      id: 2,
      title: 'Infrastructure Migration Plan',
      snippet: '...migrating the legacy database clusters to the new cloud environment will improve latency and enhance overall security protocols...',
      score: 85,
      type: 'DOCX',
      date: '2023-09-22',
      tags: ['Migration', 'Infrastructure']
    },
    {
      id: 3,
      title: 'Employee Onboarding Security Guidelines',
      snippet: '...all new employees must complete the basic security and data privacy training within their first week of onboarding...',
      score: 72,
      type: 'PDF',
      date: '2023-08-05',
      tags: ['HR', 'Security']
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto md:overflow-hidden relative">
      {/* Decorative background blur */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="p-8 pb-4 shrink-0 relative z-10 flex flex-col items-center border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-white mb-6">Semantic Search</h1>
        
        <div className="w-full max-w-3xl relative mb-6 group">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-xl group-hover:bg-cyan-500/30 transition-colors duration-500"></div>
          <div className="relative bg-slate-900 border border-slate-700/50 rounded-2xl flex items-center p-2 focus-within:border-cyan-500/50 focus-within:bg-slate-850 transition-all duration-300 shadow-2xl">
            <Search size={24} className="text-cyan-500 ml-4 mr-3" />
            <input 
              type="text" 
              placeholder="Search across all your documents using natural language..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-slate-200 py-3 px-2 outline-none text-lg placeholder:text-slate-500"
            />
            <button 
              onClick={() => alert('Search functionality coming soon!')}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-glow ml-2"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="w-full max-w-3xl flex flex-wrap items-center gap-3 text-sm">
          <span className="text-slate-500 flex items-center gap-1.5 font-medium"><Filter size={14} /> Filters:</span>
          <button onClick={() => alert('Filter options coming soon!')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:border-slate-600 hover:text-white transition-colors">
            <FileText size={14} /> File Type <ChevronDown size={14} />
          </button>
          <button onClick={() => alert('Filter options coming soon!')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:border-slate-600 hover:text-white transition-colors">
            <Calendar size={14} /> Date Range <ChevronDown size={14} />
          </button>
          <button onClick={() => alert('Filter options coming soon!')} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 hover:border-slate-600 hover:text-white transition-colors">
            <Tag size={14} /> Tags <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-visible md:overflow-y-auto p-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6 text-sm text-slate-400">
            <span>Showing {mockResults.length} results for "{query || 'security'}"</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 cursor-pointer hover:text-white"><Clock size={14} /> Recent</span>
              <span className="flex items-center gap-1.5 text-cyan-400 cursor-pointer"><Star size={14} /> Most Relevant</span>
            </div>
          </div>

          <div className="space-y-4">
            {mockResults.map((result) => (
              <div key={result.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:bg-slate-850 hover:border-slate-700 transition-all duration-200 group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                    <FileText size={18} className="text-slate-500 group-hover:text-cyan-400" />
                    {result.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">
                      {result.score}% Match
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {result.snippet}
                </p>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-500 flex items-center gap-1"><FileText size={12} /> {result.type}</span>
                  <span className="text-slate-500 flex items-center gap-1"><Calendar size={12} /> {result.date}</span>
                  <div className="flex gap-2">
                    {result.tags.map(tag => (
                      <span key={tag} className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <Tag size={10} /> {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
