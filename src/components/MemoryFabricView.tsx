import React, { useState } from 'react';
import {
  Brain,
  Layers,
  Lock,
  EyeOff,
  Shield,
  ArrowRight,
  CheckCircle,
  FileText,
  Clock,
  Sparkles,
  Fingerprint,
} from 'lucide-react';
import { MemoryItem, Entity, ClearanceLevel } from '../types/aos';

interface MemoryFabricViewProps {
  memories: MemoryItem[];
  entities: Entity[];
  onAddHandoffRecord: (senderId: string, receiverId: string, details: any) => void;
}

export const MemoryFabricView: React.FC<MemoryFabricViewProps> = ({
  memories,
  entities,
  onAddHandoffRecord,
}) => {
  const [activeTier, setActiveTier] = useState<'all' | 'episodic' | 'semantic' | 'knowledge_graph'>('all');
  
  // Cross-entity handoff simulator states
  const [senderId, setSenderId] = useState<string>(entities[0]?.entityId || '');
  const [receiverId, setReceiverId] = useState<string>(entities[1]?.entityId || '');
  const [rawHandoffContext, setRawHandoffContext] = useState<string>(
    'Client John Doe (Phone: +1-555-0192, TaxID: 88-192019) requested priority dispatch. Internal Secret: stripe_sk_live_98410294. Private CoT Reasoning: The client might cancel if delayed, so expediting without standard lead time.'
  );
  const [scrubbedResult, setScrubbedResult] = useState<{
    sanitizedText: string;
    secretsStripped: number;
    piiRedacted: number;
    cotStripped: boolean;
    clearanceEnforced: ClearanceLevel;
    timestamp: string;
  } | null>(null);

  const sender = entities.find((e) => e.entityId === senderId) || entities[0];
  const receiver = entities.find((e) => e.entityId === receiverId) || entities[1];

  const filteredMemories = memories.filter(
    (m) => activeTier === 'all' || m.tier === activeTier
  );

  const handleSimulateHandoff = () => {
    // Deterministic scrubbing algorithm per AOS Section 8
    let text = rawHandoffContext;
    let secretsCount = 0;
    let piiCount = 0;
    let cotStripped = false;

    // 1. Secrets scrubbing (Hard rule: secrets never cross boundaries)
    const secretRegex = /(sk_live_[a-zA-Z0-9]+|secret_[a-zA-Z0-9]+|stripe_sk_[a-zA-Z0-9_]+|api_key_[a-zA-Z0-9]+)/gi;
    if (secretRegex.test(text)) {
      secretsCount += (text.match(secretRegex) || []).length;
      text = text.replace(secretRegex, '[VAULT_SCOPED_TOKEN_#TOK_8410]');
    }

    // 2. Private Chain-of-Thought scrubbing
    if (text.includes('Private CoT Reasoning:') || text.includes('CoT:')) {
      cotStripped = true;
      text = text.replace(/Private CoT Reasoning:.*$/i, '[PRIVATE_CHAIN_OF_THOUGHT_STRIPPED]');
    }

    // 3. PII Redaction if receiver clearance is lower than restricted
    if (receiver.axes.access.clearanceLevel !== 'restricted') {
      const phoneRegex = /(\+?[0-9]{1,3}[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/g;
      const taxRegex = /(TaxID:\s*[0-9-]+)/gi;
      if (phoneRegex.test(text)) {
        piiCount++;
        text = text.replace(phoneRegex, '[PHONE_REDACTED_CLEARANCE]');
      }
      if (taxRegex.test(text)) {
        piiCount++;
        text = text.replace(taxRegex, 'TaxID: [REDACTED_CLEARANCE]');
      }
    }

    const result = {
      sanitizedText: text,
      secretsStripped: secretsCount,
      piiRedacted: piiCount,
      cotStripped,
      clearanceEnforced: receiver.axes.access.clearanceLevel,
      timestamp: new Date().toISOString(),
    };

    setScrubbedResult(result);

    // Record to ledger via callback
    onAddHandoffRecord(sender.entityId, receiver.entityId, {
      senderClearance: sender.axes.access.clearanceLevel,
      receiverClearance: receiver.axes.access.clearanceLevel,
      secretsStripped: secretsCount,
      piiRedacted: piiCount,
      cotStripped,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          <Brain className="h-5 w-5 text-cyan-400" />
          <span>Governed Unified Memory Fabric</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          3-Tier substrate: Episodic · Semantic · Knowledge Graph with mandatory context-scrubbing guardrails.
        </p>
      </div>

      {/* Cross-Entity Context Scrubber Interactive Simulator */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase flex items-center gap-2">
              <Shield className="h-4 w-4 text-cyan-400" />
              <span>Cross-Entity Context Scrubbing Guardrail (Section 8)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Secrets never cross boundaries. PII scrubbed per recipient clearance. Private CoT stripped. Every handoff is a ledger event.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Sender Entity (Originator):
            </label>
            <select
              value={senderId}
              onChange={(e) => setSenderId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              {entities.map((e) => (
                <option key={e.entityId} value={e.entityId}>
                  {e.name} (Clearance: {e.axes.access.clearanceLevel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1">
              Receiver Entity (Recipient):
            </label>
            <select
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            >
              {entities.map((e) => (
                <option key={e.entityId} value={e.entityId}>
                  {e.name} (Clearance: {e.axes.access.clearanceLevel})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Input */}
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1">
            Raw Context / Handoff Payload (contains simulated PII, secrets, and private reasoning):
          </label>
          <textarea
            rows={3}
            value={rawHandoffContext}
            onChange={(e) => setRawHandoffContext(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSimulateHandoff}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <EyeOff className="h-4 w-4" />
            <span>Execute Governed Context Scrubbing & Handoff</span>
          </button>
        </div>

        {/* Scrubbed Output Display */}
        {scrubbedResult && (
          <div className="p-4 rounded-lg border border-cyan-500/40 bg-cyan-950/20 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
              <span className="font-bold">Sanitized Context Delivered to {receiver.name}</span>
              <span className="text-[10px] text-slate-400">
                Enforced for clearance: {scrubbedResult.clearanceEnforced}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 leading-relaxed">
              {scrubbedResult.sanitizedText}
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">Secrets Stripped</span>
                <span className="text-emerald-400 font-bold">{scrubbedResult.secretsStripped}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">PII Redacted</span>
                <span className="text-amber-400 font-bold">{scrubbedResult.piiRedacted}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">CoT Reasoning</span>
                <span className="text-cyan-400 font-bold">
                  {scrubbedResult.cotStripped ? 'STRIPPED' : 'CLEAN'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3-Tier Memory Explorer */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
              Authoritative Memory Entries
            </h2>
            <p className="text-xs text-slate-400">
              Episodic (task-scoped), Semantic (distilled facts), Knowledge Graph (org relationships)
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs font-mono">
            {(['all', 'episodic', 'semantic', 'knowledge_graph'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-2.5 py-1 rounded capitalize transition-colors ${
                  activeTier === tier
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 text-xs space-y-2 font-mono"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      mem.tier === 'episodic'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : mem.tier === 'semantic'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800/50'
                    }`}
                  >
                    {mem.tier.replace('_', ' ')}
                  </span>
                  <span className="font-bold text-slate-200 text-xs">{mem.key}</span>
                </div>

                <span className="text-slate-500 text-[11px]">
                  Clearance: <strong className="text-slate-300">{mem.clearanceRequired}</strong>
                </span>
              </div>

              <p className="text-slate-300 font-sans leading-relaxed text-xs">{mem.summary}</p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Evidence Ref: {mem.evidenceRef || 'None'}</span>
                <span>Created: {new Date(mem.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
