import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { CAPTION_STYLES } from '../../../types/studioTypes';
import { Subtitles, Plus, Type, Sparkles } from 'lucide-react';

export default function TabTextCaptions() {
  const { addClip, currentTime, showToast } = useStudio();
  const [customText, setCustomText] = useState('UNLEASH YOUR CREATIVE POWER');
  const [selectedStyle, setSelectedStyle] = useState('hormozi');

  const titlePresets = [
    { name: 'Cinematic Title', text: 'QUANTUM HORIZON', font: 'Syne', size: 64, style: 'neonGlow' },
    { name: 'Hormozi Subtitle', text: 'THIS IS HOW YOU CREATE CONTENT', font: 'Plus Jakarta Sans', size: 52, style: 'hormozi' },
    { name: 'Minimal Lower-Third', text: 'DIRECTOR // OBSIDIAN STUDIOS', font: 'Inter', size: 40, style: 'minimalCinema' },
    { name: 'Bold Impact', text: 'ZERO WATERMARKS GUARANTEED', font: 'Plus Jakarta Sans', size: 58, style: 'boldImpact' },
  ];

  const handleAddCaption = (presetObj) => {
    const textToAdd = (presetObj?.text || customText).trim();
    if (!textToAdd) return;

    const stylePreset = presetObj?.style || selectedStyle;
    const fontFamily = presetObj?.font || (stylePreset === 'neonGlow' ? 'Syne' : 'Plus Jakarta Sans');
    const fontSize = presetObj?.size || 52;

    const words = textToAdd.split(/\s+/).map((word, i, arr) => {
      const seg = 4.0 / arr.length;
      return {
        word,
        start: currentTime + (i * seg),
        end: currentTime + ((i + 1) * seg)
      };
    });

    const newClip = {
      id: `t1-cap-${Date.now()}`,
      trackId: 'T1',
      type: 'caption',
      name: `Text: ${textToAdd.slice(0, 14)}...`,
      startTime: currentTime,
      duration: 4.5,
      trimStart: 0,
      trimEnd: 4.5,
      typography: {
        text: textToAdd.toUpperCase(),
        fontFamily,
        fontSize,
        color: stylePreset === 'hormozi' ? '#FACC15' : (stylePreset === 'neonGlow' ? '#00F2FE' : '#FFFFFF'),
        strokeColor: '#000000',
        strokeWidth: stylePreset === 'minimalCinema' ? 2 : 5,
        bgPillColor: stylePreset === 'hormozi' ? 'rgba(17,19,26,0.9)' : 'transparent',
        stylePreset,
        words
      },
      transform: { x: 0, y: stylePreset === 'minimalCinema' ? 240 : 160, scale: 1.0, rotation: 0, opacity: 1.0 }
    };

    addClip(newClip);
  };

  return (
    <div className="h-full flex flex-col p-3.5 space-y-4 select-none text-xs overflow-y-auto">
      {/* Title / Header */}
      <div className="flex items-center space-x-2 pb-2 border-b border-white/[0.08]">
        <Subtitles className="w-4 h-4 text-[#8A2BE2]" />
        <span className="font-semibold text-white">Text &amp; Kinetic Subtitles</span>
      </div>

      {/* Custom Text Builder */}
      <div className="space-y-2 p-3 bg-[#11131A] rounded-xl border border-white/[0.06]">
        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
          Add Custom Kinetic Caption
        </label>
        <textarea
          rows={2}
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Type your caption text..."
          className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#8A2BE2] resize-none"
        />

        {/* Style Selector */}
        <div className="space-y-1 pt-1">
          <span className="text-[10px] text-slate-400 font-mono">Animation Style:</span>
          <div className="grid grid-cols-2 gap-1.5">
            {CAPTION_STYLES.map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStyle(st.id)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left truncate transition-all ${
                  selectedStyle === st.id
                    ? 'bg-[#8A2BE2]/20 border-[#8A2BE2] text-white'
                    : 'bg-[#181B26] border-white/[0.06] text-slate-400 hover:text-white'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleAddCaption()}
          className="w-full mt-2 py-2 rounded-lg bg-gradient-to-r from-[#8A2BE2] to-[#00F2FE] text-obsidian-950 font-bold flex items-center justify-center space-x-1 hover:brightness-110 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Insert at Playhead</span>
        </button>
      </div>

      {/* Preset Title Cards */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
          <Type className="w-3.5 h-3.5 text-[#8A2BE2]" />
          <span>1-Click Title Presets</span>
        </span>

        <div className="space-y-2">
          {titlePresets.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handleAddCaption(preset)}
              className="p-2.5 rounded-xl bg-[#11131A] border border-white/[0.06] hover:border-[#8A2BE2]/50 cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-200 block text-xs group-hover:text-[#8A2BE2] transition-colors">
                  {preset.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[180px] block">
                  "{preset.text}"
                </span>
              </div>
              <Plus className="w-4 h-4 text-slate-500 group-hover:text-[#8A2BE2] transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

