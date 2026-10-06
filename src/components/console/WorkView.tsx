import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Activity,
  Gavel,
  Database,
  Wrench,
  Shield,
  Layers,
  ArrowRight,
  User,
  Bot,
  Cog,
  FileCode,
} from 'lucide-react';
import { Entity, RoleInterface, EntityType, OversightState } from '../../types/aos';

interface WorkViewProps {
  entities: Entity[];
  roles: RoleInterface[];
  onOpenEntityDetail: (entity: Entity) => void;
  onOpenBidding: () => void;
  onOpenLedger: () => void;
  onOpenHal: () => void;
}

export const WorkView: React.FC<WorkViewProps> = ({
  entities,
  roles,
  onOpenEntityDetail,
  onOpenBidding,
  onOpenLedger,
  onOpenHal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredEntities = entities.filter(
    (e) => filterType === 'all' || e.entityType === filterType
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

  const getStatusChip = (status: string, oversight: OversightState) => {
    if (status === 'degraded') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-800">DEGRADED</span>;
    }
    if (status === 'suspended') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-800">SUSPENDED</span>;
    }
    if (oversight === 'HITL') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">HITL GATED</span>;
    }
    if (oversight === 'HOTL') {
      return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">HOTL ACTIVE</span>;
    }
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">HOFL AUTO</span>;
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-cyan-400" />
            <span>☰ THE ORG GRAPH IN MOTION</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Entity-agnostic workforce: humans, agents, and machines unified under computational contracts
          </p>
        </div>
      </div>

      {/* Quick Access Action Hub (Task Bidding, HAL, Ledger) */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={onOpenBidding}
          className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 text-left transition-colors group"
        >
          <Gavel className="h-4 w-4 text-cyan-400 mb-1.5" />
          <div className="text-xs font-semibold text-slate-200">Task Bidding</div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">Dynamic auction formula</p>
        </button>

        <button
          onClick={onOpenHal}
          className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 text-left transition-colors group"
        >
          <Wrench className="h-4 w-4 text-indigo-400 mb-1.5" />
          <div className="text-xs font-semibold text-slate-200">HAL Physical</div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">ROS2 &amp; OPC-UA bridges</p>
        </button>

        <button
          onClick={onOpenLedger}
          className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-emerald-500/40 text-left transition-colors group"
        >
          <Database className="h-4 w-4 text-emerald-400 mb-1.5" />
          <div className="text-xs font-semibold text-slate-200">Provenance</div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">SHA-256 hash chains</p>
        </button>
      </div>

      {/* Living Org Chart: Entity Roster with Unified Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Unified Workforce Roster ({filteredEntities.length})</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
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

        <div className="space-y-2">
          {filteredEntities.map((entity) => (
            <div
              key={entity.entityId}
              onClick={() => onOpenEntityDetail(entity)}
              className="p-4 rounded-2xl border border-slate-800 bg-slate-900/70 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  {getEntityIcon(entity.entityType)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-200 truncate">{entity.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {entity.department} · Reports to: {entity.reportsTo}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getStatusChip(entity.status, entity.oversightState)}
                <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
