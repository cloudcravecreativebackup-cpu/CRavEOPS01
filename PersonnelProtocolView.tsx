
import React from 'react';
import { User, StaffTask, TaskComment } from '../types';

interface PersonnelProtocolViewProps {
  userId: string;
  users: User[];
  tasks: StaffTask[];
  currentUser: User;
  onBack: () => void;
  onAddComment: (taskId: string, text: string) => void;
  onReviewTask: (taskId: string, decision: 'approve' | 'reject' | 'block', comment?: string) => void;
}

const PersonnelProtocolView: React.FC<PersonnelProtocolViewProps> = ({ userId, users, tasks, currentUser, onBack, onAddComment, onReviewTask }) => {
  const user = users.find(u => u.id === userId);
  const personnelTasks = tasks.filter(t => t.staffName === user?.name);
  const mentor = users.find(u => u.id === user?.mentorId);
  const isAdminOrLead = currentUser.role === 'Admin' || currentUser.role === 'Staff Lead';

  if (!user) return null;

  const totalHours = personnelTasks.reduce((acc, t) => acc + t.hoursSpent, 0);
  const completedCount = personnelTasks.filter(t => t.status === 'Completed').length;
  const completionRate = personnelTasks.length ? Math.round((completedCount / personnelTasks.length) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-8">
          <button 
            onClick={onBack}
            className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-brand-blue transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-hard">
               <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{user.name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-black uppercase px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-lg tracking-widest">
                  {user.role}
                </span>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                  {mentor ? `Lead: ${mentor.name}` : 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
           {[
             { label: 'Total Hours', val: `${totalHours}h`, color: 'text-brand-blue' },
             { label: 'Tasks', val: personnelTasks.length, color: 'text-brand-cyan' },
             { label: 'Completion', val: `${completionRate}%`, color: 'text-emerald-500' }
           ].map((stat, i) => (
             <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-white/5 shadow-soft min-w-[120px]">
                <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] ml-1">Assigned Tasks</h3>
        {personnelTasks.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No active tasks</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {personnelTasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-hard overflow-hidden">
                <div className="p-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-2 mb-4 inline-block ${
                        task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        task.status === 'Blocked' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                        task.status === 'Pending Approval' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {task.status}
                      </span>
                      <h4 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{task.taskTitle}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{task.category} • {task.frequency}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-4xl font-black text-brand-blue">{task.hoursSpent}h</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Logged</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] border border-slate-100 dark:border-white/5">
                        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Description</h5>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{task.taskDescription}</p>
                      </div>
                      
                      {task.status === 'Pending Approval' && isAdminOrLead && (
                        <div className="flex gap-4">
                           <button 
                             onClick={() => onReviewTask(task.id, 'approve', 'Verified from personnel view.')}
                             className="flex-grow py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                           >
                             Confirm Protocol
                           </button>
                           <button 
                             onClick={() => onReviewTask(task.id, 'reject', 'Revision required.')}
                             className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                           >
                             Decline
                           </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Logs</h5>
                      <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {task.comments.length === 0 ? (
                          <p className="text-xs font-medium text-slate-400 italic">No logs available.</p>
                        ) : (
                          task.comments.map(comment => (
                            <div key={comment.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-brand-cyan uppercase">{comment.authorName}</span>
                                <span className="text-[8px] text-slate-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{comment.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonnelProtocolView;
