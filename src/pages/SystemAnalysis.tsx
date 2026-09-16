import React from 'react';
import { ArrowDown } from 'lucide-react';
import type { SimulationInputs, SimulationState } from '../types';
import { SectionHeader, Panel, ResponseBadge, ProbabilityBar } from '../components/UIComponents';

interface SystemAnalysisPageProps {
  inputs: SimulationInputs;
  state: SimulationState;
}

const FlowStep: React.FC<{
  label: string;
  sublabel?: string;
  value?: string;
  color?: string;
  isLast?: boolean;
}> = ({ label, sublabel, value, color = 'border-[#0d1f3c]', isLast }) => (
  <div className="flex flex-col items-center">
    <div
      className={`bg-[#080b12] border ${color} rounded-sm px-4 py-2.5 w-full text-center transition-all duration-300`}
    >
      <p className="text-[9px] tracking-[0.2em] text-slate-600 font-medium">{label}</p>
      {sublabel && (
        <p className="font-mono text-xs text-slate-400 mt-0.5">{sublabel}</p>
      )}
      {value && (
        <p className="font-mono text-sm text-cyan-400 mt-0.5">{value}</p>
      )}
    </div>
    {!isLast && (
      <div className="flex flex-col items-center py-1">
        <div className="w-px h-3 bg-[#0d1f3c]" />
        <ArrowDown size={10} className="text-slate-700 flow-pulse" />
        <div className="w-px h-3 bg-[#0d1f3c]" />
      </div>
    )}
  </div>
);

