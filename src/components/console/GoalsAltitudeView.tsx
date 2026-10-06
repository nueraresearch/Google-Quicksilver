import React, { useState } from 'react';
import {
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react';
import { Goal, GoalAltitude, GoalCandidate } from '../../types/aos';

interface GoalsAltitudeViewProps {
  goals: Goal[];
  goalCandidates: GoalCandidate[];
  onRecordProgress: (goalId: string, amount: number) => void;
  onPromoteCandidate: (candidate: GoalCandidate) => void;
}

export const GoalsAltitudeView: React.FC<GoalsAltitudeViewProps> = ({
  goals,
  goalCandidates,
  onRecordProgress,
  onPromoteCandidate,
}) => {
  const [altitude, setAltitude] = useState<GoalAltitude>('daily');

  const filteredGoals = goals.filter((g) => g.altitude === altitude);

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <Target className="h-4 w-4 text-cyan-400" />
            <span>◈ GOAL CASCADE ALTITUDE VIEW</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pinch between altitudes · Daily work directly fuels multi-year milestones
          </p>
        </div>
      </div>

      {/* Altitude Pyramid Segmented Control (Mobile & Desktop) */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
        <button
          onClick={() => setAltitude('longTerm')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            altitude === 'longTerm'
              ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-[10px] text-slate-500 uppercase">2–5+ Yrs</div>
          <div className="truncate">Long-Term</div>
        </button>

        <button
          onClick={() => setAltitude('shortTerm')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            altitude === 'shortTerm'
              ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-[10px] text-slate-500 uppercase">≤12 Mos</div>
          <div className="truncate">Milestones</div>
        </button>

        <button
          onClick={() => setAltitude('weekly')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            altitude === 'weekly'
              ? 'bg-blue-950 text-blue-300 font-bold border border-blue-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-[10px] text-slate-500 uppercase">Rolling</div>
          <div className="truncate">Weekly</div>
        </button>

        <button
          onClick={() => setAltitude('daily')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            altitude === 'daily'
              ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="text-[10px] text-slate-500 uppercase">Executable</div>
          <div className="truncate">Daily</div>
        </button>
      </div>

      {/* Daily Altitude: Checklist-with-teeth */}
      {altitude === 'daily' ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Daily Checklist-with-Teeth (Live Execution Units)</span>
            <span>{filteredGoals.length} units</span>
          </div>

          {filteredGoals.map((g) => {
            const isComplete = g.target.currentValue >= g.target.targetValue;
            return (
              <div
                key={g.goalId}
                className={`p-4 rounded-2xl border transition-all ${
                  isComplete
                    ? 'border-emerald-900/60 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          isComplete ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'
                        }`}
                      />
                      <h4 className="text-xs font-semibold text-slate-200">{g.statement}</h4>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      Owning Entity: <strong className="text-slate-300">{g.assignedEntityId || 'Unassigned'}</strong> · Deadline Today
                    </div>
                  </div>

                  <button
                    onClick={() => onRecordProgress(g.goalId, 1)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold shrink-0 transition-colors"
                  >
                    +1 Unit
                  </button>
                </div>

                {/* Progress Strip */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {g.target.metric}: {g.target.currentValue} / {g.target.targetValue} {g.target.unit}
                  </span>
                  <span
                    className={`font-bold ${
                      isComplete ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    {((g.target.currentValue / g.target.targetValue) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Higher Altitudes: Cards with Progress Rings & Trajectory */
        <div className="space-y-4">
          {filteredGoals.map((g) => {
            const pct = Math.min(100, (g.target.currentValue / g.target.targetValue) * 100);
            return (
              <div
                key={g.goalId}
                className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white leading-snug">{g.statement}</h3>
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      Target: {g.target.targetValue.toLocaleString()} {g.target.unit} ({g.target.metric}) · Deadline: {g.target.deadline}
                    </div>
                  </div>

                  {/* Circular / Segmented Progress Ring */}
                  <div className="h-12 w-12 rounded-full border-2 border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-cyan-400 shrink-0 bg-slate-950">
                    {pct.toFixed(0)}%
                  </div>
                </div>

                {/* Progress Bar & Trajectory Sparkline */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Current: {g.target.currentValue.toLocaleString()} {g.target.unit}</span>
                    <span className="text-emerald-400 font-semibold">Trajectory: Healthy</span>
                  </div>
                </div>

                {/* Decomposed Children Summary */}
                {g.childGoalIds.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{g.childGoalIds.length} sub-goals rolling up</span>
                    <span className="text-cyan-400">Verified Evidence Chain</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
