import React, { useState, useMemo, useRef } from 'react';
import { StaffTask, TaskStatus, User, Brand, ServiceType } from '../types';

interface TaskBoardProps {
  tasks: StaffTask[];
  users: User[];
  brands: Brand[];
  currentUser: User;
  onEditTask: (task: StaffTask) => void;
  onAddComment: (taskId: string, commentText: string) => void;
  onReviewTask: (taskId: string, decision: 'approve' | 'reject' | 'block', comment?: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ 
  tasks, users, brands, currentUser, onEditTask, onAddComment, onReviewTask
}) => {
  const [selectedBrandId, setSelectedBrandId] = useState<string | 'All'>('All');
  const [selectedService, setSelectedService] = useState<ServiceType | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isInputActive, setIsInputActive] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [replyToName, setReplyToName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    if (currentUser.role === 'Staff Member' || currentUser.role === 'Mentee') {
      result = result.filter(t => t.staffName === currentUser.name);
    }

    if (selectedBrandId !== 'All') result = result.filter(t => t.brandId === selectedBrandId);
    if (selectedService !== 'All') result = result.filter(t => t.serviceType === selectedService);
    if (statusFilter !== 'All') result = result.filter(t => t.status === statusFilter);
    return result;
  }, [tasks, selectedBrandId, selectedService, statusFilter, currentUser]);

  const isAdminOrLead = currentUser.role === 'Admin' || currentUser.role === 'Staff Lead';

  const handleStartComment = (taskId: string, replyTo?: string) => {
    setIsInputActive(true);
    if (replyTo) {
      setReplyToName(replyTo);
      setCommentText(`@${replyTo} `);
    } else {
      setReplyToName(null);
      setCommentText('');
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handlePostComment = (taskId: string) => {
    if (commentText.trim()) {
      onAddComment(taskId, commentText);
      setCommentText('');
      setIsInputActive(false);
      setReplyToName(null);
    }
  };

  const handleCancelComment = () => {
    setCommentText('');
    setIsInputActive(false);
    setReplyToName(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight leading-none">Operational Queue</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-3">Tactical monitoring of client brands and service protocols.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <select 
             value={selectedBrandId}
             onChange={e => setSelectedBrandId(e.target.value)}
             className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 outline-none shadow-soft"
           >
             <option value="All">All Client Brands</option>
             {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
           </select>
           <select 
             value={selectedService}
             onChange={e => setSelectedService(e.target.value as ServiceType | 'All')}
             className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 outline-none shadow-soft"
           >
             <option value="All">All Services</option>
             <option value="Social Media Management">Social Media</option>
             <option value="Cloud Support">Cloud Support</option>
             <option value="Digital Solutions">Digital Solutions</option>
             <option value="Switch2Tech Training">Switch2Tech Training</option>
           </select>
           <select 
             value={statusFilter}
             onChange={e => setStatusFilter(e.target.value as TaskStatus | 'All')}
             className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 outline-none shadow-soft"
           >
             <option value="All">All Status</option>
             <option value="In Progress">In Progress</option>
             <option value="Blocked">Blocked</option>
             <option value="Pending Approval">Pending Approval</option>
             <option value="Completed">Completed</option>
           </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-soft overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-white/5">
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Owner</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Client Brand</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Protocol</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Service Stream</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em]">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredTasks.map(task => {
              const brand = brands.find(b => b.id === task.brandId);
              const isExpanded = expandedTaskId === task.id;
              const owner = users.find(u => u.name === task.staffName);
              return (
                <React.Fragment key={task.id}>
                  <tr 
                    onClick={() => {
                      setExpandedTaskId(isExpanded ? null : task.id);
                      setIsInputActive(false);
                      setReviewComment('');
                    }}
                    className={`group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all cursor-pointer ${isExpanded ? 'bg-slate-50/30 dark:bg-white/5' : ''}`}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.staffName}`} className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm" alt="avatar" />
                        <div>
                          <p className="text-xs font-black text-slate-800 dark:text-white leading-none">{task.staffName}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {owner?.role || 'Member'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-black text-brand-blue dark:text-brand-cyan uppercase tracking-widest">{brand?.name || 'Internal'}</p>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-800 dark:text-white text-sm">{task.taskTitle}</td>
                    <td className="px-8 py-6">
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{task.serviceType}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border-2 ${
                        task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        task.status === 'Blocked' ? 'bg-rose-50 text-rose-600 border-rose-100 animate-pulse' : 
                        task.status === 'Pending Approval' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex justify-end gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onEditTask(task); }} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-brand-blue transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400">
                          <svg className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                       </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-slate-50/50 dark:bg-slate-800/20 animate-in slide-in-from-top-2 duration-300">
                      <td colSpan={6} className="px-12 py-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue"></span>
                                Task Details
                              </h4>
                              {task.status === 'Pending Approval' && isAdminOrLead && (
                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                  <svg className="w-3 h-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                  Approval Required
                                </span>
                              )}
                            </div>
                            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium bg-white dark:bg-slate-900/50 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">{task.taskDescription}</p>
                            
                            {task.status === 'Pending Approval' && isAdminOrLead ? (
                              <div className="mt-8 p-8 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/20 rounded-[2.5rem] space-y-6">
                                <h5 className="text-[11px] font-black text-amber-600 uppercase tracking-widest text-center">Protocol Review Panel</h5>
                                <textarea 
                                  value={reviewComment}
                                  onChange={e => setReviewComment(e.target.value)}
                                  placeholder="Review feedback (mandatory for rejection)..."
                                  className="w-full bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900/20 rounded-2xl px-5 py-4 text-xs font-medium outline-none h-24"
                                />
                                <div className="flex gap-4">
                                  <button 
                                    onClick={() => onReviewTask(task.id, 'reject', reviewComment || 'Sent back for refinement.')}
                                    className="flex-1 py-4 bg-white dark:bg-slate-800 text-rose-600 border border-rose-100 dark:border-rose-900/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                                  >
                                    Request Revision
                                  </button>
                                  <button 
                                    onClick={() => onReviewTask(task.id, 'approve', reviewComment || 'Completion verified.')}
                                    className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                                  >
                                    Confirm Completion
                                  </button>
                                </div>
                                <button 
                                   onClick={() => onReviewTask(task.id, 'block', reviewComment || 'Critical blocker identified by lead.')}
                                   className="w-full py-3 text-[9px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest"
                                >
                                  Escalate & Block
                                </button>
                              </div>
                            ) : (
                              <div className="mt-8 flex gap-6">
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Estimated</span>
                                  <span className="text-xl font-black text-slate-800 dark:text-white">{task.estimatedHours}h</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Logged</span>
                                  <span className="text-xl font-black text-brand-blue">{task.hoursSpent}h</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-6 flex flex-col">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                                Inference Logs
                              </span>
                              {!isInputActive && (
                                <button 
                                  onClick={() => handleStartComment(task.id)}
                                  className="text-[9px] font-black text-brand-blue dark:text-brand-cyan uppercase tracking-widest bg-brand-blue/5 dark:bg-brand-cyan/10 px-3 py-1.5 rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                                >
                                  + Add Log
                                </button>
                              )}
                            </h4>
                            
                            <div className="flex-grow space-y-4 max-h-[400px] overflow-y-auto pr-3 scrollbar-hide custom-scrollbar">
                              {task.comments.length === 0 ? (
                                <div className="py-12 text-center bg-white/50 dark:bg-slate-900/30 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No operational logs recorded.</p>
                                </div>
                              ) : (
                                task.comments.map(c => (
                                  <div key={c.id} className="p-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 shadow-sm relative group/comment">
                                    <div className="flex justify-between items-center mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[8px] font-black text-slate-500 overflow-hidden">
                                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.authorName}`} alt="avatar" />
                                        </div>
                                        <div>
                                          <span className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tighter">{c.authorName}</span>
                                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-2">{c.authorRole}</span>
                                        </div>
                                      </div>
                                      <span className="text-[8px] font-bold text-slate-400/50 uppercase tracking-widest">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{c.text}</p>
                                    
                                    <button 
                                      onClick={() => handleStartComment(task.id, c.authorName)}
                                      className="mt-3 opacity-0 group-hover/comment:opacity-100 text-[8px] font-black text-brand-blue uppercase tracking-widest transition-all hover:underline"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                ))
                              )}
                            </div>

                            {isInputActive && (
                              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-brand-blue/20 shadow-hard animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></span>
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {replyToName ? `Replying to ${replyToName}` : 'New Operational Entry'}
                                  </span>
                                </div>
                                <input 
                                  ref={inputRef}
                                  className="w-full text-xs font-bold px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl outline-none border border-transparent focus:border-brand-blue/30 mb-4 transition-all"
                                  placeholder="Log progress or reply to unit..."
                                  value={commentText}
                                  onChange={e => setCommentText(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handlePostComment(task.id);
                                    }
                                    if (e.key === 'Escape') {
                                      handleCancelComment();
                                    }
                                  }}
                                />
                                <div className="flex justify-end gap-3">
                                  <button 
                                    onClick={handleCancelComment}
                                    className="px-5 py-2.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => handlePostComment(task.id)}
                                    className="px-6 py-2.5 bg-brand-blue text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 active:scale-95 transition-all"
                                  >
                                    Commit Log
                                  </button>
                                </div>
                              </div>
                            )}

                            {!isInputActive && task.comments.length > 0 && (
                              <button 
                                onClick={() => handleStartComment(task.id)}
                                className="w-full py-4 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-2xl text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-brand-blue/20 hover:text-brand-blue transition-all"
                              >
                                + Add Another Log
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskBoard;