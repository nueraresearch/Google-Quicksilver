import React, { useState } from 'react';
import {
  X,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Bot,
  User,
  Sparkles,
} from 'lucide-react';
import {
  RoleInterface,
  BusinessSurface,
  Entity,
  CircuitBreakerRule,
  TaskProposal,
  KernelAuthorization,
} from '../types/aos';
import {
  authorizeProposal,
  runBiddingEngine,
  calculateRiskScore,
} from '../services/kernel';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: RoleInterface[];
  entities: Entity[];
  circuitBreakers: CircuitBreakerRule[];
  defaultSurface?: BusinessSurface;
  onCommitApprovedTask: (
    proposal: TaskProposal,
    auth: KernelAuthorization,
    winningEntity: Entity
  ) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  roles,
  entities,
  circuitBreakers,
  defaultSurface = '/v1/ops',
  onCommitApprovedTask,
}) => {
  const [selectedSurface, setSelectedSurface] = useState<BusinessSurface>(defaultSurface);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    roles.find((r) => r.surface === defaultSurface)?.roleId || roles[0]?.roleId || ''
  );
  const [objective, setObjective] = useState<string>(
    'Process scheduled operation under role specification'
  );

  // Parameter state dynamically populated based on role
  const [params, setParams] = useState<Record<string, any>>({
    leadEmail: 'purchasing@boeing.com',
    budgetUsd: 28000,
    inquirySummary: 'Titanium bracket machining batch for fuselage assembly.',
    vendorId: 'sandvik_tooling',
    amountUsd: 1250,
    invoiceRef: 'INV-2026-881',
    paymentMethod: 'FedNow',
    partNumber: 'AERO-FLANGE-4102',
    quantity: 12,
    toleranceMm: 0.02,
    isPhysical: true,
    ticketId: 'TCK-9901',
    customerKey: 'Lockheed Martin',
    issueCategory: 'Contract Renewal',
    auditCycle: 'Q3-2026',
    scopeSurfaces: 'All',
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [generatedProposal, setGeneratedProposal] = useState<TaskProposal | null>(null);
  const [authEvaluation, setAuthEvaluation] = useState<KernelAuthorization | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<Entity | null>(null);
  const [humanApprovalState, setHumanApprovalState] = useState<{
    signed: boolean;
    approverId: string;
  }>({ signed: false, approverId: 'ent-human-elena' });

  if (!isOpen) return null;

  const currentRole = roles.find((r) => r.roleId === selectedRoleId) || roles[0];

  const handleSurfaceChange = (surface: BusinessSurface) => {
    setSelectedSurface(surface);
    const matchingRole = roles.find((r) => r.surface === surface);
    if (matchingRole) {
      setSelectedRoleId(matchingRole.roleId);
    }
    setGeneratedProposal(null);
    setAuthEvaluation(null);
  };

  const handleGenerateProposal = async () => {
    setIsGeneratingAI(true);
    setAuthEvaluation(null);

    try {
      const response = await fetch('/api/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          objective,
          roleId: currentRole.roleId,
          surface: selectedSurface,
          entityId: 'ent-agent-apex-planner',
          inputData: params,
        }),
      });

      const data = await response.json();

      const proposal: TaskProposal = {
        proposalId: data.proposalId || `prop_${Date.now()}`,
        objective,
        surface: selectedSurface,
        roleId: currentRole.roleId,
        proposingEntityId: data.proposingEntityId || 'ent-agent-apex-planner',
        intendedAction: data.intendedAction || `Execute ${currentRole.name}`,
        parameters: { ...params, ...(data.parameters || {}) },
        estimatedCostUsd: data.estimatedCostUsd ?? 0.05,
        estimatedLatencyMs: data.estimatedLatencyMs ?? 400,
        claimedAccuracy: data.claimedAccuracy ?? 0.98,
        confidence: data.confidence ?? 0.95,
        rationale: data.rationale || 'Action proposed by LLM planner for kernel gating.',
        suggestedRiskTier: data.suggestedRiskTier ?? 2,
        triggerSource: 'http_api',
        timestamp: new Date().toISOString(),
      };

      setGeneratedProposal(proposal);

      // 2. Run Bidding Engine to determine best-fit entity
      const bids = runBiddingEngine(entities, currentRole, proposal);
      const winner = bids.find((b) => b.eligible);
      const assignedEntity = winner
        ? entities.find((e) => e.entityId === winner.entityId) || entities[0]
        : entities[0];
      setSelectedAssignee(assignedEntity);

      // 3. Pass to Deterministic Kernel Authorization
      const auth = authorizeProposal(proposal, currentRole, assignedEntity, circuitBreakers);
      setAuthEvaluation(auth);
    } catch (err) {
      console.error('Proposal generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAuthorizeWithHITL = () => {
    if (!generatedProposal || !selectedAssignee) return;

    // Kernel evaluates with human signature override
    const auth = authorizeProposal(
      generatedProposal,
      currentRole,
      selectedAssignee,
      circuitBreakers,
      { approved: true, approverId: humanApprovalState.approverId }
    );

    setAuthEvaluation(auth);

    if (auth.authorized) {
      onCommitApprovedTask(generatedProposal, auth, selectedAssignee);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white font-mono uppercase tracking-wider">
              Governed Task Intake & Proposal Loop
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs max-h-[75vh] overflow-y-auto">
          {/* Surface & Role Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-slate-400 block mb-1">Target Surface</label>
              <select
                value={selectedSurface}
                onChange={(e) => handleSurfaceChange(e.target.value as BusinessSurface)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="/v1/inbound">/v1/inbound (Sales & RFQ)</option>
                <option value="/v1/ops">/v1/ops (HAL CNC & Robotics)</option>
                <option value="/v1/outbound">/v1/outbound (Treasury & Payouts)</option>
                <option value="/v1/support">/v1/support (Escalations)</option>
                <option value="/v1/overhead">/v1/overhead (Compliance & Audit)</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-slate-400 block mb-1">Role Interface Contract</label>
              <select
                value={selectedRoleId}
                onChange={(e) => {
                  setSelectedRoleId(e.target.value);
                  setGeneratedProposal(null);
                  setAuthEvaluation(null);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              >
                {roles
                  .filter((r) => r.surface === selectedSurface)
                  .map((r) => (
                    <option key={r.roleId} value={r.roleId}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Objective Statement */}
          <div>
            <label className="font-mono text-slate-400 block mb-1">
              Business Objective / Trigger Prompt
            </label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="State target objective for intelligence proposal..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs"
            />
          </div>

          {/* Role Schemas Required Fields helper */}
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 font-mono text-[11px] text-slate-400 space-y-2">
            <div className="flex justify-between items-center text-slate-300 font-semibold">
              <span>Required Input Parameters ({currentRole.inputSchema.required?.join(', ')})</span>
              <span className="text-cyan-400">Schema Digest Pinned</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {currentRole.inputSchema.required?.map((key: string) => (
                <div key={key}>
                  <span className="text-[10px] text-slate-500 block">{key}</span>
                  <input
                    type="text"
                    value={params[key] ?? ''}
                    onChange={(e) =>
                      setParams({
                        ...params,
                        [key]: isNaN(Number(e.target.value)) ? e.target.value : Number(e.target.value),
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-slate-200 text-[11px] font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Button: Generate Proposal */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerateProposal}
              disabled={isGeneratingAI}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              {isGeneratingAI ? (
                <span>Generating Proposal (Gemini 3.8)...</span>
              ) : (
                <>
                  <Bot className="h-4 w-4" />
                  <span>Propose Action via Governed Intelligence</span>
                </>
              )}
            </button>
          </div>

          {/* Proposal Evaluation Output */}
          {generatedProposal && authEvaluation && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {/* Proposal Details */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-semibold text-cyan-400">
                    Proposal Generated: {generatedProposal.intendedAction}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Assignee: <strong className="text-slate-200">{selectedAssignee?.name}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {generatedProposal.rationale}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px] pt-1">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Cost</span>
                    <span className="text-slate-200 font-bold">
                      ${generatedProposal.estimatedCostUsd.toFixed(3)}
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Latency</span>
                    <span className="text-slate-200 font-bold">
                      {generatedProposal.estimatedLatencyMs}ms
                    </span>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Risk Tier</span>
                    <span className="text-amber-400 font-bold">
                      Tier {authEvaluation.evaluatedRiskTier}
                    </span>
                  </div>
                </div>
              </div>

              {/* Kernel Gatekeeper Verdict */}
              <div
                className={`p-4 rounded-xl border space-y-2.5 ${
                  authEvaluation.authorized
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-200'
                    : authEvaluation.oversightRequired === 'HITL'
                    ? 'border-amber-500/50 bg-amber-950/20 text-amber-200'
                    : 'border-rose-500 bg-rose-950/30 text-rose-200'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    <Shield className="h-4 w-4" />
                    <span>Kernel Verdict: {authEvaluation.oversightRequired} Gate Required</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700">
                    {authEvaluation.authorized ? 'AUTHORIZED' : 'GATED'}
                  </span>
                </div>

                <ul className="space-y-1 text-[11px] font-mono list-disc list-inside">
                  {authEvaluation.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>

                {/* HITL Human Approval Section */}
                {!authEvaluation.authorized && authEvaluation.oversightRequired === 'HITL' && (
                  <div className="pt-3 border-t border-amber-900/60 space-y-3">
                    <div className="text-xs text-amber-100 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-amber-400" />
                      <span>
                        Risk tier {authEvaluation.evaluatedRiskTier} or financial spend requires cryptographic human authorization.
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-mono text-slate-400">
                        Designated Signer: <strong className="text-slate-200">Elena Vance, Esq. (Legal Root)</strong>
                      </div>

                      <button
                        onClick={handleAuthorizeWithHITL}
                        className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold transition-colors shadow-sm"
                      >
                        Sign & Authorize Execution Token
                      </button>
                    </div>
                  </div>
                )}

                {/* If already authorized (HOTL or HOFL) */}
                {authEvaluation.authorized && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        if (selectedAssignee) {
                          onCommitApprovedTask(generatedProposal, authEvaluation, selectedAssignee);
                          onClose();
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors"
                    >
                      Commit Execution to Provenance Ledger →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
