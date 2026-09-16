import React from 'react';
import { RefreshCw, CheckCircle, Cpu, Waves, Zap } from 'lucide-react';
import type { SimulationInputs, SimulationState } from '../types';
import {
  MetricCard,
  ModeBadge,
  ProbabilityBar,
  SensorSlider,
  TechnicalBadge,
  StateVectorDisplay,
} from '../components/UIComponents';
import { SuspensionVisualization } from '../components/SuspensionVisualization';

interface DashboardProps {
  inputs: SimulationInputs;
  state: SimulationState;
  onInputChange: (key: keyof SimulationInputs, value: number) => void;
  onReset: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  inputs,
  state,
  onInputChange,
  onReset,
}) => {
  const healthVariant =
    state.health >= 0.75 ? 'good' : state.health >= 0.5 ? 'default' : state.health >= 0.25 ? 'warn' : 'bad';
  const riskVariant =
    state.vibrationRisk < 0.3 ? 'good' : state.vibrationRisk < 0.6 ? 'warn' : 'bad';
  const stabilityVariant =
    state.stability >= 0.75 ? 'good' : state.stability >= 0.5 ? 'default' : 'warn';

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      {/* ── Enhanced Top Header ─────────────────────────────────── */}
      <div className="border-b border-[#0d1f3c] shrink-0 relative overflow-hidden">
        {/* Subtle scan line animation */}
        <div
          className="scan-line absolute top-0 left-0 w-1/3 h-full pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.04), transparent)' }}
        />

        <div className="px-6 py-4 flex items-start justify-between gap-4 relative">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-[9px] tracking-[0.4em] text-cyan-400/60 font-medium">
                QUANTUM-INSPIRED VEHICLE DYNAMICS
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-cyan-400/20 to-transparent max-w-32 hidden sm:block" />
            </div>
            <h1 className="text-xl font-semibold text-slate-100 tracking-tight">
              MR Adaptive Suspension Monitor
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Interactive simulation of adaptive damping using state vectors,
              linear operators and probabilistic response analysis.
            </p>
            {/* Quick status strip */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Cpu size={10} className="text-cyan-400/60" />
                <span className="text-[9px] text-slate-600">
                  STRESS: <span className="font-mono text-cyan-400">{(state.stress * 100).toFixed(1)}%</span>
                </span>
              </div>
              <div className="w-px h-3 bg-[#0d1f3c]" />
              <div className="flex items-center gap-1.5">
                <Waves size={10} className="text-violet-400/60" />
                <span className="text-[9px] text-slate-600">
                  α={' '}<span className="font-mono text-cyan-400">{state.alpha.toFixed(3)}</span>
                  {' '}β={' '}<span className="font-mono text-violet-400">{state.beta.toFixed(3)}</span>
                </span>
              </div>
              <div className="w-px h-3 bg-[#0d1f3c]" />
              <div className="flex items-center gap-1.5">
                <Zap size={10} className="text-orange-400/60" />
                <span className="text-[9px] text-slate-600">
                  λ₁={' '}<span className="font-mono text-orange-400">{state.eigen.lambda1.toFixed(3)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* System Info Panel */}
          <div className="shrink-0 bg-[#060911] border border-[#0d1f3c] rounded-sm p-3 text-right hidden md:block min-w-44">
            <div className="text-[8px] tracking-[0.25em] text-slate-600 mb-2.5 border-b border-[#0d1f3c] pb-1.5">
              SYSTEM INFO
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[9px] text-left">
              <span className="text-slate-600">SYSTEM</span>
              <span className="text-slate-400 font-mono">MR Adaptive</span>
              <span className="text-slate-600">MODEL</span>
              <span className="text-slate-400 font-mono">2×2 Hermitian</span>
              <span className="text-slate-600">BASIS</span>
              <span className="text-cyan-400/80 font-mono">|Soft⟩, |Stiff⟩</span>
              <span className="text-slate-600">NORM</span>
              <span className="text-green-400 font-mono">
                {(state.alpha ** 2 + state.beta ** 2).toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
        {/* ── LEFT: Sensor Controls ──────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#0d1f3c]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] tracking-[0.2em] text-slate-500 font-medium">
                  VEHICLE INPUTS
                </span>
                <div
                  className="live-dot w-1.5 h-1.5 rounded-full bg-green-400"
                  aria-label="Live simulation active"
                />
              </div>
              <button
                onClick={onReset}
                className="flex items-center gap-1.5 text-[10px] text-slate-500 hover:text-cyan-400 transition-colors px-2 py-1 rounded border border-[#1a2744] hover:border-cyan-400/30 focus:outline-none focus:ring-1 focus:ring-cyan-400/40"
                aria-label="Reset simulation to default values"
              >
                <RefreshCw size={10} />
                RESET
              </button>
            </div>

            <div className="p-4 flex flex-col gap-5">
              <SensorSlider
                label="ROAD ROUGHNESS"
                description="Severity of road surface disturbance (0 = smooth, 100 = severe)"
                value={inputs.roadRoughness}
                min={0}
                max={100}
                onChange={(v) => onInputChange('roadRoughness', v)}
                tooltip="Higher roughness → higher stress → larger β (stiff amplitude)"
              />
              <SensorSlider
                label="VEHICLE SPEED"
                description="Vehicle speed affecting suspension excitation frequency"
                value={inputs.vehicleSpeed}
                min={0}
                max={150}
                unit=" km/h"
                onChange={(v) => onInputChange('vehicleSpeed', v)}
                tooltip="Higher speed → more dynamic excitation → reduced stability"
              />
              <SensorSlider
                label="VEHICLE LOAD"
                description="Relative vehicle load affecting suspension response"
                value={inputs.vehicleLoad}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => onInputChange('vehicleLoad', v)}
                tooltip="Higher load → larger A₁₁ matrix element → shifts eigenvalues"
              />
              <SensorSlider
                label="VIBRATION AMPLITUDE"
                description="Measured vertical vibration level"
                value={inputs.vibrationAmplitude}
                min={0}
                max={100}
                onChange={(v) => onInputChange('vibrationAmplitude', v)}
                tooltip="Controls suspension animation and off-diagonal coupling term A₁₂"
              />
              <SensorSlider
                label="MAGNETIC FIELD"
                description="MR damper control field — adjusts fluid viscosity"
                value={inputs.magneticField}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => onInputChange('magneticField', v)}
                tooltip="Higher field → stronger MR damping → contributes to A₂₂"
              />
              <SensorSlider
                label="DAMPING CONTROL"
                description="Desired adaptive damping setpoint"
                value={inputs.dampingControl}
                min={0}
                max={100}
                unit="%"
                onChange={(v) => onInputChange('dampingControl', v)}
                tooltip="Higher damping → lower stress → larger α (soft amplitude)"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Main Dashboard Content ──────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Status metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricCard
              label="SUSPENSION HEALTH"
              value={`${(state.health * 100).toFixed(1)}`}
              unit="%"
              variant={healthVariant}
              tooltip="Composite health score from road, vibration, damping and load"
            />
            <MetricCard
              label="VIBRATION RISK"
              value={`${(state.vibrationRisk * 100).toFixed(1)}`}
              unit="%"
              variant={riskVariant}
              tooltip="Risk level from road + vibration minus damping compensation"
            />
            <MetricCard
              label="STABILITY INDEX"
              value={state.stability.toFixed(3)}
              variant={stabilityVariant}
              tooltip="Higher stability = smoother, better-controlled suspension"
            />
            <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm p-4 flex flex-col gap-1 hover:border-[#1e3a5f] transition-colors">
              <p className="text-[9px] tracking-[0.25em] text-slate-600 font-medium">CURRENT MODE</p>
              <div className="mt-2">
                <ModeBadge mode={state.mode} large />
              </div>
            </div>
          </div>

          {/* Suspension visualization + Quantum state */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Suspension diagram */}
            <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm">
              <div className="px-4 py-3 border-b border-[#0d1f3c] flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-slate-500 font-medium">
                  ADAPTIVE SUSPENSION VISUALIZATION
                </span>
                <TechnicalBadge variant="green">
                  <span className="live-dot w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  LIVE
                </TechnicalBadge>
              </div>
              <div className="p-4 flex flex-col items-center gap-3">
                <SuspensionVisualization
                  vibrationAmplitude={inputs.vibrationAmplitude}
                  roadRoughness={inputs.roadRoughness}
                  dampingControl={inputs.dampingControl}
                  magneticField={inputs.magneticField}
                />
                {/* Quick legend */}
                <div className="flex gap-4 text-[8px] text-slate-600 flex-wrap justify-center">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-[#1e40af] inline-block" />
                    SPRING
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-cyan-400/60 inline-block" />
                    MR DAMPER
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-0.5 bg-[#374151] inline-block" />
                    TIRE
                  </span>
                </div>
              </div>
            </div>

            {/* Quantum state */}
            <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm">
              <div className="px-4 py-3 border-b border-[#0d1f3c] flex items-center justify-between">
                <span className="text-[10px] tracking-[0.2em] text-slate-500 font-medium">
                  QUANTUM-INSPIRED STATE
                </span>
                <TechnicalBadge variant="violet">NORMALIZED</TechnicalBadge>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {/* State equation */}
                <div className="bg-black/20 rounded px-3 py-2.5 border border-[#0d1f3c]">
                  <p className="font-mono text-sm text-slate-400">
                    |ψ⟩ ={' '}
                    <span className="text-cyan-400">α</span>|Soft⟩ +{' '}
                    <span className="text-violet-400">β</span>|Stiff⟩
                  </p>
                </div>

                {/* Probability bars */}
                <div className="flex flex-col gap-3">
                  <ProbabilityBar
                    label="SOFT RESPONSE — P(Soft) = |α|²"
                    value={state.softProb}
                    color="cyan"
                    tooltip="Probability suspension behaves in soft/comfortable mode"
                  />
                  <ProbabilityBar
                    label="STIFF RESPONSE — P(Stiff) = |β|²"
                    value={state.stiffProb}
                    color="violet"
                    tooltip="Probability suspension behaves in stiff/firm mode"
                  />
                </div>

                {/* State vector + values */}
                <div className="flex items-start gap-5 pt-1">
                  <StateVectorDisplay alpha={state.alpha} beta={state.beta} />
                  <div className="flex flex-col gap-2 mt-1 flex-1">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-xs">
                      <span className="text-slate-600">α =</span>
                      <span className="text-cyan-400 tabular-nums">{state.alpha.toFixed(5)}</span>
                      <span className="text-slate-600">β =</span>
                      <span className="text-violet-400 tabular-nums">{state.beta.toFixed(5)}</span>
                      <span className="text-slate-600">|α|² =</span>
                      <span className="text-slate-400 tabular-nums">{state.softProb.toFixed(5)}</span>
                      <span className="text-slate-600">|β|² =</span>
                      <span className="text-slate-400 tabular-nums">{state.stiffProb.toFixed(5)}</span>
                    </div>
                    <div className="border-t border-[#0d1f3c] pt-2">
                      <div className="font-mono text-xs text-slate-500">
                        |α|² + |β|² ={' '}
                        <span className="text-green-400">
                          {(state.alpha ** 2 + state.beta ** 2).toFixed(6)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <CheckCircle size={11} className="text-green-400" />
                        <span className="text-[9px] tracking-[0.1em] text-green-400">
                          NORMALIZED STATE ✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
