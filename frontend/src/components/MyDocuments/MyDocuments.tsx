import { useState, useEffect, useRef } from 'react';
import { UploadCloud, File as FileIcon, Search, Download, Trash2, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { api, type Document } from '../../services/api';
import { clsx } from 'clsx';

export const MyDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    const docs = await api.getDocuments();
    setDocuments(docs);
  };

  useEffect(() => {
    fetchDocuments();
    // Simple poll to update status
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const result = await api.uploadDocument(file);
    setIsUploading(false);

    if (result) {
      fetchDocuments();
    } else {
      alert("Failed to upload document. Please ensure the backend is running and you have uploaded a valid file.");
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'READY': return <CheckCircle2 size={16} className="text-emerald-400" />;
      case 'FAILED': return <AlertCircle size={16} className="text-red-400" />;
      default: return <Loader2 size={16} className="text-cyan-400 animate-spin" />;
    }
  };

  const filteredDocs = documents.filter(doc =>
    doc.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto md:overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Documents</h1>
          <p className="text-slate-400 text-sm">Manage and upload documents to your knowledge base.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-sm text-slate-200 rounded-lg pl-9 pr-4 py-2 focus:border-cyan-500/50 outline-none w-full md:w-64 transition-colors"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.docx,.txt,.csv,.pptx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center shrink-0 whitespace-nowrap gap-2 text-sm font-medium transition-colors shadow-glow disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            Upload Document
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-visible md:overflow-hidden flex flex-col">
        <div className="min-w-[700px] flex flex-col h-full">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-850/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <div className="col-span-5">Filename</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredDocs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <FileIcon size={48} className="mb-4 opacity-50" />
                <p>No documents found.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/50">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-850/50 transition-colors">
                    <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                      <FileIcon size={18} className="text-cyan-500 shrink-0" />
                      <span className="text-sm font-medium text-slate-200 truncate">{doc.filename}</span>
                    </div>
                    <div className="col-span-2 text-sm text-slate-400 uppercase">{doc.file_type}</div>
                    <div className="col-span-2 text-sm text-slate-400">{formatSize(doc.file_size)}</div>
                    <div className="col-span-2 flex items-center gap-2">
                      {getStatusIcon(doc.status)}
                      <span className={clsx("text-sm", doc.status === 'READY' ? "text-emerald-400" : doc.status === 'FAILED' ? "text-red-400" : "text-cyan-400")}>
                        {doc.status.charAt(0) + doc.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-2 text-slate-500">
                      <button 
                        onClick={() => {
                          const content = `Mock download content for ${doc.filename}`;
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = doc.filename;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                        className="p-1 hover:text-cyan-400 transition-colors"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={async () => {
                          if (confirm(`Are you sure you want to delete ${doc.filename}?`)) {
                            // Optimistically update UI
                            setDocuments(docs => docs.filter(d => d.id !== doc.id));
                            // Delete from server
                            const success = await api.deleteDocument(doc.id);
                            if (!success) {
                              alert("Failed to delete document from server.");
                              fetchDocuments(); // Revert on failure
                            }
                          }
                        }}
                        className="p-1 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
