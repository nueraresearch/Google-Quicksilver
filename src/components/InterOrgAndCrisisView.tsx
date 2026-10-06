import React, { useState } from 'react';
import {
  Network,
  ShieldAlert,
  Flame,
  FileCheck,
  Building2,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Download,
  KeyRound,
  FileText,
} from 'lucide-react';
import {
  InterOrgTransaction,
  BreakGlassSession,
  AssuranceGrant,
} from '../types/aos';

interface InterOrgAndCrisisViewProps {
  transactions: InterOrgTransaction[];
  breakGlass: BreakGlassSession;
  assuranceGrants: AssuranceGrant[];
  onToggleBreakGlass: () => void;
  onRatifyBreakGlassEvent: (eventId: string) => void;
  onSendInterOrgInvoice: (counterparty: string, amount: number) => void;
  onToggleLegalHold: (grantId: string) => void;
}

export const InterOrgAndCrisisView: React.FC<InterOrgAndCrisisViewProps> = ({
  transactions,
  breakGlass,
  assuranceGrants,
  onToggleBreakGlass,
  onRatifyBreakGlassEvent,
  onSendInterOrgInvoice,
  onToggleLegalHold,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'xorg' | 'crisis' | 'assurance'>('xorg');

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Network className="h-5 w-5 text-cyan-400" />
            <span>Inter-Org Commerce, Crisis Mode & Assurance (Sections 19, 21, 22)</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Kernel-to-Kernel Protocol · Degraded Break-Glass Resilience · Read-Only Assurance Portals
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setActiveSubTab('xorg')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'xorg'
                ? 'bg-slate-800 text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Inter-Org Protocol (19)
          </button>
          <button
            onClick={() => setActiveSubTab('crisis')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'crisis'
                ? 'bg-slate-800 text-rose-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Crisis & Break-Glass (21)
          </button>
          <button
            onClick={() => setActiveSubTab('assurance')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeSubTab === 'assurance'
                ? 'bg-slate-800 text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Assurance Portals (22)
          </button>
        </div>
      </div>

      {/* 1. Inter-Organization Protocol View (Section 19) */}
      {activeSubTab === 'xorg' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-cyan-900/60 bg-cyan-950/20 text-xs font-mono text-cyan-200">
            <strong>Kernel-to-Kernel Commerce:</strong> Contracts, purchase orders, and settlements exchange machine-verifiable commitments between two companies running AOS. "The channel grants nothing; authority stays home."
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
                  Cross-Org Ledger Exchanges
                </h2>
                <p className="text-xs text-slate-400">
                  Transactions anchored in both parties' cryptographic hash chains
                </p>
              </div>

              <button
                onClick={() =>
                  onSendInterOrgInvoice('Northrop Grumman Aerospace (AOS Instance #881)', 12500)
                }
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-colors shadow-sm"
              >
                + Dispatch Kernel-to-Kernel Invoice ($12,500)
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.transactionId}
                  className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 font-mono text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">{tx.counterpartyOrg}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                      {tx.action}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Contract Ref: {tx.contractRef}</span>
                    {tx.amountUsd && (
                      <span className="text-slate-200 font-bold">
                        ${tx.amountUsd.toLocaleString()} USD
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Local Provenance Block #{tx.localBlockIndex}</span>
                    <span className="text-emerald-400 font-semibold">
                      Mutual Cross-Reference: {tx.counterpartyBlockRef} (VERIFIED)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Crisis & Break-Glass Mode (Section 21) */}
      {activeSubTab === 'crisis' && (
        <div className="space-y-6">
          <div
            className={`p-4 rounded-xl border text-xs font-mono flex items-start gap-3 ${
              breakGlass.active
                ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                : 'border-slate-800 bg-slate-900/40 text-slate-300'
            }`}
          >
            <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm block">
                {breakGlass.active
                  ? 'CRISIS BREAK-GLASS MODE ACTIVE'
                  : 'Crisis Degraded Mode (Standby)'}
              </strong>
              <p className="mt-1 leading-relaxed text-[11px]">
                Pre-authorized emergency role under Elena Vance. Authority is time-windowed ($10,000 cap). Mandatory retroactive ratification required — unratified actions auto-generate dispute records.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
                  Break-Glass Buffer & Retroactive Ratification
                </h2>
                <p className="text-xs text-slate-400">
                  Emergency events buffered locally during outage. Must be ratified upon recovery.
                </p>
              </div>

              <button
                onClick={onToggleBreakGlass}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors ${
                  breakGlass.active
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                }`}
              >
                {breakGlass.active ? 'Restore Normal Governance' : 'ACTUATE BREAK-GLASS EXCEPTION'}
              </button>
            </div>

            <div className="space-y-2.5">
              {breakGlass.bufferedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{ev.action}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {ev.timestamp} · Spend: ${ev.amountUsd}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {ev.ratified ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>RATIFIED</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onRatifyBreakGlassEvent(ev.id)}
                        className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px]"
                      >
                        Ratify Event (Elena Vance)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. External Assurance Surface (Section 22) */}
      {activeSubTab === 'assurance' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 text-xs font-mono text-emerald-200">
            <strong>External Assurance Surface:</strong> Read-only grants for auditors (EY), regulators (FAA), and insurers (Munich Re). Chain-verified evidence exports with zero authority escalation.
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
              Active Scoped Read-Only Assurance Portals
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assuranceGrants.map((grant) => (
                <div
                  key={grant.grantId}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 font-mono text-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{grant.organization}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-300">
                      {grant.role}
                    </span>
                  </div>

                  <div className="text-slate-400 text-[11px]">
                    Designated Auditor: <strong className="text-slate-200">{grant.auditorName}</strong>
                  </div>

                  <div className="text-[10px] text-slate-500 truncate">
                    Read-Only Token: {grant.ledgerToken}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onToggleLegalHold(grant.grantId)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                        grant.legalHoldActive
                          ? 'bg-rose-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {grant.legalHoldActive ? 'LEGAL HOLD ACTIVE' : 'Enable Legal Hold'}
                    </button>

                    <button
                      onClick={() => alert(`Exporting chain-verified SHA-256 evidence package for ${grant.organization}`)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      <span>Export Provenance Proof</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
