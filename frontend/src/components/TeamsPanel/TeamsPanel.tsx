import { useState } from 'react';
import { Users, UserPlus, Shield, MoreVertical, CheckCircle2, X } from 'lucide-react';
import { clsx } from 'clsx';

export const TeamsPanel = () => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const members = [
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.j@company.com', role: 'Admin', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=sarah' },
    { id: 2, name: 'David Chen', email: 'david.c@company.com', role: 'Editor', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=david' },
    { id: 3, name: 'Maya Patel', email: 'maya.p@company.com', role: 'Viewer', status: 'Active', avatar: 'https://i.pravatar.cc/150?u=maya' },
    { id: 4, name: 'Alex Thompson', email: 'alex.t@company.com', role: 'Editor', status: 'Pending', avatar: null },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 p-8 overflow-y-auto relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="text-cyan-500" size={32} />
            Team Management
          </h1>
          <p className="text-slate-400 text-sm">Manage workspace members and their access controls.</p>
        </div>
        <button 
          onClick={() => {
            setSuccessMessage("Invite link generated and sent!");
            setTimeout(() => setSuccessMessage(null), 3000);
          }}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-colors shadow-glow w-full md:w-auto justify-center"
        >
          <UserPlus size={18} />
          Invite Member
        </button>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto flex flex-col max-w-5xl shadow-2xl">
        <div className="min-w-[800px] flex flex-col h-full">
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-slate-800 bg-slate-850/80 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-4 pl-2">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right pr-2">Actions</div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {members.map((member) => (
            <div key={member.id} className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-850/50 transition-colors group">
              
              <div className="col-span-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-600 shrink-0">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 font-medium">{member.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{member.name}</div>
                </div>
              </div>
              
              <div className="col-span-3 text-sm text-slate-400 truncate pr-4">{member.email}</div>
              
              <div className="col-span-2 flex items-center gap-2">
                <Shield size={14} className={clsx(
                  member.role === 'Admin' ? 'text-purple-400' : member.role === 'Editor' ? 'text-cyan-400' : 'text-slate-400'
                )} />
                <span className="text-sm text-slate-300 font-medium">{member.role}</span>
              </div>
              
              <div className="col-span-2">
                <span className={clsx(
                  "text-xs font-medium px-2.5 py-1 rounded-full border",
                  member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                )}>
                  {member.status}
                </span>
              </div>
              
              <div className="col-span-1 flex items-center justify-end pr-2 text-slate-500">
                <button 
                  onClick={() => alert(`Manage settings for ${member.name}`)}
                  className="p-1.5 hover:text-cyan-400 hover:bg-slate-800 rounded-md transition-all"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
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
