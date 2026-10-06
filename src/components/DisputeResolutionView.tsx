import React, { useState } from 'react';
import {
  Scale,
  FileText,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Calculator,
} from 'lucide-react';
import { DisputeIncident } from '../types/aos';

interface DisputeResolutionViewProps {
  disputes: DisputeIncident[];
  onSettleDispute: (disputeId: string) => void;
}

export const DisputeResolutionView: React.FC<DisputeResolutionViewProps> = ({
  disputes,
  onSettleDispute,
}) => {
  const [selectedDisputeId, setSelectedDisputeId] = useState<string>(disputes[0]?.disputeId || '');
  const selectedDispute = disputes.find((d) => d.disputeId === selectedDisputeId) || disputes[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          <Scale className="h-5 w-5 text-cyan-400" />
          <span>Automated Dispute Resolution & Liability Engine (Section 12)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographic provenance ledger parsed into mathematical liability shares: Λ = Σ α_l · Φ_l(Ledger).
        </p>

        {/* Mathematical formulation */}
        <div className="mt-3 p-3 rounded-lg border border-slate-800 bg-slate-900/60 font-mono text-xs text-slate-300 flex items-center justify-between">
          <div>
            <span className="text-cyan-400 font-bold">Attribution Formula: </span>
            <span>Λ_n = α₁·L1 (Actor) + α₂·L2 (Grantor) + α₃·L3 (Config) + α₄·L4 (Legal Root)</span>
          </div>
          <span className="text-[11px] text-slate-400">Aviation-Style Proportional Attribution</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <span className="text-xs font-semibold text-slate-300 font-mono uppercase block">
            Incident Records ({disputes.length})
          </span>

          <div className="space-y-2">
            {disputes.map((disp) => (
              <div
                key={disp.disputeId}
                onClick={() => setSelectedDisputeId(disp.disputeId)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedDispute.disputeId === disp.disputeId
                    ? 'border-cyan-500 bg-cyan-950/20'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-slate-200">{disp.disputeId}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      disp.status === 'SETTLED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {disp.status}
                  </span>
                </div>

                <div className="text-xs text-slate-300 mt-1 line-clamp-2">{disp.title}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-2 flex justify-between">
                  <span>Claim: ${disp.claimedDamageUsd.toLocaleString()}</span>
                  <span>Block #{disp.blockIndex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Incident Report */}
        {selectedDispute && (
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white">{selectedDispute.title}</h2>
                  <span className="text-xs font-mono text-cyan-400">({selectedDispute.disputeId})</span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Logged Date: {selectedDispute.date} · Linked Provenance Block: #{selectedDispute.blockIndex}
                </div>
              </div>

              <div className="font-mono text-right">
                <span className="text-[10px] text-slate-500 block">Claimed Damages</span>
                <span className="text-base font-bold text-rose-400">
                  ${selectedDispute.claimedDamageUsd.toLocaleString()} USD
                </span>
              </div>
            </div>

            {/* Attribution Breakdown Chart & Cards */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 font-mono uppercase">
                Proportional Liability Attribution
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                {/* L1 */}
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 text-[10px] block">Level 1: Actor</span>
                  <span className="text-base font-bold text-slate-200">
                    {selectedDispute.attributionShares.level1_actingEntityShare}%
                  </span>
                  <div className="h-1 bg-slate-800 rounded-full mt-2">
                    <div
                      className="h-1 bg-slate-400 rounded-full"
                      style={{ width: `${selectedDispute.attributionShares.level1_actingEntityShare}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Operational Execution</span>
                </div>

                {/* L2 */}
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 text-[10px] block">Level 2: Grantor</span>
                  <span className="text-base font-bold text-indigo-400">
                    {selectedDispute.attributionShares.level2_grantorShare}%
                  </span>
                  <div className="h-1 bg-slate-800 rounded-full mt-2">
                    <div
                      className="h-1 bg-indigo-400 rounded-full"
                      style={{ width: `${selectedDispute.attributionShares.level2_grantorShare}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Scoping Authorization</span>
                </div>

                {/* L3 */}
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 text-[10px] block">Level 3: Config/Trainer</span>
                  <span className="text-base font-bold text-amber-400">
                    {selectedDispute.attributionShares.level3_trainerShare}%
                  </span>
                  <div className="h-1 bg-slate-800 rounded-full mt-2">
                    <div
                      className="h-1 bg-amber-400 rounded-full"
                      style={{ width: `${selectedDispute.attributionShares.level3_trainerShare}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Pinned Digest Defect</span>
                </div>

                {/* L4 */}
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950">
                  <span className="text-slate-500 text-[10px] block">Level 4: Legal Root</span>
                  <span className="text-base font-bold text-emerald-400">
                    {selectedDispute.attributionShares.level4_legalRootShare}%
                  </span>
                  <div className="h-1 bg-slate-800 rounded-full mt-2">
                    <div
                      className="h-1 bg-emerald-400 rounded-full"
                      style={{ width: `${selectedDispute.attributionShares.level4_legalRootShare}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Ultimate Reserve Root</span>
                </div>
              </div>
            </div>

            {/* Findings Text Box */}
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="text-xs font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>Automated Findings & Regulatory Output</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {selectedDispute.findings}
              </p>
            </div>

            {/* Human Decider Action Button */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                The engine computes. Elena Vance decides.
              </span>

              {selectedDispute.status !== 'SETTLED' ? (
                <button
                  onClick={() => onSettleDispute(selectedDispute.disputeId)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold transition-colors"
                >
                  Approve Settlement & Update Risk Premiums
                </button>
              ) : (
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Settled & Reconciled in Money Ledger</span>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
