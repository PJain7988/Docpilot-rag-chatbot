import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      login(email.trim());
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 font-sans relative transition-colors duration-300 items-center justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/20">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Welcome to DocPilot AI</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center">Sign in to access your intelligent document knowledge base.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl pl-11 pr-4 py-3 focus:border-cyan-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all shadow-glow hover:scale-[1.02]"
          >
            Access Workspace <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
