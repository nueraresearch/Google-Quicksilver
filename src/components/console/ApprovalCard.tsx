import React, { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowRight,
  Clock,
  DollarSign,
  Fingerprint,
} from 'lucide-react';
import { Entity, KernelAuthorization, TaskProposal } from '../../types/aos';

interface ApprovalCardProps {
  id: string;
  actor: {
    name: string;
    type: string;
    avatarUrl?: string;
  };
  actionStatement: string;
  amountUsd?: number;
  riskTier: number; // 0 to 5
  policyChecks: string[];
  evidenceSummary: string;
  evidenceRefs: string[];
  timestamp: string;
  requiresHoldToConfirm?: boolean;
  onApprove: () => void;
  onReject: () => void;
  onRequestChanges?: () => void;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({
  id,
  actor,
  actionStatement,
  amountUsd,
  riskTier,
  policyChecks,
  evidenceSummary,
  evidenceRefs,
  timestamp,
  requiresHoldToConfirm = false,
  onApprove,
  onReject,
  onRequestChanges,
}) => {
  const [depth, setDepth] = useState<'glance' | 'inspect' | 'dive'>('glance');
  const [holding, setHolding] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);

  const getRiskBadge = (tier: number) => {
    switch (tier) {
      case 0:
        return { label: 'Tier 0 · Read-Only', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
      case 1:
        return { label: 'Tier 1 · Internal Low', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800' };
      case 2:
        return { label: 'Tier 2 · Low Financial', bg: 'bg-blue-950/80 text-blue-300 border-blue-800' };
      case 3:
        return { label: 'Tier 3 · Physical/Irreversible', bg: 'bg-amber-950/80 text-amber-300 border-amber-700 animate-pulse' };
      case 4:
        return { label: 'Tier 4 · High Financial/SLA', bg: 'bg-orange-950/80 text-orange-300 border-orange-700' };
      case 5:
      default:
        return { label: 'Tier 5 · Existential / Kill-Switch', bg: 'bg-rose-950/90 text-rose-300 border-rose-600' };
    }
  };

  const risk = getRiskBadge(riskTier);

  // Hold-to-confirm handler for Tier >= 3
  const handleMouseDown = () => {
    if (riskTier < 3 && !requiresHoldToConfirm) {
      onApprove();
      return;
    }
    setHolding(true);
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setHoldProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setHolding(false);
        setHoldProgress(0);
        onApprove();
      }
    }, 70);

    const cancelHold = () => {
      clearInterval(interval);
      setHolding(false);
      setHoldProgress(0);
      window.removeEventListener('mouseup', cancelHold);
      window.removeEventListener('touchend', cancelHold);
    };

    window.addEventListener('mouseup', cancelHold);
    window.addEventListener('touchend', cancelHold);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-lg transition-all hover:border-slate-700 relative overflow-hidden">
      {/* Top Bar: Actor & Risk Badge */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-400 shrink-0">
            {actor.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-200 truncate">{actor.name}</div>
            <div className="text-[10px] text-slate-400 font-mono capitalize">
              {actor.type} · {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 font-mono">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${risk.bg}`}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Glance Layer: Plain-language action statement + Amount */}
      <div className="space-y-1.5 my-3">
        <h3 className="text-sm font-medium text-white leading-snug">
          {actionStatement}
        </h3>
        {amountUsd !== undefined && amountUsd > 0 && (
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300">
            <DollarSign className="h-3.5 w-3.5 text-cyan-400" />
            <span>${amountUsd.toLocaleString()} USD</span>
          </div>
        )}
      </div>

      {/* One-Tap "Why?" Button (Progressive Disclosure) */}
      <div className="my-2.5">
        <button
          onClick={() => setDepth(depth === 'glance' ? 'inspect' : depth === 'inspect' ? 'dive' : 'glance')}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
        >
          <HelpCircle className="h-3 w-3" />
          <span>
            {depth === 'glance'
              ? 'Why was this scored and gated? (Inspect)'
              : depth === 'inspect'
              ? 'View Cryptographic Provenance Chain (Dive)'
              : 'Collapse Evidence'}
          </span>
          {depth === 'glance' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
        </button>
      </div>

      {/* Inspect Layer: Inline Policy Checks & Evidence Summary */}
      {depth !== 'glance' && (
        <div className="my-3 p-3 rounded-xl border border-slate-800 bg-slate-950/70 space-y-2 text-xs font-mono">
          <div className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 text-slate-300">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span>Deterministic Kernel Audit Trail</span>
          </div>

          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            {evidenceSummary}
          </p>

          <div className="space-y-1 pt-1.5 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase block">Policy Invariants Checked:</span>
            {policyChecks.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>

          {/* Dive Layer: Evidence Refs & Digest Pinning */}
          {depth === 'dive' && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] text-slate-400">
              <span className="text-slate-500 uppercase block">Pinned Provenance Refs:</span>
              <div className="flex flex-wrap gap-1">
                {evidenceRefs.map((ref) => (
                  <span key={ref} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                    {ref}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Zone: Thumb-first Ergonomics */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <button
          onClick={onReject}
          className="px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors"
        >
          Reject
        </button>

        {onRequestChanges && (
          <button
            onClick={onRequestChanges}
            className="px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors hidden sm:block"
          >
            Request Changes
          </button>
        )}

        {/* Primary Action Button (Hold to Confirm if Risk >= 3) */}
        <div className="relative">
          <button
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-sm flex items-center gap-1.5 select-none ${
              riskTier >= 3
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
            }`}
          >
            {riskTier >= 3 ? (
              <>
                <Fingerprint className="h-3.5 w-3.5" />
                <span>{holding ? `Authorizing (${holdProgress}%)` : 'Hold to Authorize'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Approve Action</span>
              </>
            )}
          </button>

          {/* Hold Progress Fill Bar */}
          {holding && (
            <div
              className="absolute inset-0 bg-white/20 rounded-xl pointer-events-none transition-all duration-75"
              style={{ width: `${holdProgress}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
