// ============================================================
// Q-SUSPEND: Core Calculation Engine
// Quantum-Inspired MR Adaptive Suspension Simulator
//
// All calculations are deterministic and based on slider inputs.
// This is a quantum-INSPIRED classical simulator.
// ============================================================

import type {
  SimulationInputs,
  SimulationState,
  SuspensionMode,
  SystemResponse,
  HermitianMatrix,
  EigenResult,
  EigenContributions,
  TensorState,
  DampingDataPoint,
} from '../types';

// ── Stress Score ────────────────────────────────────────────
export function computeStress(inputs: SimulationInputs): number {
  const road = inputs.roadRoughness / 100;
  const speed = inputs.vehicleSpeed / 150;
  const load = inputs.vehicleLoad / 100;
  const vibration = inputs.vibrationAmplitude / 100;
  const damping = inputs.dampingControl / 100;

  const stress =
    0.30 * road +
    0.20 * speed +
    0.20 * load +
    0.20 * vibration +
    0.10 * (1 - damping);

  return Math.min(1, Math.max(0, stress));
}

// ── Normalized State Vector ──────────────────────────────────
export function computeStateVector(stress: number): { alpha: number; beta: number } {
  const beta = Math.sqrt(stress);
  const alpha = Math.sqrt(1 - stress);
  return { alpha, beta };
}

// ── Suspension Health ────────────────────────────────────────
export function computeSuspensionHealth(inputs: SimulationInputs): number {
  const road = inputs.roadRoughness / 100;
  const vibration = inputs.vibrationAmplitude / 100;
  const damping = inputs.dampingControl / 100;
  const magnetic = inputs.magneticField / 100;
  const load = inputs.vehicleLoad / 100;

  const health =
    (1 - 0.35 * road) *
    (1 - 0.25 * vibration) *
    (0.5 + 0.3 * damping + 0.2 * magnetic) *
    (1 - 0.10 * load);

  return Math.min(1, Math.max(0, health));
}

// ── Stability Index ──────────────────────────────────────────
export function computeStabilityIndex(inputs: SimulationInputs): number {
  const road = inputs.roadRoughness / 100;
  const vibration = inputs.vibrationAmplitude / 100;
  const damping = inputs.dampingControl / 100;
  const magnetic = inputs.magneticField / 100;

  const stability =
    1 -
    0.40 * road -
    0.30 * vibration +
    0.20 * damping +
    0.10 * magnetic;

  return Math.min(1, Math.max(0, stability));
}

// ── Vibration Risk ───────────────────────────────────────────
export function computeVibrationRisk(inputs: SimulationInputs): number {
  const road = inputs.roadRoughness / 100;
  const vibration = inputs.vibrationAmplitude / 100;
  const speed = inputs.vehicleSpeed / 150;
  const damping = inputs.dampingControl / 100;

  const risk =
    0.35 * road +
    0.30 * vibration +
    0.20 * speed -
    0.15 * damping;

  return Math.min(1, Math.max(0, risk));
}

// ── Current Mode ─────────────────────────────────────────────
export function computeMode(
  softProb: number,
  stiffProb: number,
  risk: number
): SuspensionMode {
  if (risk >= 0.75) return 'CRITICAL';
  if (stiffProb > 0.70) return 'STIFF';
  if (softProb > 0.70) return 'SOFT';
  return 'NORMAL';
}

// ── System Response Label ─────────────────────────────────────
export function computeSystemResponse(
  health: number,
  risk: number,
  vibration: number
): SystemResponse {
  if (risk >= 0.75 || health < 0.25) return 'CRITICAL';
  if (vibration >= 70) return 'HIGH VIBRATION';
  if (health < 0.55 || risk > 0.45) return 'MONITOR';
  return 'STABLE';
}

// ── Hermitian Suspension Operator ────────────────────────────
export function computeHermitianMatrix(inputs: SimulationInputs): HermitianMatrix {
  const road = inputs.roadRoughness / 100;
  const load = inputs.vehicleLoad / 100;
  const vibration = inputs.vibrationAmplitude / 100;
  const damping = inputs.dampingControl / 100;
  const magnetic = inputs.magneticField / 100;

  const a11 = parseFloat((3.0 * road + 2.0 * load).toFixed(4));
  const a12 = parseFloat((1.5 * vibration).toFixed(4));
  const a22 = parseFloat((2.5 * damping + 2.0 * magnetic).toFixed(4));

  return { a11, a12, a21: a12, a22 };
}

