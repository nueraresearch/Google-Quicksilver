import React, { useState } from 'react';
import {
  Shield,
  Layers,
  FileCode,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  User,
  Bot,
  Wrench,
  Cog,
  FileText,
} from 'lucide-react';
import {
  Entity,
  RoleInterface,
  CircuitBreakerRule,
  EntityType,
  OversightState,
} from '../types/aos';

interface KernelConsoleProps {
  entities: Entity[];
  roles: RoleInterface[];
  circuitBreakers: CircuitBreakerRule[];
  onUpdateEntityOversight: (entityId: string, state: OversightState) => void;
  onTripBreaker: (breakerId: string) => void;
}

export const KernelConsole: React.FC<KernelConsoleProps> = ({
  entities,
  roles,
  circuitBreakers,
  onUpdateEntityOversight,
  onTripBreaker,
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>(entities[0]?.entityId || '');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.roleId || '');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'entities' | 'roles' | 'breakers'>('entities');

  const selectedEntity = entities.find((e) => e.entityId === selectedEntityId) || entities[0];
  const selectedRole = roles.find((r) => r.roleId === selectedRoleId) || roles[0];

  const filteredEntities = entities.filter(
    (e) => entityTypeFilter === 'all' || e.entityType === entityTypeFilter
  );

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'human':
        return <User className="h-4 w-4 text-emerald-400" />;
      case 'ai_agent':
        return <Bot className="h-4 w-4 text-cyan-400" />;
      case 'robot':
        return <Wrench className="h-4 w-4 text-indigo-400" />;
      case 'machine':
        return <Cog className="h-4 w-4 text-amber-400" />;
      case 'script':
      case 'service':
        return <FileCode className="h-4 w-4 text-purple-400" />;
      default:
        return <Layers className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span>Deterministic AOS Governance Kernel</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Ring 0 Execution Authority · Sole Gatekeeper · No LLM in Ring 0
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'entities'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            4-Axis Entity Profiles
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'roles'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Role Contracts (Schemas)
          </button>
          <button
            onClick={() => setActiveTab('breakers')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'breakers'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Circuit Breaker Engine
          </button>
        </div>
      </div>

      {/* 1. 4-Axis Entity Profiles View */}
      {activeTab === 'entities' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Entity List / Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 font-mono uppercase">
                Registered Entities ({filteredEntities.length})
              </span>
              <select
                value={entityTypeFilter}
                onChange={(e) => setEntityTypeFilter(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Types</option>
                <option value="human">Humans</option>
                <option value="ai_agent">AI Agents</option>
                <option value="robot">Robots (ROS2)</option>
                <option value="machine">Machines (OPC-UA)</option>
                <option value="script">Scripts</option>
              </select>
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredEntities.map((entity) => (
                <div
                  key={entity.entityId}
                  onClick={() => setSelectedEntityId(entity.entityId)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedEntity.entityId === entity.entityId
                      ? 'border-cyan-500/80 bg-cyan-950/20 shadow-sm'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEntityIcon(entity.entityType)}
                      <span className="text-xs font-semibold text-slate-200">{entity.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        entity.oversightState === 'HITL'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                          : entity.oversightState === 'HOTL'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                      }`}
                    >
                      {entity.oversightState}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>{entity.department}</span>
                    <span className="capitalize">{entity.entityType}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Axis Profile Inspector */}
          {selectedEntity && (
            <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
              {/* Header & Oversight Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    {getEntityIcon(selectedEntity.entityType)}
                    <h2 className="text-base font-semibold text-white">{selectedEntity.name}</h2>
                    <span className="text-xs text-slate-400 font-mono">({selectedEntity.entityId})</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Reports to: <strong className="text-slate-200">{selectedEntity.reportsTo}</strong> · Status:{' '}
                    <span className="text-emerald-400 uppercase font-bold">{selectedEntity.status}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Oversight State:</span>
                  <div className="flex rounded-md border border-slate-800 bg-slate-950 p-0.5 text-xs font-mono">
                    {(['HITL', 'HOTL', 'HOFL'] as OversightState[]).map((state) => (
                      <button
                        key={state}
                        onClick={() => onUpdateEntityOversight(selectedEntity.entityId, state)}
                        className={`px-2.5 py-1 rounded transition-colors ${
                          selectedEntity.oversightState === state
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* The 4 Axes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Axis 1: Capability */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-cyan-400 font-mono font-semibold">
                    <span>Axis 1: Capability</span>
                    <span className="text-slate-400 text-[11px]">
                      {selectedEntity.axes.capability.maxThroughputPerHr}/hr throughput
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[11px] font-mono">Registered Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedEntity.axes.capability.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
                    <div>
                      Runtime Config:{' '}
                      <span className="text-slate-200">
                        {selectedEntity.axes.capability.runtimeConfig.model ||
                          selectedEntity.axes.capability.runtimeConfig.hardwareSpecs ||
                          selectedEntity.axes.capability.runtimeConfig.credentialsRef ||
                          'Standard Runtime'}
                      </span>
                    </div>
                    {selectedEntity.axes.capability.runtimeConfig.firmwareVersion && (
                      <div>
                        Firmware:{' '}
                        <span className="text-slate-200">
                          {selectedEntity.axes.capability.runtimeConfig.firmwareVersion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Axis 2: Access & Scopes */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-indigo-400 font-mono font-semibold">
                    <span>Axis 2: Access & Clearance</span>
                    <span className="text-slate-300 uppercase px-2 py-0.5 rounded bg-slate-800 text-[10px]">
                      {selectedEntity.axes.access.clearanceLevel}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-400 text-[11px] font-mono">Granted Permission Scopes:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedEntity.axes.access.scopes.map((scope) => (
                        <span
                          key={scope}
                          className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40 text-indigo-300 font-mono text-[11px]"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic pt-2 border-t border-slate-800/80">
                    Scope breaches trigger immediate kernel fail-closed. No model or bridge holds wildcard scopes except Elena Vance.
                  </p>
                </div>

                {/* Axis 3: Personality */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="flex items-center justify-between text-amber-400 font-mono font-semibold">
                    <span>Axis 3: Personality & Risk</span>
                    <span className="text-slate-300 capitalize text-[11px]">
                      Mode: {selectedEntity.axes.personality.operatingMode}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Risk Tolerance Index:</span>
                      <span className="text-slate-200 font-bold">
                        {selectedEntity.axes.personality.riskTolerance.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${selectedEntity.axes.personality.riskTolerance * 100}%` }}
                      />
                    </div>
                  </div>

                  {selectedEntity.axes.personality.tone && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      Tone Persona: <span className="text-slate-200">{selectedEntity.axes.personality.tone}</span>
                    </div>
                  )}
                </div>

                {/* Axis 4: 4-Level Accountability */}
                <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                  <div className="text-rose-400 font-mono font-semibold">
                    Axis 4: 4-Level Accountability Chain
                  </div>

                  <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
                    <div>
                      Level 2 Grantor:{' '}
                      <span className="text-slate-200">
                        {selectedEntity.axes.accountability.permissionGrantorId}
                      </span>
                    </div>
                    <div>
                      Level 3 Trainer:{' '}
                      <span className="text-slate-200">
                        {selectedEntity.axes.accountability.trainerConfigurerId}
                      </span>
                    </div>
                    <div className="truncate">
                      Config Digest:{' '}
                      <span className="text-cyan-400 text-[10px]">
                        {selectedEntity.axes.accountability.configDigest.substring(0, 16)}...
                      </span>
                    </div>
                    <div>
                      Level 4 Legal Root:{' '}
                      <span className="text-emerald-400 font-semibold">
                        {selectedEntity.axes.accountability.legalRootId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Measured Cost & Risk Profiles */}
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
                <h3 className="text-xs font-semibold text-slate-300 font-mono uppercase mb-3">
                  Measured Performance & Cost Telemetry
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block">Reputation Score</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {(selectedEntity.riskProfile.reputationScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dispute Rate</span>
                    <span className="text-lg font-bold text-slate-200">
                      {(selectedEntity.riskProfile.disputeRate * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Compute / Task</span>
                    <span className="text-lg font-bold text-cyan-400">
                      ${selectedEntity.costProfile.computePerTaskUsd.toFixed(3)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hourly Rate / Deprec.</span>
                    <span className="text-lg font-bold text-slate-200">
                      ${(selectedEntity.costProfile.hourlyRateUsd || selectedEntity.costProfile.depreciationRatePerHourUsd).toFixed(2)}/hr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Role Computational Contracts View */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles Selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-300 font-mono uppercase block mb-2">
              Role Interfaces ({roles.length})
            </span>
            {roles.map((role) => (
              <div
                key={role.roleId}
                onClick={() => setSelectedRoleId(role.roleId)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedRole.roleId === role.roleId
                    ? 'border-cyan-500 bg-cyan-950/20'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">{role.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {role.surface}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">v{role.version}</div>
              </div>
            ))}
          </div>

          {/* Role Contract Detail Inspector */}
          {selectedRole && (
            <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-white">{selectedRole.name}</h2>
                  <span className="text-xs font-mono text-slate-400">v{selectedRole.version}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedRole.description}</p>
                <div className="text-[11px] font-mono text-cyan-400 mt-2 truncate">
                  SHA-256 Digest: {selectedRole.digest}
                </div>
              </div>

              {/* SLA & Requirements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-500 block">Max SLA Latency</span>
                  <span className="text-base font-bold text-slate-200">
                    {selectedRole.performanceSpecs.maxLatencyMs} ms
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-500 block">Max Cost / Task</span>
                  <span className="text-base font-bold text-slate-200">
                    ${selectedRole.performanceSpecs.maxCostPerTask.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60">
                  <span className="text-slate-500 block">Min Required Accuracy</span>
                  <span className="text-base font-bold text-emerald-400">
                    {(selectedRole.performanceSpecs.minAccuracy * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Pre-Execution & Post-Execution Schemas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
                    <span>Pre-Execution inputSchema</span>
                    <span className="text-[10px] text-slate-500">Fail Closed</span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedRole.inputSchema, null, 2)}
                  </pre>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-semibold">
                    <span>Post-Execution outputSchema</span>
                    <span className="text-[10px] text-slate-500">Validated</span>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/60 p-2.5 rounded border border-slate-800 overflow-x-auto max-h-48">
                    {JSON.stringify(selectedRole.outputSchema, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Scopes */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-1">
                  Required Authority Scopes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRole.requiredPermissions.map((perm) => (
                    <span
                      key={perm}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Circuit Breaker Engine */}
      {activeTab === 'breakers' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase mb-1">
              Active Policy Circuit Breakers
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Versioned policy documents govern thresholds. Breakers demote HOFL/HOTL → HITL instantly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {circuitBreakers.map((cb) => (
                <div
                  key={cb.id}
                  className={`rounded-lg border p-4 text-xs space-y-3 transition-colors ${
                    cb.isTripped
                      ? 'border-rose-500 bg-rose-950/20'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 text-sm">{cb.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        cb.isTripped ? 'bg-rose-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {cb.isTripped ? 'TRIPPED' : 'CLEAR'}
                    </span>
                  </div>

                  <p className="text-slate-400">{cb.actionOnTrip}</p>

                  <div className="font-mono text-[11px] text-slate-400 flex justify-between border-t border-slate-800/80 pt-2">
                    <span>
                      Current: <strong className="text-slate-200">{cb.currentValue}</strong> {cb.unit}
                    </span>
                    <span>
                      Cap: <strong className="text-slate-200">{cb.threshold}</strong>
                    </span>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => onTripBreaker(cb.id)}
                      className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                        cb.isTripped
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      {cb.isTripped ? 'Reset Breaker' : 'Trigger Fail-Closed Trip'}
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
