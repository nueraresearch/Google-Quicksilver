import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, User, Target, Database, Wrench, Shield, Zap } from 'lucide-react';
import { Entity, Goal, RoleInterface } from '../../types/aos';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  entities: Entity[];
  goals: Goal[];
  roles: RoleInterface[];
  onSelectEntity: (entity: Entity) => void;
  onSelectGoal: (goalId: string) => void;
  onSelectRole: (role: RoleInterface) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  entities,
  goals,
  roles,
  onSelectEntity,
  onSelectGoal,
  onSelectRole,
}) => {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const matchingEntities = entities.filter(
    (e) => e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.entityType.includes(q)
  );

  const matchingGoals = goals.filter(
    (g) => g.statement.toLowerCase().includes(q) || g.target.metric.toLowerCase().includes(q)
  );

  const matchingRoles = roles.filter(
    (r) => r.name.toLowerCase().includes(q) || r.surface.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950/80">
          <Search className="h-4 w-4 text-slate-400 mr-2.5 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search entities, goals, role contracts, policies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
          />
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 text-xs space-y-3 font-mono">
          {matchingEntities.length > 0 && (
            <div>
              <span className="text-[10px] text-slate-500 uppercase px-2 py-1 block">Workforce Entities</span>
              {matchingEntities.slice(0, 3).map((e) => (
                <div
                  key={e.entityId}
                  onClick={() => {
                    onSelectEntity(e);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5 text-cyan-400" />
                    <span className="text-slate-200">{e.name}</span>
                    <span className="text-[10px] text-slate-500">({e.entityType})</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {matchingGoals.length > 0 && (
            <div>
              <span className="text-[10px] text-slate-500 uppercase px-2 py-1 block">Goals & Milestones</span>
              {matchingGoals.slice(0, 3).map((g) => (
                <div
                  key={g.goalId}
                  onClick={() => {
                    onSelectGoal(g.goalId);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-slate-200 truncate max-w-sm">{g.statement}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {matchingRoles.length > 0 && (
            <div>
              <span className="text-[10px] text-slate-500 uppercase px-2 py-1 block">Role Contracts</span>
              {matchingRoles.slice(0, 3).map((r) => (
                <div
                  key={r.roleId}
                  onClick={() => {
                    onSelectRole(r);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-slate-200">{r.name}</span>
                    <span className="text-[10px] text-cyan-400">{r.surface}</span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-slate-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
