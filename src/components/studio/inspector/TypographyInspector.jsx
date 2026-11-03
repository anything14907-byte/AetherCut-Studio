import React from 'react';
import { Type, Palette, Sparkles } from 'lucide-react';
import { CAPTION_STYLES } from '../../../types/studioTypes';

export default function TypographyInspector({ clip, onUpdate }) {
  const typo = clip.typography || {
    text: '',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 52,
    color: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 4,
    bgPillColor: 'transparent',
    stylePreset: 'hormozi'
  };

  const updateTypo = (field, val) => {
    onUpdate({
      typography: {
        ...typo,
        [field]: val
      }
    });
  };

  const fonts = ['Plus Jakarta Sans', 'Inter', 'Syne', 'JetBrains Mono', 'Impact'];

  return (
    <div className="space-y-3 p-3 bg-[#11131A] rounded-xl border border-white/[0.06] text-xs">
      <div className="flex items-center space-x-1.5 text-slate-300 font-semibold font-mono text-[11px] uppercase pb-1 border-b border-white/[0.06]">
        <Type className="w-3.5 h-3.5 text-[#8A2BE2]" />
        <span>Typography &amp; Subtitle Style</span>
      </div>

      {/* Caption Content */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-mono">Text Content</label>
        <textarea
          rows={2}
          value={typo.text || ''}
          onChange={(e) => updateTypo('text', e.target.value)}
          className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#8A2BE2] resize-none"
        />
      </div>

      {/* Kinetic Style Preset */}
      <div className="space-y-1">
        <label className="text-[10px] text-slate-400 font-mono">Kinetic Subtitle Style</label>
        <div className="grid grid-cols-2 gap-1.5">
          {CAPTION_STYLES.map((st) => (
            <button
              key={st.id}
              onClick={() => updateTypo('stylePreset', st.id)}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-mono text-left truncate transition-all ${
                typo.stylePreset === st.id
                  ? 'bg-[#8A2BE2]/20 border border-[#8A2BE2] text-white font-bold'
                  : 'bg-[#181B26] border border-white/[0.06] text-slate-400 hover:text-white'
              }`}
            >
              {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* Font Family & Size */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 font-mono">Font Family</label>
          <select
            value={typo.fontFamily || 'Plus Jakarta Sans'}
            onChange={(e) => updateTypo('fontFamily', e.target.value)}
            className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg px-2 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-[#8A2BE2]"
          >
            {fonts.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
            <span>Size</span>
            <span>{typo.fontSize || 52}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="120"
            step="2"
            value={typo.fontSize || 52}
            onChange={(e) => updateTypo('fontSize', parseInt(e.target.value, 10))}
            className="w-full accent-[#8A2BE2]"
          />
        </div>
      </div>

      {/* Text Color & Stroke Color */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Text Color</label>
          <div className="flex items-center space-x-2 bg-[#0C0E15] p-1.5 rounded-lg border border-white/[0.1]">
            <input
              type="color"
              value={typo.color || '#FFFFFF'}
              onChange={(e) => updateTypo('color', e.target.value)}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
            />
            <span className="font-mono text-[10px] text-slate-300 uppercase">{typo.color || '#FFFFFF'}</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] text-slate-400 font-mono block mb-1">Stroke Width</label>
          <input
            type="range"
            min="0"
            max="12"
            step="1"
            value={typo.strokeWidth || 0}
            onChange={(e) => updateTypo('strokeWidth', parseInt(e.target.value, 10))}
            className="w-full accent-[#8A2BE2] mt-2"
          />
        </div>
      </div>
    </div>
  );
}

