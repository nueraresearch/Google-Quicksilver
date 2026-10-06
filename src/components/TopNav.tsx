import React, { useState } from 'react';
import {
  Shield,
  Activity,
  Bell,
  Target,
  Briefcase,
  User,
  Search,
  Sparkles,
  ChevronDown,
  Layers,
  Database,
  Cpu,
  Gavel,
  Radio,
  FileCheck,
  Scale,
  Users,
  Globe,
  MessageSquare,
  X,
} from 'lucide-react';
import { PlatformOperatingMode } from '../types/aos';

export type ConsoleDestination = 'feed' | 'goals' | 'work' | 'me';
export type SystemSurface =
  | 'overview'
  | 'kernel'
  | 'bidding'
  | 'ledger'
  | 'memory'
  | 'hal'
  | 'verification'
  | 'disputes'
  | 'human_ops'
  | 'xorg_crisis';

export type ActiveTab = ConsoleDestination | SystemSurface;

interface TopNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  operatingMode: PlatformOperatingMode;
  setOperatingMode: (mode: PlatformOperatingMode) => void;
  pendingApprovalsCount: number;
  onOpenProposalModal: () => void;
  onOpenCommandPalette: () => void;
  onOpenChat?: () => void;
  isChatOpen?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  operatingMode,
  setOperatingMode,
  pendingApprovalsCount,
  onOpenProposalModal,
  onOpenCommandPalette,
  onOpenChat,
  isChatOpen,
}) => {
  const [isSurfacesOpen, setIsSurfacesOpen] = useState(false);

  const isSystemSurfaceActive = [
    'overview',
    'kernel',
    'bidding',
    'ledger',
    'memory',
    'hal',
    'verification',
    'disputes',
    'human_ops',
    'xorg_crisis',
  ].includes(activeTab);

  const systemSurfacesList: { id: SystemSurface; label: string; icon: any; desc: string }[] = [
    { id: 'overview', label: 'Universal 5 Surfaces', icon: Layers, desc: 'Inbound, Ops, Outbound, Support, Overhead' },
    { id: 'kernel', label: 'Governance Kernel', icon: Shield, desc: 'Deterministic authority, 4-axis entity contracts' },
    { id: 'bidding', label: 'Task Bidding Auction', icon: Gavel, desc: 'Mathematical scoring S(e_i, T) & dispatch' },
    { id: 'ledger', label: 'Cryptographic Ledger', icon: Database, desc: 'HMAC-SHA256 provenance & tamper checks' },
    { id: 'memory', label: 'Unified Memory Fabric', icon: Cpu, desc: 'Episodic, semantic, KG & context scrubber' },
    { id: 'hal', label: 'Hardware Abstraction (HAL)', icon: Radio, desc: 'ROS2, OPC-UA, industrial robots & E-stop' },
    { id: 'verification', label: 'Formal Verification', icon: FileCheck, desc: 'Digital twins & state-machine invariants' },
    { id: 'disputes', label: 'Dispute & Liability Engine', icon: Scale, desc: 'Automated 4-tier attribution shares' },
    { id: 'human_ops', label: 'Human Operations', icon: Users, desc: 'Compensation, hiring contracts & offboarding' },
    { id: 'xorg_crisis', label: 'Inter-Org & Crisis', icon: Globe, desc: 'Federated assurance & break-glass protocol' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="h-4 w-4" />
          </div>
          <button
            onClick={() => setActiveTab('feed')}
            className="text-left flex items-center group cursor-pointer"
          >
            <span className="text-base font-semibold tracking-tight text-white font-mono group-hover:text-cyan-300 transition-colors">
              AOS
            </span>
            <span className="text-cyan-400 font-sans font-normal ml-1.5 text-xs text-slate-400 hidden lg:inline">
              The Agentic Operating System
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Strictly the 4 core destinations §25.2 + System Engine Surfaces) */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium font-mono">
          <button
            onClick={() => {
              setActiveTab('feed');
              setIsSurfacesOpen(false);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'feed'
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>⌂ Feed</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('goals');
              setIsSurfacesOpen(false);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'goals'
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>◈ Goals</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('work');
              setIsSurfacesOpen(false);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'work'
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>☰ Work</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('me');
              setIsSurfacesOpen(false);
            }}
            className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'me'
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>◔ Me</span>
          </button>

          {/* Deep Architecture Systems Menu */}
          <div className="relative ml-1">
            <button
              onClick={() => setIsSurfacesOpen(!isSurfacesOpen)}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                isSystemSurfaceActive
                  ? 'text-cyan-300 bg-cyan-950/70 border border-cyan-600/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              <span>Deep Systems</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isSurfacesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSurfacesOpen && (
              <div
                className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-800 bg-slate-950/95 backdrop-blur-xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setIsSurfacesOpen(false)}
              >
                <div className="px-2 py-1.5 text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold border-b border-slate-800/80 mb-1">
                  10 Autonomous Architecture Surfaces
                </div>
                <div className="max-h-80 overflow-y-auto space-y-0.5">
                  {systemSurfacesList.map((item) => {
                    const Icon = item.icon;
                    const isSelected = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsSurfacesOpen(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl flex items-start gap-2.5 transition-colors ${
                          isSelected
                            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
                            : 'hover:bg-slate-900/80 text-slate-300'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800/60 text-slate-400'}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold leading-tight">{item.label}</div>
                          <div className="text-[10px] text-slate-400 font-sans truncate mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: ⌘K Search, Chat Widget, Operating Mode & Action CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Active System Surface Indicator with Quick Close back to Feed */}
          {isSystemSurfaceActive && (
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
              <span className="capitalize">{activeTab.replace('_', ' ')}</span>
              <button
                onClick={() => setActiveTab('feed')}
                className="hover:text-white p-0.5 rounded"
                title="Return to Feed"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Search org graph (⌘K)"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">⌘K Search</span>
          </button>

          {/* Floating Chat Widget Toggle */}
          {onOpenChat && (
            <button
              onClick={onOpenChat}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-colors ${
                isChatOpen
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
              title="Toggle Org Assistant Chat Widget"
            >
              <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden md:inline">Chat</span>
            </button>
          )}

          {/* Operating Mode Segmented Selector */}
          <div className="hidden lg:flex items-center rounded-lg border border-slate-800 bg-slate-900/80 p-0.5 text-xs font-mono">
            {(['Genesis', 'Onboard', 'Operate'] as PlatformOperatingMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setOperatingMode(mode)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  operatingMode === mode
                    ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/60 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Primary Action Button */}
          <button
            onClick={onOpenProposalModal}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors shadow-sm font-mono cursor-pointer"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Propose</span>
          </button>
        </div>
      </div>
    </header>
  );
};
