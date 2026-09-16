import React from 'react';
import type { SimulationState } from '../types';
import {
  SectionHeader,
  Panel,
  TechnicalBadge,
  ProbabilityBar,
} from '../components/UIComponents';

interface EigenAnalysisPageProps {
  state: SimulationState;
}

const EigenVectorDisplay: React.FC<{
  label: string;
  eigenvalue: number;
  vector: [number, number];
  isPrimary?: boolean;
}> = ({ label, eigenvalue, vector, isPrimary }) => (
  <div
    className={`bg-[#080b12] border rounded-sm p-4 flex flex-col gap-3 ${
      isPrimary ? 'border-cyan-400/30' : 'border-[#0d1f3c]'
    }`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-[10px] tracking-[0.2em] font-medium ${isPrimary ? 'text-cyan-400' : 'text-slate-500'}`}>
        {label}
      </span>
      {isPrimary && <TechnicalBadge variant="cyan">DOMINANT</TechnicalBadge>}
    </div>

    <div className="flex items-center gap-4">
      <div>
        <span className="text-[9px] text-slate-600">λ =</span>
        <div
          className={`font-mono text-xl mt-0.5 ${isPrimary ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          {eigenvalue.toFixed(4)}
        </div>
      </div>

      <div>
        <span className="text-[9px] text-slate-600">|v⟩ =</span>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-lg text-slate-500">⎡</span>
          <div className="font-mono text-sm grid grid-rows-2 gap-y-1 px-1">
            <span className="text-slate-300 tabular-nums">{vector[0].toFixed(4)}</span>
            <span className="text-slate-300 tabular-nums">{vector[1].toFixed(4)}</span>
          </div>
          <span className="text-lg text-slate-500">⎤</span>
        </div>
      </div>
    </div>

    <div className="text-xs text-slate-600 font-mono">
      |v|² = {(vector[0] ** 2 + vector[1] ** 2).toFixed(4)}
    </div>
  </div>
);

// Vector arrow diagram
const VectorDiagram: React.FC<{ vec: [number, number]; label: string }> = ({ vec, label }) => {
  const cx = 80;
  const cy = 80;
  const scale = 55;
  const vx = vec[0] * scale;
  const vy = vec[1] * scale;

  return (
    <svg width="160" height="160" aria-label={`Eigenvector diagram: ${label}`}>
      {/* Grid */}
      <line x1={cx} y1={10} x2={cx} y2={150} stroke="#1a2744" strokeWidth="1" />
      <line x1={10} y1={cy} x2={150} y2={cy} stroke="#1a2744" strokeWidth="1" />

      {/* Axis labels */}
      <text x={153} y={cy + 4} fontSize="8" fill="#374151" fontFamily="monospace">Soft</text>
      <text x={cx - 8} y={8} fontSize="8" fill="#374151" fontFamily="monospace">Stiff</text>

      {/* Unit circle */}
      <circle cx={cx} cy={cy} r={scale} stroke="#0d1f3c" strokeWidth="1" fill="none" />

      {/* Eigenvector arrow */}
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill="#00d4ff" />
        </marker>
      </defs>
      <line
        x1={cx}
        y1={cy}
        x2={cx + vx}
        y2={cy - vy}
        stroke="#00d4ff"
        strokeWidth="2"
        markerEnd="url(#arrowhead)"
      />

      {/* Component lines */}
      <line
        x1={cx + vx}
        y1={cy}
        x2={cx + vx}
        y2={cy - vy}
        stroke="#0d1f3c"
        strokeWidth="1"
        strokeDasharray="3,3"
      />
      <line
        x1={cx}
        y1={cy - vy}
        x2={cx + vx}
        y2={cy - vy}
        stroke="#0d1f3c"
        strokeWidth="1"
        strokeDasharray="3,3"
      />

      {/* Endpoint dot */}
      <circle cx={cx + vx} cy={cy - vy} r="3" fill="#00d4ff" />

      {/* Label */}
      <text
        x={cx + vx + 4}
        y={cy - vy - 4}
        fontSize="8"
        fill="#00d4ff"
        fontFamily="monospace"
      >
        {label}
      </text>
    </svg>
  );
};

export const EigenAnalysisPage: React.FC<EigenAnalysisPageProps> = ({ state }) => {
  const { eigen, eigenContribs } = state;
  const { lambda1, lambda2, vec1, vec2 } = eigen;
  const { roadExcitation, vibration, damping } = eigenContribs;

  // Ensure contributions sum to 100
  const total = roadExcitation + vibration + damping || 100;
  const normRoad = Math.round((roadExcitation / total) * 100);
  const normVib = Math.round((vibration / total) * 100);
  const normDamp = 100 - normRoad - normVib;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="SPECTRAL ANALYSIS"
          title="Suspension Eigen-Mode Analysis"
          subtitle="Eigenvalue decomposition of the Hermitian suspension operator reveals the principal response directions."
        />

        {/* Equation */}
        <div className="bg-[#080b12] border border-[#0d1f3c] border-t-2 border-t-cyan-400/40 rounded-sm p-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="font-mono text-lg text-slate-400">
              A|v⟩ = <span className="text-cyan-400">λ</span>|v⟩
            </div>
            <div className="flex gap-3 text-xs text-slate-500 flex-wrap">
              <span>A = suspension operator</span>
              <span className="text-slate-700">|</span>
              <span>|v⟩ = eigenvector</span>
              <span className="text-slate-700">|</span>
              <span>λ = eigenvalue</span>
            </div>
          </div>
        </div>

        {/* Eigenvalues & Eigenvectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EigenVectorDisplay
            label="DOMINANT MODE"
            eigenvalue={lambda1}
            vector={vec1}
            isPrimary
          />
          <EigenVectorDisplay
            label="SECONDARY MODE"
            eigenvalue={lambda2}
            vector={vec2}
          />
        </div>

        {/* Formulas */}
        <Panel title="EIGENVALUE CALCULATION" accent="none">
          <div className="p-4 font-mono text-xs text-slate-500 space-y-2">
            <p>For A = [a b; b d]:</p>
            <p className="text-slate-400">
              λ₁,₂ = (a+d ± √((a−d)² + 4b²)) / 2
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <span className="text-slate-600">λ₁ = </span>
                <span className="text-cyan-400">{lambda1.toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-600">λ₂ = </span>
                <span className="text-slate-400">{lambda2.toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-600">Trace: </span>
                <span className="text-slate-400">{(lambda1 + lambda2).toFixed(5)}</span>
              </div>
              <div>
                <span className="text-slate-600">Det: </span>
                <span className="text-slate-400">{(lambda1 * lambda2).toFixed(5)}</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Dominant mode contribution + diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Panel title="DOMINANT MODE CONTRIBUTION" accent="cyan">
            <div className="p-5 flex flex-col gap-4">
              <p className="text-xs text-slate-500">
                Breakdown of the dominant eigenmode along physical parameters:
              </p>
              <ProbabilityBar
                label="ROAD EXCITATION"
                value={normRoad / 100}
                color="cyan"
              />
              <ProbabilityBar
                label="VIBRATION COUPLING"
                value={normVib / 100}
                color="violet"
              />
              <ProbabilityBar
                label="DAMPING RESPONSE"
                value={normDamp / 100}
                color="green"
              />
            </div>
          </Panel>

          <Panel title="EIGENVECTOR DIAGRAM" accent="violet">
            <div className="p-4 flex flex-col items-center gap-3">
              <VectorDiagram vec={vec1} label="|v₁⟩" />
              <p className="text-[9px] text-slate-600 text-center">
                Dominant eigenvector |v₁⟩ in the Soft–Stiff state space
              </p>
            </div>
          </Panel>
        </div>

        {/* Explanation */}
        <div className="bg-black/20 rounded px-4 py-4 border-l-2 border-cyan-400/30">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-cyan-400 font-medium">Dominant eigenmode:</span>{' '}
            The dominant eigenmode represents the principal direction of the modeled suspension response.
            A larger λ₁ indicates higher overall stress in the system. The eigenvector components
            indicate the relative contribution of soft vs stiff response in the dominant mode.
            Since A is a real symmetric matrix (Hermitian over ℝ), all eigenvalues are guaranteed to be real.
          </p>
        </div>
      </div>
    </div>
  );
};
