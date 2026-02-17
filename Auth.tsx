
import React, { useState } from 'react';
import { User } from '../types';
import Logo from './Logo';

interface AuthProps {
  onLogin: (email: string) => void;
  onRegister: (name: string, email: string, companyName?: string) => void;
  users: User[];
  showRegSuccess: boolean;
  onBackToLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, users, showRegSuccess, onBackToLogin }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'provision'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));

    if (mode === 'login') {
      if (!email) {
        setError('Operational email is required for authentication.');
        setIsLoading(false);
        return;
      }
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        setError('No active account found with this identity. Please verify or register.');
      } else {
        onLogin(email);
      }
    } else if (mode === 'register') {
      if (!name || !email) {
        setError('Please provide both your name and professional email.');
        setIsLoading(false);
        return;
      }
      onRegister(name, email);
    } else if (mode === 'provision') {
      if (!name || !email || !companyName) {
        setError('All fields are required to provision a new workspace.');
        setIsLoading(false);
        return;
      }
      onRegister(name, email, companyName);
    }
    setIsLoading(false);
  };

  const getEmailHint = () => {
    if (mode === 'login') return null;
    if (mode === 'provision') return "Use a professional domain (e.g., @company.com) for lead authorization.";
    return "Staff must use @cloudcraves.com. Mentees may use personal emails.";
  };

  if (showRegSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-hard border border-slate-100 dark:border-white/5 p-12 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-lg">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">Provisioning Logged</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
            Authentication request sent for authorization. Your lead administrator will review your unit access shortly.
          </p>
          <button 
            onClick={onBackToLogin}
            className="w-full bg-brand-blue hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] text-[10px] uppercase tracking-widest"
          >
            Return to Authenticate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl border border-slate-200/50 dark:border-white/5 overflow-hidden transition-all duration-500">
        <div className="p-10 sm:p-14">
          <div className="flex flex-col items-center mb-12">
            <Logo className="h-14 mb-4" />
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Global Ops Portal v1.0</p>
            </div>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-10 border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white dark:bg-slate-700 text-brand-blue dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'register' ? 'bg-white dark:bg-slate-700 text-brand-blue dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
              Join Unit
            </button>
          </div>

          <form onSubmit={handleAction} className="space-y-6" autoComplete="off">
            {mode !== 'login' && (
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  autoComplete="off"
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none transition-all placeholder-slate-400 shadow-sm" 
                  placeholder="Full name as registered"
                />
              </div>
            )}

            {mode === 'provision' && (
              <div className="space-y-2 animate-in slide-in-from-top-2">
                <label className="text-[10px] font-black text-brand-blue dark:text-brand-cyan uppercase tracking-[0.2em] ml-1">Company / Workspace Authority</label>
                <input 
                  type="text" 
                  value={companyName}
                  autoComplete="off"
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full bg-brand-blue/5 dark:bg-brand-cyan/5 border border-brand-blue/30 dark:border-brand-cyan/30 rounded-2xl px-6 py-4 text-slate-800 dark:text-white font-black focus:ring-4 focus:ring-brand-blue/10 outline-none transition-all placeholder-slate-400 shadow-sm" 
                  placeholder="Ex: Nexus Group Ltd."
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] ml-1">Operational Email</label>
              <input 
                type="email" 
                value={email}
                autoComplete="off"
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-4 text-slate-800 dark:text-white font-bold focus:border-brand-blue outline-none transition-all placeholder-slate-400 shadow-sm" 
                placeholder="identity@company.com"
              />
              {getEmailHint() && (
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 italic ml-1 mt-1">{getEmailHint()}</p>
              )}
            </div>

            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-2xl animate-in shake duration-500">
                <p className="text-[11px] font-black text-rose-600 text-center tracking-wide">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                mode === 'login' ? 'Authenticate Session' : mode === 'register' ? 'Register Unit Identity' : 'Provision Ecosystem'
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center space-y-6">
            {mode !== 'provision' ? (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Scale your enterprise operations</p>
                <button 
                  onClick={() => { setMode('provision'); setError(''); }}
                  className="group w-full py-5 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 text-[10px] font-black rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-blue hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-[0.98] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Provision New Workspace
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setMode('login')}
                className="text-[11px] font-black uppercase text-brand-cyan tracking-widest hover:text-brand-blue transition-colors underline underline-offset-8"
              >
                Return to Secure Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
