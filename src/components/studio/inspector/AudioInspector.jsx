import React from 'react';
import { Volume2, Music, Mic } from 'lucide-react';

export default function AudioInspector({ clip, onUpdate }) {
  const audio = clip.audio || { volume: 1.0, fadeIn: 0.2, fadeOut: 0.2 };

  const updateA = (field, val) => {
    onUpdate({
      audio: {
        ...audio,
        [field]: val
      }
    });
  };

  return (
    <div className="space-y-3 p-3 bg-[#11131A] rounded-xl border border-white/[0.06] text-xs">
      <div className="flex items-center space-x-1.5 text-slate-300 font-semibold font-mono text-[11px] uppercase pb-1 border-b border-white/[0.06]">
        <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />
        <span>Audio Gain &amp; Dynamics</span>
      </div>

      {/* Volume Gain (0% to 200%) */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-300">
          <span>Volume Gain</span>
          <span className="font-mono text-emerald-400 font-bold">
            {Math.round((audio.volume ?? 1.0) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="2.0"
          step="0.05"
          value={audio.volume ?? 1.0}
          onChange={(e) => updateA('volume', parseFloat(e.target.value))}
          className="w-full accent-[#10B981]"
        />
      </div>

      {/* Fade In & Fade Out */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 font-mono">Fade In (sec)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={audio.fadeIn ?? 0.2}
            onChange={(e) => updateA('fadeIn', parseFloat(e.target.value) || 0)}
            className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#10B981]"
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono">Fade Out (sec)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={audio.fadeOut ?? 0.2}
            onChange={(e) => updateA('fadeOut', parseFloat(e.target.value) || 0)}
            className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#10B981]"
          />
        </div>
      </div>
    </div>
  );
}

