import React from 'react';
import { Globe, LayoutDashboard, MessageSquare, BookOpen, Settings, LogOut, User } from 'lucide-react';
import { useCulturalAdvisor } from '../context/CulturalAdvisorContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'simulation' | 'knowledge';
  onViewChange: (view: 'dashboard' | 'simulation' | 'knowledge') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const { currentUser } = useCulturalAdvisor();

  const NavItem = ({ view, icon: Icon, label }: { view: 'dashboard' | 'simulation' | 'knowledge', icon: any, label: string }) => (
    <button
      onClick={() => onViewChange(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 flex-shrink-0 z-20">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-8 h-8 text-indigo-500" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              CulturalAI
            </span>
          </div>
          <p className="text-xs text-slate-500">Assimilation Advisor v1.0</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="simulation" icon={MessageSquare} label="Simulations" />
          <NavItem view="knowledge" icon={BookOpen} label="Knowledge Base" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{currentUser?.username}</p>
              <p className="text-xs text-slate-500 truncate">Global Agent</p>
            </div>
          </div>
          <button className="w-full mt-3 flex items-center justify-center gap-2 text-slate-400 hover:text-rose-400 text-sm py-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
         {children}
      </main>
    </div>
  );
};