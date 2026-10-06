import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ShieldAlert,
  FileText,
  DollarSign,
  CheckCircle2,
  XCircle,
  Briefcase,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { HumanEmployeeRecord } from '../types/aos';

interface HumanOpsViewProps {
  employees: HumanEmployeeRecord[];
  onOffboardEmployee: (employeeId: string) => void;
  onApproveOfferLetter: (candidateName: string, roleTitle: string) => void;
  onDisbursePayroll: (amountUsd: number) => void;
}

export const HumanOpsView: React.FC<HumanOpsViewProps> = ({
  employees,
  onOffboardEmployee,
  onApproveOfferLetter,
  onDisbursePayroll,
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string>(employees[0]?.employeeId || '');
  const [candidateName, setCandidateName] = useState<string>('Alex Rivera');
  const [candidateRole, setCandidateRole] = useState<string>('Senior CNC Metrologist');
  const [shiftViolationSimulated, setShiftViolationSimulated] = useState<boolean>(false);

  const selectedEmp = employees.find((e) => e.employeeId === selectedEmpId) || employees[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-400" />
          <span>Human Lifecycle Operations & HR Governance (Section 18)</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Employment mechanics connected to the deterministic kernel: illegal assignments, wage violations, and unauthorized terminations are structurally un-authorizable.
        </p>

        {/* Invariant Banner */}
        <div className="mt-3 p-3 rounded-lg border border-emerald-900/60 bg-emerald-950/20 text-xs font-mono text-emerald-200 flex items-center gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Employment-Law Coexistence:</strong> Working-time rules, mandatory rest periods, and overtime limits are enforced directly at Kernel Ring 0. The bidding engine can never assign an illegal shift.
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Employee Roster */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
          <span className="text-xs font-semibold text-slate-300 font-mono uppercase block">
            Human Workforce ({employees.length})
          </span>

          <div className="space-y-2">
            {employees.map((emp) => (
              <div
                key={emp.employeeId}
                onClick={() => setSelectedEmpId(emp.employeeId)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedEmp.employeeId === emp.employeeId
                    ? 'border-emerald-500 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-slate-200">{emp.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      emp.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {emp.status.toUpperCase()}
                  </span>
                </div>

                <div className="text-xs text-slate-400 mt-1">{emp.roleTitle}</div>
                <div className="text-[10px] font-mono text-slate-500 mt-2 flex justify-between">
                  <span>Logged: {emp.shiftSchedule.hoursLoggedThisWeek}h / {emp.shiftSchedule.maxHoursPerWeek}h</span>
                  <span>{emp.activeScopeGrants.length} Scopes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Employee Detail & Governance Controls */}
        {selectedEmp && (
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">{selectedEmp.name}</h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedEmp.roleTitle} · ID: {selectedEmp.employeeId} · Requisition: {selectedEmp.hiringRequisitionId}
                </div>
              </div>

              {selectedEmp.status === 'active' && selectedEmp.employeeId !== 'emp-elena' && (
                <button
                  onClick={() => onOffboardEmployee(selectedEmp.employeeId)}
                  className="px-3 py-1.5 rounded-lg border border-rose-800 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
                >
                  <UserX className="h-3.5 w-3.5" />
                  <span>Execute Governed Offboarding</span>
                </button>
              )}
            </div>

            {/* Shift & Working Time Compliance Card */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-400" />
                  <span>Working-Time & Shift Policy Verification</span>
                </span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>LEGAL INVARIANTS PASS</span>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Weekly Logged</span>
                  <span className="text-slate-200 font-bold text-sm">
                    {selectedEmp.shiftSchedule.hoursLoggedThisWeek} hrs
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Statutory Cap</span>
                  <span className="text-slate-200 font-bold text-sm">
                    {selectedEmp.shiftSchedule.maxHoursPerWeek} hrs
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Rest Periods</span>
                  <span className="text-emerald-400 font-bold text-sm">Compliant</span>
                </div>
              </div>

              {/* Shift violation simulation */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-sans">
                  Test kernel response to an overtime/rest-period breach assignment:
                </span>
                <button
                  onClick={() => setShiftViolationSimulated(!shiftViolationSimulated)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[10px]"
                >
                  {shiftViolationSimulated ? 'Clear Violation' : 'Simulate Illegal Shift'}
                </button>
              </div>

              {shiftViolationSimulated && (
                <div className="p-3 rounded-lg border border-rose-500 bg-rose-950/40 text-rose-200 text-xs flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>FAIL CLOSED: Kernel Refused Assignment!</strong>
                    <p className="text-[11px] font-mono mt-0.5 text-rose-300">
                      Policy Rule #EMP-LAW-04: Mandatory rest period violated (requires 11 consecutive hours). Bidding engine dispatch aborted without side-effects.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Active Scope Grants */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block">
                Active Authority Scopes (Revoked automatically upon offboarding):
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {selectedEmp.activeScopeGrants.map((sc) => (
                  <span
                    key={sc}
                    className="px-2 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800"
                  >
                    {sc}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hiring Pipeline & Offer Letter Approval (Section 18.1) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-300 font-semibold">
            <Briefcase className="h-4 w-4 text-cyan-400" />
            <span>Hiring Pipeline: Exact-Action Offer Approval (18.1)</span>
          </div>

          <p className="text-xs text-slate-400 font-sans">
            AI agents source and screen candidates; offer letters are exact-action human approvals with separation of duties. Candidate becomes an entity only upon acceptance.
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <label className="text-slate-500 text-[10px] block mb-1">Candidate Name</label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
            <div>
              <label className="text-slate-500 text-[10px] block mb-1">Role Title</label>
              <input
                type="text"
                value={candidateRole}
                onChange={(e) => setCandidateRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => onApproveOfferLetter(candidateName, candidateRole)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="h-4 w-4" />
              <span>Sign Offer Letter (Elena Vance, Legal Root)</span>
            </button>
          </div>
        </div>

        {/* Governed Payroll Disbursement (Section 18.4) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-300 font-semibold">
              <DollarSign className="h-4 w-4 text-cyan-400" />
              <span>Governed Payroll Flow (Section 18.4)</span>
            </div>

            <p className="text-xs text-slate-400 font-sans mt-2">
              Compensation flows through the cryptographic money ledger. Agents validate timecards and flag anomalies; disbursement requires human-only authority.
            </p>

            <div className="mt-4 p-3 rounded-lg border border-slate-800 bg-slate-950 text-xs font-mono space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Bi-Weekly Payroll Batch</span>
                <span className="text-slate-200 font-bold">$14,250.00 USD</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Timecard Anomaly Checks</span>
                <span className="text-emerald-400 font-bold">100% Passed</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-800">
            <button
              onClick={() => onDisbursePayroll(14250)}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors"
            >
              Authorize Payroll Disbursement ($14,250)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
