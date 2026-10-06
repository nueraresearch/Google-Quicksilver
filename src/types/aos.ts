/**
 * AOS (Agentic Operating System) Type System
 * Specifications: Entity-agnostic, 4-Axis model, deterministic governance kernel,
 * cryptographic provenance chain, HAL, memory fabric, and formal verification.
 */

export type EntityType = 
  | 'human' 
  | 'ai_agent' 
  | 'bot' 
  | 'robot' 
  | 'machine' 
  | 'script' 
  | 'service' 
  | 'contractor';

export type EntityStatus = 'active' | 'degraded' | 'suspended' | 'retired';

export type ClearanceLevel = 'public' | 'internal' | 'confidential' | 'restricted';

export type OperatingMode = 'conservative' | 'balanced' | 'aggressive';

export type OversightState = 'HITL' | 'HOTL' | 'HOFL';

export type PlatformOperatingMode = 'Genesis' | 'Onboard' | 'Operate';

export type BusinessSurface = 
  | '/v1/inbound' 
  | '/v1/ops' 
  | '/v1/outbound' 
  | '/v1/support' 
  | '/v1/overhead';

export interface EntityAxes {
  capability: {
    skills: string[];
    maxThroughputPerHr: number;
    runtimeConfig: {
      provider?: string;
      model?: string;
      effortTier?: 'low' | 'medium' | 'high';
      hardwareSpecs?: string;
      firmwareVersion?: string;
      credentialsRef?: string;
    };
  };
  access: {
    scopes: string[]; // e.g. ['erp:read', 'banking:write', 'hal:ros2:arm']
    clearanceLevel: ClearanceLevel;
  };
  personality: {
    riskTolerance: number; // 0.0 - 1.0
    tone?: string;
    operatingMode: OperatingMode;
  };
  accountability: {
    permissionGrantorId: string; // Ref to human or grantor entity
    trainerConfigurerId: string; // Ref to entity that trained/configured
    legalRootId: string; // The legal root person or corporate entity
    configDigest: string; // SHA-256 pinned config hash
  };
}

export interface Entity {
  entityId: string;
  name: string;
  entityType: EntityType;
  status: EntityStatus;
  reportsTo: string; // Any type may manage any type!
  department: string;
  availability: number; // 0.0 - 1.0
  oversightState: OversightState;
  axes: EntityAxes;
  riskProfile: {
    historicalIncidents: number;
    disputeRate: number;
    reputationScore: number; // 0.0 - 1.0
  };
  costProfile: {
    hourlyRateUsd: number;
    computePerTaskUsd: number;
    depreciationRatePerHourUsd: number;
  };
}

export interface RolePerformanceSpecs {
  maxLatencyMs: number;
  maxCostPerTask: number;
  minAccuracy: number;
}

export interface RoleInterface {
  roleId: string;
  name: string;
  version: string;
  digest: string; // SHA-256 hash of the contract
  surface: BusinessSurface;
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  requiredPermissions: string[];
  performanceSpecs: RolePerformanceSpecs;
  oversightDefault: OversightState;
  description: string;
}

export interface TaskProposal {
  proposalId: string;
  objective: string;
  surface: BusinessSurface;
  roleId: string;
  proposingEntityId: string;
  intendedAction: string;
  parameters: Record<string, any>;
  estimatedCostUsd: number;
  estimatedLatencyMs: number;
  claimedAccuracy: number;
  confidence: number;
  rationale: string;
  suggestedRiskTier: number; // 0 to 5
  triggerSource: 'http_api' | 'mcp' | 'signed_webhook' | 'cron' | 'cli' | 'channel';
  timestamp: string;
}

export interface KernelAuthorization {
  authId: string;
  proposalId: string;
  authorized: boolean;
  assignedEntityId: string;
  evaluatedRiskTier: number; // 0 to 5
  oversightRequired: OversightState;
  approvalGrantedBy?: string; // Human ID if HITL
  circuitBreakerStatus: 'clear' | 'tripped' | 'warning';
  trippedBreakerReason?: string;
  reasons: string[];
  authToken?: string; // Cryptographic capability token
  evaluatedAt: string;
  expiresAt: string;
}

