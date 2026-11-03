import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { TITLE_TEMPLATES } from '../../../types/studioTypes';
import { Type, Plus, Sparkles, Palette } from 'lucide-react';

export default function TabTitlesGenerators() {
  const { addClip, currentTime, showToast } = useStudio();

  const handleAddTitle = (template) => {
    const newClip = {
      id: `t1-title-${Date.now()}`,
      trackId: 'T1',
      role: 'titles',
      name: template.name,
      startTime: currentTime,
      duration: template.duration || 4.0,
      trimStart: 0,
      trimEnd: template.duration || 4.0,
      textOverlay: {
        text: template.text,
        subtext: template.subtext || '',
        fontFamily: template.fontFamily || 'Inter',
        fontSize: template.fontSize || 48,
        color: template.color || '#FFFFFF',
        backgroundColor: template.backgroundColor || 'transparent',
        animation: template.animation || 'fade'
      },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 }
    };

    addClip(newClip);
    showToast(`Added "${template.name}" title`);
  };

  const handleAddSolidGenerator = (colorName, hex) => {
    const newClip = {
      id: `v2-solid-${Date.now()}`,
      trackId: 'V2',
      role: 'video',
      name: `Solid: ${colorName}`,
      startTime: currentTime,
      duration: 5.0,
      trimStart: 0,
      trimEnd: 5.0,
      isSolid: true,
      solidColor: hex,
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: 'normal' }
    };

    addClip(newClip);
    showToast(`Added Solid (${colorName})`);
  };

  const solids = [
    { name: 'Pure Obsidian', hex: '#0B0B0D' },
    { name: 'Chroma Green (Keyer)', hex: '#00FF00' },
    { name: 'Studio Slate', hex: '#1C1C21' },
    { name: 'Apple Pro Blue', hex: '#0A84FF' },
  ];

  return (
    <div className="h-full flex flex-col p-3 space-y-4 select-none text-xs overflow-y-auto">
      {/* Title Templates */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <Type className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Title Templates</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Track T1</span>
        </div>

        <div className="space-y-2">
          {TITLE_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleAddTitle(tpl)}
              className="p-3 rounded-xl bg-[#111114] border border-[#242429] hover:border-[#0A84FF] transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-slate-200 group-hover:text-[#0A84FF] transition-colors text-xs">
                    {tpl.name}
                  </span>
                  <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-white/[0.08] text-slate-400">
                    {tpl.animation}
                  </span>
                </div>
                <div className="p-1.5 rounded bg-black/40 border border-white/[0.06] text-[11px] font-mono text-slate-300 truncate max-w-[190px]">
                  {tpl.text}
                </div>
              </div>

              <button
                className="w-7 h-7 rounded-lg bg-[#1C1C21] group-hover:bg-[#0A84FF] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shrink-0 ml-2"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Solid & Color Generators */}
      <div className="space-y-2 pt-2 border-t border-[#242429]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <Palette className="w-3.5 h-3.5 text-[#30D158]" />
            <span>Generators &amp; Solids</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Track V2</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {solids.map((s) => (
            <button
              key={s.name}
              onClick={() => handleAddSolidGenerator(s.name, s.hex)}
              className="p-2.5 rounded-xl bg-[#111114] border border-[#242429] hover:border-[#30D158] flex flex-col space-y-1.5 items-start text-left transition-colors group"
            >
              <div
                className="w-full h-7 rounded-md border border-white/[0.1] shadow-inner"
                style={{ backgroundColor: s.hex }}
              />
              <span className="font-medium text-slate-300 text-[11px] group-hover:text-white truncate w-full">
                {s.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