// ── Eigenvalues ───────────────────────────────────────────────
export function computeEigenvalues(m: HermitianMatrix): EigenResult {
  const { a11: a, a12: b, a22: d } = m;
  const trace = a + d;
  const disc = Math.sqrt((a - d) ** 2 + 4 * b ** 2);

  const lambda1 = (trace + disc) / 2;
  const lambda2 = (trace - disc) / 2;

  function computeEigenvector(lambda: number): [number, number] {
    let v1: number, v2: number;
    if (Math.abs(b) > 1e-10) {
      v1 = b;
      v2 = lambda - a;
    } else if (Math.abs(a - lambda) < 1e-10) {
      v1 = 1;
      v2 = 0;
    } else {
      v1 = 0;
      v2 = 1;
    }
    const norm = Math.sqrt(v1 ** 2 + v2 ** 2) || 1;
    return [v1 / norm, v2 / norm];
  }

  return {
    lambda1,
    lambda2,
    vec1: computeEigenvector(lambda1),
    vec2: computeEigenvector(lambda2),
  };
}

// ── Dominant Eigenmode Contributions ─────────────────────────
export function computeEigenContributions(
  vec: [number, number],
  inputs: SimulationInputs
): EigenContributions {
  const road = inputs.roadRoughness / 100;
  const vibration = inputs.vibrationAmplitude / 100;
  const damping = inputs.dampingControl / 100;

  const v1sq = vec[0] ** 2;
  const v2sq = vec[1] ** 2;

  const roadContrib = road * v1sq;
  const vibContrib = vibration * (v1sq + v2sq) / 2;
  const dampContrib = damping * v2sq;

  const total = roadContrib + vibContrib + dampContrib || 1;

  return {
    roadExcitation: Math.round((roadContrib / total) * 100),
    vibration: Math.round((vibContrib / total) * 100),
    damping: Math.round((dampContrib / total) * 100),
  };
}

// ── Tensor Product: Front ⊗ Rear ─────────────────────────────
export function computeTensorProduct(
  front: { alpha: number; beta: number },
  rear: { alpha: number; beta: number }
): TensorState {
  return {
    ss: (front.alpha * rear.alpha) ** 2,
    sh: (front.alpha * rear.beta) ** 2,
    hs: (front.beta * rear.alpha) ** 2,
    hh: (front.beta * rear.beta) ** 2,
  };
}

// ── Front / Rear states with offset ──────────────────────────
export function computeFrontRearStates(inputs: SimulationInputs): {
  front: { alpha: number; beta: number };
  rear: { alpha: number; beta: number };
} {
  const frontInputs: SimulationInputs = {
    ...inputs,
    roadRoughness: Math.min(100, inputs.roadRoughness * 1.1),
    vehicleLoad: inputs.vehicleLoad * 0.9,
  };
  const rearInputs: SimulationInputs = {
    ...inputs,
    roadRoughness: inputs.roadRoughness * 0.9,
    vehicleLoad: Math.min(100, inputs.vehicleLoad * 1.1),
  };

  return {
    front: computeStateVector(computeStress(frontInputs)),
    rear: computeStateVector(computeStress(rearInputs)),
  };
}

// ── Damping Chart Data ────────────────────────────────────────
export function generateDampingChartData(
  roadRoughness: number,
  magneticField: number,
  dampingControl: number
): DampingDataPoint[] {
  const points: DampingDataPoint[] = [];
  const amplitude = (roadRoughness / 100) * 40;
  const dampFactor = (magneticField / 100) * 0.7 + (dampingControl / 100) * 0.3;
  const dampedAmp = amplitude * (1 - dampFactor * 0.8);

  for (let i = 0; i <= 60; i++) {
    const t = i * 0.1;
    const freq = 1.5 + (roadRoughness / 100) * 1.5;
    const without = amplitude * Math.sin(2 * Math.PI * freq * t) * Math.exp(-0.05 * t);
    const withDamping =
      dampedAmp * Math.sin(2 * Math.PI * freq * t) * Math.exp(-(0.15 + dampFactor * 0.5) * t);
    points.push({ t: parseFloat(t.toFixed(1)), without, with: withDamping });
  }
  return points;
}

// ── Full simulation state ─────────────────────────────────────
export function computeSimulationState(inputs: SimulationInputs): SimulationState {
  const stress = computeStress(inputs);
  const { alpha, beta } = computeStateVector(stress);
  const softProb = alpha ** 2;
  const stiffProb = beta ** 2;

  const health = computeSuspensionHealth(inputs);
  const stability = computeStabilityIndex(inputs);
  const vibrationRisk = computeVibrationRisk(inputs);
  const mode = computeMode(softProb, stiffProb, vibrationRisk);
  const response = computeSystemResponse(health, vibrationRisk, inputs.vibrationAmplitude);

  const matrix = computeHermitianMatrix(inputs);
  const eigen = computeEigenvalues(matrix);
  const eigenContribs = computeEigenContributions(eigen.vec1, inputs);

  const { front, rear } = computeFrontRearStates(inputs);
  const tensor = computeTensorProduct(front, rear);

  const dampingChart = generateDampingChartData(
    inputs.roadRoughness,
    inputs.magneticField,
    inputs.dampingControl
  );

  return {
    stress,
    alpha,
    beta,
    softProb,
    stiffProb,
    health,
    stability,
    vibrationRisk,
    mode,
    response,
    matrix,
    eigen,
    eigenContribs,
    front,
    rear,
    tensor,
    dampingChart,
  };
}
