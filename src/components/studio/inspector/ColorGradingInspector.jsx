import React from 'react';
import { Sliders, Sun, Contrast, Droplet, Sparkles } from 'lucide-react';
import { LUT_PRESETS } from '../../../types/studioTypes';

export default function ColorGradingInspector({ clip, onUpdate }) {
  const f = clip.colorFilter || {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotate: 0,
    blur: 0,
    lutPreset: 'none'
  };

  const updateF = (field, val) => {
    onUpdate({
      colorFilter: {
        ...f,
        [field]: val
      }
    });
  };

  return (
    <div className="space-y-3 p-3 bg-[#11131A] rounded-xl border border-white/[0.06] text-xs">
      <div className="flex items-center space-x-1.5 text-slate-300 font-semibold font-mono text-[11px] uppercase pb-1 border-b border-white/[0.06]">
        <Sliders className="w-3.5 h-3.5 text-[#00F2FE]" />
        <span>Color Grading &amp; LUTs</span>
      </div>

      {/* Preset LUT Pills */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-mono">LUT Preset</label>
        <div className="grid grid-cols-3 gap-1">
          {LUT_PRESETS.map((lut) => (
            <button
              key={lut.id}
              onClick={() => updateF('lutPreset', lut.id)}
              className={`px-1.5 py-1 rounded text-[10px] font-mono truncate transition-all ${
                f.lutPreset === lut.id
                  ? 'bg-[#00F2FE]/20 text-[#00F2FE] border border-[#00F2FE]/40 font-bold'
                  : 'bg-[#181B26] text-slate-400 hover:text-white border border-white/[0.04]'
              }`}
            >
              {lut.label.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Brightness */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span className="flex items-center space-x-1">
            <Sun className="w-3 h-3 text-amber-400" />
            <span>Brightness</span>
          </span>
          <span className="font-mono text-slate-400">{f.brightness ?? 100}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="200"
          step="5"
          value={f.brightness ?? 100}
          onChange={(e) => updateF('brightness', parseInt(e.target.value, 10))}
          className="w-full accent-[#00F2FE]"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span className="flex items-center space-x-1">
            <Contrast className="w-3 h-3 text-slate-300" />
            <span>Contrast</span>
          </span>
          <span className="font-mono text-slate-400">{f.contrast ?? 100}%</span>
        </div>
        <input
          type="range"
          min="50"
          max="200"
          step="5"
          value={f.contrast ?? 100}
          onChange={(e) => updateF('contrast', parseInt(e.target.value, 10))}
          className="w-full accent-[#00F2FE]"
        />
      </div>

      {/* Saturation */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span className="flex items-center space-x-1">
            <Droplet className="w-3 h-3 text-electric-magenta" />
            <span>Saturation</span>
          </span>
          <span className="font-mono text-slate-400">{f.saturation ?? 100}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="250"
          step="5"
          value={f.saturation ?? 100}
          onChange={(e) => updateF('saturation', parseInt(e.target.value, 10))}
          className="w-full accent-[#00F2FE]"
        />
      </div>

      {/* Blur */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span>Lens Blur</span>
          <span className="font-mono text-slate-400">{f.blur || 0}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="20"
          step="1"
          value={f.blur || 0}
          onChange={(e) => updateF('blur', parseInt(e.target.value, 10))}
          className="w-full accent-[#00F2FE]"
        />
      </div>
    </div>
  );
}

