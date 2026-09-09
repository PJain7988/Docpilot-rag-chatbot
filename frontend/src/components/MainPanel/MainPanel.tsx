import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Download, Share, Loader2 } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { api, type Document } from '../../services/api';

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
  const [latestDoc, setLatestDoc] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestDocument = async () => {
      try {
        const docs = await api.getDocuments();
        if (docs.length > 0) {
          // Assuming the last one in the list is the most recent (or sort by uploaded_at if available)
          const sorted = docs.sort((a, b) => new Date(b.uploaded_at || 0).getTime() - new Date(a.uploaded_at || 0).getTime());
          setLatestDoc(sorted[0]);
        }
      } catch (error) {
        console.error("Failed to fetch documents for dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestDocument();
  }, []);

  const handleDownload = () => {
    if (!latestDoc) return;
    // Create a dummy blob representing the file download
    const content = `Mock download content for ${latestDoc.filename}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = latestDoc.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!latestDoc) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: latestDoc.filename,
          text: `Check out this document: ${latestDoc.filename}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert(`Sharing is not supported on this browser. Share Link: ${window.location.href}`);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto md:overflow-hidden">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
          <span>Workspace: <span className="text-slate-800 dark:text-white">Alpha</span></span>
          <span className="text-slate-600">|</span>
          <span>Project: <span className="text-slate-800 dark:text-white">Security Audit Q3</span></span>
        </div>
        {/* Placeholder for future top-right actions */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-visible md:overflow-hidden shadow-2xl">
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 size={32} className="text-cyan-500 animate-spin" />
          </div>
        ) : !latestDoc ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Documents Uploaded</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Head over to the "My Documents" tab to upload your first document.</p>
          </div>
        ) : (
          <>
            {/* Document Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col shrink-0 bg-slate-100 dark:bg-slate-850/50">
              <h1 className="text-lg font-semibold text-slate-100 mb-1">{latestDoc.filename}</h1>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Doc ID: {latestDoc.id} | Uploaded: {new Date(latestDoc.uploaded_at || Date.now()).toLocaleDateString()}
              </div>
            </div>

            {/* Document Viewer (Placeholder Grid) */}
            <div className="flex-1 p-6 overflow-visible md:overflow-y-auto relative bg-slate-50 dark:bg-slate-950/50">
              {/* Toolbar */}
              <div className="absolute top-4 right-6 flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 backdrop-blur border border-slate-300 dark:border-slate-700 p-1.5 rounded-lg z-10 text-slate-500 dark:text-slate-400">
                <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))} className="p-1 hover:text-slate-800 dark:text-white hover:bg-slate-700 rounded transition-colors"><ZoomOut size={16} /></button>
                <button onClick={() => setZoom(z => Math.min(z + 0.2, 2))} className="p-1 hover:text-slate-800 dark:text-white hover:bg-slate-700 rounded transition-colors"><ZoomIn size={16} /></button>
                <button onClick={handleDownload} className="p-1 hover:text-slate-800 dark:text-white hover:bg-slate-700 rounded transition-colors"><Download size={16} /></button>
                <button onClick={handleShare} className="p-1 hover:text-slate-800 dark:text-white hover:bg-slate-700 rounded transition-colors"><Share size={16} /></button>
              </div>

              <div className="text-xs text-slate-400 dark:text-slate-500 mb-4">Previewing content...</div>
          
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
        <div className="shrink-0 flex flex-col border-t border-slate-200 dark:border-slate-800 bg-slate-850">
          
            {/* Document Metadata */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800/50 flex flex-col">
              <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Document Metadata</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">Size</div>
                  <div className="text-sm text-slate-900 dark:text-slate-200">{formatSize(latestDoc.file_size)}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">Type</div>
                  <div className="text-sm text-slate-900 dark:text-slate-200 uppercase">{latestDoc.file_type}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">Uploaded By</div>
                  <div className="text-sm text-slate-900 dark:text-slate-200 truncate">{latestDoc.owner_id.substring(0, 8)}...</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mb-1">Status</div>
                  <div className={`text-sm ${latestDoc.status === 'READY' ? 'text-emerald-400' : latestDoc.status === 'FAILED' ? 'text-red-400' : 'text-cyan-400'}`}>
                    {latestDoc.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Processing Stats */}
            <div className="p-4 flex flex-col">
              <h3 className="text-sm font-medium text-slate-300 mb-4">Document Processing Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                
                {/* Processing Progress */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs text-slate-500">Pipeline Status</div>
                    <div className="text-xs text-cyan-500 font-medium">
                      {latestDoc.status === 'READY' ? 'Complete' : latestDoc.status === 'FAILED' ? 'Error' : 'In Progress'}
                    </div>
                  </div>
                  <div className="h-8 flex items-center">
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-1000 ${
                        latestDoc.status === 'READY' ? 'bg-emerald-500 w-full' : 
                        latestDoc.status === 'FAILED' ? 'bg-red-500 w-full' : 
                        latestDoc.status === 'INDEXING' ? 'bg-cyan-500 w-3/4' : 'bg-cyan-500 w-1/4 animate-pulse'
                      }`}></div>
                    </div>
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
                    <div className="text-[10px] text-slate-500">
                      {Math.floor(latestDoc.file_size / 500)} Chunks
                    </div>
                  </div>
                </div>

                {/* Semantic Indexing */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs text-slate-500">Semantic Indexing</div>
                    <div className="text-xs text-cyan-500 font-medium">
                      {latestDoc.status === 'READY' ? 'Ready' : 'Pending'}
                    </div>
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
          </>
        )}

      </div>
    </div>
  );
};
