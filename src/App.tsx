/**
 * AOS (Agentic Operating System)
 * Entity-Agnostic Operating System for Business Operations
 * Gated by a Deterministic Governance Kernel, Audited through a Cryptographic Provenance Chain.
 */

import React, { useState, useEffect } from 'react';
import {
  AOSState,
  BusinessSurface,
  PlatformOperatingMode,
  OversightState,
  RoleInterface,
  TaskProposal,
  KernelAuthorization,
  Entity,
  ProvenanceBlock,
  Goal,
  GoalCandidate,
  BreakGlassSession,
  AssuranceGrant,
  InterOrgTransaction,
  HumanEmployeeRecord,
} from './types/aos';
import {
  initialEntities,
  initialRoles,
  initialCircuitBreakers,
  initialMemories,
  initialHalDevices,
  initialInvariants,
  initialDisputes,
  initialGoals,
  initialGoalCandidates,
  initialBreakGlass,
  initialAssuranceGrants,
  initialInterOrgTransactions,
  initialEmployees,
  createInitialLedger,
} from './services/store';
import { computeBlockHash } from './services/crypto';
import { TopNav, ActiveTab } from './components/TopNav';
import { Overview } from './components/Overview';
import { KernelConsole } from './components/KernelConsole';
import { TaskBiddingView } from './components/TaskBiddingView';
import { LedgerView } from './components/LedgerView';
import { MemoryFabricView } from './components/MemoryFabricView';
import { HalWorkforceView } from './components/HalWorkforceView';
import { FormalVerificationView } from './components/FormalVerificationView';
import { DisputeResolutionView } from './components/DisputeResolutionView';
import { GoalEngineView } from './components/GoalEngineView';
import { HumanOpsView } from './components/HumanOpsView';
import { InterOrgAndCrisisView } from './components/InterOrgAndCrisisView';
import { ProposalModal } from './components/ProposalModal';

