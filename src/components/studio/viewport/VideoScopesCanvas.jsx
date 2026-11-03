import React, { useRef, useEffect } from 'react';
import { extractScopeData } from '../../../services/canvasRenderer';
import { Activity, X } from 'lucide-react';

export default function VideoScopesCanvas({ sourceCanvasRef, onClose }) {
  const scopeCanvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const drawScopes = () => {
      const source = sourceCanvasRef?.current;
      const target = scopeCanvasRef?.current;
      if (!source || !target) return;

      const tCtx = target.getContext('2d');
      if (!tCtx) return;

      const scopeData = extractScopeData(source);
      if (!scopeData) return;

      const w = target.width;
      const h = target.height;

      // Clear dark scope backdrop
      tCtx.fillStyle = '#0B0B0E';
      tCtx.fillRect(0, 0, w, h);

      // Grid Lines (100 IRE, 50 IRE, 0 IRE)
      tCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      tCtx.lineWidth = 1;
      tCtx.setLineDash([3, 3]);

      // 100 IRE Line
      const y100 = h * 0.15;
      tCtx.beginPath();
      tCtx.moveTo(0, y100);
      tCtx.lineTo(w, y100);
      tCtx.stroke();

      // 50 IRE Line
      const y50 = h * 0.52;
      tCtx.beginPath();
      tCtx.moveTo(0, y50);
      tCtx.lineTo(w, y50);
      tCtx.stroke();

      // 0 IRE Line
      const y0 = h * 0.88;
      tCtx.beginPath();
      tCtx.moveTo(0, y0);
      tCtx.lineTo(w, y0);
      tCtx.stroke();
      tCtx.setLineDash([]);

      // Labels
      tCtx.fillStyle = '#8E8E93';
      tCtx.font = '9px "JetBrains Mono", monospace';
      tCtx.fillText('100 IRE', 4, y100 - 3);
      tCtx.fillText('50 IRE', 4, y50 - 3);
      tCtx.fillText('0 IRE', 4, y0 - 3);

      // 4 Quadrants: Luma (Left), Red (Mid-Left), Green (Mid-Right), Blue (Right)
      const colW = w / 4;

      const renderCurve = (histogram, color, startX, label) => {
        tCtx.strokeStyle = color;
        tCtx.lineWidth = 1.5;
        tCtx.beginPath();

        const maxVal = Math.max(...histogram, 1);
        const graphH = y0 - y100;

        for (let i = 0; i < histogram.length; i++) {
          const val = histogram[i];
          const x = startX + (i / histogram.length) * (colW - 8);
          const y = y0 - (val / maxVal) * graphH;
          if (i === 0) tCtx.moveTo(x, y);
          else tCtx.lineTo(x, y);
        }
        tCtx.stroke();

        // Title Badge
        tCtx.fillStyle = color;
        tCtx.fillText(label, startX + 4, h - 6);
      };

      // Draw 4 Parades
      renderCurve(scopeData.luma, '#FFFFFF', 45, 'LUMA');
      renderCurve(scopeData.r, '#FF453A', colW + 15, 'RED');
      renderCurve(scopeData.g, '#30D158', colW * 2 + 15, 'GREEN');
      renderCurve(scopeData.b, '#0A84FF', colW * 3 + 15, 'BLUE');

      animRef.current = requestAnimationFrame(drawScopes);
    };

    animRef.current = requestAnimationFrame(drawScopes);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [sourceCanvasRef]);

  return (
    <div className="absolute top-3 left-3 z-30 w-80 md:w-96 bg-[#161619]/95 border border-[#242429] rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in fade-in duration-200">
      <div className="px-3 py-1.5 bg-[#1C1C21] border-b border-[#242429] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 text-slate-200 font-mono text-[11px] font-semibold">
          <Activity className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>Luma Waveform &amp; RGB Parade</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="p-2">
        <canvas
          ref={scopeCanvasRef}
          width={360}
          height={160}
          className="w-full h-40 rounded bg-[#0B0B0E]"
        />
      </div>
    </div>
  );
}

