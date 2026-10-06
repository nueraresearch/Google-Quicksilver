import React from 'react';
import { Bell, Target, Briefcase, User, Sparkles } from 'lucide-react';

export type ConsoleTab = 'feed' | 'goals' | 'work' | 'me';

interface BottomNavProps {
  activeTab: ConsoleTab;
  setActiveTab: (tab: ConsoleTab) => void;
  pendingApprovalsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingApprovalsCount,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-4 py-2 flex items-center justify-around sm:hidden">
      {/* ⌂ Feed */}
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] relative transition-colors ${
          activeTab === 'feed' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Bell className="h-5 w-5" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute -top-1 -right-2 h-4 min-w-[16px] px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-mono font-bold flex items-center justify-center">
              {pendingApprovalsCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono mt-1">⌂ Feed</span>
      </button>

      {/* ◈ Goals */}
      <button
        onClick={() => setActiveTab('goals')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors ${
          activeTab === 'goals' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Target className="h-5 w-5" />
        <span className="text-[10px] font-mono mt-1">◈ Goals</span>
      </button>

      {/* ☰ Work */}
      <button
        onClick={() => setActiveTab('work')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors ${
          activeTab === 'work' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Briefcase className="h-5 w-5" />
        <span className="text-[10px] font-mono mt-1">☰ Work</span>
      </button>

      {/* ◔ Me */}
      <button
        onClick={() => setActiveTab('me')}
        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[44px] transition-colors ${
          activeTab === 'me' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="h-5 w-5" />
        <span className="text-[10px] font-mono mt-1">◔ Me</span>
      </button>
    </nav>
  );
};
