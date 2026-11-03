import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { TRANSITION_PRESETS, LUT_PRESETS } from '../../../types/studioTypes';
import { Layers, Sliders, Zap, Check } from 'lucide-react';

export default function TabEffectsTransitions() {
  const { selectedClip, updateClip, setClipSpeed, showToast } = useStudio();

  const handleApplyTransition = (trans) => {
    if (!selectedClip) {
      showToast('Select a clip first to apply transition');
      return;
    }
    updateClip(selectedClip.id, {
      transition: {
        type: trans.id,
        duration: 0.8
      }
    });
    showToast(`Applied ${trans.name} transition`);
  };

  const handleApplyLut = (lut) => {
    if (!selectedClip) {
      showToast('Select a clip first to apply LUT');
      return;
    }
    updateClip(selectedClip.id, {
      colorFilter: {
        ...(selectedClip.colorFilter || {}),
        lutPreset: lut.id
      }
    });
    showToast(`Applied LUT: ${lut.name}`);
  };

  const speedPresets = [
    { label: '25% Super Slow', speed: 0.25, isReversed: false },
    { label: '50% Slow Mo', speed: 0.5, isReversed: false },
    { label: '100% Normal', speed: 1.0, isReversed: false },
    { label: '200% Fast (2x)', speed: 2.0, isReversed: false },
    { label: '400% Hyperlapse', speed: 4.0, isReversed: false },
    { label: 'Reverse Playback', speed: 1.0, isReversed: true },
  ];

  return (
    <div className="h-full flex flex-col p-3 space-y-4 select-none text-xs overflow-y-auto">
      {/* Retiming / Speed Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-[#FF9F0A]" />
            <span>Speed Retiming (⌘R)</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {selectedClip ? selectedClip.name.slice(0, 14) : 'Select a clip'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {speedPresets.map((sp) => (
            <button
              key={sp.label}
              onClick={() => {
                if (!selectedClip) {
                  showToast('Select a clip first');
                  return;
                }
                setClipSpeed(selectedClip.id, { speed: sp.speed, isReversed: sp.isReversed, adjustDuration: true });
              }}
              className="p-2 rounded-lg bg-[#111114] border border-[#242429] hover:border-[#FF9F0A] hover:bg-[#1C1C21] text-slate-300 hover:text-white transition-colors text-left font-mono text-[11px]"
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Video Transitions */}
      <div className="space-y-2 pt-2 border-t border-[#242429]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Video Transitions</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Cut Stems</span>
        </div>

        <div className="space-y-1.5">
          {TRANSITION_PRESETS.map((t) => {
            const isApplied = selectedClip?.transition?.type === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleApplyTransition(t)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isApplied
                    ? 'bg-[#0A84FF]/10 border-[#0A84FF] text-white'
                    : 'bg-[#111114] border-[#242429] text-slate-300 hover:border-white/[0.2]'
                }`}
              >
                <div>
                  <span className="font-semibold text-xs block group-hover:text-[#0A84FF] transition-colors">
                    {t.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {t.description}
                  </span>
                </div>
                {isApplied && <Check className="w-4 h-4 text-[#0A84FF]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D LUT Color Presets */}
      <div className="space-y-2 pt-2 border-t border-[#242429]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#BF5AF2]" />
            <span>Cinematic 3D LUTs</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Color Space</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {LUT_PRESETS.map((lut) => {
            const isApplied = selectedClip?.colorFilter?.lutPreset === lut.id;
            return (
              <button
                key={lut.id}
                onClick={() => handleApplyLut(lut)}
                className={`p-2 rounded-lg border text-left font-mono text-[11px] transition-colors truncate ${
                  isApplied
                    ? 'bg-[#BF5AF2]/20 border-[#BF5AF2] text-white font-bold'
                    : 'bg-[#111114] border-[#242429] text-slate-400 hover:text-white hover:border-white/[0.2]'
                }`}
              >
                {lut.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
