import React from 'react';
import { Move, RotateCw, ZoomIn, Eye } from 'lucide-react';

export default function TransformInspector({ clip, onUpdate }) {
  const t = clip.transform || { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 };

  const updateT = (field, val) => {
    onUpdate({
      transform: {
        ...t,
        [field]: val
      }
    });
  };

  return (
    <div className="space-y-3 p-3 bg-[#11131A] rounded-xl border border-white/[0.06] text-xs">
      <div className="flex items-center space-x-1.5 text-slate-300 font-semibold font-mono text-[11px] uppercase pb-1 border-b border-white/[0.06]">
        <Move className="w-3.5 h-3.5 text-[#00F2FE]" />
        <span>Transform &amp; Framing</span>
      </div>

      {/* Position X / Y */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 font-mono">X Offset (px)</label>
          <input
            type="number"
            value={t.x || 0}
            onChange={(e) => updateT('x', parseInt(e.target.value, 10) || 0)}
            className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#00F2FE]"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 font-mono">Y Offset (px)</label>
          <input
            type="number"
            value={t.y || 0}
            onChange={(e) => updateT('y', parseInt(e.target.value, 10) || 0)}
            className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#00F2FE]"
          />
        </div>
      </div>

      {/* Scale */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span className="flex items-center space-x-1">
            <ZoomIn className="w-3 h-3 text-[#00F2FE]" />
            <span>Scale</span>
          </span>
          <span className="font-mono text-electric-cyan font-bold">{Math.round((t.scale || 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="2.5"
          step="0.05"
          value={t.scale ?? 1.0}
          onChange={(e) => updateT('scale', parseFloat(e.target.value))}
          className="w-full accent-[#00F2FE]"
        />
      </div>

      {/* Rotation */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span className="flex items-center space-x-1">
            <RotateCw className="w-3 h-3 text-[#00F2FE]" />
            <span>Rotation</span>
          </span>
          <span className="font-mono text-electric-cyan">{t.rotation || 0}°</span>
        </div>
        <input
          type="range"
          min="-180"
          max="180"
          step="1"
          value={t.rotation || 0}
          onChange={(e) => updateT('rotation', parseInt(e.target.value, 10))}
          className="w-full accent-[#00F2FE]"
        />
      </div>

      {/* Opacity */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span className="flex items-center space-x-1">
            <Eye className="w-3 h-3 text-[#00F2FE]" />
            <span>Opacity</span>
          </span>
          <span className="font-mono text-electric-cyan">{Math.round((t.opacity ?? 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={t.opacity ?? 1.0}
          onChange={(e) => updateT('opacity', parseFloat(e.target.value))}
          className="w-full accent-[#00F2FE]"
        />
      </div>
    </div>
  );
}

