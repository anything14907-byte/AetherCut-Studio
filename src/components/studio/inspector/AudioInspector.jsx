import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { AUDIO_EQ_PRESETS } from '../../../types/studioTypes';
import { Volume2, Mic, Sliders, Sparkles, Radio } from 'lucide-react';

export default function AudioInspector({ clip, onUpdate }) {
  const {
    voiceIsolation,
    toggleVoiceIsolation,
    autoDuck,
    toggleAutoDuck,
    currentEqPreset,
    setEqPreset
  } = useStudio();

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
    <div className="space-y-3.5 p-3.5 bg-[#161619] rounded-xl border border-[#242429] text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#242429]">
        <div className="flex items-center space-x-1.5 text-slate-200 font-semibold font-mono text-[11px] uppercase">
          <Volume2 className="w-3.5 h-3.5 text-[#30D158]" />
          <span>Pro Audio Dynamics &amp; EQ</span>
        </div>
        <span className="text-[10px] font-mono text-[#30D158]">Final Cut Audio</span>
      </div>

      {/* Pro Audio Features: Voice Isolation & Auto-Ducking */}
      <div className="space-y-2">
        <label className="text-[10px] text-slate-400 font-mono uppercase font-bold">
          Intelligent Audio Enhancements
        </label>
        
        {/* Voice Isolation Toggle */}
        <div
          onClick={toggleVoiceIsolation}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            voiceIsolation
              ? 'bg-[#30D158]/15 border-[#30D158] text-white shadow-sm'
              : 'bg-[#1C1C21] border-[#242429] text-slate-300 hover:border-white/[0.15]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Mic className={`w-4 h-4 ${voiceIsolation ? 'text-[#30D158]' : 'text-slate-400'}`} />
            <div>
              <span className="font-semibold text-xs block">Voice Isolation</span>
              <span className="text-[10px] text-slate-400 block">Enhance vocal clarity &amp; filter noise</span>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            voiceIsolation ? 'bg-[#30D158] text-black' : 'bg-[#242429] text-slate-400'
          }`}>
            {voiceIsolation ? 'ACTIVE' : 'OFF'}
          </span>
        </div>

        {/* 1-Click Auto-Duck Music */}
        <div
          onClick={toggleAutoDuck}
          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
            autoDuck
              ? 'bg-[#0A84FF]/15 border-[#0A84FF] text-white shadow-sm'
              : 'bg-[#1C1C21] border-[#242429] text-slate-300 hover:border-white/[0.15]'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Radio className={`w-4 h-4 ${autoDuck ? 'text-[#0A84FF]' : 'text-slate-400'}`} />
            <div>
              <span className="font-semibold text-xs block">Auto-Duck Soundtrack</span>
              <span className="text-[10px] text-slate-400 block">-14dB attenuation during voiceover</span>
            </div>
          </div>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
            autoDuck ? 'bg-[#0A84FF] text-white' : 'bg-[#242429] text-slate-400'
          }`}>
            {autoDuck ? 'DUCKING' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Audio EQ Presets */}
      <div className="space-y-1.5 pt-1">
        <label className="text-[10px] text-slate-400 font-mono uppercase font-bold">
          Audio EQ Profiles
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {AUDIO_EQ_PRESETS.map((eq) => (
            <button
              key={eq.id}
              onClick={() => setEqPreset(eq.id)}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-mono truncate transition-all ${
                currentEqPreset === eq.id
                  ? 'bg-[#30D158] text-black font-bold shadow-sm'
                  : 'bg-[#1C1C21] text-slate-400 hover:text-white border border-white/[0.04]'
              }`}
            >
              {eq.name}
            </button>
          ))}
        </div>
      </div>

      {/* Volume Gain (0% to 200%) */}
      <div className="space-y-1.5 pt-2 border-t border-[#242429]">
        <div className="flex justify-between text-[11px] text-slate-300 font-mono">
          <span>Clip Volume Gain</span>
          <span className="text-[#30D158] font-bold tabular-nums">
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
          className="w-full accent-[#30D158]"
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
            className="w-full bg-[#0E0E12] border border-[#242429] rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#30D158] tabular-nums"
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
            className="w-full bg-[#0E0E12] border border-[#242429] rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#30D158] tabular-nums"
          />
        </div>
      </div>
    </div>
  );
}
