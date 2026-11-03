import React, { useRef, useEffect } from 'react';

export default function WaveformCanvas({ width, height = 36, color = '#10B981' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    const step = 4;
    const barCount = Math.floor(width / step);

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.65;

    for (let i = 0; i < barCount; i++) {
      // Procedural waveform envelope
      const seed = Math.sin(i * 0.2) * Math.cos(i * 0.05);
      const randomNoise = (Math.sin(i * 99.3) * 0.5 + 0.5);
      const amp = Math.max(3, (Math.abs(seed) * 0.7 + randomNoise * 0.3) * (height * 0.8));

      const x = i * step;
      const y = centerY - amp / 2;

      ctx.fillRect(x, y, 2.5, amp);
    }
  }, [width, height, color]);

  return (
    <canvas
      ref={canvasRef}
      width={Math.max(10, width)}
      height={height}
      className="absolute inset-0 pointer-events-none opacity-50"
    />
  );
}

