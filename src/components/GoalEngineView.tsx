import React, { useState } from 'react';
import {
  TrendingUp,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Flame,
  Shield,
  Layers,
  Award,
  Clock,
  Activity,
  Plus,
} from 'lucide-react';
import {
  Goal,
  GoalAltitude,
  GoalCandidate,
  GoalOriginationSource,
} from '../types/aos';

interface GoalEngineViewProps {
  goals: Goal[];
  goalCandidates: GoalCandidate[];
  onPromoteCandidate: (candidate: GoalCandidate) => void;
  onRecordProgress: (goalId: string, amount: number) => void;
  onSimulateMilestoneSuccession: (milestoneId: string) => void;
}

export const GoalEngineView: React.FC<GoalEngineViewProps> = ({
  goals,
  goalCandidates,
  onPromoteCandidate,
  onRecordProgress,
  onSimulateMilestoneSuccession,
}) => {
  const [selectedAltitude, setSelectedAltitude] = useState<GoalAltitude | 'all'>('all');
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.goalId || '');
  const [showCandidateIntake, setShowCandidateIntake] = useState<boolean>(false);

  const selectedGoal = goals.find((g) => g.goalId === selectedGoalId) || goals[0];

  const filteredGoals = goals.filter(
    (g) => selectedAltitude === 'all' || g.altitude === selectedAltitude
  );

  const getAltitudeBadge = (altitude: GoalAltitude) => {
    switch (altitude) {
      case 'longTerm':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">Long-Term (2-5y)</span>;
      case 'shortTerm':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">Short-Term (≤12m)</span>;
      case 'weekly':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">Weekly (Rolling)</span>;
      case 'daily':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">Daily Unit</span>;
    }
  };

  const getSourceLabel = (source: GoalOriginationSource) => {
    switch (source) {
      case 'intent_ledger': return '1. Intent Ledger (Founders)';
      case 'strategy_analysis': return '2. Strategy Analysis Loop';
      case 'function_telemetry': return '3. Business Function Telemetry';
      case 'circuit_breakers': return '4. Circuit Breakers & Risk';
      case 'workforce_reports': return '5. Workforce Entity Reports';
      case 'financial_state': return '6. Financial State & Runway';
      case 'external_signals': return '7. External Signals & Regs';
      case 'prior_goal_history': return '8. Prior Goal History (Learning)';
    }
  };

  // Health Metrics
  const cascadeCoverage = 100;
  const rollupIntegrity = 100;
  const goalVelocity = '1.18×';
  const staleness = '0 days (Nominal)';

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Mathematical Formulation */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <Target className="h-5 w-5 text-cyan-400" />
              <span>Goal Cascade & Progression Engine (Section 13)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              The forward-motion engine: decomposes intent top-down, verifies achievement bottom-up, and automatically derives successor goals.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSimulateMilestoneSuccession('goal-st-01')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Award className="h-4 w-4" />
              <span>Simulate Milestone Succession ($1M ARR)</span>
            </button>
          </div>
        </div>

        {/* Observable Health Metrics Strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <span className="text-slate-500 text-[10px] block">Cascade Coverage</span>
            <span className="text-base font-bold text-emerald-400">{cascadeCoverage}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Fully Decomposed to Daily</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <span className="text-slate-500 text-[10px] block">Roll-up Integrity</span>
            <span className="text-base font-bold text-cyan-400">{rollupIntegrity}%</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Verified Measurements Only</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <span className="text-slate-500 text-[10px] block">Goal Velocity</span>
            <span className="text-base font-bold text-indigo-400">{goalVelocity}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Achieved vs Planned Rate</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/50">
            <span className="text-slate-500 text-[10px] block">Staleness Monitor</span>
            <span className="text-base font-bold text-slate-200">{staleness}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Alert if &gt; 0 days at weekly+</span>
          </div>
        </div>
      </div>

      {/* Main Cascade Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Altitude Selector & Goal Hierarchy List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 font-mono uppercase">
              Goal Tree ({filteredGoals.length})
            </span>
            <select
              value={selectedAltitude}
              onChange={(e) => setSelectedAltitude(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Altitudes</option>
              <option value="longTerm">Long-Term (2-5y)</option>
              <option value="shortTerm">Short-Term (≤12m)</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {filteredGoals.map((g) => {
              const progressPct = Math.min(100, (g.target.currentValue / g.target.targetValue) * 100);
              return (
                <div
                  key={g.goalId}
                  onClick={() => setSelectedGoalId(g.goalId)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedGoal.goalId === g.goalId
                      ? 'border-cyan-500 bg-cyan-950/20 shadow-sm'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    {getAltitudeBadge(g.altitude)}
                    <span className="text-[10px] font-mono text-slate-400">
                      {g.target.deadline}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-2">
                    {g.statement}
                  </h4>

                  <div className="mt-2.5 font-mono text-[11px] text-slate-400">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span>{g.target.metric}</span>
                      <span className="text-slate-200 font-bold">
                        {g.target.currentValue.toLocaleString()} / {g.target.targetValue.toLocaleString()} {g.target.unit}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Goal Inspector & Roll-up Actions */}
        {selectedGoal && (
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {getAltitudeBadge(selectedGoal.altitude)}
                  <h2 className="text-base font-semibold text-white">{selectedGoal.statement}</h2>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Goal ID: {selectedGoal.goalId} · Digest: {selectedGoal.digest.substring(0, 16)}...
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                  {selectedGoal.status}
                </span>
              </div>
            </div>

            {/* Target & Metric Progress with Bottom-Up Simulation Button */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-[10px] block">Measurable Target</span>
                  <span className="text-base font-bold text-cyan-400">
                    {selectedGoal.target.currentValue.toLocaleString()} / {selectedGoal.target.targetValue.toLocaleString()} {selectedGoal.target.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[10px] block">Deadline</span>
                  <span className="text-slate-200">{selectedGoal.target.deadline}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full"
                  style={{
                    width: `${Math.min(100, (selectedGoal.target.currentValue / selectedGoal.target.targetValue) * 100)}%`,
                  }}
                />
              </div>

              {/* Bottom-Up Verified Measurement Action Button */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 italic font-sans">
                  Rule 13.3: Verified measurement only. No entity can assert progress without evidence.
                </span>

                <button
                  onClick={() => onRecordProgress(selectedGoal.goalId, 1)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
                >
                  Record Verified Measurement (+1 Unit)
                </button>
              </div>
            </div>

            {/* Top-Down Decomposition & Child Goals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-300 font-mono uppercase">
                  Top-Down Decomposed Children ({selectedGoal.childGoalIds.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Decomposition: {selectedGoal.decomposition}
                </span>
              </div>

              {selectedGoal.childGoalIds.length > 0 ? (
                <div className="space-y-2">
                  {selectedGoal.childGoalIds.map((cid) => {
                    const child = goals.find((g) => g.goalId === cid);
                    if (!child) return null;
                    return (
                      <div
                        key={cid}
                        onClick={() => setSelectedGoalId(cid)}
                        className="p-3 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 cursor-pointer transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
                          <span className="font-semibold text-slate-200">{child.statement}</span>
                        </div>
                        {getAltitudeBadge(child.altitude)}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 rounded bg-slate-950 border border-slate-800">
                  Executable leaf goal. Directly routed into the governed task queue.
                </p>
              )}
            </div>

            {/* Evidence & Provenance Refs */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block">
                Evidence Chains & Provenance Refs:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedGoal.evidenceRefs.map((ref) => (
                  <span
                    key={ref}
                    className="px-2 py-1 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-mono text-xs"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 8 Origination Sources & Candidate Strategy Prioritization (Section 13.1) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Goal Candidates & Strategy Prioritization (Section 13.1b)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Continuously harvested from 8 sources. Prioritized by formula: P(g) = I · U · Feas · (1 - Dep).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goalCandidates.map((cand) => (
            <div
              key={cand.candidateId}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-cyan-400">
                    {getSourceLabel(cand.source)}
                  </span>
                  <div className="flex items-center gap-1.5 font-mono text-xs">
                    <span className="text-slate-500">P(g):</span>
                    <span className="text-cyan-400 font-bold">{cand.priorityScore.toFixed(3)}</span>
                  </div>
                </div>

                <h3 className="text-xs font-semibold text-white leading-relaxed">
                  {cand.statement}
                </h3>

                <p className="text-[11px] text-slate-400 mt-1 font-sans leading-relaxed">
                  {cand.evidenceSummary}
                </p>
              </div>

              {/* Score parameter breakdown */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex gap-2 text-[10px] font-mono text-slate-500">
                  <span>I: {(cand.intentAlignment * 100).toFixed(0)}%</span>
                  <span>U: {(cand.urgency * 100).toFixed(0)}%</span>
                  <span>Feas: {(cand.feasibility * 100).toFixed(0)}%</span>
                  <span>Dep: {(cand.dependencyOverlap * 100).toFixed(0)}%</span>
                </div>

                <button
                  onClick={() => onPromoteCandidate(cand)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Activate Goal (Founder Sign-Off)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
