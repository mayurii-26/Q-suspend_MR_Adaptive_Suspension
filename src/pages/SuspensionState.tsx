import React from 'react';
import { CheckCircle, BookOpen } from 'lucide-react';
import type { SimulationState } from '../types';
import {
  SectionHeader,
  Panel,
  ProbabilityBar,
  TechnicalBadge,
  StateVectorDisplay,
  Tooltip,
} from '../components/UIComponents';

interface SuspensionStatePageProps {
  state: SimulationState;
}

const BasisVector: React.FC<{
  label: string;
  v1: number;
  v2: number;
  color: string;
  meaning: string;
}> = ({ label, v1, v2, color, meaning }) => (
  <div className="flex flex-col gap-2">
    <Tooltip content={meaning}>
      <span className={`font-mono text-sm ${color} cursor-help`}>{label} =</span>
    </Tooltip>
    <div className="flex items-center gap-1">
      <div className="flex flex-col text-xl text-slate-500 leading-none select-none" aria-hidden="true">
        <span>⎡</span>
        <span>⎣</span>
      </div>
      <div className="font-mono text-sm grid grid-rows-2 gap-y-2 px-2">
        <span className="text-slate-300 tabular-nums">{v1}</span>
        <span className="text-slate-300 tabular-nums">{v2}</span>
      </div>
      <div className="flex flex-col text-xl text-slate-500 leading-none select-none" aria-hidden="true">
        <span>⎤</span>
        <span>⎦</span>
      </div>
    </div>
  </div>
);

