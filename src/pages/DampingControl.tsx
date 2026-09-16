import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { SimulationInputs, SimulationState } from '../types';
import {
  SectionHeader,
  Panel,
  ModeBadge,
} from '../components/UIComponents';

interface DampingControlPageProps {
  inputs: SimulationInputs;
  state: SimulationState;
}

const ModeButton: React.FC<{
  label: string;
  active: boolean;
  color: string;
}> = ({ label, active, color }) => (
  <div
    className={`flex-1 py-3 text-center rounded-sm border text-xs font-mono font-bold tracking-widest transition-all duration-200
      ${active ? `${color} glow-cyan-sm` : 'bg-transparent text-slate-600 border-[#1a2744]'}`}
  >
    {label}
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm px-3 py-2">
        <p className="text-[9px] text-slate-500 mb-1">t = {label}s</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="font-mono text-xs" style={{ color: entry.color }}>
            {entry.name === 'without' ? 'Without: ' : 'With MR: '}
            {entry.value?.toFixed(2)} mm
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const DampingControlPage: React.FC<DampingControlPageProps> = ({ inputs, state }) => {
  const { mode } = state;

  const magneticPct = inputs.magneticField;
  const dampPct = inputs.dampingControl;

  const mrFluidResponse =
    magneticPct < 25 ? 'LOW' : magneticPct < 55 ? 'MODERATE' : magneticPct < 80 ? 'HIGH' : 'MAXIMUM';
  const dampingForce =
    dampPct < 25 ? 'LOW' : dampPct < 55 ? 'MODERATE' : dampPct < 80 ? 'HIGH' : 'MAXIMUM';

  const activeMode = mode === 'CRITICAL' ? 'STIFF' : mode;
  const chartData = state.dampingChart.filter((_, i) => i % 2 === 0); // thin out for perf

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="MR FLUID DYNAMICS"
          title="Adaptive MR Damping Control"
          subtitle="Visualization of magnetorheological damping response under current control parameters."
        />

        {/* Magnetic Field Intensity */}
        <Panel title="MAGNETIC FIELD INTENSITY" accent="cyan">
          <div className="p-5 flex flex-col gap-5">
            {/* Field bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-slate-600">0%</span>
                <span className="font-mono text-lg text-cyan-400">
                  {inputs.magneticField}%
                </span>
                <span className="text-[9px] text-slate-600">100%</span>
              </div>
              <div className="h-3 bg-[#0d1626] rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${inputs.magneticField}%`,
                    background: `linear-gradient(90deg, #1d4ed8, #00d4ff)`,
                  }}
                />
                {/* Thumb indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-cyan-400 glow-cyan"
                  style={{ left: `calc(${inputs.magneticField}% - 6px)` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[8px] text-slate-600">WEAK FIELD</span>
                <span className="text-[8px] text-slate-600">STRONG FIELD</span>
              </div>
            </div>

            {/* Response indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/20 rounded px-4 py-3">
                <p className="text-[9px] tracking-[0.15em] text-slate-600 mb-2">MR FLUID RESPONSE</p>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-slate-600">LOW</span>
                  <div className="flex-1 mx-2 h-1 bg-[#0d1626] rounded-full">
                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${inputs.magneticField}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-600">HIGH</span>
                </div>
                <p className="font-mono text-sm text-cyan-400 mt-2">{mrFluidResponse}</p>
              </div>

              <div className="bg-black/20 rounded px-4 py-3">
                <p className="text-[9px] tracking-[0.15em] text-slate-600 mb-2">DAMPING FORCE</p>
                <div className="flex items-center justify-between">
                  <span className="text-[8px] text-slate-600">LOW</span>
                  <div className="flex-1 mx-2 h-1 bg-[#0d1626] rounded-full">
                    <div
                      className="h-full bg-violet-400 rounded-full transition-all duration-500"
                      style={{ width: `${inputs.dampingControl}%` }}
                    />
                  </div>
                  <span className="text-[8px] text-slate-600">HIGH</span>
                </div>
                <p className="font-mono text-sm text-violet-400 mt-2">{dampingForce}</p>
              </div>
            </div>
          </div>
        </Panel>

        {/* Mode selector */}
        <Panel title="DAMPING MODE" accent="none">
          <div className="p-4 flex flex-col gap-3">
            <div className="flex gap-2">
              <ModeButton
                label="SOFT"
                active={activeMode === 'SOFT'}
                color="bg-green-400/10 text-green-400 border-green-400/30"
              />
              <ModeButton
                label="NORMAL"
                active={activeMode === 'NORMAL'}
                color="bg-cyan-400/10 text-cyan-400 border-cyan-400/30"
              />
              <ModeButton
                label="STIFF"
                active={activeMode === 'STIFF'}
                color="bg-orange-400/10 text-orange-400 border-orange-400/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Active Mode:</span>
              <ModeBadge mode={mode} />
            </div>
          </div>
        </Panel>

        {/* Chart */}
        <Panel title="SUSPENSION DISPLACEMENT — TIME DOMAIN" accent="cyan">
          <div className="p-4">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0d1f3c" />
                  <XAxis
                    dataKey="t"
                    stroke="#374151"
                    tick={{ fill: '#4b5563', fontSize: 9 }}
                    label={{ value: 'Time (s)', position: 'insideBottom', fill: '#4b5563', fontSize: 9, dy: 10 }}
                  />
                  <YAxis
                    stroke="#374151"
                    tick={{ fill: '#4b5563', fontSize: 9 }}
                    label={{ value: 'Displacement (mm)', angle: -90, position: 'insideLeft', fill: '#4b5563', fontSize: 9 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '10px', color: '#6b7280' }}
                    formatter={(value) =>
                      value === 'without' ? 'Without Adaptive Damping' : 'With MR Adaptive Damping'
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="without"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="4 2"
                    isAnimationActive={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="with"
                    stroke="#00d4ff"
                    strokeWidth={1.5}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 bg-black/20 rounded px-3 py-2 border-l-2 border-cyan-400/30">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-cyan-400 font-medium">MR Damper principle:</span>{' '}
                In an MR damper, changing the magnetic field changes the effective damping behavior
                of the magnetorheological fluid. This interface visualizes that relationship conceptually.
                Higher magnetic field intensity → higher apparent viscosity → stronger damping force.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
