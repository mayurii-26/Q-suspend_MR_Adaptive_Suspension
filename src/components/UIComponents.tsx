import React, { useState } from 'react';
import type { SuspensionMode, SystemResponse } from '../types';

// ── Tooltip ───────────────────────────────────────────────────
interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span
          role="tooltip"
          className="
            tooltip-enter absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
            bg-[#0d1626] border border-[#1e3a5f] rounded-sm
            px-2.5 py-1.5 text-[10px] text-slate-300 leading-relaxed
            whitespace-nowrap pointer-events-none
            shadow-xl
          "
        >
          {content}
          <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1e3a5f]" />
        </span>
      )}
    </span>
  );
};

// ── Section Header ────────────────────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, subtitle }) => (
  <div className="mb-6">
    {eyebrow && (
      <p className="text-[10px] tracking-[0.3em] text-cyan-400/70 mb-1 font-medium uppercase">
        {eyebrow}
      </p>
    )}
    <h1 className="text-xl font-semibold text-slate-100 tracking-tight">{title}</h1>
    {subtitle && (
      <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-relaxed">{subtitle}</p>
    )}
  </div>
);

// ── Technical Badge ───────────────────────────────────────────
interface TechnicalBadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'green' | 'orange' | 'violet' | 'red';
}

export const TechnicalBadge: React.FC<TechnicalBadgeProps> = ({
  children,
  variant = 'cyan',
}) => {
  const styles = {
    cyan: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    green: 'bg-green-400/10 text-green-400 border-green-400/20',
    orange: 'bg-orange-400/10 text-orange-400 border-orange-400/20',
    violet: 'bg-violet-400/10 text-violet-400 border-violet-400/20',
    red: 'bg-red-400/10 text-red-400 border-red-400/20',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] tracking-[0.15em] font-medium border ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

// ── Panel ─────────────────────────────────────────────────────
interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: React.ReactNode;
  accent?: 'cyan' | 'violet' | 'none';
}