export interface BiddingCandidate {
  entityId: string;
  entityName: string;
  entityType: EntityType;
  eligible: boolean;
  ineligibilityReason?: string;
  costScore: number;
  latencyScore: number;
  accuracyScore: number;
  riskScore: number;
  compositeScore: number; // S(e_i, T) = w_c*C + w_l*L + w_a*A + w_r*R
  rank: number;
}

export interface ProvenanceBlock {
  index: number;
  timestamp: string;
  previousHash: string;
  hash: string;
  actionType: 
    | 'PROPOSAL' 
    | 'AUTHORIZATION' 
    | 'EXECUTION' 
    | 'HUMAN_APPROVAL' 
    | 'CIRCUIT_BREAKER_DEMOTION' 
    | 'MEMORY_HANDOFF' 
    | 'MONEY_MOVEMENT' 
    | 'DISPUTE_LOGGED';
  surface: BusinessSurface;
  payload: {
    taskId?: string;
    roleId?: string;
    action: string;
    details: Record<string, any>;
    monetaryAmountUsd?: number;
    decisionArtifact?: {
      question: string;
      context: string;
      candidatesEvaluated: number;
      selectedAction: string;
      policyCheckPassed: boolean;
      riskScore: number;
      evidenceRefs: string[];
      humanReadableRationale: string;
    };
  };
  accountability: {
    level1_actingEntityId: string;
    level2_permissionGrantorId: string;
    level3_trainerConfigurerId: string;
    level3_configDigest: string;
    level4_legalRootId: string;
  };
  isTampered?: boolean;
}

export interface CircuitBreakerRule {
  id: string;
  name: string;
  type: 'financial_velocity' | 'error_spike' | 'anomaly' | 'budget_cap';
  threshold: number;
  unit: string;
  timeWindowSec: number;
  currentValue: number;
  isTripped: boolean;
  actionOnTrip: string;
}

export interface MemoryItem {
  id: string;
  tier: 'episodic' | 'semantic' | 'knowledge_graph';
  key: string;
  summary: string;
  evidenceRef?: string;
  clearanceRequired: ClearanceLevel;
  containsPII: boolean;
  containsSecret: boolean;
  createdAt: string;
  expiresAt?: string;
  supersededById?: string;
}

export interface HalDevice {
  deviceId: string;
  entityId: string;
  name: string;
  protocol: 'ROS2' | 'OPC-UA' | 'MQTT';
  topicOrNode: string;
  status: 'online' | 'busy' | 'e_stop' | 'offline';
  safetyInterlockEngaged: boolean;
  physicalRiskFloor: number; // Always >= 3
  telemetry: {
    loadPercentage: number;
    temperatureCelsius: number;
    errorCount: number;
    lastPingMs: number;
  };
}

export interface FormalInvariantResult {
  invariantId: string;
  name: string;
  type: 'Safety' | 'Liveness' | 'Budget' | 'Accountability';
  formalStatement: string;
  status: 'VERIFIED' | 'VIOLATED' | 'IN_SHADOW';
  proofDetails: string;
  shadowRunsEvaluated: number;
  passRate: number;
}

export interface DisputeIncident {
  disputeId: string;
  title: string;
  date: string;
  blockIndex: number;
  surface: BusinessSurface;
  claimedDamageUsd: number;
  status: 'COMPUTED' | 'HUMAN_REVIEW' | 'SETTLED';
  attributionShares: {
    level1_actingEntityShare: number; // %
    level2_grantorShare: number;      // %
    level3_trainerShare: number;      // %
    level4_legalRootShare: number;    // %
  };
  findings: string;
}

