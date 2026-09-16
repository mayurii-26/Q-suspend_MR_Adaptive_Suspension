import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SectionHeader, InfoCard } from '../components/UIComponents';

export const AboutModelPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="ACADEMIC DOCUMENTATION"
          title="Mathematical Foundation"
          subtitle="The quantum-inspired mathematical framework underlying the Q-SUSPEND simulation."
        />

        {/* Disclaimer */}
        <div className="bg-orange-400/5 border border-orange-400/20 rounded-sm p-4 flex gap-3">
          <AlertTriangle size={16} className="text-orange-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] tracking-[0.2em] text-orange-400 font-medium mb-1">
              IMPORTANT DISCLAIMER
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Quantum-inspired model:</strong>{' '}
              quantum state vectors, operators, eigen-analysis and tensor products are used as a
              mathematical framework for representing and analyzing classical suspension parameters.
              This simulation does NOT claim that an automobile suspension is a quantum mechanical system.
            </p>
          </div>
        </div>

        {/* Math cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard
            title="1. STATE VECTOR"
            symbol="|ψ⟩"
            formula="|ψ⟩ = α|Soft⟩ + β|Stiff⟩"
            description="The suspension condition is encoded as a two-component state vector with real amplitudes α and β."
            accent="cyan"
          />
          <InfoCard
            title="2. NORMALIZATION"
            symbol="‖ψ‖ = 1"
            formula="|α|² + |β|² = 1"
            description="The sum of squared amplitudes equals one, ensuring probabilities sum to 100%."
            accent="violet"
          />
          <InfoCard
            title="3. INNER PRODUCT"
            symbol="⟨ψ|ψ⟩"
            formula="⟨ψ|ψ⟩ = α² + β² = 1"
            description="The inner product of a normalized state with itself equals one — the normalization check."
            accent="cyan"
          />
          <InfoCard
            title="4. HERMITIAN OPERATOR"
            symbol="A = A†"
            formula="A₁₂ = A₂₁ (symmetric)"
            description="The 2×2 suspension stress matrix is Hermitian (real symmetric), guaranteeing real eigenvalues."
            accent="violet"
          />
          <InfoCard
            title="5. EIGEN EQUATION"
            symbol="λ, |v⟩"
            formula="A|v⟩ = λ|v⟩"
            description="Eigenvalue decomposition reveals the principal response directions and characteristic frequencies."
            accent="cyan"
          />
          <InfoCard
            title="6. TENSOR PRODUCT"
            symbol="⊗"
            formula="|ψF⟩ ⊗ |ψR⟩"
            description="Combines front and rear suspension state spaces into a four-dimensional composite state."
            accent="violet"
          />
        </div>

        {/* Why use these concepts */}
        <div className="bg-[#080b12] border border-[#0d1f3c] border-t-2 border-t-cyan-400/40 rounded-sm">
          <div className="px-5 py-4 border-b border-[#0d1f3c]">
            <p className="text-[10px] tracking-[0.25em] text-slate-500 font-medium">
              WHY USE THESE CONCEPTS?
            </p>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                concept: 'State Vectors',
                why: 'A two-component vector [α, β] is a compact, normalized way to encode the soft/stiff balance of the suspension. The formalism naturally enforces probability constraints.',
              },
              {
                concept: 'Complex Amplitudes & Normalization',
                why: 'Normalization |α|² + |β|² = 1 automatically ensures that response probabilities are valid and sum to 100%, preventing unphysical values.',
              },
              {
                concept: 'Inner Product',
                why: 'The inner product ⟨ψ|ψ⟩ provides a clean algebraic check that the state is correctly normalized throughout the simulation.',
              },
              {
                concept: 'Hermitian Operator',
                why: 'Real symmetric matrices always have real eigenvalues — essential for physically meaningful suspension stress values. The structure also encodes the symmetry of the damper response.',
              },
              {
                concept: 'Eigenvalues & Eigenvectors',
                why: 'Eigenanalysis decomposes the suspension response into independent principal modes. The dominant eigenvalue quantifies overall system stress; the eigenvector shows the response direction.',
              },
              {
                concept: 'Tensor Product',
                why: 'The tensor product systematically enumerates all joint states of two subsystems (front + rear), providing a principled way to compute joint probabilities.',
              },
              {
                concept: 'Measurement / Probability',
                why: 'Probabilistic measurement (random collapse weighted by |α|² and |β|²) models the inherent stochastic nature of real road-tire interactions.',
              },
              {
                concept: 'Qubit-Style Representation',
                why: 'Using a two-level state basis {|Soft⟩, |Stiff⟩} mirrors the qubit formalism, making the simulation a concrete demonstration of how quantum computing mathematics applies to classical engineering problems.',
              },
            ].map(({ concept, why }) => (
              <div
                key={concept}
                className="bg-black/20 rounded p-4 border border-[#0d1f3c] flex flex-col gap-2"
              >
                <p className="text-[10px] tracking-[0.15em] text-cyan-400 font-medium">{concept}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Concept flow */}
        <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm p-5">
          <p className="text-[10px] tracking-[0.25em] text-slate-500 font-medium mb-4">
            CONCEPTUAL FRAMEWORK
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
            <div className="flex flex-col gap-2">
              <p className="text-[9px] tracking-[0.15em] text-cyan-400">PHYSICS LAYER</p>
              <ul className="space-y-1 list-none">
                <li>• MR damper fluid dynamics</li>
                <li>• Road excitation forces</li>
                <li>• Vehicle dynamics</li>
                <li>• Magnetic field effects</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[9px] tracking-[0.15em] text-violet-400">MATHEMATICAL LAYER</p>
              <ul className="space-y-1 list-none">
                <li>• State vector encoding</li>
                <li>• Linear algebra operators</li>
                <li>• Spectral decomposition</li>
                <li>• Tensor composition</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[9px] tracking-[0.15em] text-green-400">QUANTUM ANALOGY</p>
              <ul className="space-y-1 list-none">
                <li>• Qubit ↔ Soft/Stiff state</li>
                <li>• Hamiltonian ↔ Stress operator</li>
                <li>• Superposition ↔ Mixed response</li>
                <li>• Measurement ↔ Observed mode</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Academic note */}
        <div className="bg-black/20 rounded px-4 py-4 border-l-2 border-violet-400/30">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-violet-400 font-medium">Academic note:</span>{' '}
            This project was developed as a college-level demonstration of quantum computing mathematical concepts
            applied to an automotive engineering problem (magnetorheological adaptive suspension).
            All quantum-mechanical language is used as a <em>mathematical analogy</em> —
            the simulation operates entirely on classical computer hardware and does not involve
            any quantum hardware, real sensor data, or actual vehicle systems.
            Language such as "quantum-inspired", "mathematical representation", "simulation", and
            "conceptual model" is used intentionally throughout to maintain academic accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};