export const Panel: React.FC<PanelProps> = ({
  children,
  className = '',
  title,
  badge,
  accent = 'none',
}) => {
  const accentBar = {
    cyan: 'border-t-cyan-400/40',
    violet: 'border-t-violet-400/40',
    none: 'border-t-transparent',
  };

  return (
    <div
      className={`
        bg-[#080b12] border border-[#0d1f3c] rounded-sm
        border-t-2 ${accentBar[accent]}
        transition-colors duration-200
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#0d1f3c]">
          <span className="text-[10px] tracking-[0.2em] text-slate-500 font-medium">{title}</span>
          {badge}
        </div>
      )}
      {children}
    </div>
  );
};

// ── MetricCard ────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  subtext?: string;
  variant?: 'default' | 'good' | 'warn' | 'bad';
  size?: 'sm' | 'md';
  tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subtext,
  variant = 'default',
  size = 'md',
  tooltip,
}) => {
  const valueColors = {
    default: 'text-cyan-400',
    good: 'text-green-400',
    warn: 'text-orange-400',
    bad: 'text-red-400',
  };

  const card = (
    <div className="bg-[#080b12] border border-[#0d1f3c] rounded-sm p-4 flex flex-col gap-1 hover:border-[#1e3a5f] transition-colors duration-200">
      <p className="text-[9px] tracking-[0.25em] text-slate-600 font-medium">{label}</p>
      <div className="flex items-baseline gap-1 mt-1">
        <span
          className={`font-mono font-bold transition-all duration-500 ${
            size === 'md' ? 'text-2xl' : 'text-lg'
          } ${valueColors[variant]}`}
        >
          {value}
        </span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      {subtext && <p className="text-[10px] text-slate-600 mt-0.5">{subtext}</p>}
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{card}</Tooltip>;
  }
  return card;
};

// ── Mode Badge ────────────────────────────────────────────────
interface ModeBadgeProps {
  mode: SuspensionMode;
  large?: boolean;
}

export const ModeBadge: React.FC<ModeBadgeProps> = ({ mode, large = false }) => {
  const styles: Record<SuspensionMode, string> = {
    SOFT: 'bg-green-400/10 text-green-400 border-green-400/30',
    NORMAL: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30',
    STIFF: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
    CRITICAL: 'bg-red-400/10 text-red-400 border-red-400/30 critical-glow',
  };

  return (
    <span
      className={`
        inline-flex items-center font-mono font-bold tracking-widest border rounded-sm
        ${large ? 'px-4 py-2 text-sm' : 'px-2.5 py-1 text-xs'}
        ${styles[mode]}
      `}
      aria-label={`Suspension mode: ${mode}`}
    >
      {mode}
    </span>
  );
};

// ── Response Badge ────────────────────────────────────────────
interface ResponseBadgeProps {
  response: SystemResponse;
}

export const ResponseBadge: React.FC<ResponseBadgeProps> = ({ response }) => {
  const styles: Record<SystemResponse, string> = {
    'STABLE': 'bg-green-400/10 text-green-400 border-green-400/30 stable-glow',
    'MONITOR': 'bg-orange-400/10 text-orange-400 border-orange-400/30',
    'HIGH VIBRATION': 'bg-orange-500/10 text-orange-500 border-orange-500/30',
    'CRITICAL': 'bg-red-400/10 text-red-400 border-red-400/30 critical-glow',
  };

  return (
    <span
      className={`
        inline-flex items-center font-mono font-bold tracking-widest border rounded-sm
        px-4 py-2 text-sm
        ${styles[response]}
      `}
      aria-label={`System response: ${response}`}
    >
      {response}
    </span>
  );
};

// ── Progress Bar ──────────────────────────────────────────────
interface ProbabilityBarProps {
  label: string;
  value: number; // 0–1
  color?: 'cyan' | 'violet' | 'green' | 'orange' | 'red';
  showPercent?: boolean;
  tooltip?: string;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  label,
  value,
  color = 'cyan',
  showPercent = true,
  tooltip,
}) => {
  const colors = {
    cyan:   'bg-cyan-400',
    violet: 'bg-violet-400',
    green:  'bg-green-400',
    orange: 'bg-orange-400',
    red:    'bg-red-400',
  };

  const glows = {
    cyan:   'shadow-cyan-400/20',
    violet: 'shadow-violet-400/20',
    green:  'shadow-green-400/20',
    orange: 'shadow-orange-400/20',
    red:    'shadow-red-400/20',
  };

  const pct = Math.min(100, Math.round(value * 100));

  const bar = (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] tracking-[0.15em] text-slate-500 font-medium">{label}</span>
        {showPercent && (
          <span className="font-mono text-xs text-slate-400 tabular-nums">{pct}%</span>
        )}
      </div>
      <div className="h-2 bg-[#0d1626] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[color]} shadow-sm ${glows[color]}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );

  if (tooltip) return <Tooltip content={tooltip}>{bar}</Tooltip>;
  return bar;
};

// ── Sensor Slider ─────────────────────────────────────────────
interface SensorSliderProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (v: number) => void;
  tooltip?: string;
}

export const SensorSlider: React.FC<SensorSliderProps> = ({
  label,
  description,
  value,
  min,
  max,
  unit = '',
  onChange,
  tooltip,
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  const id = `slider-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-[10px] tracking-[0.15em] text-slate-500 font-medium cursor-pointer"
        >
          {tooltip ? (
            <Tooltip content={tooltip}>{label}</Tooltip>
          ) : label}
        </label>
        <span className="font-mono text-xs text-cyan-400 bg-cyan-400/5 px-2 py-0.5 rounded border border-cyan-400/10 tabular-nums">
          {value}{unit}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{
          background: `linear-gradient(to right, #00d4ff ${pct}%, #1a2744 ${pct}%)`,
        }}
        aria-label={`${label}: ${value}${unit}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <p className="text-[9px] text-slate-600 leading-snug">{description}</p>
    </div>
  );
};

// ── Matrix Display ────────────────────────────────────────────
interface MatrixDisplayProps {
  values: [[number, number], [number, number]];
  label?: string;
  size?: 'sm' | 'md';
}

export const MatrixDisplay: React.FC<MatrixDisplayProps> = ({
  values,
  label,
  size = 'md',
}) => {
  const fmt = (n: number) => n.toFixed(3);
  const textSize = size === 'md' ? 'text-base' : 'text-sm';

  return (
    <div className="inline-flex flex-col gap-1" role="img" aria-label={label ?? 'Matrix'}>
      {label && (
        <span className="text-[10px] tracking-[0.2em] text-slate-600 font-medium mb-1">{label}</span>
      )}
      <div className="flex items-center gap-1">
        <div className="flex flex-col text-2xl text-slate-500 leading-none select-none" aria-hidden="true">
          <span>⎡</span>
          <span>⎣</span>
        </div>
        <div className={`font-mono ${textSize} grid grid-cols-2 gap-x-6 gap-y-2 px-2`}>
          {values.flat().map((v, i) => (
            <span
              key={i}
              className="text-cyan-300 tabular-nums transition-all duration-400"
            >
              {fmt(v)}
            </span>
          ))}
        </div>
        <div className="flex flex-col text-2xl text-slate-500 leading-none select-none" aria-hidden="true">
          <span>⎤</span>
          <span>⎦</span>
        </div>
      </div>
    </div>
  );
};

// ── State Vector Display ──────────────────────────────────────
interface StateVectorProps {
  alpha: number;
  beta: number;
}

export const StateVectorDisplay: React.FC<StateVectorProps> = ({ alpha, beta }) => {
  const fmt = (n: number) => n.toFixed(4);
  return (
    <div
      className="inline-flex flex-col gap-1"
      role="img"
      aria-label={`State vector: alpha=${alpha.toFixed(4)}, beta=${beta.toFixed(4)}`}
    >
      <span className="text-[10px] tracking-[0.2em] text-slate-600 font-medium mb-1">|ψ⟩ =</span>
      <div className="flex items-center gap-1">
        <div className="flex flex-col text-2xl text-slate-500 leading-none select-none" aria-hidden="true">
          <span>⎡</span>
          <span>⎣</span>
        </div>
        <div className="font-mono text-base grid grid-rows-2 gap-y-2 px-2">
          <span className="text-cyan-300 tabular-nums transition-all duration-500">{fmt(alpha)}</span>
          <span className="text-violet-300 tabular-nums transition-all duration-500">{fmt(beta)}</span>
        </div>
        <div className="flex flex-col text-2xl text-slate-500 leading-none select-none" aria-hidden="true">
          <span>⎤</span>
          <span>⎦</span>
        </div>
      </div>
    </div>
  );
};

// ── Info Card (for About page) ────────────────────────────────
interface InfoCardProps {
  title: string;
  symbol: string;
  formula: string;
  description?: string;
  accent?: 'cyan' | 'violet';
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  symbol,
  formula,
  description,
  accent = 'cyan',
}) => {
  const accentColors = {
    cyan: {
      border: 'border-t-cyan-400/50',
      symbol: 'text-cyan-400',
      formula: 'text-cyan-300',
    },
    violet: {
      border: 'border-t-violet-400/50',
      symbol: 'text-violet-400',
      formula: 'text-violet-300',
    },
  };

  const colors = accentColors[accent];

  return (
    <div
      className={`bg-[#080b12] border border-[#0d1f3c] border-t-2 ${colors.border} rounded-sm p-4 flex flex-col gap-3 hover:border-[#1e3a5f] transition-colors duration-200`}
    >
      <p className="text-[9px] tracking-[0.25em] text-slate-600 font-medium">{title}</p>
      <div
        className={`font-mono text-2xl ${colors.symbol}`}
        style={{ textShadow: accent === 'cyan' ? '0 0 10px rgba(0,212,255,0.4)' : '0 0 10px rgba(139,92,246,0.4)' }}
        aria-label={`Symbol: ${symbol}`}
      >
        {symbol}
      </div>
      <code
        className={`font-mono text-sm ${colors.formula} bg-black/30 px-3 py-2 rounded block border border-[#0d1f3c]`}
        aria-label={`Formula: ${formula}`}
      >
        {formula}
      </code>
      {description && (
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
};
