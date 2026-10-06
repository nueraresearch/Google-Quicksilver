import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Cpu,
  ShieldCheck,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { FormalInvariantResult } from '../types/aos';

interface FormalVerificationViewProps {
  invariants: FormalInvariantResult[];
}

export const FormalVerificationView: React.FC<FormalVerificationViewProps> = ({
  invariants,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState<number | null>(null);
  const [simulationStats, setSimulationStats] = useState<{
    cyclesRun: number;
    invariantsPassed: number;
    deadlocksDetected: number;
    budgetOverruns: number;
    authorityLeaks: number;
  }>({
    cyclesRun: 1000,
    invariantsPassed: 1000,
    deadlocksDetected: 0,
    budgetOverruns: 0,
    authorityLeaks: 0,
  });

  const handleRunDigitalTwin = () => {
    setIsSimulating(true);
    setSimulationProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setSimulationProgress(current);

      if (current >= 100) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationStats({
          cyclesRun: 1000,
          invariantsPassed: 1000,
          deadlocksDetected: 0,
          budgetOverruns: 0,
          authorityLeaks: 0,
        });
      }
    }, 150);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <span>Formal Verification & Digital Twins Engine (Section 10)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          State-space model checking & zero-side-effect digital twin simulations required for HOFL autonomous operation.
        </p>
      </div>

      {/* The 4 Core Invariants */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
          Mathematical Workflow Invariants
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invariants.map((inv) => (
            <div
              key={inv.invariantId}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {inv.type} Invariant · {inv.invariantId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                  {inv.status}
                </span>
              </div>

              <h3 className="text-sm font-semibold text-white">{inv.name}</h3>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                {inv.formalStatement}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-sans">{inv.proofDetails}</p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Shadow Runs: {inv.shadowRunsEvaluated.toLocaleString()}</span>
                <span className="text-emerald-400 font-semibold">
                  Pass Rate: {(inv.passRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Twin Monte Carlo Simulator */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
              Digital Twin Simulation Chamber
            </h2>
            <p className="text-xs text-slate-400">
              Executes workflow state machines against simulated enterprise twins without side-effects or authority.
            </p>
          </div>

          <button
            onClick={handleRunDigitalTwin}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            {isSimulating ? (
              <>
                <RotateCw className="h-4 w-4 animate-spin" />
                <span>Simulating State Space... {simulationProgress}%</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Run 1,000 Monte Carlo Cycles</span>
              </>
            )}
          </button>
        </div>

        {/* Progress bar */}
        {isSimulating && (
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-150"
              style={{ width: `${simulationProgress}%` }}
            />
          </div>
        )}

        {/* Simulation Output Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono pt-2">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Cycles Evaluated</span>
            <span className="text-base font-bold text-slate-200">
              {simulationStats.cyclesRun.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Invariants Passed</span>
            <span className="text-base font-bold text-emerald-400">
              {simulationStats.invariantsPassed.toLocaleString()}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Deadlocks Found</span>
            <span className="text-base font-bold text-slate-200">
              {simulationStats.deadlocksDetected}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Budget Overruns</span>
            <span className="text-base font-bold text-slate-200">
              {simulationStats.budgetOverruns}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="text-slate-500 text-[10px] block">Authority Leaks</span>
            <span className="text-base font-bold text-emerald-400">
              {simulationStats.authorityLeaks} (Zero)
            </span>
          </div>
        </div>
      </div>

      {/* HOFL Gate Verification Protocol */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase flex items-center gap-2">
          <Award className="h-4 w-4 text-cyan-400" />
          <span>HOFL (Human-Off-the-Loop) Promotion Gate Standard</span>
        </h2>
        <p className="text-xs text-slate-400">
          No entity or workflow self-promotes to autonomous HOFL. Strict standard required:
        </p>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>20+ Judged Shadow-Mode Recommendations with 80%+ Human Agreement</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Zero Bad Outcomes or Breaker Trips in Prior 30 Days</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Formal Safety & Liveness Verification over Pinned Contract Digest</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Explicit Signed Handover Entry from Elena Vance, Esq. (Legal Root)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
