import React, { useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SimulationState, MeasurementEntry, MeasurementResult } from '../types';
import { SectionHeader, Panel, TechnicalBadge } from '../components/UIComponents';

interface MeasurementLabPageProps {
  state: SimulationState;
}

const MAX_HISTORY = 20;

export const MeasurementLabPage: React.FC<MeasurementLabPageProps> = ({ state }) => {
  const [history, setHistory] = useState<MeasurementEntry[]>([]);
  const [lastResult, setLastResult] = useState<MeasurementEntry | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [counter, setCounter] = useState(1);

  const runMeasurement = useCallback(() => {
    if (measuring) return;
    setMeasuring(true);

    setTimeout(() => {
      const r = Math.random();
      const result: MeasurementResult = r < state.softProb ? 'Soft' : 'Stiff';
      const probability = result === 'Soft' ? state.softProb : state.stiffProb;

      const entry: MeasurementEntry = {
        id: counter,
        result,
        probability,
        timestamp: Date.now(),
      };

      setLastResult(entry);
      setHistory((prev) => {
        const updated = [entry, ...prev];
        return updated.slice(0, MAX_HISTORY);
      });
      setCounter((c) => c + 1);
      setMeasuring(false);
    }, 600);
  }, [measuring, state.softProb, state.stiffProb, counter]);

  const resetHistory = () => {
    setHistory([]);
    setLastResult(null);
    setCounter(1);
  };

  // Observed counts
  const softCount = history.filter((h) => h.result === 'Soft').length;
  const stiffCount = history.filter((h) => h.result === 'Stiff').length;
  const total = history.length;

  const obsVsExpData = [
    {
      state: 'Soft',
      expected: Math.round(state.softProb * 100),
      observed: total > 0 ? Math.round((softCount / total) * 100) : 0,
    },
    {
      state: 'Stiff',
      expected: Math.round(state.stiffProb * 100),
      observed: total > 0 ? Math.round((stiffCount / total) * 100) : 0,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm px-3 py-2">
          <p className="text-xs text-slate-400 mb-1">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.name} className="font-mono text-xs" style={{ color: entry.fill }}>
              {entry.name === 'expected' ? 'Expected: ' : 'Observed: '}{entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin page-enter">
      <div className="p-6 flex flex-col gap-6">
        <SectionHeader
          eyebrow="PROBABILISTIC SIMULATION"
          title="Suspension Response Measurement Lab"
          subtitle="Simulate individual suspension state measurements using the calculated response probabilities."
        />

        {/* Pre-measurement state */}
        <Panel title="PRE-MEASUREMENT STATE" accent="violet">
          <div className="p-5 flex flex-col gap-3">
            <div className="font-mono text-sm text-slate-400">
              |ψ⟩ = <span className="text-cyan-400">{state.alpha.toFixed(4)}</span>|Soft⟩ +{' '}
              <span className="text-violet-400">{state.beta.toFixed(4)}</span>|Stiff⟩
            </div>
            <div className="flex gap-4 text-xs font-mono flex-wrap">
              <span>
                P(Soft) = <span className="text-cyan-400">{(state.softProb * 100).toFixed(1)}%</span>
              </span>
              <span>
                P(Stiff) = <span className="text-violet-400">{(state.stiffProb * 100).toFixed(1)}%</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Before measurement, the suspension state contains probabilistic information.
              Each measurement randomly resolves to either Soft or Stiff response based on these probabilities.
            </p>
          </div>
        </Panel>

        {/* Measurement button + result */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Button */}
          <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm p-5 flex flex-col items-center justify-center gap-4">
            <button
              onClick={runMeasurement}
              disabled={measuring}
              className={`
                w-full py-4 rounded-sm font-mono font-bold tracking-widest text-sm
                border transition-all duration-200
                ${measuring
                  ? 'bg-cyan-400/5 border-cyan-400/20 text-cyan-400/50 cursor-wait'
                  : 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/20 hover:glow-cyan cursor-pointer'
                }
              `}
              aria-label="Run measurement simulation"
            >
              {measuring ? '⟳ MEASURING...' : '⚡ RUN MEASUREMENT'}
            </button>
            <p className="text-[9px] text-slate-600 text-center">
              Uses P(Soft) and P(Stiff) to probabilistically determine the measured state.
            </p>
          </div>

          {/* Last result */}
          <div
            className={`
              bg-[#080b12] border rounded-sm p-5 flex flex-col justify-center gap-3 transition-all duration-300
              ${lastResult
                ? lastResult.result === 'Soft'
                  ? 'border-cyan-400/30'
                  : 'border-violet-400/30'
                : 'border-[#0d1f3c]'
              }
            `}
          >
            <p className="text-[9px] tracking-[0.25em] text-slate-600 font-medium">MEASUREMENT RESULT</p>
            {lastResult ? (
              <div className={`measure-animate`}>
                <div
                  className={`font-mono text-2xl font-bold mb-1 ${
                    lastResult.result === 'Soft' ? 'text-cyan-400' : 'text-violet-400'
                  }`}
                >
                  |{lastResult.result}⟩
                </div>
                <div className="text-xs text-slate-500">
                  Measurement #{lastResult.id} •{' '}
                  <span className="font-mono">P = {(lastResult.probability * 100).toFixed(1)}%</span>
                </div>
                <TechnicalBadge
                  variant={lastResult.result === 'Soft' ? 'cyan' : 'violet'}
                >
                  {lastResult.result === 'Soft' ? 'SOFT RESPONSE OBSERVED' : 'STIFF RESPONSE OBSERVED'}
                </TechnicalBadge>
              </div>
            ) : (
              <p className="text-xs text-slate-600 font-mono">No measurement yet</p>
            )}
          </div>
        </div>

        {/* History + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* History */}
          <Panel title={`MEASUREMENT HISTORY (LAST ${MAX_HISTORY})`} accent="none"
            badge={
              <button
                onClick={resetHistory}
                className="text-[9px] text-slate-500 hover:text-red-400 transition-colors border border-[#1a2744] hover:border-red-400/20 px-2 py-0.5 rounded"
                aria-label="Reset measurement history"
              >
                RESET
              </button>
            }
          >
            <div className="p-3 max-h-64 overflow-y-auto scrollbar-thin">
              {history.length === 0 ? (
                <p className="text-xs text-slate-600 font-mono p-2">No measurements recorded.</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {history.map((entry) => (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-3 px-3 py-1.5 rounded text-xs font-mono
                        ${entry.result === 'Soft' ? 'bg-cyan-400/5' : 'bg-violet-400/5'}
                      `}
                    >
                      <span className="text-slate-600 w-6">#{entry.id}</span>
                      <span
                        className={`font-bold ${
                          entry.result === 'Soft' ? 'text-cyan-400' : 'text-violet-400'
                        }`}
                      >
                        {entry.result}
                      </span>
                      <span className="text-slate-600 ml-auto">
                        P={( entry.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {history.length > 0 && (
              <div className="px-3 py-2 border-t border-[#0d1f3c] flex gap-4 text-[9px] text-slate-500">
                <span>Soft: <span className="text-cyan-400">{softCount}</span></span>
                <span>Stiff: <span className="text-violet-400">{stiffCount}</span></span>
                <span>Total: <span className="text-slate-400">{total}</span></span>
              </div>
            )}
          </Panel>

          {/* Bar chart */}
          <Panel title="OBSERVED vs EXPECTED" accent="cyan">
            <div className="p-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={obsVsExpData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#0d1f3c" />
                    <XAxis
                      dataKey="state"
                      stroke="#374151"
                      tick={{ fill: '#4b5563', fontSize: 10 }}
                    />
                    <YAxis
                      stroke="#374151"
                      tick={{ fill: '#4b5563', fontSize: 9 }}
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="expected" fill="#1e3a5f" name="expected" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="observed" fill="#00d4ff" name="observed" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 mt-2 text-[9px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 bg-[#1e3a5f] rounded" />
                  <span className="text-slate-500">Expected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-2 bg-cyan-400 rounded" />
                  <span className="text-slate-500">Observed ({total} samples)</span>
                </div>
              </div>
              {total > 0 && (
                <p className="text-[9px] text-slate-600 mt-2">
                  With more measurements, observed frequencies converge to expected probabilities (Law of Large Numbers).
                </p>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
};
