// ============================================================
// Q-SUSPEND: Shared Types
// ============================================================

// ── Navigation Pages ──────────────────────────────────────────
export type PageId =
  | 'dashboard'
  | 'suspension-state'
  | 'damping-control'
  | 'stress-operator'
  | 'eigen-analysis'
  | 'tensor-state'
  | 'measurement-lab'
  | 'system-analysis'
  | 'about-model';

// ── Simulation Inputs ─────────────────────────────────────────
export interface SimulationInputs {
  roadRoughness: number;      // 0–100
  vehicleSpeed: number;       // 0–150 km/h
  vehicleLoad: number;        // 0–100%
  vibrationAmplitude: number; // 0–100
  magneticField: number;      // 0–100%
  dampingControl: number;     // 0–100%
}

// ── Suspension Mode ───────────────────────────────────────────
export type SuspensionMode = 'SOFT' | 'NORMAL' | 'STIFF' | 'CRITICAL';

// ── System Response ───────────────────────────────────────────
export type SystemResponse = 'STABLE' | 'MONITOR' | 'HIGH VIBRATION' | 'CRITICAL';

// ── Matrix types ──────────────────────────────────────────────
export interface HermitianMatrix {
  a11: number;
  a12: number;
  a21: number;
  a22: number;
}

export interface EigenResult {
  lambda1: number;
  lambda2: number;
  vec1: [number, number];
  vec2: [number, number];
}

export interface EigenContributions {
  roadExcitation: number;
  vibration: number;
  damping: number;
}

export interface TensorState {
  ss: number;
  sh: number;
  hs: number;
  hh: number;
}

export interface DampingDataPoint {
  t: number;
  without: number;
  with: number;
}

// ── Simulation State (computed) ───────────────────────────────
export interface SimulationState {
  stress: number;
  alpha: number;
  beta: number;
  softProb: number;
  stiffProb: number;
  health: number;
  stability: number;
  vibrationRisk: number;
  mode: SuspensionMode;
  response: SystemResponse;
  matrix: HermitianMatrix;
  eigen: EigenResult;
  eigenContribs: EigenContributions;
  front: { alpha: number; beta: number };
  rear: { alpha: number; beta: number };
  tensor: TensorState;
  dampingChart: DampingDataPoint[];
}

// ── Measurement Types ─────────────────────────────────────────
export type MeasurementResult = 'Soft' | 'Stiff';

export interface MeasurementEntry {
  id: number;
  result: MeasurementResult;
  probability: number;
  timestamp: number;
}
