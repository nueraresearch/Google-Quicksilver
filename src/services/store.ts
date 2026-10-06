/**
 * AOS State Store & Ground Truth Seed Data
 * Enforces entity parity, 4-Axis model, 5 universal business surfaces,
 * hash-chained provenance, circuit breakers, and memory fabric.
 */

import {
  Entity,
  RoleInterface,
  ProvenanceBlock,
  CircuitBreakerRule,
  MemoryItem,
  HalDevice,
  FormalInvariantResult,
  DisputeIncident,
  PlatformOperatingMode,
  AOSState,
} from '../types/aos';
import { computeBlockHash } from './crypto';

// 1. Initial 4-Axis Entities
export const initialEntities: Entity[] = [
  {
    entityId: 'ent-human-elena',
    name: 'Elena Vance, Esq.',
    entityType: 'human',
    status: 'active',
    reportsTo: 'BOARD_OF_DIRECTORS',
    department: 'Executive & Legal',
    availability: 0.9,
    oversightState: 'HITL',
    axes: {
      capability: {
        skills: ['general_operations', 'legal_counsel', 'financial_authority', 'compliance_auditor'],
        maxThroughputPerHr: 12,
        runtimeConfig: { credentialsRef: 'BAR_CALIFORNIA_#289411' },
      },
      access: {
        scopes: ['*'],
        clearanceLevel: 'restricted',
      },
      personality: {
        riskTolerance: 0.2,
        tone: 'formal',
        operatingMode: 'conservative',
      },
      accountability: {
        permissionGrantorId: 'LEGAL_CHARTER_ROOT',
        trainerConfigurerId: 'STANFORD_LAW_ALUMNI',
        legalRootId: 'ent-human-elena',
        configDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    },
    riskProfile: { historicalIncidents: 0, disputeRate: 0.0, reputationScore: 0.99 },
    costProfile: { hourlyRateUsd: 220, computePerTaskUsd: 0, depreciationRatePerHourUsd: 0 },
  },
  {
    entityId: 'ent-agent-apex-planner',
    name: 'Apex-Planner (Gemini 3.8)',
    entityType: 'ai_agent',
    status: 'active',
    reportsTo: 'ent-human-elena',
    department: 'Strategic Planning',
    availability: 1.0,
    oversightState: 'HOTL',
    axes: {
      capability: {
        skills: ['lead_triage', 'strategic_planning', 'financial_analysis', 'general_operations'],
        maxThroughputPerHr: 450,
        runtimeConfig: {
          provider: 'Google AI Studio',
          model: 'gemini-3.8-flash',
          effortTier: 'high',
        },
      },
      access: {
        scopes: ['erp:read', 'crm:read', 'crm:write', 'ledger:propose'],
        clearanceLevel: 'confidential',
      },
      personality: {
        riskTolerance: 0.35,
        tone: 'objective_analytical',
        operatingMode: 'balanced',
      },
      accountability: {
        permissionGrantorId: 'ent-human-elena',
        trainerConfigurerId: 'AOS_SYSTEM_PROMPT_V1_4',
        legalRootId: 'ent-human-elena',
        configDigest: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      },
    },
    riskProfile: { historicalIncidents: 1, disputeRate: 0.004, reputationScore: 0.97 },
    costProfile: { hourlyRateUsd: 0, computePerTaskUsd: 0.04, depreciationRatePerHourUsd: 0 },
  },
  {
    entityId: 'ent-agent-sentinel',
    name: 'Sentinel-Auditor',
    entityType: 'ai_agent',
    status: 'active',
    reportsTo: 'ent-human-elena',
    department: 'Governance & Compliance',
    availability: 1.0,
    oversightState: 'HOTL',
    axes: {
      capability: {
        skills: ['compliance_auditor', 'disbursement_controller', 'tier2_retention'],
        maxThroughputPerHr: 300,
        runtimeConfig: {
          provider: 'Google AI Studio',
          model: 'gemini-3.8-flash',
          effortTier: 'medium',
        },
      },
      access: {
        scopes: ['erp:read', 'banking:read', 'banking:propose', 'audit:write'],
        clearanceLevel: 'confidential',
      },
      personality: {
        riskTolerance: 0.15,
        tone: 'strictly_verifiable',
        operatingMode: 'conservative',
      },
      accountability: {
        permissionGrantorId: 'ent-human-elena',
        trainerConfigurerId: 'AUDIT_POLICY_PACK_V3',
        legalRootId: 'ent-human-elena',
        configDigest: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
      },
    },
    riskProfile: { historicalIncidents: 0, disputeRate: 0.001, reputationScore: 0.99 },
    costProfile: { hourlyRateUsd: 0, computePerTaskUsd: 0.03, depreciationRatePerHourUsd: 0 },
  },
  {
    entityId: 'ent-robot-kuka-01',
    name: 'KUKA KR-10 Cybertech (ROS2)',
    entityType: 'robot',
    status: 'active',
    reportsTo: 'ent-agent-apex-planner', // AI managing a physical robot!
    department: 'Industrial Ops',
    availability: 0.95,
    oversightState: 'HOTL',
    axes: {
      capability: {
        skills: ['palletizing', 'cnc_machining', 'material_transfer'],
        maxThroughputPerHr: 180,
        runtimeConfig: {
          hardwareSpecs: '6-Axis articulated arm, 10kg payload, 0.03mm repeatability',
          firmwareVersion: 'ROS2_HUMBLE_KRC4_V8.6',
        },
      },
      access: {
        scopes: ['hal:ros2:arm', 'hal:safety:e_stop_listen'],
        clearanceLevel: 'internal',
      },
      personality: {
        riskTolerance: 0.05,
        operatingMode: 'conservative',
      },
      accountability: {
        permissionGrantorId: 'ent-human-elena',
        trainerConfigurerId: 'KUKA_SYSTEMS_CERTIFIED_INTEGRATOR',
        legalRootId: 'ent-human-elena',
        configDigest: '7b52009b64fd0a2a49e6d8a939753077792b0554251d8820a0b593a11656be52',
      },
    },
    riskProfile: { historicalIncidents: 0, disputeRate: 0.0, reputationScore: 0.99 },
    costProfile: { hourlyRateUsd: 0, computePerTaskUsd: 0.12, depreciationRatePerHourUsd: 4.5 },
  },
  {
    entityId: 'ent-machine-haas-vf2',
    name: 'Haas VF-2 CNC Vertical Mill',
    entityType: 'machine',
    status: 'active',
    reportsTo: 'ent-robot-kuka-01',
    department: 'Manufacturing',
    availability: 0.88,
    oversightState: 'HITL',
    axes: {
      capability: {
        skills: ['cnc_machining', 'subtractive_milling'],
        maxThroughputPerHr: 4,
        runtimeConfig: {
          hardwareSpecs: '30x16x20 inch travel, 30hp, 8100rpm spindle, OPC-UA enabled',
          firmwareVersion: 'NGC_100.20.000.1110',
        },
      },
      access: {
        scopes: ['hal:opc_ua:spindle', 'hal:opc_ua:gcode_feed'],
        clearanceLevel: 'internal',
      },
      personality: {
        riskTolerance: 0.01,
        operatingMode: 'conservative',
      },
      accountability: {
        permissionGrantorId: 'ent-human-elena',
        trainerConfigurerId: 'HAAS_FACTORY_OUTLET_WEST',
        legalRootId: 'ent-human-elena',
        configDigest: '4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5',
      },
    },
    riskProfile: { historicalIncidents: 0, disputeRate: 0.0, reputationScore: 0.98 },
    costProfile: { hourlyRateUsd: 0, computePerTaskUsd: 1.85, depreciationRatePerHourUsd: 18.0 },
  },
  {
    entityId: 'ent-script-reconciler',
    name: 'Chronos-Reconciler Script',
    entityType: 'script',
    status: 'active',
    reportsTo: 'ent-agent-sentinel',
    department: 'Finance Ops',
    availability: 1.0,
    oversightState: 'HOFL',
    axes: {
      capability: {
        skills: ['reconciliation', 'ledger_batching', 'disbursement_controller'],
        maxThroughputPerHr: 12000,
        runtimeConfig: {
          hardwareSpecs: 'Cloud Run micro-container, Node.js 22 LTS',
          firmwareVersion: 'v2.1.0-sha-94a2b1',
        },
      },
      access: {
        scopes: ['banking:read', 'erp:read', 'ledger:write'],
        clearanceLevel: 'internal',
      },
      personality: {
        riskTolerance: 0.0,
        operatingMode: 'conservative',
      },
      accountability: {
        permissionGrantorId: 'ent-human-elena',
        trainerConfigurerId: 'FINANCE_ENG_COMMIT_4821',
        legalRootId: 'ent-human-elena',
        configDigest: '1b85293014a371695273943a57710e21ee2d993f7c131f32841d4995ecf100c2',
      },
    },
    riskProfile: { historicalIncidents: 0, disputeRate: 0.0, reputationScore: 1.0 },
    costProfile: { hourlyRateUsd: 0, computePerTaskUsd: 0.001, depreciationRatePerHourUsd: 0 },
  },
];

// 2. Initial Role Interfaces (Contracts)
export const initialRoles: RoleInterface[] = [
  {
    roleId: 'role-lead-triage',
    name: 'Inbound Opportunity Triage Lead',
    version: '1.2.0',
    digest: 'c63b4b89b2513f596395b066f7f711d95d10d18e9575916327e57c6b5b546313',
    surface: '/v1/inbound',
    inputSchema: {
      type: 'object',
      required: ['leadEmail', 'budgetUsd', 'inquirySummary'],
      properties: {
        leadEmail: { type: 'string' },
        budgetUsd: { type: 'number' },
        inquirySummary: { type: 'string' },
        tier: { type: 'string' },
      },
    },
    outputSchema: {
      type: 'object',
      required: ['qualified', 'tierAssigned', 'routingSurface'],
    },
    requiredPermissions: ['crm:read', 'crm:write'],
    performanceSpecs: {
      maxLatencyMs: 1500,
      maxCostPerTask: 0.15,
      minAccuracy: 0.95,
    },
    oversightDefault: 'HOTL',
    description: 'Screens and qualifies prospective customer requests, scores fit, and creates CRM contracts.',
  },
  {
    roleId: 'role-cnc-machining',
    name: 'Precision Milling Controller',
    version: '2.0.1',
    digest: '458efef3a479a0b943d266e7ea8167f677d242636f33cfba342e4ecfa58d4615',
    surface: '/v1/ops',
    inputSchema: {
      type: 'object',
      required: ['partNumber', 'quantity', 'toleranceMm', 'isPhysical'],
      properties: {
        partNumber: { type: 'string' },
        quantity: { type: 'number' },
        toleranceMm: { type: 'number' },
        isPhysical: { type: 'boolean' },
      },
    },
    outputSchema: {
      type: 'object',
      required: ['spindleCyclesCompleted', 'inspectionPassRate'],
    },
    requiredPermissions: ['hal:opc_ua:gcode_feed', 'hal:safety:e_stop_listen'],
    performanceSpecs: {
      maxLatencyMs: 5000,
      maxCostPerTask: 25.0,
      minAccuracy: 0.999,
    },
    oversightDefault: 'HITL',
    description: 'Governs physical subtractive machining via OPC-UA. Physical risk floor = Tier 3.',
  },
  {
    roleId: 'role-disbursement-controller',
    name: 'Treasury Disbursement Manager',
    version: '1.4.0',
    digest: '9e73d09a87cd94fb00b20466487e49f874983228a64939d8928014e3b7944111',
    surface: '/v1/outbound',
    inputSchema: {
      type: 'object',
      required: ['vendorId', 'amountUsd', 'invoiceRef', 'paymentMethod'],
      properties: {
        vendorId: { type: 'string' },
        amountUsd: { type: 'number' },
        invoiceRef: { type: 'string' },
        paymentMethod: { type: 'string' },
      },
    },
    outputSchema: {
      type: 'object',
      required: ['transactionId', 'settlementStatus'],
    },
    requiredPermissions: ['banking:propose', 'banking:read'],
    performanceSpecs: {
      maxLatencyMs: 800,
      maxCostPerTask: 0.1,
      minAccuracy: 1.0,
    },
    oversightDefault: 'HITL',
    description: 'Enforces spend limits and dual-entity reconciliation for commercial payouts.',
  },
  {
    roleId: 'role-tier2-retention',
    name: 'Enterprise Contract Retention Specialist',
    version: '1.1.0',
    digest: '517a26cb0e9803099e0df7aa85f81e3a6c117dcfbd2c7fa4f005b6510344b1d1',
    surface: '/v1/support',
    inputSchema: {
      type: 'object',
      required: ['ticketId', 'customerKey', 'issueCategory'],
      properties: {
        ticketId: { type: 'string' },
        customerKey: { type: 'string' },
        issueCategory: { type: 'string' },
        concessionValueUsd: { type: 'number' },
      },
    },
    outputSchema: {
      type: 'object',
      required: ['resolutionSummary', 'retained'],
    },
    requiredPermissions: ['crm:read', 'crm:write'],
    performanceSpecs: {
      maxLatencyMs: 2000,
      maxCostPerTask: 0.25,
      minAccuracy: 0.94,
    },
    oversightDefault: 'HOTL',
    description: 'Handles high-touch enterprise accounts and commercial concessions.',
  },
  {
    roleId: 'role-compliance-auditor',
    name: 'Corporate & Regulatory Auditor',
    version: '3.0.0',
    digest: 'a7c93845c43d9bf31a61e6878b664d9f78310c950d8924b22c710214878b4081',
    surface: '/v1/overhead',
    inputSchema: {
      type: 'object',
      required: ['auditCycle', 'scopeSurfaces'],
      properties: {
        auditCycle: { type: 'string' },
        scopeSurfaces: { type: 'string' },
      },
    },
    outputSchema: {
      type: 'object',
      required: ['attestationValid', 'breachesFound'],
    },
    requiredPermissions: ['audit:write', 'erp:read'],
    performanceSpecs: {
      maxLatencyMs: 3500,
      maxCostPerTask: 0.5,
      minAccuracy: 0.999,
    },
    oversightDefault: 'HOFL',
    description: 'Verifies continuous cryptographic ledger integrity and generates statutory attestation.',
  },
];

// 3. Initial Circuit Breakers
export const initialCircuitBreakers: CircuitBreakerRule[] = [
  {
    id: 'cb-financial-velocity',
    name: 'Financial Velocity Limit',
    type: 'financial_velocity',
    threshold: 2500,
    unit: 'USD / 1h',
    timeWindowSec: 3600,
    currentValue: 840,
    isTripped: false,
    actionOnTrip: 'Demote all entities to HITL. Require Elena Vance human signature for all disbursements.',
  },
  {
    id: 'cb-error-spike',
    name: 'Kernel Error Spike Guard',
    type: 'error_spike',
    threshold: 0.02,
    unit: 'Failure Rate ε',
    timeWindowSec: 600,
    currentValue: 0.003,
    isTripped: false,
    actionOnTrip: 'Mark failing entity degraded. Reroute dispatch to human backup queue.',
  },
  {
    id: 'cb-anomaly-detector',
    name: 'Payload & Telemetry Anomaly',
    type: 'anomaly',
    threshold: 3.5,
    unit: 'Std Deviations σ',
    timeWindowSec: 300,
    currentValue: 0.8,
    isTripped: false,
    actionOnTrip: 'Halt dispatch pipeline, log Level 1-4 incident, trigger human inspection.',
  },
  {
    id: 'cb-workflow-budget',
    name: 'Workflow Compute Budget Cap',
    type: 'budget_cap',
    threshold: 15.0,
    unit: 'USD / run',
    timeWindowSec: 60,
    currentValue: 1.84,
    isTripped: false,
    actionOnTrip: 'Kill runaway execution loop, dead-letter task, alert operations lead.',
  },
];

// 4. Initial Unified Memory Fabric
export const initialMemories: MemoryItem[] = [
  {
    id: 'mem-ep-101',
    tier: 'episodic',
    key: 'active_lead_acme_industrial',
    summary: 'Evaluating RFQ for 500 titanium flange brackets from Acme Corp. Budget $34,000.',
    evidenceRef: 'block_0003',
    clearanceRequired: 'internal',
    containsPII: true,
    containsSecret: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'mem-sem-201',
    tier: 'semantic',
    key: 'vendor_discount_policy_net30',
    summary: 'Standard 2.5% early payment discount applied to CNC tooling suppliers if paid within 10 days.',
    evidenceRef: 'policy_doc_v2_1',
    clearanceRequired: 'internal',
    containsPII: false,
    containsSecret: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'mem-kg-301',
    tier: 'knowledge_graph',
    key: 'entity_rel_haas_vf2_reports_to_kuka',
    summary: 'Haas VF-2 CNC Mill is managed by KUKA KR-10 Cybertech for automated material loading.',
    evidenceRef: 'org_charter_graph_v1',
    clearanceRequired: 'public',
    containsPII: false,
    containsSecret: false,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
];

// 5. Initial HAL Physical Devices
export const initialHalDevices: HalDevice[] = [
  {
    deviceId: 'hal-ros2-arm',
    entityId: 'ent-robot-kuka-01',
    name: 'KUKA Articulated Arm Cell #1',
    protocol: 'ROS2',
    topicOrNode: '/arm_controller/joint_trajectory',
    status: 'online',
    safetyInterlockEngaged: true,
    physicalRiskFloor: 3,
    telemetry: {
      loadPercentage: 42.1,
      temperatureCelsius: 38.4,
      errorCount: 0,
      lastPingMs: 14,
    },
  },
  {
    deviceId: 'hal-opc-vf2',
    entityId: 'ent-machine-haas-vf2',
    name: 'Haas VF-2 CNC Milling Center',
    protocol: 'OPC-UA',
    topicOrNode: 'ns=2;s=Device.Channel1.SpindleState',
    status: 'online',
    safetyInterlockEngaged: true,
    physicalRiskFloor: 3,
    telemetry: {
      loadPercentage: 76.8,
      temperatureCelsius: 52.1,
      errorCount: 0,
      lastPingMs: 28,
    },
  },
  {
    deviceId: 'hal-mqtt-sensor',
    entityId: 'ent-script-reconciler',
    name: 'Sensata Industrial Vibration Fleet',
    protocol: 'MQTT',
    topicOrNode: 'factory/cell1/vibration/spectrum',
    status: 'online',
    safetyInterlockEngaged: true,
    physicalRiskFloor: 3,
    telemetry: {
      loadPercentage: 11.2,
      temperatureCelsius: 24.5,
      errorCount: 0,
      lastPingMs: 6,
    },
  },
];

// 6. Formal Invariants
export const initialInvariants: FormalInvariantResult[] = [
  {
    invariantId: 'inv-safety-01',
    name: 'Cognition-Authority Separation Invariant',
    type: 'Safety',
    formalStatement: '∀ state s ∈ S, Authority(LLM, s) = ∅ ∧ (Transition(s, e) ⟹ ValidToken(e))',
    status: 'VERIFIED',
    proofDetails: 'Model checked over 10,000 state mutations. No execution path exists where an LLM mints an execution token.',
    shadowRunsEvaluated: 1420,
    passRate: 1.0,
  },
  {
    invariantId: 'inv-liveness-02',
    name: 'Deadlock-Free Liveness Invariant',
    type: 'Liveness',
    formalStatement: '∀ task t ∈ Tasks, (PendingApproval(t) ∧ ExceededTimeout(t)) ⟹ EscalatedOrDeadLetter(t)',
    status: 'VERIFIED',
    proofDetails: 'Approval queues auto-escalate after 24h. Zero orphaned queue events.',
    shadowRunsEvaluated: 980,
    passRate: 1.0,
  },
  {
    invariantId: 'inv-budget-03',
    name: 'Bounded Cost & Iteration Invariant',
    type: 'Budget',
    formalStatement: '∀ run r ∈ Runs, LoopSteps(r) ≤ MaxSteps(r) ∧ TotalCost(r) ≤ Cap(r)',
    status: 'VERIFIED',
    proofDetails: 'Loop limit = 20 iterations; cost cap strictly enforced at kernel intake.',
    shadowRunsEvaluated: 2150,
    passRate: 1.0,
  },
  {
    invariantId: 'inv-account-04',
    name: 'Complete 4-Level Chain Invariant',
    type: 'Accountability',
    formalStatement: '∀ block b ∈ Ledger, ∃ (L1, L2, L3, L4) s.t. ValidDigest(L3) ∧ LegalEntity(L4)',
    status: 'VERIFIED',
    proofDetails: 'All emitted ledger blocks verify against registered root legal identities and pinned digests.',
    shadowRunsEvaluated: 3410,
    passRate: 1.0,
  },
];

// 7. Dispute Incidents
export const initialDisputes: DisputeIncident[] = [
  {
    disputeId: 'disp-2026-081',
    title: 'Flange Dimension Tolerance Variance (Job #4102)',
    date: '2026-09-14',
    blockIndex: 4,
    surface: '/v1/ops',
    claimedDamageUsd: 1450.0,
    status: 'COMPUTED',
    attributionShares: {
      level1_actingEntityShare: 20, // KUKA arm tool positioning
      level2_grantorShare: 10,      // Permitted tolerance window was wide
      level3_trainerShare: 60,      // Firmware calibration drift in pinned config
      level4_legalRootShare: 10,    // Corporate ultimate warranty reserve
    },
    findings: 'Automated attribution under Policy Doc v2.1: Level 3 Trainer/Configurer carries 60% liability due to uncalibrated tool-center point digest.',
  },
];

// 8. Initial Goal Cascade (Section 13)
export const initialGoals: import('../types/aos').Goal[] = [
  {
    goalId: 'goal-lt-01',
    version: '1.0.0',
    digest: '8f2b31a0e882a7f551b94d12c8b7470f11da08ec228492040b2a335012fce0a1',
    altitude: 'longTerm',
    statement: 'Achieve $10M annual revenue as regional leader in precision machining',
    childGoalIds: ['goal-st-01', 'goal-st-02'],
    target: {
      metric: 'Annual Revenue (ARR)',
      currentValue: 840000,
      targetValue: 10000000,
      unit: 'USD',
      deadline: '2028-12-31',
    },
    decomposition: 'human_approved',
    status: 'onTrack',
    budgetUsd: 250000,
    evidenceRefs: ['intent_ledger_entry_01', 'financial_ledger_baseline'],
  },
  {
    goalId: 'goal-st-01',
    version: '1.2.0',
    digest: '4a1b028cde38a92039c94801fe19283049182309182390182301928301928301',
    altitude: 'shortTerm',
    statement: 'Reach $1M annual run-rate in custom aerospace flange production',
    parentGoalId: 'goal-lt-01',
    childGoalIds: ['goal-wk-01', 'goal-wk-02'],
    target: {
      metric: 'Run-Rate ARR',
      currentValue: 840000,
      targetValue: 1000000,
      unit: 'USD',
      deadline: '2026-12-31',
    },
    decomposition: 'human_approved',
    status: 'onTrack',
    budgetUsd: 50000,
    evidenceRefs: ['block_0001', 'block_0002'],
  },
  {
    goalId: 'goal-st-02',
    version: '1.0.0',
    digest: '9921029301928301928301928301928301928301928301928301928301928301',
    altitude: 'shortTerm',
    statement: 'Commission secondary CNC production cell with OPC-UA bridge',
    parentGoalId: 'goal-lt-01',
    childGoalIds: [],
    target: {
      metric: 'Cell Commissioning',
      currentValue: 70,
      targetValue: 100,
      unit: '% Complete',
      deadline: '2026-11-15',
    },
    decomposition: 'hybrid',
    status: 'onTrack',
    budgetUsd: 35000,
    evidenceRefs: ['hal_device_haas_vf2'],
  },
  {
    goalId: 'goal-wk-01',
    version: '1.0.0',
    digest: '1182309182309182309182309182309182309182309182309182309182309182',
    altitude: 'weekly',
    statement: 'Close $25,000 in new commercial orders under /v1/inbound triage',
    parentGoalId: 'goal-st-01',
    childGoalIds: ['goal-dy-01'],
    target: {
      metric: 'Weekly Booked Inbound',
      currentValue: 18400,
      targetValue: 25000,
      unit: 'USD',
      deadline: '2026-10-11',
    },
    decomposition: 'automatic',
    status: 'onTrack',
    budgetUsd: 1200,
    evidenceRefs: ['crm_lead_ref_482'],
  },
  {
    goalId: 'goal-wk-02',
    version: '1.0.0',
    digest: '2282309182309182309182309182309182309182309182309182309182309182',
    altitude: 'weekly',
    statement: 'Complete 40 Haas VF-2 milling cycles with zero tolerance disputes',
    parentGoalId: 'goal-st-01',
    childGoalIds: ['goal-dy-03'],
    target: {
      metric: 'Machining Cycles Completed',
      currentValue: 36,
      targetValue: 40,
      unit: 'Parts',
      deadline: '2026-10-11',
    },
    decomposition: 'automatic',
    status: 'onTrack',
    budgetUsd: 2400,
    evidenceRefs: ['hal_telemetry_vf2'],
  },
  {
    goalId: 'goal-dy-01',
    version: '1.0.0',
    digest: '3382309182309182309182309182309182309182309182309182309182309182',
    altitude: 'daily',
    statement: 'Screen and qualify 5 RFQs via Apex Planner on /v1/inbound',
    parentGoalId: 'goal-wk-01',
    childGoalIds: [],
    target: {
      metric: 'Qualified RFQs',
      currentValue: 4,
      targetValue: 5,
      unit: 'Quotes',
      deadline: '2026-10-06',
    },
    decomposition: 'automatic',
    status: 'onTrack',
    budgetUsd: 50,
    assignedEntityId: 'ent-agent-apex-planner',
    evidenceRefs: ['block_0001'],
  },
  {
    goalId: 'goal-dy-03',
    version: '1.0.0',
    digest: '5582309182309182309182309182309182309182309182309182309182309182',
    altitude: 'daily',
    statement: 'Execute 8 titanium flange cuts on Haas VF-2 with KUKA KR-10 loader',
    parentGoalId: 'goal-wk-02',
    childGoalIds: [],
    target: {
      metric: 'Spindle Runs',
      currentValue: 6,
      targetValue: 8,
      unit: 'Parts',
      deadline: '2026-10-06',
    },
    decomposition: 'automatic',
    status: 'onTrack',
    budgetUsd: 320,
    assignedEntityId: 'ent-machine-haas-vf2',
    evidenceRefs: ['block_0003'],
  },
];

// 9. Initial Goal Candidates from 8 Origination Sources (Section 13.1)
export const initialGoalCandidates: import('../types/aos').GoalCandidate[] = [
  {
    candidateId: 'cand-01',
    statement: 'Reduce support ticket resolution lag from 6.2h to <4.0h',
    source: 'function_telemetry',
    evidenceSummary: '/v1/support backlog growing 14%/week; customer retention risk elevated',
    proposedAltitude: 'shortTerm',
    intentAlignment: 0.95,
    urgency: 0.85,
    feasibility: 0.9,
    dependencyOverlap: 0.1,
    priorityScore: 0.654,
  },
  {
    candidateId: 'cand-02',
    statement: 'Adopt FAA Part 21 digital traceability standard before Q1 statutory deadline',
    source: 'external_signals',
    evidenceSummary: 'Regulatory compliance deadline in 4 months; required for aerospace expansion',
    proposedAltitude: 'shortTerm',
    intentAlignment: 1.0,
    urgency: 0.95,
    feasibility: 0.85,
    dependencyOverlap: 0.05,
    priorityScore: 0.767,
  },
  {
    candidateId: 'cand-03',
    statement: 'Refactor FedNow payout velocity thresholds to prevent false breaker trips',
    source: 'circuit_breakers',
    evidenceSummary: 'Financial velocity circuit breaker tripped 3x during normal supplier batch days',
    proposedAltitude: 'weekly',
    intentAlignment: 0.9,
    urgency: 0.8,
    feasibility: 0.95,
    dependencyOverlap: 0.0,
    priorityScore: 0.684,
  },
  {
    candidateId: 'cand-04',
    statement: 'Expand regional custom milling to $2.5M ARR successor milestone',
    source: 'prior_goal_history',
    evidenceSummary: 'Achieved $840k run-rate milestone ahead of schedule with 99.4% schema pass rate',
    proposedAltitude: 'shortTerm',
    intentAlignment: 1.0,
    urgency: 0.7,
    feasibility: 0.88,
    dependencyOverlap: 0.15,
    priorityScore: 0.524,
  },
];

// 10. Initial Break-Glass Crisis Session (Section 21)
export const initialBreakGlass: import('../types/aos').BreakGlassSession = {
  active: false,
  emergencyOfficerId: 'ent-human-elena',
  disbursementCapUsd: 10000,
  bufferedEvents: [
    {
      id: 'bg-ev-01',
      action: 'EMERGENCY_COOLANT_DISBURSEMENT',
      amountUsd: 450,
      timestamp: '2026-09-02T11:00:00Z',
      ratified: true,
    },
  ],
};

// 11. Initial Assurance Grants (Section 22)
export const initialAssuranceGrants: import('../types/aos').AssuranceGrant[] = [
  {
    grantId: 'grant-ey-audit',
    auditorName: 'David Sterling, CPA',
    organization: 'Ernst & Young LLP',
    role: 'External Auditor',
    clearanceScope: 'PROVENANCE_LEDGER_READONLY',
    expiresAt: '2026-12-31T23:59:59Z',
    legalHoldActive: false,
    ledgerToken: 'AUDIT_TOKEN_EY_9941_READONLY',
  },
  {
    grantId: 'grant-munich-re',
    auditorName: 'Dr. Klaus Becker',
    organization: 'Munich Re Specialty',
    role: 'Actuarial Insurer',
    clearanceScope: 'DISPUTE_ACTUARIAL_READONLY',
    expiresAt: '2027-06-30T23:59:59Z',
    legalHoldActive: false,
    ledgerToken: 'INSURANCE_ACTUARIAL_TOKEN_8812',
  },
];

// 12. Initial Inter-Org Transactions (Section 19)
export const initialInterOrgTransactions: import('../types/aos').InterOrgTransaction[] = [
  {
    transactionId: 'xorg-ng-491',
    counterpartyOrg: 'Northrop Grumman Aerospace (AOS Instance #881)',
    contractRef: 'CONTRACT-NG-2026-004',
    action: 'PURCHASE_ORDER',
    amountUsd: 48000,
    localBlockIndex: 1,
    counterpartyBlockRef: 'BLOCK_NG_#49021',
    verifiedKernelToKernel: true,
    timestamp: '2026-09-12T14:30:00Z',
  },
  {
    transactionId: 'xorg-sandvik-119',
    counterpartyOrg: 'Sandvik Coromant Tooling (AOS Instance #104)',
    contractRef: 'PO-TOOLING-9912',
    action: 'SETTLEMENT_INVOICE',
    amountUsd: 840,
    localBlockIndex: 2,
    counterpartyBlockRef: 'BLOCK_SANDVIK_#8129',
    verifiedKernelToKernel: true,
    timestamp: '2026-09-13T10:20:00Z',
  },
];

// 13. Initial Human Employee Records (Section 18)
export const initialEmployees: import('../types/aos').HumanEmployeeRecord[] = [
  {
    employeeId: 'emp-elena',
    name: 'Elena Vance, Esq.',
    roleTitle: 'General Counsel & Corporate Secretary',
    status: 'active',
    hiringRequisitionId: 'REQ-EXEC-01',
    offerLetterSignedBy: 'BOARD_OF_DIRECTORS',
    shiftSchedule: {
      maxHoursPerWeek: 40,
      hoursLoggedThisWeek: 34,
      mandatoryRestHoursRemaining: 0,
      employmentLawCompliant: true,
    },
    activeScopeGrants: ['*', 'banking:write', 'legal:root'],
  },
  {
    employeeId: 'emp-marcus',
    name: 'Marcus Chen',
    roleTitle: 'Director of Robotic & CNC Operations',
    status: 'active',
    hiringRequisitionId: 'REQ-OPS-04',
    offerLetterSignedBy: 'ent-human-elena',
    shiftSchedule: {
      maxHoursPerWeek: 40,
      hoursLoggedThisWeek: 38,
      mandatoryRestHoursRemaining: 0,
      employmentLawCompliant: true,
    },
    activeScopeGrants: ['hal:opc_ua:gcode_feed', 'hal:ros2:arm', 'ops:write'],
  },
  {
    employeeId: 'emp-sarah',
    name: 'Sarah Jenkins',
    roleTitle: 'Lead Commercial Inbound Engineer',
    status: 'active',
    hiringRequisitionId: 'REQ-INBOUND-02',
    offerLetterSignedBy: 'ent-human-elena',
    shiftSchedule: {
      maxHoursPerWeek: 40,
      hoursLoggedThisWeek: 31,
      mandatoryRestHoursRemaining: 0,
      employmentLawCompliant: true,
    },
    activeScopeGrants: ['crm:read', 'crm:write', 'inbound:quote'],
  },
];


/**
 * Creates seed hash-chained ledger.
 */
export async function createInitialLedger(): Promise<ProvenanceBlock[]> {
  const blocks: ProvenanceBlock[] = [];
  const genesisPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  // Block #0 - Genesis
  const genesisTime = '2026-09-01T08:00:00.000Z';
  const genesisPayload = {
    action: 'GENESIS_BOOTSTRAP',
    details: {
      constitution: 'Deterministic Governance Kernel Active. Cognition Separated from Authority.',
      governanceRoot: 'Elena Vance, Esq.',
    },
  };
  const genesisAccountability = {
    level1_actingEntityId: 'KERNEL_BOOTSTRAP',
    level2_permissionGrantorId: 'LEGAL_CHARTER_ROOT',
    level3_trainerConfigurerId: 'AOS_CORE_TEAM',
    level3_configDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    level4_legalRootId: 'ent-human-elena',
  };
  const genesisHash = await computeBlockHash(
    0,
    genesisTime,
    genesisPrevHash,
    'PROPOSAL',
    '/v1/overhead',
    genesisPayload,
    genesisAccountability
  );
  blocks.push({
    index: 0,
    timestamp: genesisTime,
    previousHash: genesisPrevHash,
    hash: genesisHash,
    actionType: 'PROPOSAL',
    surface: '/v1/overhead',
    payload: genesisPayload,
    accountability: genesisAccountability,
  });

  // Block #1 - Lead Triage
  const b1Time = '2026-09-12T14:22:10.000Z';
  const b1Payload = {
    taskId: 'task-inbound-842',
    roleId: 'role-lead-triage',
    action: 'INBOUND_QUALIFICATION_COMPLETED',
    details: {
      client: 'Apex Aerostructures Inc.',
      qualifiedBudgetUsd: 48000,
      fitScore: 0.96,
    },
    monetaryAmountUsd: 48000,
    decisionArtifact: {
      question: 'Should lead from Apex Aerostructures be routed to Commercial Aerospace Tier?',
      context: 'Budget $48,000 matches aerospace contract criteria.',
      candidatesEvaluated: 3,
      selectedAction: 'DISPATCH_COMMERCIAL_PROPOSAL',
      policyCheckPassed: true,
      riskScore: 2,
      evidenceRefs: ['crm_lead_ref_482'],
      humanReadableRationale: 'Apex Aerostructures verified against enterprise registry. Low dispute risk.',
    },
  };
  const b1Accountability = {
    level1_actingEntityId: 'ent-agent-apex-planner',
    level2_permissionGrantorId: 'ent-human-elena',
    level3_trainerConfigurerId: 'AOS_SYSTEM_PROMPT_V1_4',
    level3_configDigest: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    level4_legalRootId: 'ent-human-elena',
  };
  const b1Hash = await computeBlockHash(
    1,
    b1Time,
    blocks[0].hash,
    'EXECUTION',
    '/v1/inbound',
    b1Payload,
    b1Accountability
  );
  blocks.push({
    index: 1,
    timestamp: b1Time,
    previousHash: blocks[0].hash,
    hash: b1Hash,
    actionType: 'EXECUTION',
    surface: '/v1/inbound',
    payload: b1Payload,
    accountability: b1Accountability,
  });

  // Block #2 - Vendor Disbursement ($840)
  const b2Time = '2026-09-13T10:15:00.000Z';
  const b2Payload = {
    taskId: 'task-outbound-912',
    roleId: 'role-disbursement-controller',
    action: 'VENDOR_SETTLEMENT_EXECUTED',
    details: {
      vendor: 'Sandvik Coromant CNC Tooling',
      invoiceId: 'INV-2026-9921',
      settlementAmountUsd: 840.0,
      paymentRail: 'FedNow / ACH Same-Day',
    },
    monetaryAmountUsd: 840.0,
    decisionArtifact: {
      question: 'Authorize $840 payment for carbide end mills?',
      context: 'Matching purchase order verified against inventory receipt.',
      candidatesEvaluated: 1,
      selectedAction: 'DISBURSE_SETTLEMENT',
      policyCheckPassed: true,
      riskScore: 2,
      evidenceRefs: ['po_4091', 'receipt_8812'],
      humanReadableRationale: 'Automated 3-way match verified. Early payment discount captured.',
    },
  };
  const b2Accountability = {
    level1_actingEntityId: 'ent-script-reconciler',
    level2_permissionGrantorId: 'ent-human-elena',
    level3_trainerConfigurerId: 'FINANCE_ENG_COMMIT_4821',
    level3_configDigest: '1b85293014a371695273943a57710e21ee2d993f7c131f32841d4995ecf100c2',
    level4_legalRootId: 'ent-human-elena',
  };
  const b2Hash = await computeBlockHash(
    2,
    b2Time,
    blocks[1].hash,
    'MONEY_MOVEMENT',
    '/v1/outbound',
    b2Payload,
    b2Accountability
  );
  blocks.push({
    index: 2,
    timestamp: b2Time,
    previousHash: blocks[1].hash,
    hash: b2Hash,
    actionType: 'MONEY_MOVEMENT',
    surface: '/v1/outbound',
    payload: b2Payload,
    accountability: b2Accountability,
  });

  // Block #3 - HAL Physical Machining
  const b3Time = '2026-09-14T09:00:00.000Z';
  const b3Payload = {
    taskId: 'task-ops-machining-04',
    roleId: 'role-cnc-machining',
    action: 'HAL_CNC_CYCLE_EXECUTED',
    details: {
      partNumber: 'AERO-FLANGE-4102',
      quantity: 12,
      spindleRunTimeMinutes: 44,
      halProtocol: 'OPC-UA',
    },
    decisionArtifact: {
      question: 'Actuate Haas VF-2 spindle for titanium batch?',
      context: 'Physical action. G-code validated against safety bounds.',
      candidatesEvaluated: 2,
      selectedAction: 'EXECUTE_MILLING_CYCLE',
      policyCheckPassed: true,
      riskScore: 3,
      evidenceRefs: ['gcode_hash_491', 'safety_interlock_telemetry'],
      humanReadableRationale: 'Physical safety bounds verified. Risk floor tier 3 authorized under HITL protocol.',
    },
  };
  const b3Accountability = {
    level1_actingEntityId: 'ent-machine-haas-vf2',
    level2_permissionGrantorId: 'ent-human-elena',
    level3_trainerConfigurerId: 'HAAS_FACTORY_OUTLET_WEST',
    level3_configDigest: '4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5',
    level4_legalRootId: 'ent-human-elena',
  };
  const b3Hash = await computeBlockHash(
    3,
    b3Time,
    blocks[2].hash,
    'EXECUTION',
    '/v1/ops',
    b3Payload,
    b3Accountability
  );
  blocks.push({
    index: 3,
    timestamp: b3Time,
    previousHash: blocks[2].hash,
    hash: b3Hash,
    actionType: 'EXECUTION',
    surface: '/v1/ops',
    payload: b3Payload,
    accountability: b3Accountability,
  });

  return blocks;
}
