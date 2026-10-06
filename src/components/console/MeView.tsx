import React from 'react';
import {
  User,
  Shield,
  Key,
  Users,
  Flame,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { BreakGlassSession, Entity } from '../../types/aos';

interface MeViewProps {
  breakGlass: BreakGlassSession;
  onToggleBreakGlass: () => void;
  density: 'comfortable' | 'compact';
  setDensity: (d: 'comfortable' | 'compact') => void;
  onNavigateToHumanOps: () => void;
}

export const MeView: React.FC<MeViewProps> = ({
  breakGlass,
  onToggleBreakGlass,
  density,
  setDensity,
  onNavigateToHumanOps,
}) => {
  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <User className="h-4 w-4 text-cyan-400" />
            <span>◔ HUMAN ENTITY PROFILE (ME)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Elena Vance, Esq. · Legal Root Person &amp; Executive General Counsel
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-800">
          CLEARANCE: RESTRICTED
        </span>
      </div>

      {/* Break-Glass Emergency Banner (Section 21 & 25.5 visual language) */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          breakGlass.active
            ? 'border-rose-500 bg-rose-950/40 text-rose-200 shadow-xl ring-2 ring-rose-500/40 animate-pulse'
            : 'border-slate-800 bg-slate-900/60'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Flame className={`h-5 w-5 ${breakGlass.active ? 'text-rose-400' : 'text-slate-400'}`} />
            <h3 className="text-sm font-mono font-bold text-white">
              {breakGlass.active ? 'CRISIS BREAK-GLASS AUTHORIZATION ACTIVE' : 'Crisis & Break-Glass Authority'}
            </h3>
          </div>
          {breakGlass.active && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900 border border-rose-600 text-white font-bold">
              COUNTDOWN: 03:42:19 REMAINING
            </span>
          )}
        </div>

        <p className="text-xs text-slate-300 font-sans leading-relaxed mb-3">
          {breakGlass.active
            ? 'Emergency degraded mode active under Elena Vance root key. Spend authority capped at $10,000. All actions buffered with mandatory retroactive ratification.'
            : 'Pre-authorized emergency role for kernel/vault offline exceptions. Authority is bounded, expiring, and requires retroactive ratification.'}
        </p>

        <div className="flex justify-end">
          <button
            onClick={onToggleBreakGlass}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-sm ${
              breakGlass.active
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {breakGlass.active ? 'Deactivate Break-Glass Mode' : 'Activate Break-Glass Exception'}
          </button>
        </div>
      </div>

      {/* Scopes & Identity Summary */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-300 font-semibold uppercase">
            Active Scopes & Authority Grants
          </span>
          <span className="text-[11px] font-mono text-cyan-400">Level 4 Legal Root</span>
        </div>

        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {['*', 'banking:write', 'legal:root', 'policy:publish', 'crisis:break_glass'].map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 font-bold"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Workforce HR Management Hub */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Human Workforce &amp; HR Lifecycle</h3>
            <p className="text-xs text-slate-400">Shift schedules, offer approvals, and offboarding</p>
          </div>
          <button
            onClick={onNavigateToHumanOps}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Open HR Ops →</span>
          </button>
        </div>
      </div>

      {/* Console Display Preferences (Density Modes) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Console Density Mode</h3>
            <p className="text-xs text-slate-400">Mobile defaults to comfortable; toggle for desktop multi-pane</p>
          </div>

          <div className="flex p-0.5 rounded-lg border border-slate-800 bg-slate-950 text-xs font-mono">
            <button
              onClick={() => setDensity('comfortable')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                density === 'comfortable' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Comfortable
            </button>
            <button
              onClick={() => setDensity('compact')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                density === 'compact' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Compact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
