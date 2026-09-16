import React, { useEffect, useRef } from 'react';

interface SuspensionVisualizationProps {
  vibrationAmplitude: number; // 0–100
  roadRoughness: number;      // 0–100
  dampingControl: number;     // 0–100%
  magneticField: number;      // 0–100%
}

export const SuspensionVisualization: React.FC<SuspensionVisualizationProps> = ({
  vibrationAmplitude,
  roadRoughness,
  dampingControl,
  magneticField,
}) => {
  const animRef = useRef<number>(0);
  const tRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const amplitude = (vibrationAmplitude / 100) * 12 + (roadRoughness / 100) * 8;
    const dampFactor = (dampingControl / 100) * 0.6 + (magneticField / 100) * 0.3;
    const freq = 1.5 + (roadRoughness / 100) * 2;
    const effectiveAmp = amplitude * (1 - dampFactor * 0.7);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      const bodyOscillation = effectiveAmp * Math.sin(2 * Math.PI * freq * t * 0.001);
      const tireOscillation = amplitude * Math.sin(2 * Math.PI * freq * t * 0.001 + 0.3);

      const cx = W / 2;
      const roadY = H - 20;

      // ── Road ──────────────────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = '#1a2744';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, roadY + 5);
        ctx.lineTo(x + 10, roadY + 5);
        ctx.stroke();
      }
      ctx.fillStyle = '#0d1626';
      ctx.fillRect(0, roadY, W, H - roadY);

      // Road surface label
      ctx.font = '9px monospace';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'center';
      ctx.fillText('ROAD SURFACE', cx, roadY + 15);
      ctx.restore();

      // ── Road bumps (roughness indicator) ─────────────────────
      if (roadRoughness > 20) {
        ctx.save();
        const bumpCount = Math.floor(roadRoughness / 25) + 1;
        ctx.strokeStyle = `rgba(234, 179, 8, ${roadRoughness / 200})`;
        ctx.lineWidth = 1.5;
        for (let i = 0; i < bumpCount; i++) {
          const bx = cx - 60 + i * 40 + (Math.sin(t * 0.001 + i) * 2);
          ctx.beginPath();
          ctx.arc(bx, roadY - 3, 5, Math.PI, 0);
          ctx.stroke();
        }
        ctx.restore();
      }

      // ── Tire ─────────────────────────────────────────────────
      const tireY = roadY - 18 + tireOscillation * 0.3;
      ctx.save();
      ctx.strokeStyle = '#374151';
      ctx.fillStyle = '#111827';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, tireY - 14, 22, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Rim
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, tireY - 14, 10, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ── Spring ────────────────────────────────────────────────
      const springTopY = tireY - 28 + bodyOscillation * 0.3;
      const springBottomY = tireY - 28;
      const springHeight = Math.abs(springTopY - springBottomY) + 55;
      const springCoils = 7;
      const springTop = tireY - 28 - springHeight * 0.5 + bodyOscillation;
      const springBottom = tireY - 28;

      ctx.save();
      ctx.strokeStyle = '#1e40af';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.beginPath();
      const coilW = 16;
      const segH = (springBottom - springTop) / (springCoils * 2);
      ctx.moveTo(cx, springTop);
      for (let i = 0; i < springCoils * 2; i++) {
        const y = springTop + i * segH;
        const x = i % 2 === 0 ? cx + coilW : cx - coilW;
        ctx.lineTo(x, y + segH / 2);
        ctx.lineTo(cx, y + segH);
      }
      ctx.stroke();
      ctx.restore();

      // ── MR Damper ─────────────────────────────────────────────
      const damperCX = cx + 38;
      const damperTop = springTop + (springBottom - springTop) * 0.15 + bodyOscillation * 0.8;
      const damperBottom = springBottom - 2;
      const damperHeight = damperBottom - damperTop;

      // Magnetic glow when field is active
      if (magneticField > 20) {
        ctx.save();
        const glowAlpha = (magneticField / 100) * 0.3;
        ctx.shadowColor = `rgba(0, 212, 255, ${glowAlpha * 2})`;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = `rgba(0, 212, 255, ${glowAlpha})`;
        ctx.lineWidth = 8;
        ctx.strokeRect(damperCX - 6, damperTop, 12, damperHeight);
        ctx.restore();
      }

      // Cylinder body
      ctx.save();
      ctx.fillStyle = '#0d1626';
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 1.5;
      ctx.fillRect(damperCX - 6, damperTop + damperHeight * 0.4, 12, damperHeight * 0.6);
      ctx.strokeRect(damperCX - 6, damperTop + damperHeight * 0.4, 12, damperHeight * 0.6);

      // Piston rod
      ctx.fillStyle = '#374151';
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 1;
      ctx.fillRect(damperCX - 2, damperTop, 4, damperHeight * 0.55);
      ctx.strokeRect(damperCX - 2, damperTop, 4, damperHeight * 0.55);

      // MR fluid fill indicator
      const fluidLevel = (magneticField / 100);
      ctx.fillStyle = `rgba(0, 212, 255, ${0.1 + fluidLevel * 0.25})`;
      ctx.fillRect(damperCX - 5, damperTop + damperHeight * 0.42, 10, damperHeight * 0.57);

      // Label
      ctx.font = '7px monospace';
      ctx.fillStyle = '#0ea5e9';
      ctx.textAlign = 'center';
      ctx.fillText('MR', damperCX, damperBottom + 12);
      ctx.fillText('DMPR', damperCX, damperBottom + 21);
      ctx.restore();

      // ── Connection lines ──────────────────────────────────────
      ctx.save();
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      // Damper top to spring top
      ctx.beginPath();
      ctx.moveTo(cx, springTop);
      ctx.lineTo(damperCX, damperTop);
      ctx.stroke();
      // Damper bottom to spring bottom
      ctx.beginPath();
      ctx.moveTo(cx, springBottom);
      ctx.lineTo(damperCX + 6, damperBottom);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // ── Vehicle body ──────────────────────────────────────────
      const bodyY = springTop - 18;
      ctx.save();
      ctx.fillStyle = '#0d1626';
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 1.5;
      ctx.fillRect(cx - 45, bodyY, 90, 24);
      ctx.strokeRect(cx - 45, bodyY, 90, 24);

      // Body outline accents
      ctx.strokeStyle = '#0ea5e9';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(cx - 42, bodyY + 3, 84, 18);

      // Body label
      ctx.font = '8px monospace';
      ctx.fillStyle = '#0ea5e9';
      ctx.textAlign = 'center';
      ctx.fillText('VEHICLE CHASSIS', cx, bodyY + 15);
      ctx.restore();

      // ── Labels column (left side) ─────────────────────────────
      ctx.save();
      ctx.font = '8px monospace';
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'right';
      const lx = cx - 58;
      ctx.fillText('CHASSIS', lx, bodyY + 14);
      ctx.fillText('SPRING', lx, springTop + (springBottom - springTop) / 2 + 3);
      ctx.fillText('TIRE', lx, tireY - 11);
      ctx.restore();

      // ── Vertical flow arrows ──────────────────────────────────
      const arrowAlpha = 0.3 + 0.3 * Math.abs(Math.sin(t * 0.003));
      ctx.save();
      ctx.strokeStyle = `rgba(0, 212, 255, ${arrowAlpha})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(cx - 50, roadY - 4);
      ctx.lineTo(cx - 50, bodyY + 12);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrow head pointing up
      ctx.fillStyle = `rgba(0, 212, 255, ${arrowAlpha})`;
      ctx.beginPath();
      ctx.moveTo(cx - 50, bodyY + 8);
      ctx.lineTo(cx - 54, bodyY + 16);
      ctx.lineTo(cx - 46, bodyY + 16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ── Stress level indicator ────────────────────────────────
      const stressLevel = (vibrationAmplitude + roadRoughness) / 200;
      const stressColor =
        stressLevel > 0.7
          ? 'rgba(239, 68, 68, 0.8)'
          : stressLevel > 0.4
          ? 'rgba(251, 146, 60, 0.8)'
          : 'rgba(34, 197, 94, 0.8)';
      ctx.save();
      ctx.font = '7px monospace';
      ctx.fillStyle = stressColor;
      ctx.textAlign = 'left';
      ctx.fillText(`VIB: ${vibrationAmplitude}`, cx + 56, tireY - 20);
      ctx.fillText(`RD: ${roadRoughness}`, cx + 56, tireY - 10);
      ctx.restore();
    };

    const animate = (time: number) => {
      tRef.current = time;
      draw(time);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [vibrationAmplitude, roadRoughness, dampingControl, magneticField]);

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={280}
      className="w-full max-w-[260px] mx-auto"
      aria-label="Suspension visualization diagram"
      role="img"
    />
  );
};