// Console Interface Components (Section 25)
import { FeedView } from './components/console/FeedView';
import { GoalsAltitudeView } from './components/console/GoalsAltitudeView';
import { WorkView } from './components/console/WorkView';
import { MeView } from './components/console/MeView';
import { BottomNav } from './components/console/BottomNav';
import { CommandPalette } from './components/console/CommandPalette';
import { ChatWidget } from './components/console/ChatWidget';
import { DetailSheet } from './components/console/DetailSheet';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('feed');
  const [operatingMode, setOperatingMode] = useState<PlatformOperatingMode>('Operate');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [entities, setEntities] = useState<Entity[]>(initialEntities);
  const [roles, setRoles] = useState<RoleInterface[]>(initialRoles);
  const [ledger, setLedger] = useState<ProvenanceBlock[]>([]);
  const [circuitBreakers, setCircuitBreakers] = useState(initialCircuitBreakers);
  const [memories, setMemories] = useState(initialMemories);
  const [halDevices, setHalDevices] = useState(initialHalDevices);
  const [invariants, setInvariants] = useState(initialInvariants);
  const [disputes, setDisputes] = useState(initialDisputes);

  // New Subsystem States: Goals, Break-Glass, Assurance, Inter-Org, HR
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [goalCandidates, setGoalCandidates] = useState<GoalCandidate[]>(initialGoalCandidates);
  const [breakGlass, setBreakGlass] = useState<BreakGlassSession>(initialBreakGlass);
  const [assuranceGrants, setAssuranceGrants] = useState<AssuranceGrant[]>(initialAssuranceGrants);
  const [interOrgTransactions, setInterOrgTransactions] = useState<InterOrgTransaction[]>(initialInterOrgTransactions);
  const [employees, setEmployees] = useState<HumanEmployeeRecord[]>(initialEmployees);

  // Console Modals & Drawers
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const [goalsViewMode, setGoalsViewMode] = useState<'altitude' | 'engine'>('altitude');
  const [selectedEntityForDetail, setSelectedEntityForDetail] = useState<Entity | null>(null);
  const [proposalDefaultSurface, setProposalDefaultSurface] = useState<BusinessSurface>('/v1/ops');

  // Keyboard shortcut for ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize cryptographic ledger on mount
  useEffect(() => {
    async function initLedger() {
      const initialBlocks = await createInitialLedger();
      setLedger(initialBlocks);
    }
    initLedger();
  }, []);

  // Helper: Append a block to the cryptographic ledger
  const appendBlockToLedger = async (
    actionType: ProvenanceBlock['actionType'],
    surface: BusinessSurface,
    payload: any,
    actingEntityId: string = 'KERNEL_EXEC'
  ) => {
    const prevBlock = ledger[ledger.length - 1];
    const prevHash = prevBlock ? prevBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
    const newIndex = ledger.length;
    const timestamp = new Date().toISOString();

    const accountability = {
      level1_actingEntityId: actingEntityId,
      level2_permissionGrantorId: 'ent-human-elena',
      level3_trainerConfigurerId: 'AOS_CORE_SYSTEM',
      level3_configDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      level4_legalRootId: 'ent-human-elena',
    };

    const hash = await computeBlockHash(
      newIndex,
      timestamp,
      prevHash,
      actionType,
      surface,
      payload,
      accountability
    );

    const newBlock: ProvenanceBlock = {
      index: newIndex,
      timestamp,
      previousHash: prevHash,
      hash,
      actionType,
      surface,
      payload,
      accountability,
    };

    setLedger((prev) => [...prev, newBlock]);
  };

  // Handler: Commit approved task as new block to the Provenance Ledger
  const handleCommitApprovedTask = async (
    proposal: TaskProposal,
    auth: KernelAuthorization,
    winningEntity: Entity
  ) => {
    const actionType =
      auth.oversightRequired === 'HITL' && auth.approvalGrantedBy
        ? 'HUMAN_APPROVAL'
        : proposal.parameters?.amountUsd
        ? 'MONEY_MOVEMENT'
        : 'EXECUTION';

    const payload = {
      taskId: `task_${Date.now()}`,
      roleId: proposal.roleId,
      action: proposal.intendedAction,
      details: proposal.parameters,
      monetaryAmountUsd: proposal.parameters?.amountUsd || proposal.estimatedCostUsd,
      decisionArtifact: {
        question: `Authorize ${proposal.intendedAction}?`,
        context: `Triggered via ${proposal.triggerSource} for objective: ${proposal.objective}`,
        candidatesEvaluated: 6,
        selectedAction: proposal.intendedAction,
        policyCheckPassed: true,
        riskScore: auth.evaluatedRiskTier,
        evidenceRefs: [`role_contract_${proposal.roleId}`, `auth_token_${auth.authToken?.substring(0, 8)}`],
        humanReadableRationale: proposal.rationale,
      },
    };

    await appendBlockToLedger(actionType, proposal.surface, payload, winningEntity.entityId);

    // Update financial velocity breaker if spend occurred
    if (proposal.parameters?.amountUsd) {
      setCircuitBreakers((prev) =>
        prev.map((cb) =>
          cb.type === 'financial_velocity'
            ? { ...cb, currentValue: cb.currentValue + proposal.parameters.amountUsd }
            : cb
        )
      );
    }
  };

  // Handler: Goal Progress Recording (Bottom-Up Roll-Up, Section 13.3)
  const handleRecordGoalProgress = async (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.goalId === goalId) {
          const nextVal = g.target.currentValue + amount;
          return {
            ...g,
            target: { ...g.target, currentValue: nextVal },
            status: nextVal >= g.target.targetValue ? 'achieved' : g.status,
          };
        }
        return g;
      })
    );

    await appendBlockToLedger('EXECUTION', '/v1/ops', {
      action: 'GOAL_PROGRESS_MEASUREMENT_VERIFIED',
      goalId,
      increment: amount,
      evidence: 'Verified measurement output from role execution.',
    });
  };

  // Handler: Milestone Succession Simulation (Section 13.4)
  const handleSimulateMilestoneSuccession = async (milestoneId: string) => {
    // 1. Mark milestone achieved
    setGoals((prev) =>
      prev.map((g) =>
        g.goalId === milestoneId
          ? {
              ...g,
              status: 'achieved',
              target: { ...g.target, currentValue: g.target.targetValue },
              achievedAt: new Date().toISOString(),
            }
          : g
      )
    );

    // 2. Automatically generate candidate successor milestone ($1M -> $2.5M)
    const successorCandidate: GoalCandidate = {
      candidateId: `cand_succ_${Date.now()}`,
      statement: 'Expand regional custom milling to $2.5M in 18 months',
      source: 'prior_goal_history',
      evidenceSummary: 'Predecessor milestone achieved with 100% contract pass rate; capacity unlocked.',
      proposedAltitude: 'shortTerm',
      intentAlignment: 1.0,
      urgency: 0.9,
      feasibility: 0.88,
      dependencyOverlap: 0.05,
      priorityScore: 0.735,
    };

    setGoalCandidates((prev) => [successorCandidate, ...prev]);

    await appendBlockToLedger('EXECUTION', '/v1/overhead', {
      action: 'MILESTONE_ACHIEVED_SUCCESSOR_PROPOSED',
      predecessorMilestoneId: milestoneId,
      successorProposal: successorCandidate.statement,
    });
  };

  // Handler: Promote Goal Candidate to Active Goal Set (Section 13.1b)
  const handlePromoteCandidate = async (candidate: GoalCandidate) => {
    const newGoal: Goal = {
      goalId: `goal_${Date.now()}`,
      version: '1.0.0',
      digest: `sha_${Math.random().toString(36).substring(2, 10)}`,
      altitude: candidate.proposedAltitude,
      statement: candidate.statement,
      childGoalIds: [],
      target: {
        metric: 'Progress',
        currentValue: 0,
        targetValue: 100,
        unit: '%',
        deadline: '2027-03-31',
      },
      decomposition: 'human_approved',
      status: 'active',
      budgetUsd: 15000,
      evidenceRefs: [candidate.candidateId],
    };

    setGoals((prev) => [...prev, newGoal]);
    setGoalCandidates((prev) => prev.filter((c) => c.candidateId !== candidate.candidateId));

    await appendBlockToLedger('HUMAN_APPROVAL', '/v1/overhead', {
      action: 'GOAL_CANDIDATE_ACTIVATED',
      statement: candidate.statement,
      approvedBy: 'Elena Vance, Esq. (Legal Root)',
    });
  };

  // Handler: Offboard Employee (Section 18.2)
  const handleOffboardEmployee = async (employeeId: string) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.employeeId === employeeId
          ? { ...emp, status: 'offboarding', activeScopeGrants: [] }
          : emp
      )
    );

    // Update entity status in workforce
    setEntities((prev) =>
      prev.map((e) =>
        e.entityId.includes(employeeId.replace('emp-', ''))
          ? { ...e, status: 'retired', axes: { ...e.axes, access: { ...e.axes.access, scopes: [] } } }
          : e
      )
    );

    await appendBlockToLedger('HUMAN_APPROVAL', '/v1/overhead', {
      action: 'EMPLOYEE_OFFBOARDING_SCOPES_REVOKED',
      employeeId,
      revocationPolicy: 'RULE_18_2_TOTAL_REVOCATION',
    });
  };

  // Handler: Offer Letter Approval (Section 18.1)
  const handleApproveOfferLetter = async (candidateName: string, roleTitle: string) => {
    const newEmpId = `emp_${Date.now().toString(36)}`;
    const newRecord: HumanEmployeeRecord = {
      employeeId: newEmpId,
      name: candidateName,
      roleTitle,
      status: 'active',
      hiringRequisitionId: `REQ_${Date.now().toString().slice(-4)}`,
      offerLetterSignedBy: 'ent-human-elena',
      shiftSchedule: {
        maxHoursPerWeek: 40,
        hoursLoggedThisWeek: 0,
        mandatoryRestHoursRemaining: 0,
        employmentLawCompliant: true,
      },
      activeScopeGrants: ['internal:read', 'ops:participate'],
    };

    setEmployees((prev) => [...prev, newRecord]);

    await appendBlockToLedger('HUMAN_APPROVAL', '/v1/overhead', {
      action: 'HUMAN_OFFER_LETTER_RATIFIED',
      candidateName,
      roleTitle,
      signedBy: 'Elena Vance, Esq. (Legal Root)',
    });
  };

  // Handler: Disburse Payroll (Section 18.4)
  const handleDisbursePayroll = async (amountUsd: number) => {
    await appendBlockToLedger('MONEY_MOVEMENT', '/v1/outbound', {
      action: 'PAYROLL_SETTLEMENT_EXECUTED',
      amountUsd,
      authorizedBy: 'Elena Vance, Esq. (Legal Root)',
      rail: 'FedNow / ACH Direct Deposit',
    });
  };

  // Handler: Break-Glass Crisis Toggle (Section 21)
  const handleToggleBreakGlass = () => {
    setBreakGlass((prev) => ({
      ...prev,
      active: !prev.active,
      activatedAt: !prev.active ? new Date().toISOString() : undefined,
    }));
  };

  // Handler: Ratify Break-Glass Event (Section 21.2)
  const handleRatifyBreakGlassEvent = async (eventId: string) => {
    setBreakGlass((prev) => ({
      ...prev,
      bufferedEvents: prev.bufferedEvents.map((ev) =>
        ev.id === eventId ? { ...ev, ratified: true } : ev
      ),
    }));

    await appendBlockToLedger('HUMAN_APPROVAL', '/v1/overhead', {
      action: 'BREAK_GLASS_EVENT_RATIFIED',
      eventId,
      ratifiedBy: 'Elena Vance, Esq. (Legal Root)',
    });
  };

  // Handler: Send Inter-Org Invoice (Section 19)
  const handleSendInterOrgInvoice = async (counterparty: string, amount: number) => {
    const newTx: InterOrgTransaction = {
      transactionId: `xorg_${Date.now()}`,
      counterpartyOrg: counterparty,
      contractRef: `CONTRACT-AOS-${Date.now().toString().slice(-4)}`,
      action: 'SETTLEMENT_INVOICE',
      amountUsd: amount,
      localBlockIndex: ledger.length,
      counterpartyBlockRef: `BLOCK_XORG_#${Math.floor(Math.random() * 90000 + 10000)}`,
      verifiedKernelToKernel: true,
      timestamp: new Date().toISOString(),
    };

    setInterOrgTransactions((prev) => [newTx, ...prev]);

    await appendBlockToLedger('MONEY_MOVEMENT', '/v1/outbound', {
      action: 'INTER_ORG_SETTLEMENT_DISPATCHED',
      counterparty,
      amountUsd: amount,
      verifiedKernelToKernel: true,
    });
  };

  // Handler: Toggle Legal Hold (Section 22)
  const handleToggleLegalHold = (grantId: string) => {
    setAssuranceGrants((prev) =>
      prev.map((g) => (g.grantId === grantId ? { ...g, legalHoldActive: !g.legalHoldActive } : g))
    );
  };

  // Handler: Toggle circuit breaker trip (simulate failure and demotion)
  const handleTripBreaker = (breakerId: string) => {
    setCircuitBreakers((prev) =>
      prev.map((cb) => {
        if (cb.id === breakerId) {
          const nextState = !cb.isTripped;
          if (nextState) {
            setEntities((currEnts) =>
              currEnts.map((e) => ({
                ...e,
                oversightState: 'HITL',
                status: e.entityType === 'ai_agent' ? 'degraded' : e.status,
              }))
            );
          }
          return { ...cb, isTripped: nextState };
        }
        return cb;
      })
    );
  };

  // Handler: Simulate payload tampering in block
  const handleTamperBlock = (indexToTamper: number) => {
    setLedger((prev) =>
      prev.map((block) => {
        if (block.index === indexToTamper) {
          return {
            ...block,
            payload: {
              ...block.payload,
              action: 'TAMPERED_UNAUTHORIZED_CORRUPTION_EVENT',
              monetaryAmountUsd: 999999,
            },
            isTampered: true,
          };
        }
        return block;
      })
    );
  };

  // Handler: Restore clean ledger
  const handleRestoreLedger = async () => {
    const cleanBlocks = await createInitialLedger();
    setLedger(cleanBlocks);
  };

  // Handler: Update entity oversight state
  const handleUpdateEntityOversight = (entityId: string, state: OversightState) => {
    setEntities((prev) =>
      prev.map((e) => (e.entityId === entityId ? { ...e, oversightState: state } : e))
    );
  };

  // Handler: Toggle Emergency Stop on HAL device
  const handleToggleEStop = (deviceId: string) => {
    setHalDevices((prev) =>
      prev.map((d) => {
        if (d.deviceId === deviceId) {
          const newStatus = d.status === 'e_stop' ? 'online' : 'e_stop';
          return { ...d, status: newStatus };
        }
        return d;
      })
    );
  };

  // Handler: Settle dispute
  const handleSettleDispute = (disputeId: string) => {
    setDisputes((prev) =>
      prev.map((d) => (d.disputeId === disputeId ? { ...d, status: 'SETTLED' } : d))
    );
  };

  // Handler: Add memory handoff event to ledger
  const handleAddHandoffRecord = async (
    senderId: string,
    receiverId: string,
    details: any
  ) => {
    const payload = {
      action: 'MEMORY_CROSS_ENTITY_HANDOFF_GOVERNED',
      details: {
        senderEntityId: senderId,
        receiverEntityId: receiverId,
        ...details,
      },
      decisionArtifact: {
        question: `Permit context transfer from ${senderId} to ${receiverId}?`,
        context: 'Clearance-governed cross-entity memory handoff protocol.',
        candidatesEvaluated: 1,
        selectedAction: 'SCRUB_AND_TRANSFER',
        policyCheckPassed: true,
        riskScore: 1,
        evidenceRefs: ['memory_fabric_policy_v1'],
        humanReadableRationale: 'Secrets stripped, PII redacted per recipient clearance level.',
      },
    };

    await appendBlockToLedger('MEMORY_HANDOFF', '/v1/overhead', payload, senderId);
  };

  const appState: AOSState = {
    operatingMode,
    entities,
    roles,
    ledger,
    circuitBreakers,
    memories,
    halDevices,
    invariants,
    disputes,
    goals,
    goalCandidates,
    breakGlass,
    assuranceGrants,
    interOrgTransactions,
    employees,
    isChainTampered: ledger.some((b) => b.isTampered),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        operatingMode={operatingMode}
        setOperatingMode={setOperatingMode}
        pendingApprovalsCount={3}
        onOpenProposalModal={() => {
          setProposalDefaultSurface('/v1/ops');
          setIsProposalModalOpen(true);
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenChat={() => setIsChatWidgetOpen((prev) => !prev)}
        isChatOpen={isChatWidgetOpen}
      />

      {/* Main Content Area */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 ${density === 'compact' ? 'space-y-4' : 'space-y-6'}`}>
        {/* Mobile & Console Core Tab 1: Feed (Default Home §25.2) */}
        {activeTab === 'feed' && (
          <FeedView
            goals={goals}
            circuitBreakers={circuitBreakers}
            onApproveAction={(appId) => {
              appendBlockToLedger('HUMAN_APPROVAL', '/v1/outbound', {
                action: 'APPROVAL_AUTHORIZED_BY_ROOT',
                approvalId: appId,
                signer: 'Elena Vance, Esq. (Legal Root)',
              });
            }}
            onRejectAction={(appId) => {
              appendBlockToLedger('EXECUTION', '/v1/overhead', {
                action: 'APPROVAL_REJECTED_FAIL_CLOSED',
                approvalId: appId,
                rejector: 'Elena Vance, Esq. (Legal Root)',
              });
            }}
            onNavigateToGoals={() => setActiveTab('goals')}
            onNavigateToWork={() => setActiveTab('work')}
          />
        )}

        {/* Mobile & Console Core Tab 2: Work (Org Graph in Motion §25.2) */}
        {activeTab === 'work' && (
          <WorkView
            entities={entities}
            roles={roles}
            onOpenEntityDetail={(e) => setSelectedEntityForDetail(e)}
            onOpenBidding={() => setActiveTab('bidding')}
            onOpenLedger={() => setActiveTab('ledger')}
            onOpenHal={() => setActiveTab('hal')}
          />
        )}

        {/* Mobile & Console Core Tab 3: Me (Human Profile & Break-Glass §25.2) */}
        {activeTab === 'me' && (
          <MeView
            breakGlass={breakGlass}
            onToggleBreakGlass={handleToggleBreakGlass}
            density={density}
            setDensity={setDensity}
            onNavigateToHumanOps={() => setActiveTab('human_ops')}
          />
        )}

        {activeTab === 'overview' && (
          <Overview
            state={appState}
            onOpenProposalModal={(surface) => {
              if (surface) setProposalDefaultSurface(surface);
              setIsProposalModalOpen(true);
            }}
            onNavigateTab={setActiveTab}
            onVerifyLedger={() => setActiveTab('ledger')}
            onTripBreaker={handleTripBreaker}
          />
        )}

        {activeTab === 'goals' && (
          <div className="space-y-4">
            {/* Perspective Switcher (§25.2 Altitude View vs §13 Deep Succession Engine) */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 max-w-3xl mx-auto">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Goal Perspective</span>
              <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono">
                <button
                  onClick={() => setGoalsViewMode('altitude')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    goalsViewMode === 'altitude'
                      ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ◈ Altitude View (§25.2)
                </button>
                <button
                  onClick={() => setGoalsViewMode('engine')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    goalsViewMode === 'engine'
                      ? 'bg-purple-950 text-purple-300 font-bold border border-purple-800 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  ⚡ Succession Engine (§13)
                </button>
              </div>
            </div>

            {goalsViewMode === 'altitude' ? (
              <GoalsAltitudeView
                goals={goals}
                goalCandidates={goalCandidates}
                onRecordProgress={handleRecordGoalProgress}
                onPromoteCandidate={handlePromoteCandidate}
              />
            ) : (
              <GoalEngineView
                goals={goals}
                goalCandidates={goalCandidates}
                onPromoteCandidate={handlePromoteCandidate}
                onRecordProgress={handleRecordGoalProgress}
                onSimulateMilestoneSuccession={handleSimulateMilestoneSuccession}
              />
            )}
          </div>
        )}

        {activeTab === 'kernel' && (
          <KernelConsole
            entities={entities}
            roles={roles}
            circuitBreakers={circuitBreakers}
            onUpdateEntityOversight={handleUpdateEntityOversight}
            onTripBreaker={handleTripBreaker}
          />
        )}

        {activeTab === 'bidding' && (
          <TaskBiddingView
            entities={entities}
            roles={roles}
            onDispatchWinningBid={(role) => {
              setProposalDefaultSurface(role.surface);
              setIsProposalModalOpen(true);
            }}
          />
        )}

        {activeTab === 'ledger' && (
          <LedgerView
            ledger={ledger}
            onTamperBlock={handleTamperBlock}
            onRestoreLedger={handleRestoreLedger}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryFabricView
            memories={memories}
            entities={entities}
            onAddHandoffRecord={handleAddHandoffRecord}
          />
        )}

        {activeTab === 'hal' && (
          <HalWorkforceView
            devices={halDevices}
            onToggleEStop={handleToggleEStop}
          />
        )}

        {activeTab === 'human_ops' && (
          <HumanOpsView
            employees={employees}
            onOffboardEmployee={handleOffboardEmployee}
            onApproveOfferLetter={handleApproveOfferLetter}
            onDisbursePayroll={handleDisbursePayroll}
          />
        )}

        {activeTab === 'xorg_crisis' && (
          <InterOrgAndCrisisView
            transactions={interOrgTransactions}
            breakGlass={breakGlass}
            assuranceGrants={assuranceGrants}
            onToggleBreakGlass={handleToggleBreakGlass}
            onRatifyBreakGlassEvent={handleRatifyBreakGlassEvent}
            onSendInterOrgInvoice={handleSendInterOrgInvoice}
            onToggleLegalHold={handleToggleLegalHold}
          />
        )}

        {activeTab === 'verification' && (
          <FormalVerificationView invariants={invariants} />
        )}

        {activeTab === 'disputes' && (
          <DisputeResolutionView
            disputes={disputes}
            onSettleDispute={handleSettleDispute}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (§25.2 4 Destinations) */}
      <BottomNav
        activeTab={
          activeTab === 'feed' || activeTab === 'goals' || activeTab === 'work' || activeTab === 'me'
            ? activeTab
            : 'feed'
        }
        setActiveTab={(t) => setActiveTab(t as any)}
        pendingApprovalsCount={3}
      />

      {/* Floating Chat Widget (§25.3) */}
      <ChatWidget
        isOpen={isChatWidgetOpen}
        setIsOpen={setIsChatWidgetOpen}
        onCommitProposal={(proposal) => {
          setProposalDefaultSurface(proposal.targetSurface || '/v1/ops');
          setIsProposalModalOpen(true);
        }}
      />

      {/* Command Palette (⌘K) Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        entities={entities}
        goals={goals}
        roles={roles}
        onSelectEntity={(e) => setSelectedEntityForDetail(e)}
        onSelectGoal={() => setActiveTab('goals')}
        onSelectRole={(r) => {
          setProposalDefaultSurface(r.surface);
          setIsProposalModalOpen(true);
        }}
      />

      {/* Entity 4-Axis Detail Sheet Overlay (§25.2) */}
      <DetailSheet
        isOpen={Boolean(selectedEntityForDetail)}
        onClose={() => setSelectedEntityForDetail(null)}
        title={selectedEntityForDetail?.name || 'Entity Profile'}
        subtitle={`ID: ${selectedEntityForDetail?.entityId} · ${selectedEntityForDetail?.department}`}
      >
        {selectedEntityForDetail && (
          <div className="space-y-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Status: <strong className="text-emerald-400 uppercase">{selectedEntityForDetail.status}</strong></span>
              <span className="text-slate-400">Oversight: <strong className="text-cyan-400">{selectedEntityForDetail.oversightState}</strong></span>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Registered Skills</span>
              <div className="flex flex-wrap gap-1">
                {selectedEntityForDetail.axes.capability.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[11px]">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 space-y-1">
              <span className="text-slate-500 uppercase text-[10px] block">Granted Scopes</span>
              <div className="flex flex-wrap gap-1">
                {selectedEntityForDetail.axes.access.scopes.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px]">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-800 bg-slate-950 space-y-1 text-[11px] text-slate-400">
              <div>Reports to: <span className="text-slate-200">{selectedEntityForDetail.reportsTo}</span></div>
              <div>Clearance: <span className="text-slate-200 uppercase">{selectedEntityForDetail.axes.access.clearanceLevel}</span></div>
              <div>Hourly Rate: <span className="text-cyan-400">${selectedEntityForDetail.costProfile.hourlyRateUsd}/hr</span></div>
            </div>
          </div>
        )}
      </DetailSheet>

      {/* Governed Task Proposal & HITL Modal */}
      <ProposalModal
        isOpen={isProposalModalOpen}
        onClose={() => setIsProposalModalOpen(false)}
        roles={roles}
        entities={entities}
        circuitBreakers={circuitBreakers}
        defaultSurface={proposalDefaultSurface}
        onCommitApprovedTask={handleCommitApprovedTask}
      />
    </div>
  );
}
