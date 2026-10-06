import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  TrendingDown,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { ApprovalCard } from './ApprovalCard';
import { Goal, CircuitBreakerRule } from '../../types/aos';

interface PendingApprovalItem {
  id: string;
  actor: { name: string; type: string };
  actionStatement: string;
  amountUsd?: number;
  riskTier: number;
  policyChecks: string[];
  evidenceSummary: string;
  evidenceRefs: string[];
  timestamp: string;
}

interface FeedViewProps {
  goals: Goal[];
  circuitBreakers: CircuitBreakerRule[];
  onApproveAction: (approvalId: string) => void;
  onRejectAction: (approvalId: string) => void;
  onNavigateToGoals: () => void;
  onNavigateToWork: () => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  goals,
  circuitBreakers,
  onApproveAction,
  onRejectAction,
  onNavigateToGoals,
  onNavigateToWork,
}) => {
  // Pending approvals needing human decision (Authority Surface)
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>([
    {
      id: 'app-01',
      actor: { name: 'Sentinel-Auditor (AI)', type: 'ai_agent' },
      actionStatement: 'Disburse $1,250.00 to Sandvik Coromant for Carbide Tooling Batch #491',
      amountUsd: 1250,
      riskTier: 3,
      policyChecks: [
        '3-way inventory match confirmed (PO #9921, Receipt #8812)',
        'Vendor tax ID & FedNow routing verified on legal whitelist',
        'Spend within daily $2,500 velocity cap',
      ],
      evidenceSummary:
        'Purchase order PO-4091 matches receiving report from KUKA cell. Early settlement 2.5% discount expires in 4 hours.',
      evidenceRefs: ['po_4091', 'receipt_8812', 'bank_whitelist_v2'],
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    },
    {
      id: 'app-02',
      actor: { name: 'KUKA KR-10 Cybertech (Robot)', type: 'robot' },
      actionStatement: 'Actuate physical palletizing gripper cell for 500 aerospace brackets',
      riskTier: 3,
      policyChecks: [
        'Safety light-curtains active and confirmed nominal',
        'Physical risk floor Tier 3 enforced',
        'Hardware emergency stop ping latency < 15ms',
      ],
      evidenceSummary:
        'Physical automation batch queued. Telemetry indicates zero motor temperature variances or torque deviations.',
      evidenceRefs: ['hal_ros2_arm_telemetry', 'safety_interlock_log_84'],
      timestamp: new Date(Date.now() - 42 * 60000).toISOString(),
    },
    {
      id: 'app-03',
      actor: { name: 'Apex-Planner (AI)', type: 'ai_agent' },
      actionStatement: 'Send commercial binding quote ($48,000.00) to Boeing Aerospace',
      amountUsd: 48000,
      riskTier: 4,
      policyChecks: [
        'Creditworthiness verified against Dun & Bradstreet API',
        'Contractual delivery schedule validated against Haas VF-2 capacity',
        'Requires Elena Vance exact-action signature',
      ],
      evidenceSummary:
        'Boeing RFQ #8412 qualifies for aerospace preferred tier with estimated 42% gross margin.',
      evidenceRefs: ['crm_lead_ref_482', 'margin_model_v1_4'],
      timestamp: new Date(Date.now() - 95 * 60000).toISOString(),
    },
  ]);

  const [digestExpanded, setDigestExpanded] = useState<boolean>(false);

  const handleApprove = (id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    onApproveAction(id);
  };

  const handleReject = (id: string) => {
    setApprovals((prev) => prev.filter((a) => a.id !== id));
    onRejectAction(id);
  };

  const trippedBreakers = circuitBreakers.filter((cb) => cb.isTripped);
  const atRiskGoals = goals.filter((g) => g.status === 'atRisk');
  const achievedGoals = goals.filter((g) => g.status === 'achieved');

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Feed Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white font-mono tracking-tight">⌂ INTELLIGENT FEED</span>
            {approvals.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                {approvals.length} Awaiting Authority
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Calm by default · Interruptions rationed to required human decisions
          </p>
        </div>

        <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Kernel Sync Active</span>
        </div>
      </div>

      {/* 1. Urgent: Active Breakers Alert (Loud when it matters) */}
      {trippedBreakers.length > 0 && (
        <div className="rounded-2xl border border-rose-500 bg-rose-950/30 p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-mono font-bold text-xs">
            <ShieldAlert className="h-4 w-4 text-rose-400 animate-bounce" />
            <span>CIRCUIT BREAKER TRIP ACTIVE (DEMOTED TO HITL)</span>
          </div>
          {trippedBreakers.map((cb) => (
            <p key={cb.id} className="text-xs text-rose-200 font-mono">
              • {cb.name}: {cb.actionOnTrip}
            </p>
          ))}
        </div>
      )}

      {/* 2. Authority Cards: Pending Decisions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 uppercase tracking-wider">
          <span>Authority Queue (Human Action Required)</span>
          <span>{approvals.length} pending</span>
        </div>

        {approvals.length > 0 ? (
          approvals.map((app) => (
            <ApprovalCard
              key={app.id}
              id={app.id}
              actor={app.actor}
              actionStatement={app.actionStatement}
              amountUsd={app.amountUsd}
              riskTier={app.riskTier}
              policyChecks={app.policyChecks}
              evidenceSummary={app.evidenceSummary}
              evidenceRefs={app.evidenceRefs}
              timestamp={app.timestamp}
              onApprove={() => handleApprove(app.id)}
              onReject={() => handleReject(app.id)}
            />
          ))
        ) : (
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 text-center space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
            <div className="text-xs font-mono text-slate-200 font-semibold">
              Authority Queue Clear
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              All intelligence proposals authorized or resolved. No blocking human approvals.
            </p>
          </div>
        )}
      </div>

      {/* 3. Deviation Notices: At-Risk Goals (Gap Math in one sentence) */}
      {atRiskGoals.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
            Trajectory Deviations
          </span>

          {atRiskGoals.map((g) => (
            <div
              key={g.goalId}
              onClick={onNavigateToGoals}
              className="p-4 rounded-2xl border border-amber-900/60 bg-amber-950/20 text-xs font-mono space-y-2 cursor-pointer hover:border-amber-700 transition-colors"
            >
              <div className="flex items-center justify-between text-amber-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" />
                  <span>{g.statement}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                  AT-RISK
                </span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Gap Math: At current velocity (3.2 units/day), milestone misses deadline by 14 units ($38,000 ARR delta). Tap to view corrective entity rebalancing proposals.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4. Milestone Celebrations: Achieved Goals */}
      {achievedGoals.length > 0 && (
        <div className="p-4 rounded-2xl border border-emerald-900/60 bg-emerald-950/20 text-xs font-mono space-y-2">
          <div className="flex items-center justify-between text-emerald-300 font-bold">
            <span className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Milestone Verified & Achieved!</span>
            </span>
            <span className="text-[10px] text-slate-400">Self-Progression Active</span>
          </div>
          <p className="text-slate-200 font-sans text-xs">
            {achievedGoals[0].statement} has verified 100% progress via cryptographic ledger evidence. Successor proposal generated in Goal Cascade.
          </p>
        </div>
      )}

      {/* 5. Quiet Daily Digest (Calm by default) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-xs font-mono">
        <button
          onClick={() => setDigestExpanded(!digestExpanded)}
          className="w-full flex items-center justify-between text-slate-300 font-semibold"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span>Operational Digest (34 Routine Events)</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {digestExpanded ? 'Collapse' : 'Tap to expand'}
          </span>
        </button>

        {digestExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-[11px] text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span>Haas VF-2 completed 6 titanium flange cuts</span>
              <span className="text-slate-300">09:44 AM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span>Apex Planner screened 4 inbound RFQs on /v1/inbound</span>
              <span className="text-slate-300">08:12 AM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span>Chronos Reconciler processed 12 ACH disbursements</span>
              <span className="text-slate-300">07:00 AM</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Continuous compliance attestation verified Block #3</span>
              <span className="text-slate-300">06:30 AM</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
