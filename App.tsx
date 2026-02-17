import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  StaffTask, 
  ManagementSummary, 
  User, 
  TaskComment, 
  Notification, 
  Organization, 
  Brand, 
  ServiceType, 
  TaskCategory, 
  Frequency, 
  TaskType, 
  TaskStatus, 
  ContentCalendar, 
  CalendarEntry 
} from './types';
import { MOCK_TASKS, USERS, ORGS, BRANDS } from './constants';
import { analyzeTasks } from './services/geminiService';
import Dashboard from './components/Dashboard';
import TaskEntryForm from './components/TaskEntryForm';
import TaskBoard from './components/TaskBoard';
import Auth from './components/Auth';
import AdminUserManagement from './components/AdminUserManagement';
import BrandManagement from './components/BrandManagement';
import BrandDetailView from './components/BrandDetailView';
import Logo from './components/Logo';
import NotificationsPanel from './components/NotificationsPanel';
import MentorshipHub from './components/MentorshipHub';
import PersonnelProtocolView from './components/PersonnelProtocolView';
import ContentCalendarView from './components/ContentCalendarView';

type AppView = 'board' | 'analysis' | 'users' | 'squad' | 'personnel-detail' | 'brands' | 'brand-detail' | 'calendar';

const STORAGE_KEY_ORGS = 'craveops_cloudcraves_orgs_v1';
const STORAGE_KEY_USERS = 'craveops_cloudcraves_users_v1';
const STORAGE_KEY_BRANDS = 'craveops_cloudcraves_brands_v1';
const STORAGE_KEY_USER = 'craveops_cloudcraves_current_v1';
const STORAGE_KEY_TASKS = 'craveops_cloudcraves_tasks_v1';
const STORAGE_KEY_CALENDARS = 'craveops_cloudcraves_calendars_v1';
const STORAGE_KEY_NOTIFS = 'craveops_cloudcraves_notifs_v1';

