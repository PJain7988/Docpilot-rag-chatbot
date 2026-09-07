import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, X, RotateCcw, ThumbsUp, ThumbsDown, Paperclip, Smile, Send, Mic, Loader2 } from 'lucide-react';
import { api, type Citation } from '../../services/api';
import { clsx } from 'clsx';

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  citations?: Citation[];
  timestamp: Date;
}

interface ChatPanelProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const ChatPanel = ({ isOpen, setIsOpen }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'ai',
    text: "Hello! I'm IntelliRAG, your enterprise knowledge assistant. Ask me anything about your uploaded documents.",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await api.chat(userMessage.text);
    
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'ai',
      text: response.answer,
      citations: response.citations,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={clsx(
      "w-80 h-full bg-slate-900 border-l border-slate-800 flex flex-col fixed md:relative right-0 z-40 transition-transform duration-300",
      isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
    )}>
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <span className="font-medium text-slate-200">Document Intelligence</span>
        <div className="flex items-center gap-2 text-slate-400">
          <button className="p-1.5 hover:bg-slate-800 rounded-md transition-colors" onClick={() => setMessages(messages.slice(0,1))}><RotateCcw size={16} /></button>
          <button className="p-1.5 hover:bg-slate-800 rounded-md transition-colors"><MoreHorizontal size={16} /></button>
          <button className="p-1.5 hover:bg-slate-800 rounded-md transition-colors md:hidden" onClick={() => setIsOpen(false)}><X size={16} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === 'user' ? (
              <>
                <div className="flex justify-end">
                  <div className="bg-slate-800/80 border border-slate-700 text-slate-200 text-sm p-3 rounded-2xl rounded-tr-sm max-w-[90%] shadow-lg">
                    {msg.text}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 text-right mt-1">{formatTime(msg.timestamp)}</div>
              </>
            ) : (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400"><path d="M2 22 12 2l10 20-10-4z"/></svg>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-300 mb-1">DocPilot Assistant</div>
                  <div className="bg-panel-gradient border border-cyan-500/50 shadow-glow text-slate-300 text-sm p-4 rounded-2xl rounded-tl-sm w-full leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                    
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-700/50">
                        <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wide">Citations</div>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite, idx) => (
                             <span key={idx} className="text-[11px] px-2 py-1 bg-slate-800 rounded border border-slate-700 text-cyan-300 hover:bg-slate-700 cursor-pointer transition-colors" title={cite.text_snippet}>
                               [{cite.id}] {cite.document} (Pg. {cite.page})
                             </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 ml-1 text-slate-500">
                    <button className="p-1 hover:text-cyan-400 transition-colors"><ThumbsUp size={14} /></button>
                    <button className="p-1 hover:text-red-400 transition-colors"><ThumbsDown size={14} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-900/50 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-400"><path d="M2 22 12 2l10 20-10-4z"/></svg>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-300 mb-1">DocPilot Assistant</div>
              <div className="bg-panel-gradient border border-cyan-500/50 shadow-glow text-slate-300 text-sm p-4 rounded-2xl rounded-tl-sm w-full leading-relaxed flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-cyan-400" /> Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <div className="relative bg-slate-850 border border-slate-700 rounded-xl focus-within:border-cyan-500/50 focus-within:shadow-glow transition-all duration-300 overflow-hidden">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="w-full bg-transparent text-sm text-slate-200 px-4 py-3 pb-12 outline-none placeholder:text-slate-500 disabled:opacity-50"
          />
          <div className="absolute bottom-2 left-3 flex items-center gap-2 text-slate-500">
            <button className="p-1 hover:text-slate-300 transition-colors"><Paperclip size={16} /></button>
            <button className="p-1 hover:text-slate-300 transition-colors"><Smile size={16} /></button>
          </div>
          <div className="absolute bottom-2 right-3 flex items-center gap-2">
            <button className="p-1 text-slate-500 hover:text-slate-300 transition-colors"><Mic size={16} /></button>
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-7 h-7 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-glow disabled:opacity-50 disabled:cursor-not-allowed">
              <Send size={14} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
