import React from 'react';
import {
  Wrench,
  Radio,
  Cpu,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Activity,
  CheckCircle2,
  XCircle,
  Thermometer,
  Gauge,
} from 'lucide-react';
import { HalDevice } from '../types/aos';

interface HalWorkforceViewProps {
  devices: HalDevice[];
  onToggleEStop: (deviceId: string) => void;
}

export const HalWorkforceView: React.FC<HalWorkforceViewProps> = ({
  devices,
  onToggleEStop,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
          <Wrench className="h-5 w-5 text-indigo-400" />
          <span>Hardware Abstraction Layer (HAL) Physical Workforce</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Robots, CNCs, and industrial systems registered as first-class 4-Axis entities under deterministic governance.
        </p>

        {/* Physical Risk Floor Banner */}
        <div className="mt-3 p-3 rounded-lg border border-indigo-900/60 bg-indigo-950/20 text-xs font-mono text-indigo-200 flex items-center gap-2.5">
          <ShieldAlert className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>
            <strong>Mandatory Physical Risk Floor:</strong> Irreversible physical effects can never score below Risk Tier 3. Execution requires HITL or formally verified HOFL with hardware kill-switch interlocks.
          </span>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {devices.map((device) => {
          const isEStop = device.status === 'e_stop';
          return (
            <div
              key={device.deviceId}
              className={`rounded-xl border p-5 flex flex-col justify-between space-y-4 transition-all ${
                isEStop
                  ? 'border-rose-500 bg-rose-950/20 shadow-lg'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-xs font-bold">
                    {device.protocol} Bridge
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isEStop
                        ? 'bg-rose-500 text-slate-950'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {isEStop ? 'EMERGENCY STOPPED' : 'ONLINE & GATED'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">{device.name}</h3>
                <div className="text-[11px] font-mono text-slate-400 truncate">
                  Binding: {device.topicOrNode}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                  Entity Ref: {device.entityId}
                </div>
              </div>

              {/* Telemetry Grid */}
              <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/60 grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                    <Gauge className="h-3 w-3" />
                    <span>Spindle / Axis Load</span>
                  </div>
                  <span className="text-sm font-bold text-slate-200">
                    {device.telemetry.loadPercentage.toFixed(1)}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                    <Thermometer className="h-3 w-3" />
                    <span>Core Temp</span>
                  </div>
                  <span className="text-sm font-bold text-slate-200">
                    {device.telemetry.temperatureCelsius.toFixed(1)} °C
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">Error Count</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {device.telemetry.errorCount}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">HAL Ping</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {device.telemetry.lastPingMs} ms
                  </span>
                </div>
              </div>

              {/* Governance & E-Stop Toggle */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] font-mono text-slate-400">
                  Risk Floor: <strong className="text-amber-400">Tier {device.physicalRiskFloor}</strong>
                </div>

                <button
                  onClick={() => onToggleEStop(device.deviceId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    isEStop
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                  }`}
                >
                  {isEStop ? 'Release E-Stop' : 'ACTUATE E-STOP'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* HAL Architectural Guarantees */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
        <h2 className="text-sm font-semibold text-slate-200 font-mono uppercase">
          HAL Execution Invariants (Section 11)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 font-sans">
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/40">
            <strong className="text-indigo-400 block font-mono mb-1">01. Executors, Never Authorities</strong>
            Bridges consume kernel-issued authorization tokens, validate signatures, execute, and sign results. Bridges cannot originate actions or self-approve.
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/40">
            <strong className="text-indigo-400 block font-mono mb-1">02. Contract Parity</strong>
            A robot holding a role has the exact same schemas and performance specs as a human or agent holding it. The bidding engine treats all candidates identically.
          </div>
          <div className="p-3 rounded-lg border border-slate-800 bg-slate-950/40">
            <strong className="text-indigo-400 block font-mono mb-1">03. Local Real-Time Safety</strong>
            Hard real-time collision interlocks, emergency stops, and hardware torque limits live directly inside the device controller. The kernel governs authorization, not millisecond physics.
          </div>
        </div>
      </div>
    </div>
  );
};