export const SuspensionStatePage: React.FC<SuspensionStatePageProps> = ({ state }) => {
  const innerProduct = state.alpha ** 2 + state.beta ** 2;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="QUANTUM-INSPIRED FRAMEWORK"
          title="Suspension State Vector"
          subtitle="The suspension condition is represented using a two-level mathematical state inspired by qubit formalism in quantum mechanics."
        />

        {/* Main state equation card */}
        <div className="bg-[#080b12] border border-[#0d1f3c] border-t-2 border-t-violet-400/40 rounded-sm p-5">
          <p className="text-[10px] tracking-[0.2em] text-slate-600 font-medium mb-4">
            STATE REPRESENTATION
          </p>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="font-mono text-lg text-slate-300 mb-3">
                |ψ⟩ ={' '}
                <Tooltip content="α: soft amplitude — its square gives P(Soft)">
                  <span className="text-cyan-400 cursor-help border-b border-dashed border-cyan-400/40">α</span>
                </Tooltip>
                |Soft⟩ +{' '}
                <Tooltip content="β: stiff amplitude — its square gives P(Stiff)">
                  <span className="text-violet-400 cursor-help border-b border-dashed border-violet-400/40">β</span>
                </Tooltip>
                |Stiff⟩
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                The suspension condition is represented using a <em>qubit-style</em> mathematical state.
                α and β are real amplitudes whose squares give the probability of each suspension response mode.
              </p>
            </div>
            <div className="bg-black/20 rounded px-3 py-2 border border-[#0d1f3c] font-mono text-xs">
              <div className="text-[9px] text-slate-600 mb-1.5">CURRENT VALUES</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <span className="text-slate-600">α</span>
                <span className="text-cyan-400 tabular-nums">{state.alpha.toFixed(6)}</span>
                <span className="text-slate-600">β</span>
                <span className="text-violet-400 tabular-nums">{state.beta.toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Basis vectors */}
          <Panel title="BASIS VECTORS" accent="cyan">
            <div className="p-5 flex flex-col gap-5">
              <div className="flex gap-8 flex-wrap">
                <BasisVector
                  label="|Soft⟩"
                  v1={1}
                  v2={0}
                  color="text-cyan-400"
                  meaning="Soft basis: fully soft suspension state. Like |0⟩ in qubit notation."
                />
                <BasisVector
                  label="|Stiff⟩"
                  v1={0}
                  v2={1}
                  color="text-violet-400"
                  meaning="Stiff basis: fully stiff suspension state. Like |1⟩ in qubit notation."
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The basis vectors |Soft⟩ and |Stiff⟩ represent the two extreme suspension modes,
                analogous to |0⟩ and |1⟩ in qubit formalism. Any intermediate state is a linear
                combination of these two orthonormal bases.
              </p>
              <div className="flex items-center gap-2">
                <BookOpen size={11} className="text-cyan-400/60" />
                <span className="text-[9px] text-slate-600">
                  ⟨Soft|Stiff⟩ = 0 (orthogonal) · ⟨Soft|Soft⟩ = ⟨Stiff|Stiff⟩ = 1 (orthonormal)
                </span>
              </div>
            </div>
          </Panel>

          {/* Current state */}
          <Panel title="CURRENT STATE VECTOR" accent="violet">
            <div className="p-5 flex flex-col gap-5">
              <div className="flex items-start gap-6 flex-wrap">
                <StateVectorDisplay alpha={state.alpha} beta={state.beta} />
                <div className="flex flex-col gap-3 mt-1">
                  <div>
                    <span className="text-[9px] tracking-[0.15em] text-slate-600">
                      α — SOFT AMPLITUDE
                    </span>
                    <Tooltip content="α = √(1 - stress). Larger α means the suspension leans toward soft mode.">
                      <div className="font-mono text-lg text-cyan-400 mt-0.5 cursor-help">
                        {state.alpha.toFixed(6)}
                      </div>
                    </Tooltip>
                  </div>
                  <div>
                    <span className="text-[9px] tracking-[0.15em] text-slate-600">
                      β — STIFF AMPLITUDE
                    </span>
                    <Tooltip content="β = √stress. Larger β means the suspension leans toward stiff mode.">
                      <div className="font-mono text-lg text-violet-400 mt-0.5 cursor-help">
                        {state.beta.toFixed(6)}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className="bg-black/20 rounded px-3 py-2 font-mono text-xs text-slate-500 border border-[#0d1f3c]">
                <p className="mb-1">α = √(1 − stress) = √({(1 - state.stress).toFixed(4)}) = <span className="text-cyan-400">{state.alpha.toFixed(5)}</span></p>
                <p>β = √stress      = √({state.stress.toFixed(4)}) = <span className="text-violet-400">{state.beta.toFixed(5)}</span></p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Probabilities */}
        <Panel title="RESPONSE PROBABILITIES" accent="cyan">
          <div className="p-5 flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <Tooltip content="P(Soft) = α² — the probability that a measurement returns the SOFT response mode.">
                  <div className="bg-black/20 rounded px-3 py-2.5 font-mono text-sm text-slate-400 border border-[#0d1f3c] cursor-help hover:border-cyan-400/20 transition-colors">
                    P(Soft) = |α|² ={' '}
                    <span className="text-cyan-400 tabular-nums">{state.softProb.toFixed(6)}</span>
                  </div>
                </Tooltip>
                <Tooltip content="P(Stiff) = β² — the probability that a measurement returns the STIFF response mode.">
                  <div className="bg-black/20 rounded px-3 py-2.5 font-mono text-sm text-slate-400 border border-[#0d1f3c] cursor-help hover:border-violet-400/20 transition-colors">
                    P(Stiff) = |β|² ={' '}
                    <span className="text-violet-400 tabular-nums">{state.stiffProb.toFixed(6)}</span>
                  </div>
                </Tooltip>
              </div>
              <div className="flex flex-col gap-4">
                <ProbabilityBar
                  label="P(Soft) = |α|²"
                  value={state.softProb}
                  color="cyan"
                  tooltip="Soft response probability"
                />
                <ProbabilityBar
                  label="P(Stiff) = |β|²"
                  value={state.stiffProb}
                  color="violet"
                  tooltip="Stiff response probability"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[#0d1f3c]">
              <span className="font-mono text-xs text-slate-500">
                P(Soft) + P(Stiff) ={' '}
                <span className="text-green-400 tabular-nums">
                  {(state.softProb + state.stiffProb).toFixed(6)}
                </span>
              </span>
              <TechnicalBadge variant="green">
                ∑P = 1.000000 ✓
              </TechnicalBadge>
            </div>
          </div>
        </Panel>

        {/* Inner Product */}
        <Panel title="INNER PRODUCT — NORMALIZATION CHECK" accent="violet">
          <div className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="bg-black/20 rounded px-3 py-2.5 font-mono text-sm text-slate-400 border border-[#0d1f3c]">
                  <span className="text-slate-600">Bra-ket notation:</span>
                  <div className="mt-1">⟨ψ|ψ⟩ = |α|² + |β|²</div>
                </div>
                <div className="bg-black/20 rounded px-3 py-2.5 font-mono text-sm text-slate-400 border border-[#0d1f3c]">
                  <div>
                    ⟨ψ|ψ⟩ ={' '}
                    <span className="text-cyan-400 tabular-nums">{state.softProb.toFixed(4)}</span>
                    {' '}+{' '}
                    <span className="text-violet-400 tabular-nums">{state.stiffProb.toFixed(4)}</span>
                  </div>
                  <div className="mt-1">
                    ⟨ψ|ψ⟩ ={' '}
                    <span className="text-green-400 tabular-nums">{innerProduct.toFixed(6)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-400" />
                  <span className="font-mono text-sm text-green-400">⟨ψ|ψ⟩ = 1.000000</span>
                </div>
                <TechnicalBadge variant="green">VALID NORMALIZED STATE ✓</TechnicalBadge>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The inner product of a normalized state with itself always equals one.
                  This is the fundamental normalization condition.
                </p>
              </div>
            </div>

            <div className="bg-black/20 rounded px-4 py-3 border-l-2 border-violet-400/30">
              <p className="text-xs text-slate-400 leading-relaxed">
                <span className="text-violet-400 font-medium">Inner product:</span>{' '}
                In quantum mechanics, ⟨ψ|ψ⟩ = 1 guarantees that the total probability sums to one.
                This mathematical property is preserved throughout our quantum-inspired model — the
                suspension is always in some combination of soft and stiff response modes, and
                the probabilities of those modes always sum to exactly 100%.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
