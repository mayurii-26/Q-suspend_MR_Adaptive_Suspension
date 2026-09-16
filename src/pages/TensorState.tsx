import React from 'react';
import type { SimulationState } from '../types';
import {
  SectionHeader,
  Panel,
  StateVectorDisplay,
} from '../components/UIComponents';

interface TensorStatePageProps {
  state: SimulationState;
}

const ProbCell: React.FC<{ value: number; highlight?: boolean }> = ({ value, highlight }) => {
  const pct = Math.round(value * 100);
  const barColor = pct > 40 ? '#00d4ff' : pct > 20 ? '#8b5cf6' : '#374151';

  return (
    <div
      className={`p-3 text-center rounded border transition-all duration-500 ${
        highlight ? 'border-cyan-400/30 bg-cyan-400/5' : 'border-[#0d1f3c] bg-black/20'
      }`}
    >
      <div
        className="font-mono text-lg"
        style={{ color: barColor }}
      >
        {pct}%
      </div>
      <div className="h-1 bg-[#0d1626] rounded-full mt-1.5">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

export const TensorStatePage: React.FC<TensorStatePageProps> = ({ state }) => {
  const { front, rear, tensor } = state;
  const { ss, sh, hs, hh } = tensor;

  const totalProb = ss + sh + hs + hh;
  const pAtLeastOneStiff = sh + hs + hh;
  const pBothSoft = ss;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="COMPOSITE STATE SPACE"
          title="Front + Rear Joint Suspension State"
          subtitle="The tensor product combines front and rear suspension state spaces into a composite four-dimensional state."
        />

        {/* Equation */}
        <div className="bg-[#080b12] border border-[#0d1f3c] border-t-2 border-t-violet-400/40 rounded-sm p-5">
          <div className="font-mono text-lg text-slate-400 mb-2">
            |ψ<sub>Vehicle</sub>⟩ = |ψ<sub>F</sub>⟩ ⊗ |ψ<sub>R</sub>⟩
          </div>
          <p className="text-xs text-slate-500">
            The joint state of the vehicle is the tensor product of the individual front and rear suspension states.
          </p>
        </div>

        {/* Front and Rear states */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Panel title="FRONT SUSPENSION — |ψF⟩" accent="cyan">
            <div className="p-5 flex flex-col gap-4">
              <div className="font-mono text-sm text-slate-400">
                |ψF⟩ = <span className="text-cyan-400">{front.alpha.toFixed(4)}</span>|Soft⟩ +{' '}
                <span className="text-violet-400">{front.beta.toFixed(4)}</span>|Stiff⟩
              </div>
              <div className="flex items-center gap-6">
                <StateVectorDisplay alpha={front.alpha} beta={front.beta} />
                <div className="flex flex-col gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">P(Soft) = </span>
                    <span className="text-cyan-400">{(front.alpha ** 2 * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">P(Stiff) = </span>
                    <span className="text-violet-400">{(front.beta ** 2 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-600">
                Front suspension sees ~10% higher road roughness and ~10% lower load.
              </p>
            </div>
          </Panel>

          <Panel title="REAR SUSPENSION — |ψR⟩" accent="violet">
            <div className="p-5 flex flex-col gap-4">
              <div className="font-mono text-sm text-slate-400">
                |ψR⟩ = <span className="text-cyan-400">{rear.alpha.toFixed(4)}</span>|Soft⟩ +{' '}
                <span className="text-violet-400">{rear.beta.toFixed(4)}</span>|Stiff⟩
              </div>
              <div className="flex items-center gap-6">
                <StateVectorDisplay alpha={rear.alpha} beta={rear.beta} />
                <div className="flex flex-col gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-500">P(Soft) = </span>
                    <span className="text-cyan-400">{(rear.alpha ** 2 * 100).toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">P(Stiff) = </span>
                    <span className="text-violet-400">{(rear.beta ** 2 * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <p className="text-[9px] text-slate-600">
                Rear suspension sees ~10% lower road roughness and ~10% higher load.
              </p>
            </div>
          </Panel>
        </div>

        {/* Tensor product formula */}
        <Panel title="TENSOR PRODUCT EXPANSION" accent="cyan">
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="font-mono text-xs text-slate-500 space-y-2">
                <p>|ψF⟩ ⊗ |ψR⟩ =</p>
                <p className="text-slate-400">
                  [ αF·αR ] = <span className="text-cyan-400">{(front.alpha * rear.alpha).toFixed(4)}</span>
                </p>
                <p className="text-slate-400">
                  [ αF·βR ] = <span className="text-slate-300">{(front.alpha * rear.beta).toFixed(4)}</span>
                </p>
                <p className="text-slate-400">
                  [ βF·αR ] = <span className="text-slate-300">{(front.beta * rear.alpha).toFixed(4)}</span>
                </p>
                <p className="text-slate-400">
                  [ βF·βR ] = <span className="text-violet-400">{(front.beta * rear.beta).toFixed(4)}</span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-black/20 p-2 rounded border border-[#0d1f3c]">
                    <span className="text-slate-600">|SS⟩</span>
                    <div className="text-cyan-400 text-sm mt-0.5">{(ss * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-[#0d1f3c]">
                    <span className="text-slate-600">|SH⟩</span>
                    <div className="text-slate-300 text-sm mt-0.5">{(sh * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-[#0d1f3c]">
                    <span className="text-slate-600">|HS⟩</span>
                    <div className="text-slate-300 text-sm mt-0.5">{(hs * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-[#0d1f3c]">
                    <span className="text-slate-600">|HH⟩</span>
                    <div className="text-violet-400 text-sm mt-0.5">{(hh * 100).toFixed(1)}%</div>
                  </div>
                </div>
                <div className="text-[9px] text-slate-600 font-mono">
                  Total = {(totalProb * 100).toFixed(1)}%
                  {Math.abs(totalProb - 1) < 0.001 && (
                    <span className="text-green-400 ml-2">✓ NORMALIZED</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* 2x2 Probability Matrix */}
        <Panel title="JOINT PROBABILITY MATRIX" accent="violet">
          <div className="p-5 flex flex-col gap-4">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse" aria-label="Joint probability matrix">
                <thead>
                  <tr>
                    <th className="text-slate-600 text-left p-2"></th>
                    <th className="text-[9px] tracking-[0.15em] text-slate-500 p-2 text-center border-b border-[#0d1f3c]">
                      REAR: Soft
                    </th>
                    <th className="text-[9px] tracking-[0.15em] text-slate-500 p-2 text-center border-b border-[#0d1f3c]">
                      REAR: Stiff
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-[9px] tracking-[0.1em] text-slate-500 p-2 border-r border-[#0d1f3c]">
                      FRONT: Soft
                    </td>
                    <td className="p-2">
                      <ProbCell value={ss} highlight />
                    </td>
                    <td className="p-2">
                      <ProbCell value={sh} />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-[9px] tracking-[0.1em] text-slate-500 p-2 border-r border-[#0d1f3c]">
                      FRONT: Stiff
                    </td>
                    <td className="p-2">
                      <ProbCell value={hs} />
                    </td>
                    <td className="p-2">
                      <ProbCell value={hh} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Derived probabilities */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[#0d1f3c]">
              <div className="bg-black/20 rounded px-3 py-2">
                <p className="text-[9px] text-slate-600 mb-1">P(Both Soft)</p>
                <p className="font-mono text-sm text-cyan-400">{(pBothSoft * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-black/20 rounded px-3 py-2">
                <p className="text-[9px] text-slate-600 mb-1">P(At Least One Stiff)</p>
                <p className="font-mono text-sm text-orange-400">{(pAtLeastOneStiff * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-black/20 rounded px-3 py-2">
                <p className="text-[9px] text-slate-600 mb-1">P(Both Stiff)</p>
                <p className="font-mono text-sm text-violet-400">{(hh * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </Panel>

        {/* Explanation */}
        <div className="bg-black/20 rounded px-4 py-4 border-l-2 border-violet-400/30">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-violet-400 font-medium">Tensor products:</span>{' '}
            Tensor products provide a mathematical way to combine the state spaces of separate
            quantum-like systems. Here, the four-dimensional joint state |ψ_Vehicle⟩ describes
            all possible combinations of front and rear suspension modes simultaneously.
            The probability of each joint state is the product of the individual probabilities,
            reflecting the independence of front and rear suspension systems.
          </p>
        </div>
      </div>
    </div>
  );
};
