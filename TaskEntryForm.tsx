
import React, { useState, useEffect } from 'react';
import { StaffTask, TaskCategory, TaskType, TaskStatus, Frequency, User, Brand, ServiceType } from '../types';

interface TaskEntryFormProps {
  currentUser: User;
  users: User[];
  brands: Brand[];
  initialTask?: StaffTask | null;
  onSubmit: (task: Partial<StaffTask>) => void;
  onCancel: () => void;
}

const TaskEntryForm: React.FC<TaskEntryFormProps> = ({ currentUser, users, brands, initialTask, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    brandId: initialTask ? initialTask.brandId : (brands[0]?.id || ''),
    serviceType: initialTask ? initialTask.serviceType : ('General Operations' as ServiceType),
    staffName: initialTask ? initialTask.staffName : currentUser.name,
    taskTitle: initialTask ? initialTask.taskTitle : '',
    category: initialTask ? initialTask.category : ('Internal Protocol' as TaskCategory),
    type: initialTask ? initialTask.type : ('One-time' as TaskType),
    frequency: initialTask ? initialTask.frequency : ('Daily' as Frequency),
    taskDescription: initialTask ? initialTask.taskDescription : '',
    status: initialTask ? initialTask.status : ('Not Started' as TaskStatus),
    dueDate: initialTask ? initialTask.dueDate : '',
    progressUpdate: initialTask ? initialTask.progressUpdate : '',
    estimatedHours: initialTask ? initialTask.estimatedHours : 0,
    hoursSpent: initialTask ? initialTask.hoursSpent : 0
  });

  const currentBrand = brands.find(b => b.id === formData.brandId);

  useEffect(() => {
    if (initialTask) {
      setFormData({
        brandId: initialTask.brandId,
        serviceType: initialTask.serviceType,
        staffName: initialTask.staffName,
        taskTitle: initialTask.taskTitle,
        category: initialTask.category,
        type: initialTask.type,
        frequency: initialTask.frequency || 'Daily',
        taskDescription: initialTask.taskDescription,
        status: initialTask.status,
        dueDate: initialTask.dueDate,
        progressUpdate: initialTask.progressUpdate || '',
        estimatedHours: initialTask.estimatedHours || 0,
        hoursSpent: initialTask.hoursSpent || 0
      });
    }
  }, [initialTask]);

  const getPossibleAssignees = () => {
    let approvedUsers = users.filter(u => u.registrationStatus === 'approved');
    if (currentUser.role === 'Admin' || currentUser.role === 'Staff Lead') return approvedUsers;
    return [currentUser];
  };

  const possibleAssignees = getPossibleAssignees();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      assignedBy: initialTask ? initialTask.assignedBy : currentUser.name
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="bg-slate-100 dark:bg-slate-800 p-8 sm:p-10 text-slate-800 dark:text-white flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl font-black flex items-center gap-4 tracking-tight">
            <div className="bg-brand-blue p-3 rounded-2xl shadow-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
            </div>
            {initialTask ? 'Protocol Calibration' : 'Generate Brand Protocol'}
          </h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] ml-16 mt-2 hidden sm:block">Log authority: {currentUser.name}</p>
        </div>
        <button onClick={onCancel} className="text-slate-400 hover:text-brand-blue transition-all bg-white/5 p-4 rounded-2xl hover:bg-white/10 active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Client Brand</label>
            <select 
              value={formData.brandId}
              onChange={e => setFormData({...formData, brandId: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none cursor-pointer"
            >
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Stream</label>
            <select 
              value={formData.serviceType}
              onChange={e => setFormData({...formData, serviceType: e.target.value as ServiceType})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none cursor-pointer"
            >
              <option value="General Operations">General Operations</option>
              {currentBrand?.services.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assign To</label>
            <select 
              value={formData.staffName}
              onChange={e => setFormData({...formData, staffName: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold outline-none cursor-pointer"
            >
              {possibleAssignees.map(u => <option key={u.id} value={u.name}>{u.name} ({u.role})</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Task Title</label>
            <input 
              type="text" 
              required
              value={formData.taskTitle}
              onChange={e => setFormData({...formData, taskTitle: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none transition-all" 
              placeholder="Ex: Weekly Instagram Insights"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Category</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value as TaskCategory})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold outline-none cursor-pointer"
            >
              <option value="Profile Optimisation">Profile Optimisation</option>
              <option value="Highlight Optimisation">Highlight Optimisation</option>
              <option value="Content Optimisation">Content Optimisation</option>
              <option value="Engagement Optimisation">Engagement Optimisation</option>
              <option value="Insights & Reporting">Insights & Reporting</option>
              <option value="Cloud Infrastructure">Cloud Infrastructure</option>
              <option value="Software Development">Software Development</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Strategic Planning">Strategic Planning</option>
              <option value="Asset Management">Asset Management</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Internal Protocol">Internal Protocol</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Protocol Status</label>
            <select 
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})}
              className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-sm font-black uppercase tracking-widest outline-none cursor-pointer ${
                formData.status === 'Completed' ? 'text-emerald-500' : 
                formData.status === 'Blocked' ? 'text-rose-500' : 'text-slate-800 dark:text-white'
              }`}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Frequency</label>
            <select 
              value={formData.frequency}
              onChange={e => setFormData({...formData, frequency: e.target.value as Frequency})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold outline-none cursor-pointer"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="N/A">One-time</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Due Date</label>
            <input 
              type="date" 
              value={formData.dueDate}
              onChange={e => setFormData({...formData, dueDate: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none transition-all" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estimated Hours</label>
            <input 
              type="number" 
              min="0"
              step="0.5"
              value={formData.estimatedHours}
              onChange={e => setFormData({...formData, estimatedHours: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none transition-all" 
              placeholder="Ex: 4.5"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Actual Hours Spent</label>
            <input 
              type="number" 
              min="0"
              step="0.5"
              value={formData.hoursSpent}
              onChange={e => setFormData({...formData, hoursSpent: parseFloat(e.target.value) || 0})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none transition-all" 
              placeholder="Ex: 2.0"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Task Requirements</label>
          <textarea 
            required
            value={formData.taskDescription}
            onChange={e => setFormData({...formData, taskDescription: e.target.value})}
            className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.25rem] px-6 py-5 text-slate-800 dark:text-white font-medium focus:border-brand-blue outline-none resize-none transition-all"
            placeholder="Specify platforms (Instagram, LinkedIn etc.) and deliverables..."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6">
          <button type="button" onClick={onCancel} className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-400 py-5 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all">Abort</button>
          <button type="submit" className="flex-grow bg-brand-blue hover:bg-blue-700 text-white font-black py-5 rounded-[1.5rem] shadow-xl text-xs uppercase tracking-widest">Commit Brand Protocol</button>
        </div>
      </form>
    </div>
  );
};

export default TaskEntryForm;
