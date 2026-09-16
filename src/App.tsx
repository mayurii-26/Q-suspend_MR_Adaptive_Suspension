import { useState, useCallback, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { SuspensionStatePage } from './pages/SuspensionState';
import { DampingControlPage } from './pages/DampingControl';
import { StressOperatorPage } from './pages/StressOperator';
import { EigenAnalysisPage } from './pages/EigenAnalysis';
import { TensorStatePage } from './pages/TensorState';
import { MeasurementLabPage } from './pages/MeasurementLab';
import { SystemAnalysisPage } from './pages/SystemAnalysis';
import { AboutModelPage } from './pages/AboutModel';
import type { PageId, SimulationInputs } from './types';
import { computeSimulationState } from './engine/calculations';

const DEFAULT_INPUTS: SimulationInputs = {
  roadRoughness: 45,
  vehicleSpeed: 60,
  vehicleLoad: 55,
  vibrationAmplitude: 35,
  magneticField: 65,
  dampingControl: 70,
};

function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [inputs, setInputs] = useState<SimulationInputs>(DEFAULT_INPUTS);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Compute all derived simulation state reactively from inputs
  const simState = useMemo(() => computeSimulationState(inputs), [inputs]);

  const handleInputChange = useCallback(
    (key: keyof SimulationInputs, value: number) => {
      setInputs((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setInputs(DEFAULT_INPUTS);
  }, []);

  const handleNavigate = useCallback((page: PageId) => {
    setCurrentPage(page);
  }, []);

  const modeColorClass: Record<string, string> = {
    SOFT: 'text-green-400',
    NORMAL: 'text-cyan-400',
    STIFF: 'text-orange-400',
    CRITICAL: 'text-red-400',
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            inputs={inputs}
            state={simState}
            onInputChange={handleInputChange}
            onReset={handleReset}
          />
        );
      case 'suspension-state':
        return <SuspensionStatePage state={simState} />;
      case 'damping-control':
        return <DampingControlPage inputs={inputs} state={simState} />;
      case 'stress-operator':
        return <StressOperatorPage state={simState} />;
      case 'eigen-analysis':
        return <EigenAnalysisPage state={simState} />;
      case 'tensor-state':
        return <TensorStatePage state={simState} />;
      case 'measurement-lab':
        return <MeasurementLabPage state={simState} />;
      case 'system-analysis':
        return <SystemAnalysisPage inputs={inputs} state={simState} />;
      case 'about-model':
        return <AboutModelPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0d14] overflow-hidden">
      {/* ── Sidebar ──────────────────────────────────────────── */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((v) => !v)}
      />

      {/* ── Main content ─────────────────────────────────────── */}
      <main
        className="flex-1 flex flex-col min-w-0 overflow-hidden"
        role="main"
        aria-label="Simulation workspace"
      >
        {/* Top status bar */}
        <div
          className="shrink-0 h-9 bg-[#060911] border-b border-[#0d1f3c] flex items-center px-4 gap-4 pl-14 lg:pl-4"
          role="status"
          aria-live="polite"
          aria-label="Simulation status"
        >
          {/* Live status indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className="live-dot w-1.5 h-1.5 rounded-full bg-green-400"
              aria-hidden="true"
            />
            <span className="text-[9px] tracking-[0.15em] text-slate-600">LIVE</span>
          </div>

          <div className="h-3 w-px bg-[#0d1f3c]" aria-hidden="true" />

          <span className="text-[9px] tracking-[0.1em] text-slate-600 hidden sm:block">
            MODE:{' '}
            <span className={`font-mono font-medium ${modeColorClass[simState.mode] ?? 'text-cyan-400'}`}>
              {simState.mode}
            </span>
          </span>

          <div className="h-3 w-px bg-[#0d1f3c] hidden sm:block" aria-hidden="true" />

          <span className="text-[9px] tracking-[0.1em] text-slate-600 hidden sm:block">
            HEALTH:{' '}
            <span className="font-mono text-green-400 tabular-nums">
              {(simState.health * 100).toFixed(1)}%
            </span>
          </span>

          <div className="h-3 w-px bg-[#0d1f3c] hidden md:block" aria-hidden="true" />

          <span className="text-[9px] tracking-[0.1em] text-slate-600 hidden md:block">
            λ₁:{' '}
            <span className="font-mono text-orange-400 tabular-nums">
              {simState.eigen.lambda1.toFixed(3)}
            </span>
          </span>

          <div className="h-3 w-px bg-[#0d1f3c] hidden md:block" aria-hidden="true" />

          <span className="text-[9px] tracking-[0.1em] text-slate-600 hidden md:block">
            ⟨ψ|ψ⟩:{' '}
            <span className="font-mono text-cyan-400 tabular-nums">
              {(simState.alpha ** 2 + simState.beta ** 2).toFixed(4)}
            </span>
          </span>

          <div className="ml-auto flex items-center gap-3">
            <span className="text-[9px] tracking-[0.1em] text-slate-700 font-mono hidden sm:block">
              Q-SUSPEND v1.0
            </span>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-hidden grid-bg" key={currentPage}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