export const SystemAnalysisPage: React.FC<SystemAnalysisPageProps> = ({ inputs, state }) => {
  const roadPct = inputs.roadRoughness;
  const vibPct = inputs.vibrationAmplitude;
  const dampPct = inputs.dampingControl;
  const magPct = inputs.magneticField;
  const speedPct = Math.round((inputs.vehicleSpeed / 150) * 100);
  const loadPct = inputs.vehicleLoad;

  const responseColor = {
    'STABLE': 'border-green-400/30',
    'MONITOR': 'border-orange-400/30',
    'HIGH VIBRATION': 'border-orange-500/30',
    'CRITICAL': 'border-red-400/30',
  }[state.response];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="COMPREHENSIVE OVERVIEW"
          title="System Analysis Summary"
          subtitle="End-to-end view of the quantum-inspired suspension simulation pipeline and current system response."
        />

        {/* Sensor readings */}
        <Panel title="SENSOR INPUT READINGS" accent="cyan">
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            <ProbabilityBar label="ROAD CONDITION" value={roadPct / 100} color="cyan" />
            <ProbabilityBar label="VEHICLE SPEED" value={speedPct / 100} color="cyan" />
            <ProbabilityBar label="VEHICLE LOAD" value={loadPct / 100} color="violet" />
            <ProbabilityBar label="VIBRATION AMPLITUDE" value={vibPct / 100} color="orange" />
            <ProbabilityBar label="MAGNETIC FIELD" value={magPct / 100} color="cyan" />
            <ProbabilityBar label="DAMPING CONTROL" value={dampPct / 100} color="green" />
          </div>
        </Panel>

        {/* System response */}
        <div
          className={`bg-[#080b12] border ${responseColor} border-t-2 rounded-sm p-5 flex flex-col gap-3`}
        >
          <p className="text-[9px] tracking-[0.25em] text-slate-600 font-medium">SYSTEM RESPONSE</p>
          <ResponseBadge response={state.response} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
            <div>
              <p className="text-[9px] text-slate-600">HEALTH</p>
              <p className="font-mono text-sm text-green-400">{(state.health * 100).toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-600">STABILITY</p>
              <p className="font-mono text-sm text-cyan-400">{state.stability.toFixed(3)}</p>
            </div>
            <div>
              <p className="text-[9px] text-slate-600">VIBRATION RISK</p>
              <p className="font-mono text-sm text-orange-400">
                {(state.vibrationRisk * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-[9px] text-slate-600">MODE</p>
              <p className="font-mono text-sm text-slate-300">{state.mode}</p>
            </div>
          </div>
        </div>

        {/* Pipeline flow */}
        <Panel title="SIMULATION PIPELINE" accent="violet">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Inputs */}
              <div className="flex flex-col gap-0">
                <p className="text-[9px] tracking-[0.2em] text-slate-600 mb-3">INPUT LAYER</p>
                <FlowStep
                  label="SENSOR INPUTS"
                  sublabel="Road · Speed · Load · Vibration"
                  color="border-cyan-400/20"
                />
                <FlowStep
                  label="STATE VECTOR"
                  sublabel="|ψ⟩ = α|Soft⟩ + β|Stiff⟩"
                  value={`α=${state.alpha.toFixed(3)}, β=${state.beta.toFixed(3)}`}
                  color="border-violet-400/20"
                />
                <FlowStep
                  label="NORMALIZATION"
                  sublabel="|α|² + |β|² = 1"
                  value="VERIFIED ✓"
                  color="border-green-400/20"
                  isLast
                />
              </div>

              {/* Column 2: Processing */}
              <div className="flex flex-col gap-0">
                <p className="text-[9px] tracking-[0.2em] text-slate-600 mb-3">PROCESSING LAYER</p>
                <FlowStep
                  label="SUSPENSION OPERATOR"
                  sublabel="Hermitian 2×2 Matrix"
                  value={`A₁₁=${state.matrix.a11.toFixed(2)}`}
                  color="border-cyan-400/20"
                />
                <FlowStep
                  label="EIGEN ANALYSIS"
                  sublabel="A|v⟩ = λ|v⟩"
                  value={`λ₁=${state.eigen.lambda1.toFixed(3)}`}
                  color="border-violet-400/20"
                />
                <FlowStep
                  label="TENSOR STATE"
                  sublabel="|ψF⟩ ⊗ |ψR⟩"
                  value={`|SS⟩=${(state.tensor.ss * 100).toFixed(0)}%`}
                  color="border-cyan-400/20"
                  isLast
                />
              </div>

              {/* Column 3: Output */}
              <div className="flex flex-col gap-0">
                <p className="text-[9px] tracking-[0.2em] text-slate-600 mb-3">OUTPUT LAYER</p>
                <FlowStep
                  label="MEASUREMENT"
                  sublabel="Probabilistic collapse"
                  value={`P(S)=${(state.softProb * 100).toFixed(0)}%`}
                  color="border-cyan-400/20"
                />
                <FlowStep
                  label="MODE DETERMINATION"
                  sublabel="SOFT / NORMAL / STIFF / CRITICAL"
                  value={state.mode}
                  color="border-orange-400/20"
                />
                <FlowStep
                  label="ADAPTIVE RESPONSE"
                  sublabel="MR field adjustment"
                  value={state.response}
                  color={
                    state.response === 'STABLE'
                      ? 'border-green-400/30'
                      : state.response === 'CRITICAL'
                      ? 'border-red-400/30'
                      : 'border-orange-400/30'
                  }
                  isLast
                />
              </div>
            </div>
          </div>
        </Panel>

        {/* Current state summary */}
        <Panel title="QUANTUM-INSPIRED STATE SUMMARY" accent="none">
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'STRESS', value: state.stress.toFixed(3) },
              { label: 'α (SOFT)', value: state.alpha.toFixed(4) },
              { label: 'β (STIFF)', value: state.beta.toFixed(4) },
              { label: 'λ₁', value: state.eigen.lambda1.toFixed(4) },
              { label: 'λ₂', value: state.eigen.lambda2.toFixed(4) },
              { label: '⟨ψ|ψ⟩', value: (state.alpha ** 2 + state.beta ** 2).toFixed(4) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-black/20 rounded px-3 py-2">
                <p className="text-[8px] tracking-[0.15em] text-slate-600">{label}</p>
                <p className="font-mono text-sm text-cyan-400 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
};
