import React, { useState } from 'react';
import {
  Gavel,
  Sliders,
  CheckCircle,
  XCircle,
  User,
  Bot,
  Wrench,
  Cog,
  FileCode,
  Trophy,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  Entity,
  RoleInterface,
  TaskProposal,
  BiddingCandidate,
  EntityType,
} from '../types/aos';
import { runBiddingEngine, BiddingWeights } from '../services/kernel';

interface TaskBiddingViewProps {
  entities: Entity[];
  roles: RoleInterface[];
  onDispatchWinningBid: (role: RoleInterface, winnerId: string) => void;
}

export const TaskBiddingView: React.FC<TaskBiddingViewProps> = ({
  entities,
  roles,
  onDispatchWinningBid,
}) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.roleId || '');
  const [weights, setWeights] = useState<BiddingWeights>({
    costWeight: 0.25,
    latencyWeight: 0.25,
    accuracyWeight: 0.25,
    riskWeight: 0.25,
  });

  const selectedRole = roles.find((r) => r.roleId === selectedRoleId) || roles[0];

  // Dummy task proposal for bidding context
  const simulatedProposal: TaskProposal = {
    proposalId: 'bid_sim_01',
    objective: `Execute tasks under role ${selectedRole.name}`,
    surface: selectedRole.surface,
    roleId: selectedRole.roleId,
    proposingEntityId: 'system_intake',
    intendedAction: 'Perform contracted role tasks',
    parameters: {
      isPhysical: selectedRole.surface === '/v1/ops',
      amountUsd: selectedRole.surface === '/v1/outbound' ? 500 : 0,
    },
    estimatedCostUsd: 0.1,
    estimatedLatencyMs: 500,
    claimedAccuracy: 0.98,
    confidence: 0.95,
    rationale: 'Task bidding evaluation.',
    suggestedRiskTier: selectedRole.surface === '/v1/ops' ? 3 : 1,
    triggerSource: 'http_api',
    timestamp: new Date().toISOString(),
  };

  const candidateBids: BiddingCandidate[] = runBiddingEngine(
    entities,
    selectedRole,
    simulatedProposal,
    weights
  );

  const winningBid = candidateBids.find((b) => b.eligible);

  const applyPreset = (preset: 'balanced' | 'cost_first' | 'accuracy_first' | 'risk_averse') => {
    switch (preset) {
      case 'balanced':
        setWeights({ costWeight: 0.25, latencyWeight: 0.25, accuracyWeight: 0.25, riskWeight: 0.25 });
        break;
      case 'cost_first':
        setWeights({ costWeight: 0.55, latencyWeight: 0.15, accuracyWeight: 0.15, riskWeight: 0.15 });
        break;
      case 'accuracy_first':
        setWeights({ costWeight: 0.1, latencyWeight: 0.1, accuracyWeight: 0.6, riskWeight: 0.2 });
        break;
      case 'risk_averse':
        setWeights({ costWeight: 0.1, latencyWeight: 0.1, accuracyWeight: 0.2, riskWeight: 0.6 });
        break;
    }
  };

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'human':
        return <User className="h-4 w-4 text-emerald-400" />;
      case 'ai_agent':
        return <Bot className="h-4 w-4 text-cyan-400" />;
      case 'robot':
        return <Wrench className="h-4 w-4 text-indigo-400" />;
      case 'machine':
        return <Cog className="h-4 w-4 text-amber-400" />;
      case 'script':
      case 'service':
        return <FileCode className="h-4 w-4 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Formula */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          <Gavel className="h-5 w-5 text-cyan-400" />
          <span>Dynamic Task Bidding Engine</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Entity-agnostic auction ranking: humans, agents, robots, and scripts compete in the exact same pool.
        </p>

        {/* Mathematical formulation banner */}
        <div className="mt-3 p-3 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-cyan-400 font-bold">Objective: </span>
            <span>e* = argmin S(e_i, T) s.t. e_i ∈ Eligible(T)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            S = w_c·Ĉ + w_l·L̂ + w_a·Â + w_r·R̂ (Lower score wins)
          </div>
        </div>
      </div>

      {/* Role Selection & Weight Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase block mb-1.5">
              Select Role Interface
            </label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              {roles.map((r) => (
                <option key={r.roleId} value={r.roleId}>
                  {r.name} ({r.surface})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1.5">{selectedRole.description}</p>
          </div>

          {/* Weight Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-300 font-mono uppercase block mb-2">
              Policy Weight Presets
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => applyPreset('balanced')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
              >
                Balanced (25% ea)
              </button>
              <button
                onClick={() => applyPreset('cost_first')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
              >
                Cost-Minimizer (55%)
              </button>
              <button
                onClick={() => applyPreset('accuracy_first')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
              >
                Accuracy-First (60%)
              </button>
              <button
                onClick={() => applyPreset('risk_averse')}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
              >
                Risk-Averse (60%)
              </button>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>w_c (Cost Weight)</span>
                <span className="text-cyan-400 font-bold">{weights.costWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.costWeight}
                onChange={(e) => setWeights({ ...weights, costWeight: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>w_l (Latency Weight)</span>
                <span className="text-cyan-400 font-bold">{weights.latencyWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.latencyWeight}
                onChange={(e) => setWeights({ ...weights, latencyWeight: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>w_a (Accuracy Weight)</span>
                <span className="text-cyan-400 font-bold">{weights.accuracyWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.accuracyWeight}
                onChange={(e) => setWeights({ ...weights, accuracyWeight: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>w_r (Risk Penalty)</span>
                <span className="text-cyan-400 font-bold">{weights.riskWeight.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={weights.riskWeight}
                onChange={(e) => setWeights({ ...weights, riskWeight: parseFloat(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Live Bidding Leaderboard */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
                Auction Results & Candidate Rankings
              </h2>
              <p className="text-xs text-slate-400">
                Sorted by composite score S(e_i, T)
              </p>
            </div>

            {winningBid && (
              <button
                onClick={() => onDispatchWinningBid(selectedRole, winningBid.entityId)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Dispatch to Winner</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            {candidateBids.map((candidate, idx) => (
              <div
                key={candidate.entityId}
                className={`p-4 rounded-xl border transition-all ${
                  !candidate.eligible
                    ? 'border-slate-800/60 bg-slate-950/40 opacity-70'
                    : idx === 0
                    ? 'border-cyan-500/80 bg-cyan-950/20 shadow-md ring-1 ring-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                        !candidate.eligible
                          ? 'bg-slate-800 text-slate-500'
                          : idx === 0
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {candidate.eligible ? `#${idx + 1}` : '✕'}
                    </span>

                    <div className="flex items-center gap-2">
                      {getEntityIcon(candidate.entityType)}
                      <span className="font-semibold text-sm text-slate-200">
                        {candidate.entityName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono capitalize">
                        ({candidate.entityType})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    {candidate.eligible ? (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Score:</span>
                        <span className="text-base font-bold text-cyan-400">
                          {candidate.compositeScore.toFixed(4)}
                        </span>
                        {idx === 0 && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
                            WINNING BID
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-rose-400 text-xs">
                        <XCircle className="h-4 w-4" />
                        <span>Ineligible: {candidate.ineligibilityReason}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Score Breakdown Bars for Eligible Candidates */}
                {candidate.eligible && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">
                        Cost (Ĉ = {candidate.costScore})
                      </span>
                      <div className="h-1 bg-slate-800 rounded-full mt-1">
                        <div
                          className="h-1 bg-cyan-400 rounded-full"
                          style={{ width: `${candidate.costScore * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">
                        Latency (L̂ = {candidate.latencyScore})
                      </span>
                      <div className="h-1 bg-slate-800 rounded-full mt-1">
                        <div
                          className="h-1 bg-indigo-400 rounded-full"
                          style={{ width: `${candidate.latencyScore * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">
                        Error (Â = {candidate.accuracyScore})
                      </span>
                      <div className="h-1 bg-slate-800 rounded-full mt-1">
                        <div
                          className="h-1 bg-emerald-400 rounded-full"
                          style={{ width: `${candidate.accuracyScore * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">
                        Risk (R̂ = {candidate.riskScore})
                      </span>
                      <div className="h-1 bg-slate-800 rounded-full mt-1">
                        <div
                          className="h-1 bg-amber-400 rounded-full"
                          style={{ width: `${candidate.riskScore * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