export type GoalAltitude = 'daily' | 'weekly' | 'shortTerm' | 'longTerm';

export type GoalStatus = 
  | 'draft' 
  | 'active' 
  | 'onTrack' 
  | 'atRisk' 
  | 'blocked' 
  | 'achieved' 
  | 'missed' 
  | 'superseded';

export type GoalOriginationSource =
  | 'intent_ledger'
  | 'strategy_analysis'
  | 'function_telemetry'
  | 'circuit_breakers'
  | 'workforce_reports'
  | 'financial_state'
  | 'external_signals'
  | 'prior_goal_history';

export interface Goal {
  goalId: string;
  version: string;
  digest: string;
  altitude: GoalAltitude;
  statement: string;
  parentGoalId?: string;
  childGoalIds: string[];
  target: {
    metric: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    deadline: string;
  };
  decomposition: 'automatic' | 'human_approved' | 'hybrid';
  status: GoalStatus;
  budgetUsd: number;
  assignedEntityId?: string;
  evidenceRefs: string[];
  achievedAt?: string;
  deviationReason?: string;
}

export interface GoalCandidate {
  candidateId: string;
  statement: string;
  source: GoalOriginationSource;
  evidenceSummary: string;
  proposedAltitude: GoalAltitude;
  intentAlignment: number; // I(g) 0-1
  urgency: number;         // U(g) 0-1
  feasibility: number;     // Feas(g) 0-1
  dependencyOverlap: number; // Dep(g) 0-1
  priorityScore: number;   // P(g) = I * U * Feas * (1 - Dep)
}

export interface BreakGlassSession {
  active: boolean;
  emergencyOfficerId: string;
  activatedAt?: string;
  expiresAt?: string;
  disbursementCapUsd: number;
  bufferedEvents: {
    id: string;
    action: string;
    amountUsd?: number;
    timestamp: string;
    ratified: boolean;
  }[];
}

export interface AssuranceGrant {
  grantId: string;
  auditorName: string;
  organization: string;
  role: 'External Auditor' | 'Regulatory Agency' | 'Actuarial Insurer';
  clearanceScope: 'PROVENANCE_LEDGER_READONLY' | 'DISPUTE_ACTUARIAL_READONLY';
  expiresAt: string;
  legalHoldActive: boolean;
  ledgerToken: string;
}

export interface InterOrgTransaction {
  transactionId: string;
  counterpartyOrg: string;
  contractRef: string;
  action: 'CONTRACT_OFFER' | 'PURCHASE_ORDER' | 'SETTLEMENT_INVOICE' | 'DELIVERY_RECEIPT';
  amountUsd?: number;
  localBlockIndex: number;
  counterpartyBlockRef: string;
  verifiedKernelToKernel: boolean;
  timestamp: string;
}

export interface HumanEmployeeRecord {
  employeeId: string;
  name: string;
  roleTitle: string;
  status: 'active' | 'onboarding' | 'offboarding' | 'terminated';
  hiringRequisitionId: string;
  offerLetterSignedBy: string;
  shiftSchedule: {
    maxHoursPerWeek: number;
    hoursLoggedThisWeek: number;
    mandatoryRestHoursRemaining: number;
    employmentLawCompliant: boolean;
  };
  activeScopeGrants: string[];
}

export interface AOSState {
  operatingMode: PlatformOperatingMode;
  entities: Entity[];
  roles: RoleInterface[];
  ledger: ProvenanceBlock[];
  circuitBreakers: CircuitBreakerRule[];
  memories: MemoryItem[];
  halDevices: HalDevice[];
  invariants: FormalInvariantResult[];
  disputes: DisputeIncident[];
  goals: Goal[];
  goalCandidates: GoalCandidate[];
  breakGlass: BreakGlassSession;
  assuranceGrants: AssuranceGrant[];
  interOrgTransactions: InterOrgTransaction[];
  employees: HumanEmployeeRecord[];
  isChainTampered: boolean;
}


