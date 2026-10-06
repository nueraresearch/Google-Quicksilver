import React from 'react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Zap,
  Server,
  DollarSign,
  Workflow,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import {
  AOSState,
  BusinessSurface,
  PlatformOperatingMode,
  CircuitBreakerRule,
  Entity,
  ProvenanceBlock,
} from '../types/aos';

interface OverviewProps {
  state: AOSState;
  onOpenProposalModal: (defaultSurface?: BusinessSurface) => void;
  onNavigateTab: (tab: any) => void;
  onVerifyLedger: () => void;
  onTripBreaker: (breakerId: string) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  state,
  onOpenProposalModal,
  onNavigateTab,
  onVerifyLedger,
  onTripBreaker,
}) => {
  const { operatingMode, entities, roles, ledger, circuitBreakers } = state;

  const surfaces: {
    surface: BusinessSurface;
    name: string;
    description: string;
    activeRole: string;
    throughput: string;
    latency: string;
  }[] = [
    {
      surface: '/v1/inbound',
      name: 'Inbound',
      description: 'Lead intake, qualification, RFQs, commercial onboarding',
      activeRole: 'role-lead-triage',
      throughput: '450/hr',
      latency: '340ms',
    },
    {
      surface: '/v1/ops',
      name: 'Operations',
      description: 'Service dispatch, production scheduling, HAL physical CNC/robotics',
      activeRole: 'role-cnc-machining',
      throughput: '180/hr',
      latency: '1,200ms',
    },
    {
      surface: '/v1/outbound',
      name: 'Outbound',
      description: 'Invoicing, dual-entity reconciliation, vendor disbursements',
      activeRole: 'role-disbursement-controller',
      throughput: '12,000/hr',
      latency: '85ms',
    },
    {
      surface: '/v1/support',
      name: 'Support',
      description: 'Tier-1/2 triage, voice workflows, contract dispute retention',
      activeRole: 'role-tier2-retention',
      throughput: '320/hr',
      latency: '510ms',
    },
    {
      surface: '/v1/overhead',
      name: 'Overhead',
      description: 'Compliance attestation, continuous audits, statutory reporting',
      activeRole: 'role-compliance-auditor',
      throughput: '60/hr',
      latency: '450ms',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Operating Mode Banner */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Active Operating Mode: {operatingMode}
            </div>
            <h1 className="mt-1 text-lg font-semibold text-white tracking-tight">
              {operatingMode === 'Genesis' && 'Genesis: Bootstrapping Venture Under Safe Guardrails'}
              {operatingMode === 'Onboard' && 'Onboard: Shadow-Mode Backtesting & Gradual Handover'}
              {operatingMode === 'Operate' && 'Operate: Steady-State Reinvestment & Continuous Learning'}
            </h1>
            <p className="mt-1 text-xs text-slate-400 max-w-2xl leading-relaxed">
              {operatingMode === 'Genesis' &&
                'Autonomous experiments with strict spend caps ($50/day), zero unauthorized banking writes, and automated kill thresholds.'}
              {operatingMode === 'Onboard' &&
                'Shadowing existing bookkeeping, payment rails, and CRM. Promotes to HOTL only after 20+ verified recommendations with zero errors.'}
              {operatingMode === 'Operate' &&
                'Multi-department fluid workforce: AI planners, human counsel, Haas CNC machines, and KUKA robots cooperating under the governance kernel.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenProposalModal()}
              className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Dispatch Governed Task</span>
            </button>
            <button
              onClick={onVerifyLedger}
              className="px-3 py-2 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Verify Provenance</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Three Non-Negotiable Architectural Principles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Core Architectural Invariants
          </h2>
          <span className="text-xs text-slate-500 font-mono">Enforced at Kernel Ring 0</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-slate-700">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-2">
              <Cpu className="h-4 w-4" />
              <span>01. Cognition Separated from Authority</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong>The LLM proposes. The kernel authorizes.</strong> All intelligence (human or artificial) generates proposals; a deterministic, zero-LLM governance kernel is the sole authority that approves and gates execution.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-slate-700">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold mb-2">
              <Layers className="h-4 w-4" />
              <span>02. Entity-Agnostic Parity</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              <strong>Any entity in any position.</strong> A human, AI agent, KUKA robot, Haas CNC machine, or script can hold any role contract if it satisfies schemas, capabilities, and oversight gates.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-4 transition-all hover:border-slate-700">
            <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold mb-2">
              <ShieldAlert className="h-4 w-4" />
              <span>03. Fail Closed Always</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Missing identity, broken schemas, stale evidence, invalid signatures, expired approvals, or tripped circuit breakers immediately abort execution without side-effects.
            </p>
          </div>
        </div>
      </div>

      {/* Goal Cascade & Forward-Motion Engine Card (Section 13) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 mb-1">
            <TrendingUp className="h-4 w-4" />
            <span>Forward-Motion Engine: Active Goal Cascade</span>
          </div>
          <p className="text-xs text-slate-300">
            Long-Term: <strong>$10M Annual Revenue</strong> → Short-Term: <strong>$1M Run-Rate ($840k current)</strong> → Weekly: <strong>$25k Inbound (73%)</strong>
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('goals')}
          className="px-3.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-900/30 text-cyan-300 font-mono text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5"
        >
          <span>Goal Engine & Progression →</span>
        </button>
      </div>

      {/* 3. Five Universal Business Functions (Surfaces) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Five Universal Routing Surfaces
            </h2>
            <p className="text-xs text-slate-500">Every external trigger routes into these first-class governed endpoints</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">All Channels Grant Zero Authority</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {surfaces.map((s) => (
            <div
              key={s.surface}
              className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors group cursor-pointer"
              onClick={() => onOpenProposalModal(s.surface)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 group-hover:text-cyan-300">
                    {s.surface}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    Active
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">{s.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {s.description}
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-2 text-[11px] text-slate-400 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>Throughput</span>
                  <span className="text-slate-200 tabular-nums">{s.throughput}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Latency</span>
                  <span className="text-slate-200 tabular-nums">{s.latency}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-cyan-400 group-hover:translate-x-0.5 transition-transform text-[11px] font-sans font-medium">
                  <span>Dispatch role</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Circuit Breakers & Quick Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circuit Breakers Card */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Deterministic Circuit Breakers</span>
              </h2>
              <p className="text-xs text-slate-400">Automatic demotion from HOFL/HOTL to HITL when limits are breached</p>
            </div>
            <button
              onClick={() => onNavigateTab('kernel')}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              Configure Policies →
            </button>
          </div>

          <div className="space-y-3">
            {circuitBreakers.map((cb: CircuitBreakerRule) => {
              const ratio = cb.currentValue / cb.threshold;
              const isWarning = ratio >= 0.7 && !cb.isTripped;
              return (
                <div
                  key={cb.id}
                  className={`rounded-lg border p-3 text-xs transition-colors ${
                    cb.isTripped
                      ? 'border-rose-500/60 bg-rose-950/20'
                      : isWarning
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-200">{cb.name}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400">
                        {cb.currentValue.toLocaleString()} / {cb.threshold.toLocaleString()} {cb.unit}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cb.isTripped
                            ? 'bg-rose-500/20 text-rose-300'
                            : isWarning
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}
                      >
                        {cb.isTripped ? 'TRIPPED (HITL)' : isWarning ? 'WARNING' : 'CLEAR'}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        cb.isTripped
                          ? 'bg-rose-500'
                          : isWarning
                          ? 'bg-amber-400'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, ratio * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="italic">{cb.actionOnTrip}</span>
                    <button
                      onClick={() => onTripBreaker(cb.id)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                    >
                      {cb.isTripped ? 'Reset Breaker' : 'Simulate Breach'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Workforce Breakdown */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono mb-1">
              Active Workforce Composition
            </h2>
            <p className="text-xs text-slate-400 mb-4">6 Entities registered in unified 4-Axis model</p>

            <div className="space-y-2.5 text-xs">
              {entities.map((e: Entity) => (
                <div
                  key={e.entityId}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        e.status === 'active'
                          ? 'bg-emerald-400'
                          : e.status === 'degraded'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    <div>
                      <div className="font-medium text-slate-200 text-xs">{e.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {e.entityType} · {e.department}
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-mono text-[11px]">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] ${
                        e.oversightState === 'HITL'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                          : e.oversightState === 'HOTL'
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      {e.oversightState}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400 font-mono">Bidding Eligibility</span>
            <button
              onClick={() => onNavigateTab('bidding')}
              className="text-cyan-400 hover:underline font-mono"
            >
              Inspect Task Auction →
            </button>
          </div>
        </div>
      </div>

      {/* 5. Recent Cryptographic Provenance Ledger Summary */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Provenance Ledger (Hash-Chained & 4-Level Accountable)
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Chain verified: SHA-256 HMAC · {ledger.length} blocks committed
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('ledger')}
            className="text-xs font-mono text-cyan-400 hover:underline"
          >
            Full Ledger Explorer →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2 px-3">Block #</th>
                <th className="py-2 px-3">Action Type</th>
                <th className="py-2 px-3">Surface</th>
                <th className="py-2 px-3">Summary</th>
                <th className="py-2 px-3">Actor (L1)</th>
                <th className="py-2 px-3">Legal Root (L4)</th>
                <th className="py-2 px-3 text-right">Hash Digest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ledger.slice(-4).reverse().map((b: ProvenanceBlock) => (
                <tr key={b.index} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-cyan-400">#{b.index}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {b.actionType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{b.surface}</td>
                  <td className="py-2.5 px-3 font-sans text-slate-200 truncate max-w-xs">
                    {b.payload.action}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{b.accountability.level1_actingEntityId}</td>
                  <td className="py-2.5 px-3 text-slate-400">{b.accountability.level4_legalRootId}</td>
                  <td className="py-2.5 px-3 text-right text-slate-500 font-mono">
                    {b.hash.substring(0, 10)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
