import { useState } from 'react';
import { Search, Bell, ZoomIn, ZoomOut, Download, Share } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'A', uv: 4000 },
  { name: 'B', uv: 3000 },
  { name: 'C', uv: 2000 },
  { name: 'D', uv: 2780 },
  { name: 'E', uv: 1890 },
  { name: 'F', uv: 2390 },
  { name: 'G', uv: 3490 },
];

const dummyData2 = [
  { name: 'A', uv: 2000 },
  { name: 'B', uv: 3500 },
  { name: 'C', uv: 2800 },
  { name: 'D', uv: 3908 },
  { name: 'E', uv: 4800 },
  { name: 'F', uv: 3800 },
  { name: 'G', uv: 4300 },
];

export const MainPanel = () => {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto md:overflow-hidden">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-400 text-sm font-medium flex items-center gap-2">
          <span>Workspace: <span className="text-white">Alpha</span></span>
          <span className="text-slate-600">|</span>
          <span>Project: <span className="text-white">Security Audit Q3</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Search size={18} className="text-slate-400 cursor-pointer hover:text-white transition-colors" />
          <Bell size={18} className="text-slate-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-900 border border-slate-800 rounded-xl overflow-visible md:overflow-hidden shadow-2xl">
        
        {/* Document Header */}
        <div className="p-5 border-b border-slate-800 flex flex-col shrink-0 bg-slate-850/50">
          <h1 className="text-lg font-semibold text-slate-100 mb-1">Q3 Technical Report: Cloud Security and Compliance</h1>
          <div className="text-xs text-slate-400">
            Page 4 of 28 | Doc ID: DP-98124 | Uploaded: 2023-10-15
          </div>
        </div>

        {/* Document Viewer (Placeholder Grid) */}
        <div className="flex-1 p-6 overflow-visible md:overflow-y-auto relative bg-slate-950/50">
          {/* Toolbar */}
          <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-800/80 backdrop-blur border border-slate-700 p-1.5 rounded-lg z-10 text-slate-400">
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"><ZoomOut size={16} /></button>
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"><ZoomIn size={16} /></button>
            <button onClick={() => alert('Download mockup clicked')} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"><Download size={16} /></button>
            <button onClick={() => alert('Share mockup clicked')} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors"><Share size={16} /></button>
          </div>

          <div className="text-xs text-slate-500 mb-4">Page 4 of 28</div>
          
          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto opacity-90 hover:opacity-100 transition-transform origin-top duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* Page 1 Mock */}
            <div className="bg-white rounded p-4 aspect-[1/1.4] shadow-sm flex flex-col">
               <div className="h-4 bg-slate-200 rounded w-3/4 mb-6"></div>
               <div className="flex-1 flex items-end gap-2 px-4 border-b border-slate-200 pb-2">
                 <div className="w-1/4 bg-teal-500 h-1/3"></div>
                 <div className="w-1/4 bg-teal-600 h-2/3"></div>
                 <div className="w-1/4 bg-teal-700 h-full"></div>
                 <div className="w-1/4 bg-teal-800 h-1/2"></div>
               </div>
               <div className="mt-4 space-y-2">
                 <div className="h-2 bg-slate-200 rounded w-full"></div>
                 <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                 <div className="h-2 bg-slate-200 rounded w-full"></div>
               </div>
            </div>
            
            {/* Page 2 Mock */}
            <div className="bg-white rounded p-4 aspect-[1/1.4] shadow-sm flex flex-col">
               <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
               <div className="space-y-4 flex-1">
                 <div className="flex gap-4 items-center">
                   <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></div>
                   <div className="space-y-2 flex-1">
                     <div className="h-2 bg-slate-200 rounded w-full"></div>
                     <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                   </div>
                 </div>
                 <div className="flex gap-4 items-center">
                   <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></div>
                   <div className="space-y-2 flex-1">
                     <div className="h-2 bg-slate-200 rounded w-full"></div>
                     <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                   </div>
                 </div>
                 <div className="flex gap-4 items-center">
                   <div className="w-2 h-2 rounded-full bg-slate-400 shrink-0"></div>
                   <div className="space-y-2 flex-1">
                     <div className="h-2 bg-slate-200 rounded w-full"></div>
                     <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                   </div>
                 </div>
               </div>
            </div>

             {/* Page 3 Mock */}
             <div className="bg-white rounded p-4 aspect-[1/1.4] shadow-sm flex flex-col">
               <div className="w-full bg-slate-100 rounded flex-1 border border-slate-200 flex flex-col">
                  <div className="h-8 border-b border-slate-200 flex">
                    <div className="flex-1 border-r border-slate-200 bg-slate-50"></div>
                    <div className="flex-1 border-r border-slate-200 bg-slate-50"></div>
                    <div className="flex-1 bg-slate-50"></div>
                  </div>
                  <div className="flex-1 flex flex-col justify-evenly px-2 space-y-2 py-2">
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                  </div>
               </div>
               <div className="mt-4 space-y-2">
                 <div className="h-2 bg-slate-200 rounded w-full"></div>
                 <div className="h-2 bg-slate-200 rounded w-2/3"></div>
               </div>
            </div>

             {/* Page 4 Mock */}
             <div className="bg-white rounded p-4 aspect-[1/1.4] shadow-sm flex flex-col items-center justify-center">
                <div className="w-48 h-32 border-2 border-slate-200 rounded-lg flex items-center justify-center relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200"></div>
                  <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-200"></div>
                  <div className="w-16 h-12 bg-teal-100 border-2 border-teal-500 rounded flex items-center justify-center text-[8px] text-teal-700 font-bold z-10">PROCESS A</div>
                </div>
                <div className="mt-8 space-y-2 w-full">
                 <div className="h-2 bg-slate-200 rounded w-full"></div>
                 <div className="h-2 bg-slate-200 rounded w-full"></div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Metadata & Stats */}
        <div className="shrink-0 flex flex-col border-t border-slate-800 bg-slate-850">
          
          {/* Document Metadata */}
          <div className="p-4 border-b border-slate-800/50 flex flex-col">
            <h3 className="text-sm font-medium text-slate-300 mb-3">Document Metadata</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-1">Size</div>
                <div className="text-sm text-slate-200">1.2MB</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Type</div>
                <div className="text-sm text-slate-200">PDF</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Pages</div>
                <div className="text-sm text-slate-200">28</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Status</div>
                <div className="text-sm text-cyan-400">Indexed</div>
              </div>
            </div>
          </div>

          {/* Document Processing Stats */}
          <div className="p-4 flex flex-col">
            <h3 className="text-sm font-medium text-slate-300 mb-4">Document Processing Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              
              {/* Pages Processed */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs text-slate-500">Pages Processed</div>
                  <div className="text-xs text-cyan-500 font-medium">(28/28)</div>
                </div>
                <div className="flex items-end gap-1 h-8">
                  {[4, 6, 8, 3, 7, 5, 9, 10, 8].map((h, i) => (
                    <div key={i} className="flex-1 bg-cyan-500 rounded-t-sm" style={{ height: `${h * 10}%`, opacity: 0.5 + (i * 0.05) }}></div>
                  ))}
                </div>
              </div>

              {/* Entity Extraction */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs text-slate-500">Entity Extraction</div>
                  <div className="text-xs text-cyan-500 font-medium">(94%)</div>
                </div>
                <div className="h-8">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dummyData}>
                      <Area type="monotone" dataKey="uv" stroke="#00f2fe" fill="#00f2fe" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Vector Status */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs text-slate-500">Vector Status</div>
                  <div className="text-xs text-cyan-500 font-medium">Complete</div>
                </div>
                <div className="h-8 flex flex-col justify-center">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 mb-1">
                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="text-[10px] text-slate-500">2048 Chunks</div>
                </div>
              </div>

              {/* Semantic Indexing */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <div className="text-xs text-slate-500">Semantic Indexing</div>
                  <div className="text-xs text-cyan-500 font-medium">Ready</div>
                </div>
                <div className="h-8">
                   <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dummyData2}>
                      <Area type="monotone" dataKey="uv" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
