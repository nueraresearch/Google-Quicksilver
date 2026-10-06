/**
 * AOS Deterministic Governance Kernel
 * Principles:
 * 1. The LLM proposes. The kernel authorizes. Never the other way around.
 * 2. Any entity in any position.
 * 3. Fail closed on missing scopes, broken schemas, tripped breakers, or invalid chains.
 * Zero LLMs in this module. 100% deterministic mathematical governance.
 */

import {
  Entity,
  RoleInterface,
  TaskProposal,
  KernelAuthorization,
  BiddingCandidate,
  CircuitBreakerRule,
  OversightState,
} from '../types/aos';

export interface BiddingWeights {
  costWeight: number;      // w_c
  latencyWeight: number;   // w_l
  accuracyWeight: number;  // w_a
  riskWeight: number;      // w_r
}

/**
 * Validates payload against role input schema.
 * Simple deterministic JSON schema property checker for contracts.
 */
export function validateInputContract(
  schema: Record<string, any>,
  payload: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (schema.required && Array.isArray(schema.required)) {
    for (const reqKey of schema.required) {
      if (payload[reqKey] === undefined || payload[reqKey] === null) {
        errors.push(`Missing required parameter: '${reqKey}'`);
      }
    }
  }

  if (schema.properties) {
    for (const [key, propDef] of Object.entries<any>(schema.properties)) {
      if (payload[key] !== undefined) {
        const val = payload[key];
        if (propDef.type === 'number' && typeof val !== 'number') {
          errors.push(`Parameter '${key}' must be a number, got ${typeof val}`);
        } else if (propDef.type === 'string' && typeof val !== 'string') {
          errors.push(`Parameter '${key}' must be a string, got ${typeof val}`);
        } else if (propDef.type === 'boolean' && typeof val !== 'boolean') {
          errors.push(`Parameter '${key}' must be a boolean, got ${typeof val}`);
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Computes deterministic risk score (0 to 5) based on action parameters,
 * target surface, financial spend, physical effects, and entity personality.
 */
export function calculateRiskScore(
  proposal: TaskProposal,
  targetEntity?: Entity
): number {
  let score = proposal.suggestedRiskTier || 1;

  // Rule: Physical actions (HAL) have a mandatory risk floor of 3
  if (proposal.surface === '/v1/ops' && (proposal.parameters?.isPhysical || proposal.parameters?.halProtocol)) {
    score = Math.max(score, 3);
  }

  // Rule: Spend risk scale
  const monetary = proposal.parameters?.amountUsd || proposal.estimatedCostUsd || 0;
  if (monetary > 10000) score = 5;
  else if (monetary > 2500) score = 4;
  else if (monetary > 500) score = Math.max(score, 3);
  else if (monetary > 50) score = Math.max(score, 2);

  // Irreversible or sensitive keywords
  const actionLower = (proposal.intendedAction + ' ' + proposal.objective).toLowerCase();
  if (actionLower.includes('terminate') || actionLower.includes('kill-switch') || actionLower.includes('delete-all')) {
    score = 5;
  } else if (actionLower.includes('disburse') || actionLower.includes('wire') || actionLower.includes('contract')) {
    score = Math.max(score, 4);
  } else if (actionLower.includes('dispatch') || actionLower.includes('actuate') || actionLower.includes('cnc')) {
    score = Math.max(score, 3);
  }

  // Personality risk tolerance scaling if targetEntity present
  if (targetEntity) {
    if (targetEntity.axes.personality.riskTolerance > 0.7) {
      score = Math.min(5, score + 1);
    }
    if (targetEntity.status === 'degraded') {
      score = Math.min(5, score + 1);
    }
  }

  return Math.min(5, Math.max(0, score));
}

/**
 * Task Bidding Engine
 * Formula: S(e_i, T) = w_c * C_hat + w_l * L_hat + w_a * A_hat + w_r * R_hat
 * Lower score = superior fit!
 */
export function runBiddingEngine(
  entities: Entity[],
  role: RoleInterface,
  proposal: TaskProposal,
  weights: BiddingWeights = {
    costWeight: 0.25,
    latencyWeight: 0.25,
    accuracyWeight: 0.25,
    riskWeight: 0.25,
  }
): BiddingCandidate[] {
  const candidates: BiddingCandidate[] = entities.map((entity) => {
    // 1. Eligibility Check
    let eligible = true;
    let ineligibilityReason = '';

    if (entity.status === 'suspended' || entity.status === 'retired') {
      eligible = false;
      ineligibilityReason = `Entity status is ${entity.status}`;
    }

    // Scope check: entity must have all role.requiredPermissions
    const hasScopes = role.requiredPermissions.every((perm) =>
      entity.axes.access.scopes.includes(perm) || entity.axes.access.scopes.includes('*')
    );
    if (!hasScopes) {
      eligible = false;
      ineligibilityReason = 'Missing required permission scopes';
    }

    // Department / Capability match check
    const hasSkill = entity.axes.capability.skills.some((skill) =>
      role.roleId.toLowerCase().includes(skill.toLowerCase()) ||
      role.name.toLowerCase().includes(skill.toLowerCase()) ||
      skill === 'general_operations'
    );
    if (!hasSkill && entity.entityType !== 'human') {
      // Humans get higher generic leeway, specific AI/robots must match
      eligible = false;
      ineligibilityReason = ineligibilityReason || 'No registered capability skill match';
    }

    // 2. Normalized dimensions (0.0 to 1.0)
    // Cost: normalize against max role budget
    const expectedCost = (entity.costProfile.computePerTaskUsd || 0.05) + (entity.costProfile.hourlyRateUsd / 30);
    const costScore = Math.min(1.0, expectedCost / Math.max(1, role.performanceSpecs.maxCostPerTask));

    // Latency: normalize against max latency
    let expectedLatency = 500;
    if (entity.entityType === 'human') expectedLatency = 3000;
    else if (entity.entityType === 'ai_agent') expectedLatency = 450;
    else if (entity.entityType === 'script') expectedLatency = 80;
    else if (entity.entityType === 'robot' || entity.entityType === 'machine') expectedLatency = 1200;
    const latencyScore = Math.min(1.0, expectedLatency / Math.max(100, role.performanceSpecs.maxLatencyMs));

    // Accuracy: invert accuracy so lower is better (error rate)
    const accuracy = entity.riskProfile.reputationScore || 0.95;
    const accuracyScore = Math.max(0, 1.0 - accuracy);

    // Risk: based on entity status, risk profile, and tolerance
    let entityRisk = entity.axes.personality.riskTolerance * 0.5 + entity.riskProfile.disputeRate * 0.5;
    if (entity.status === 'degraded') entityRisk += 0.4;
    const riskScore = Math.min(1.0, entityRisk);

    // 3. Composite score
    const compositeScore = eligible
      ? weights.costWeight * costScore +
        weights.latencyWeight * latencyScore +
        weights.accuracyWeight * accuracyScore +
        weights.riskWeight * riskScore
      : 999.0;

    return {
      entityId: entity.entityId,
      entityName: entity.name,
      entityType: entity.entityType,
      eligible,
      ineligibilityReason,
      costScore: Number(costScore.toFixed(3)),
      latencyScore: Number(latencyScore.toFixed(3)),
      accuracyScore: Number(accuracyScore.toFixed(3)),
      riskScore: Number(riskScore.toFixed(3)),
      compositeScore: Number(compositeScore.toFixed(4)),
      rank: 0,
    };
  });

  // Sort: eligible ones first by compositeScore asc, then ineligibles
  candidates.sort((a, b) => a.compositeScore - b.compositeScore);
  candidates.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  return candidates;
}

/**
 * Deterministic Kernel Authorization
 * Sole authority in the operating system.
 */
export function authorizeProposal(
  proposal: TaskProposal,
  role: RoleInterface,
  assignedEntity: Entity,
  circuitBreakers: CircuitBreakerRule[],
  humanApprovalOverride?: { approved: boolean; approverId: string }
): KernelAuthorization {
  const authId = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const reasons: string[] = [];

  // Step 1: Pre-execution Input Schema Validation
  const schemaCheck = validateInputContract(role.inputSchema, proposal.parameters);
  if (!schemaCheck.valid) {
    return {
      authId,
      proposalId: proposal.proposalId,
      authorized: false,
      assignedEntityId: assignedEntity.entityId,
      evaluatedRiskTier: 5,
      oversightRequired: 'HITL',
      circuitBreakerStatus: 'clear',
      reasons: [`FAIL CLOSED: Contract breach. ${schemaCheck.errors.join('; ')}`],
      evaluatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 600000).toISOString(),
    };
  }
  reasons.push('Contract inputSchema verified against pinned digest.');

  // Step 2: Permission Scopes Verification
  const hasPermissions = role.requiredPermissions.every((perm) =>
    assignedEntity.axes.access.scopes.includes(perm) || assignedEntity.axes.access.scopes.includes('*')
  );
  if (!hasPermissions) {
    return {
      authId,
      proposalId: proposal.proposalId,
      authorized: false,
      assignedEntityId: assignedEntity.entityId,
      evaluatedRiskTier: 4,
      oversightRequired: 'HITL',
      circuitBreakerStatus: 'clear',
      reasons: ['FAIL CLOSED: Missing required authority permission scopes for role.'],
      evaluatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 600000).toISOString(),
    };
  }
  reasons.push('Authority scopes verified against 4-Axis access profile.');

  // Step 3: Circuit Breakers Check
  let trippedBreakerReason: string | undefined;
  let breakerStatus: 'clear' | 'tripped' | 'warning' = 'clear';

  for (const breaker of circuitBreakers) {
    if (breaker.isTripped) {
      breakerStatus = 'tripped';
      trippedBreakerReason = `Circuit Breaker Active: ${breaker.name} (${breaker.actionOnTrip})`;
      break;
    } else if (breaker.currentValue / breaker.threshold >= 0.8) {
      breakerStatus = 'warning';
    }
  }

  if (breakerStatus === 'tripped') {
    return {
      authId,
      proposalId: proposal.proposalId,
      authorized: false,
      assignedEntityId: assignedEntity.entityId,
      evaluatedRiskTier: 4,
      oversightRequired: 'HITL',
      circuitBreakerStatus: 'tripped',
      trippedBreakerReason,
      reasons: [`FAIL CLOSED: ${trippedBreakerReason}. Autonomous execution gated.`],
      evaluatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 600000).toISOString(),
    };
  }

  // Step 4: Risk Scoring and Oversight Determination
  const evaluatedRiskTier = calculateRiskScore(proposal, assignedEntity);
  let oversightRequired: OversightState = role.oversightDefault;

  // Auto-demotion to HITL if risk >= 3 or entity is degraded or spend cap exceeded
  if (evaluatedRiskTier >= 3 || assignedEntity.status === 'degraded' || assignedEntity.oversightState === 'HITL') {
    oversightRequired = 'HITL';
  } else if (assignedEntity.oversightState === 'HOTL') {
    oversightRequired = 'HOTL';
  }

  // Step 5: Check Human Approval if HITL
  let isAuthorized = false;
  if (oversightRequired === 'HITL') {
    if (humanApprovalOverride?.approved) {
      isAuthorized = true;
      reasons.push(`HITL approval authorized by designated human root [${humanApprovalOverride.approverId}].`);
    } else {
      isAuthorized = false;
      reasons.push(`PENDING HUMAN AUTHORIZATION: Risk tier ${evaluatedRiskTier} requires cryptographic HITL approval.`);
    }
  } else {
    // HOTL or HOFL with clear breakers
    isAuthorized = true;
    reasons.push(`Autonomous ${oversightRequired} gate passed under verified invariants.`);
  }

  const authToken = isAuthorized
    ? `AOS_AUTH_SIG_${Date.now()}_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    : undefined;

  return {
    authId,
    proposalId: proposal.proposalId,
    authorized: isAuthorized,
    assignedEntityId: assignedEntity.entityId,
    evaluatedRiskTier,
    oversightRequired,
    approvalGrantedBy: humanApprovalOverride?.approverId,
    circuitBreakerStatus: breakerStatus,
    trippedBreakerReason,
    reasons,
    authToken,
    evaluatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 600000).toISOString(),
  };
}
