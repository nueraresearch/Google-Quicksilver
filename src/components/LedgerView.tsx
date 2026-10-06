import React, { useState } from 'react';
import {
  Database,
  Link,
  ShieldCheck,
  ShieldAlert,
  Search,
  Eye,
  FileCheck,
  Flame,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { ProvenanceBlock } from '../types/aos';
import { verifyChainIntegrity } from '../services/crypto';

interface LedgerViewProps {
  ledger: ProvenanceBlock[];
  onTamperBlock: (index: number) => void;
  onRestoreLedger: () => void;
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  ledger,
  onTamperBlock,
  onRestoreLedger,
}) => {
  const [selectedBlockIndex, setSelectedBlockIndex] = useState<number>(ledger.length - 1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    checked: boolean;
    isValid: boolean;
    brokenIndex?: number;
    reason?: string;
    verifiedCount: number;
  }>({ checked: false, isValid: true, verifiedCount: ledger.length });

  const selectedBlock = ledger.find((b) => b.index === selectedBlockIndex) || ledger[ledger.length - 1];

  const handleVerifyNow = async () => {
    const result = await verifyChainIntegrity(ledger);
    setVerificationResult({
      checked: true,
      isValid: result.isValid,
      brokenIndex: result.brokenIndex,
      reason: result.reason,
      verifiedCount: result.verifiedCount,
    });
  };

  const filteredBlocks = ledger.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.index.toString().includes(q) ||
      b.actionType.toLowerCase().includes(q) ||
      b.surface.toLowerCase().includes(q) ||
      b.payload.action.toLowerCase().includes(q) ||
      b.accountability.level1_actingEntityId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Verification Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Database className="h-5 w-5 text-cyan-400" />
            <span>Immutable Cryptographic Provenance Ledger</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            HMAC / SHA-256 Hash Chained · 4-Level Accountability · Fail Closed on Tamper
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleVerifyNow}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Verify Cryptographic Chain</span>
          </button>

          <button
            onClick={() => onTamperBlock(1)}
            className="px-3 py-1.5 rounded-lg border border-rose-800 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            <span>Simulate Payload Tampering</span>
          </button>

          <button
            onClick={onRestoreLedger}
            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restore</span>
          </button>
        </div>
      </div>

      {/* Verification Alert Banner */}
      {verificationResult.checked && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
            verificationResult.isValid
              ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-200'
              : 'border-rose-500 bg-rose-950/40 text-rose-200'
          }`}
        >
          {verificationResult.isValid ? (
            <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          )}

          <div className="space-y-1">
            <div className="font-semibold text-sm">
              {verificationResult.isValid
                ? 'Cryptographic Chain Valid (Fail-Closed Passed)'
                : 'SECURITY ALERT: Hash Chain Integrity Compromised!'}
            </div>
            <p className="font-mono text-[11px] leading-relaxed">
              {verificationResult.isValid
                ? `All ${verificationResult.verifiedCount} blocks verified sequentially. Genesis previousHash is 64 zeros. Every payload matches its SHA-256 digest.`
                : `${verificationResult.reason} Governance Kernel has immediately halted autonomous dispatch.`}
            </p>
          </div>
        </div>
      )}

      {/* Main Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Block Stream List */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 font-mono uppercase">
              Block Stream ({ledger.length})
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search blocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 font-mono placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 w-32"
              />
            </div>
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredBlocks.map((block) => (
              <div
                key={block.index}
                onClick={() => setSelectedBlockIndex(block.index)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  block.isTampered
                    ? 'border-rose-500 bg-rose-950/30'
                    : selectedBlock.index === block.index
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-sm'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-cyan-400">Block #{block.index}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {block.actionType}
                  </span>
                </div>

                <div className="mt-1 text-xs text-slate-200 font-medium truncate">
                  {block.payload.action}
                </div>

                <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-slate-500">
                  <span>{block.surface}</span>
                  <span className="truncate max-w-[120px]">{block.hash.substring(0, 12)}...</span>
                </div>

                {block.isTampered && (
                  <div className="mt-1.5 text-[10px] font-mono text-rose-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    <span>TAMPERED PAYLOAD</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Block Inspector */}
        {selectedBlock && (
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white font-mono">
                    Block #{selectedBlock.index}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-xs">
                    {selectedBlock.actionType}
                  </span>
                  {selectedBlock.isTampered && (
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-xs border border-rose-800">
                      CORRUPTED
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Timestamp: {new Date(selectedBlock.timestamp).toLocaleString()} · Surface: {selectedBlock.surface}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono text-slate-500 block">SHA-256 Digest</span>
                <span className="font-mono text-xs text-cyan-400 font-bold">
                  {selectedBlock.hash.substring(0, 18)}...
                </span>
              </div>
            </div>

            {/* Cryptographic Linkage Display */}
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Link className="h-3.5 w-3.5 text-cyan-400" />
                <span className="text-[11px]">Previous Hash (Hash_{selectedBlock.index - 1}):</span>
                <span className="text-slate-300 truncate text-[11px]">{selectedBlock.previousHash}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-[11px]">Current Hash (Hash_{selectedBlock.index}):</span>
                <span className="text-cyan-400 truncate text-[11px]">{selectedBlock.hash}</span>
              </div>
            </div>

            {/* 4-Level Accountability Chain Box */}
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 space-y-3">
              <h3 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider">
                4-Level Accountability Resolution Chain
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Level 1 — Acting Entity</span>
                  <span className="font-semibold text-slate-200">
                    {selectedBlock.accountability.level1_actingEntityId}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Bears operational dispatch reputation</p>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Level 2 — Permission Grantor</span>
                  <span className="font-semibold text-indigo-300">
                    {selectedBlock.accountability.level2_permissionGrantorId}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Scope authorizer liability</p>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Level 3 — Trainer / Configurer</span>
                  <span className="font-semibold text-amber-300">
                    {selectedBlock.accountability.level3_trainerConfigurerId}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Pinned Digest: {selectedBlock.accountability.level3_configDigest.substring(0, 10)}...
                  </p>
                </div>

                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Level 4 — Legal Root</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedBlock.accountability.level4_legalRootId}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Accountable legal person / corporate root</p>
                </div>
              </div>
            </div>

            {/* Decision Artifact & Payload */}
            <div className="space-y-4">
              {selectedBlock.payload.decisionArtifact && (
                <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                    <span>Decision Artifact (Governed Justification)</span>
                    <span className="text-slate-400">
                      Risk Tier {selectedBlock.payload.decisionArtifact.riskScore}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    <strong>Question:</strong> {selectedBlock.payload.decisionArtifact.question}
                  </p>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    <strong>Rationale:</strong>{' '}
                    {selectedBlock.payload.decisionArtifact.humanReadableRationale}
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-400 block">Raw Payload JSON:</span>
                <pre className="text-[11px] font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-56">
                  {JSON.stringify(selectedBlock.payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