const WHITELISTED_ADMINS = [
  'support@cloudcraves.com', 
  'support@craveops.com', 
  'adeola.lois@cloudcraves.com', 
  'sheriff.saka@cloudcraves.com',
  'ademuyiwa.ogunnowo@cloudcraves.com'
];

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem('theme') === 'dark');
  const [showRegSuccess, setShowRegSuccess] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showNotifs, setShowNotifs] = useState<boolean>(false);
  
  const [organizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ORGS);
    return saved ? JSON.parse(saved) : ORGS;
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BRANDS);
    return saved ? JSON.parse(saved) : BRANDS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : USERS;
  });

  const [calendars, setCalendars] = useState<ContentCalendar[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CALENDARS);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_NOTIFS);
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!currentUser);
  
  const [tasks, setTasks] = useState<StaffTask[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TASKS);
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [view, setView] = useState<AppView>('board');
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string | null>(null);
  const [selectedBrandDetailId, setSelectedBrandDetailId] = useState<string | null>(null);
  const [summary, setSummary] = useState<ManagementSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<StaffTask | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);

  const currentOrg = useMemo(() => 
    organizations.find((o: Organization) => o.id === currentUser?.orgId), 
    [organizations, currentUser?.orgId]
  );

  const tenantUsers = useMemo(() => 
    users.filter((u: User) => u.orgId === currentUser?.orgId),
    [users, currentUser?.orgId]
  );

  const visibleUsers = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Admin') return users.filter((u: User) => u.orgId === currentUser.orgId);
    if (currentUser.role === 'Staff Lead') {
      return users.filter((u: User) => 
        u.orgId === currentUser.orgId && 
        (u.id === currentUser.id || u.mentorId === currentUser.id || !u.mentorId)
      );
    }
    return users.filter((u: User) => u.id === currentUser.id);
  }, [users, currentUser]);

  const tenantTasks = useMemo(() => 
    tasks.filter((t: StaffTask) => t.orgId === currentUser?.orgId),
    [tasks, currentUser?.orgId]
  );

  const visibleTasks = useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Admin') return tenantTasks;
    if (currentUser.role === 'Staff Lead') {
      const myTeamNames = new Set(tenantUsers.filter((u: User) => u.mentorId === currentUser.id || u.id === currentUser.id).map(u => u.name));
      return tenantTasks.filter((t: StaffTask) => myTeamNames.has(t.staffName));
    }
    return tenantTasks.filter((t: StaffTask) => t.staffName === currentUser.name);
  }, [tenantTasks, currentUser, tenantUsers]);

  const visibleBrands = useMemo(() => {
    if (!currentUser) return [];
    const orgBrands = brands.filter((b: Brand) => b.orgId === currentUser.orgId);
    if (currentUser.role === 'Admin') return orgBrands;
    if (currentUser.role === 'Staff Lead') return orgBrands.filter((b: Brand) => b.leadId === currentUser.id);
    const brandIds = new Set(tasks.filter((t: StaffTask) => t.staffName === currentUser.name).map(t => t.brandId));
    return orgBrands.filter((b: Brand) => brandIds.has(b.id));
  }, [brands, currentUser, tasks]);

  const tenantNotifications = useMemo(() => 
    notifications.filter((n: Notification) => n.orgId === currentUser?.orgId && n.userId === currentUser?.id),
    [notifications, currentUser?.orgId, currentUser?.id]
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BRANDS, JSON.stringify(brands));
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_KEY_CALENDARS, JSON.stringify(calendars));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
  }, [brands, tasks, calendars, users, notifications]);

  const createNotification = (userId: string, type: Notification['type'], message: string, relatedTaskId?: string, relatedUserId?: string) => {
    if (!currentUser) return;
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      orgId: currentUser.orgId,
      userId,
      type,
      message,
      read: false,
      timestamp: new Date().toISOString(),
      relatedTaskId,
      relatedUserId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const notifyAdmins = (type: Notification['type'], message: string, relatedTaskId?: string, relatedUserId?: string) => {
    tenantUsers.filter((u: User) => u.role === 'Admin' || u.role === 'Staff Lead').forEach((admin: User) => {
      if (admin.id !== currentUser?.id) {
        createNotification(admin.id, type, message, relatedTaskId, relatedUserId);
      }
    });
  };

  const navigateTo = (newView: AppView) => {
    setView(newView);
    setIsAddingTask(false);
    setEditingTask(null);
    setShowProfileModal(false);
    setShowNotifs(false);
    if (newView !== 'personnel-detail') setSelectedPersonnelId(null);
    if (newView !== 'brand-detail') setSelectedBrandDetailId(null);
  };

  const handleLogin = (email: string) => {
    const user = users.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
    }
  };

  const handleRegister = (name: string, email: string, companyName?: string) => {
    const emailLower = email.toLowerCase();
    const isWhitelisted = WHITELISTED_ADMINS.includes(emailLower);
    const orgId = organizations[0]?.id || 'org-cloudcrave';
    const role = (companyName || isWhitelisted) ? 'Staff Lead' : 'Staff Member';
    const registrationStatus = (isWhitelisted || role === 'Staff Lead') ? 'approved' : 'pending';
    const newUser: User = { id: Math.random().toString(36).substr(2, 9), orgId, name, email, role, registrationStatus };
    setUsers([...users, newUser]);
    
    if (registrationStatus === 'pending') {
      notifyAdmins('warning', `New Access Request: ${name}`, undefined, newUser.id);
      setShowRegSuccess(true);
    } else {
      setCurrentUser(newUser);
      setIsLoggedIn(true);
    }
  };

  const handleAnalyze = useCallback(async () => {
    setLoading(true);
    setSummary(null);
    try {
      const result = await analyzeTasks(visibleTasks);
      setSummary(result);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [visibleTasks]);

  const handleAddComment = useCallback((taskId: string, commentText: string) => {
    if (!currentUser) return;
    const task = tenantTasks.find((t: StaffTask) => t.id === taskId);
    if (!task) return;
    const newComment: TaskComment = {
      id: Math.random().toString(36).substr(2, 9),
      authorName: currentUser.name,
      authorRole: currentUser.role,
      text: commentText,
      timestamp: new Date().toISOString()
    };
    setTasks(prev => prev.map((t: StaffTask) => t.id === taskId ? { ...t, comments: [...t.comments, newComment] } : t));
  }, [currentUser, tenantTasks]);

  const handleTaskSubmit = (taskData: Partial<StaffTask>) => {
    if (!currentUser) return;
    let targetStatus: TaskStatus = taskData.status || 'Not Started';
    if (targetStatus === 'Completed' && currentUser.role !== 'Admin') {
      targetStatus = 'Pending Approval';
    }

    if (editingTask) {
      setTasks(prev => prev.map((t: StaffTask) => t.id === editingTask.id ? { ...t, ...taskData, status: targetStatus } as StaffTask : t));
      setEditingTask(null);
    } else {
      const newTask: StaffTask = {
        id: Math.random().toString(36).substr(2, 9),
        orgId: currentUser.orgId,
        brandId: taskData.brandId || '',
        serviceType: taskData.serviceType || 'General Operations',
        staffName: taskData.staffName || currentUser.name,
        assignedBy: taskData.assignedBy || currentUser.name,
        taskTitle: taskData.taskTitle || 'Untitled Task',
        taskDescription: taskData.taskDescription || '',
        category: taskData.category || 'Internal Protocol',
        type: taskData.type || 'One-time',
        frequency: taskData.frequency || 'N/A',
        status: targetStatus,
        dueDate: taskData.dueDate || '',
        progressUpdate: '',
        estimatedHours: taskData.estimatedHours || 0,
        hoursSpent: taskData.hoursSpent || 0,
        comments: [],
        reportingPeriod: 'Nov 2024'
      };
      setTasks([newTask, ...tasks]);
      setIsAddingTask(false);
    }
  };

  const handleReviewTask = useCallback((taskId: string, decision: 'approve' | 'reject' | 'block', comment?: string) => {
    if (!currentUser) return;
    const task = tenantTasks.find((t: StaffTask) => t.id === taskId);
    if (!task) return;

    let newStatus: TaskStatus = 'Completed';
    if (decision === 'reject') newStatus = 'In Progress';
    if (decision === 'block') newStatus = 'Blocked';

    if (comment) handleAddComment(taskId, `[REVIEW] ${comment}`);
    setTasks(prev => prev.map((t: StaffTask) => t.id === taskId ? { ...t, status: newStatus } : t));
  }, [currentUser, tenantTasks, handleAddComment]);

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} users={users} showRegSuccess={showRegSuccess} onBackToLogin={() => setShowRegSuccess(false)} />;
  }

  const isAdminOrLead = currentUser?.role === 'Admin' || currentUser?.role === 'Staff Lead';

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-300">
      <header className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/10 sticky top-0 z-[100] shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Logo className="h-8 sm:h-10" />
              <div className="flex flex-col">
                <span className="hidden sm:block text-[11px] font-black uppercase tracking-[0.2em] text-brand-blue dark:text-brand-cyan">{currentOrg?.name}</span>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200/50 dark:border-white/10">
              <button onClick={() => navigateTo('board')} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl ${view === 'board' ? 'bg-white dark:bg-white/10 text-brand-blue' : 'text-slate-500'}`}>Protocol Board</button>
              {isAdminOrLead && <button onClick={() => navigateTo('users')} className={`px-5 py-2 text-xs font-black uppercase tracking-widest rounded-xl ${view === 'users' ? 'bg-white dark:bg-white/10 text-brand-blue' : 'text-slate-500'}`}>Moderation</button>}
            </nav>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500">
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              <div className="relative">
                <div onClick={() => setShowProfileModal(!showProfileModal)} className="w-10 h-10 rounded-xl overflow-hidden cursor-pointer">
                  <img src={currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name}`} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {(isAddingTask || editingTask) ? (
          <TaskEntryForm 
            currentUser={currentUser!} 
            users={tenantUsers} 
            brands={visibleBrands}
            initialTask={editingTask} 
            onSubmit={handleTaskSubmit} 
            onCancel={() => { setIsAddingTask(false); setEditingTask(null); }} 
          />
        ) : (
          <>
            {view === 'board' && <TaskBoard tasks={visibleTasks} users={tenantUsers} brands={visibleBrands} currentUser={currentUser!} onEditTask={setEditingTask} onAddComment={handleAddComment} onReviewTask={handleReviewTask} />}
            {view === 'users' && isAdminOrLead && (
              <AdminUserManagement 
                users={visibleUsers} 
                currentUser={currentUser!} 
                onUpdateUser={(userId: string, updates: Partial<User>) => setUsers(prev => prev.map(u => u.id === userId ? {...u, ...updates} : u))} 
                onDeleteUser={(userId: string) => setUsers(prev => prev.filter(u => u.id !== userId))} 
                onDrillDown={(userId: string) => { setSelectedPersonnelId(userId); setView('personnel-detail'); }} 
              />
            )}
            {view === 'personnel-detail' && selectedPersonnelId && (
              <PersonnelProtocolView 
                userId={selectedPersonnelId} 
                users={tenantUsers} 
                tasks={tenantTasks} 
                currentUser={currentUser!}
                onBack={() => setView('users')}
                onAddComment={handleAddComment}
                onReviewTask={handleReviewTask}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;