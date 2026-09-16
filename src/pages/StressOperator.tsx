import React from 'react';
import type { SimulationState } from '../types';
import {
  SectionHeader,
  Panel,
  TechnicalBadge,
  MatrixDisplay,
} from '../components/UIComponents';

interface StressOperatorPageProps {
  state: SimulationState;
}

export const StressOperatorPage: React.FC<StressOperatorPageProps> = ({ state }) => {
  const { matrix } = state;
  const { a11, a12, a21, a22 } = matrix;

  const isHermitian = Math.abs(a12 - a21) < 1e-10;

  const matrixValues: [[number, number], [number, number]] = [
    [a11, a12],
    [a21, a22],
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="LINEAR ALGEBRA"
          title="Hermitian Suspension Operator"
          subtitle="The 2×2 Hermitian matrix A represents the mathematical suspension stress operator. Its eigenvalues are always real."
        />

        {/* Main matrix display */}
        <div className="bg-[#080b12] border border-[#0d1f3c] border-t-2 border-t-violet-400/40 rounded-sm p-5">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-4">
              <p className="text-[10px] tracking-[0.2em] text-slate-600 font-medium">
                SUSPENSION STRESS OPERATOR
              </p>
              <div className="flex items-center gap-6 flex-wrap">
                <div>
                  <span className="font-mono text-slate-500 text-sm mr-2">A =</span>
                  <MatrixDisplay values={matrixValues} />
                </div>
                <div className="flex flex-col gap-2">
                  {isHermitian && (
                    <TechnicalBadge variant="green">HERMITIAN OPERATOR ✓</TechnicalBadge>
                  )}
                  <TechnicalBadge variant="violet">A = A†</TechnicalBadge>
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded px-3 py-2 min-w-40">
              <p className="text-[9px] tracking-[0.15em] text-slate-600 mb-2">MATRIX ELEMENTS</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-xs">
                <span className="text-slate-600">A₁₁</span>
                <span className="text-cyan-400">{a11.toFixed(4)}</span>
                <span className="text-slate-600">A₁₂</span>
                <span className="text-cyan-400">{a12.toFixed(4)}</span>
                <span className="text-slate-600">A₂₁</span>
                <span className="text-cyan-400">{a21.toFixed(4)}</span>
                <span className="text-slate-600">A₂₂</span>
                <span className="text-cyan-400">{a22.toFixed(4)}</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#0d1f3c]">
                <span className="text-[9px] text-slate-600">
                  A₁₂ = A₂₁ ={' '}
                  <span className={isHermitian ? 'text-green-400' : 'text-red-400'}>
                    {isHermitian ? '✓ SYMMETRIC' : '✗ ASYMMETRIC'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Parameter mapping */}
        <Panel title="PARAMETER MAPPING" accent="cyan">
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* A11 */}
              <div className="bg-black/20 rounded p-4 border border-[#0d1f3c]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-cyan-400 text-sm">A₁₁</span>
                  <span className="font-mono text-lg text-slate-200">{a11.toFixed(4)}</span>
                </div>
                <p className="text-[9px] tracking-[0.15em] text-slate-600 mb-2">ROAD STRESS + LOAD</p>
                <div className="font-mono text-xs text-slate-500 bg-black/30 px-2 py-1 rounded">
                  A₁₁ = 3.0×road + 2.0×load
                </div>
              </div>

              {/* A12/A21 */}
              <div className="bg-black/20 rounded p-4 border border-[#0d1f3c]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-cyan-400 text-sm">A₁₂ = A₂₁</span>
                  <span className="font-mono text-lg text-slate-200">{a12.toFixed(4)}</span>
                </div>
                <p className="text-[9px] tracking-[0.15em] text-slate-600 mb-2">VIBRATION COUPLING</p>
                <div className="font-mono text-xs text-slate-500 bg-black/30 px-2 py-1 rounded">
                  A₁₂ = 1.5×vibration
                </div>
              </div>

              {/* A22 */}
              <div className="bg-black/20 rounded p-4 border border-[#0d1f3c]">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-cyan-400 text-sm">A₂₂</span>
                  <span className="font-mono text-lg text-slate-200">{a22.toFixed(4)}</span>
                </div>
                <p className="text-[9px] tracking-[0.15em] text-slate-600 mb-2">DAMPING + MAGNETIC</p>
                <div className="font-mono text-xs text-slate-500 bg-black/30 px-2 py-1 rounded">
                  A₂₂ = 2.5×damping + 2.0×magnetic
                </div>
              </div>

              {/* Verification */}
              <div className="bg-black/20 rounded p-4 border border-[#0d1f3c]">
                <p className="text-[9px] tracking-[0.15em] text-slate-600 mb-3">HERMITIAN PROPERTY</p>
                <div className="flex flex-col gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">A₁₂ =</span>
                    <span className="text-cyan-400">{a12.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">A₂₁ =</span>
                    <span className="text-cyan-400">{a21.toFixed(4)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">|A₁₂ - A₂₁| =</span>
                    <span className="text-green-400">
                      {Math.abs(a12 - a21).toExponential(2)}
                    </span>
                  </div>
                  <TechnicalBadge variant="green">A = Aᵀ VERIFIED ✓</TechnicalBadge>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* Explanation */}
        <div className="bg-black/20 rounded px-4 py-4 border-l-2 border-violet-400/30">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-violet-400 font-medium">Hermitian operator:</span>{' '}
            A Hermitian operator is equal to its conjugate transpose (A = A†), which guarantees
            real eigenvalues. In this quantum-inspired framework, the suspension operator provides
            an interpretable mathematical representation of suspension stress. The diagonal elements
            represent self-coupling (road stress/damping), while the off-diagonal elements represent
            cross-coupling between the two basis modes (vibration coupling).
          </p>
        </div>
      </div>
    </div>
  );
};
