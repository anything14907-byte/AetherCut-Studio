import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import FcpColorBoard from './FcpColorBoard';
import ColorWheelsInspector from './ColorWheelsInspector';
import { FCP_ROLES, BLEND_MODES, AUDIO_EQ_PRESETS, formatSmpteTimecode } from '../../../types/studioTypes';
import {
  Film,
  Disc,
  Volume2,
  Info,
  Check,
  RotateCcw,
  Sliders,
  ChevronDown,
  Layers,
  Wand2
} from 'lucide-react';

export default function FcpInspector() {
  const {
    selectedClip,
    updateClip,
    selectedClipId,
    project
  } = useStudio();

  const [activeInspectorTab, setActiveInspectorTab] = useState('video'); // 'video' | 'color' | 'audio' | 'info'
  const [colorInspectorSubMode, setColorInspectorSubMode] = useState('board'); // 'board' | 'wheels' | 'curves' | 'hueSat'

  if (!selectedClip) {
    return (
      <div className="w-80 bg-[#1E1E20] border-l border-[#000000] flex flex-col items-center justify-center p-6 text-center text-[#8E8E93] text-xs font-mono shrink-0 select-none">
        <Film className="w-8 h-8 mb-2 opacity-30 text-[#0A84FF]" />
        <span className="font-semibold text-white block mb-1">No Selection</span>
        <span className="text-[11px] leading-relaxed">Select a clip on the storyline to inspect video, color, and audio properties.</span>
      </div>
    );
  }

  const t = selectedClip.transform || { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: 'normal' };
  const crop = selectedClip.crop || { top: 0, bottom: 0, left: 0, right: 0, type: 'trim' };
  const audio = selectedClip.audio || { volume: 1.0, pan: 0, voiceIsolation: false, autoDuck: true, eqPreset: 'flat' };
  const currentRole = selectedClip.role || (selectedClip.trackId === 'A1' ? 'dialogue' : selectedClip.trackId === 'T1' ? 'titles' : 'video');

  return (
    <div className="w-80 bg-[#1E1E20] border-l border-[#000000] flex flex-col h-full text-xs text-[#ECECEE] shrink-0 select-none overflow-hidden">
      {/* INSPECTOR TOP TAB BAR: 4 Icons (Video, Color, Audio, Info) */}
      <div className="h-8 bg-[#18181A] border-b border-[#000000] px-2 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveInspectorTab('video')}
            title="Video Inspector"
            className={`p-1 rounded-[3px] transition-colors ${
              activeInspectorTab === 'video' ? 'bg-[#3A3A40] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveInspectorTab('color')}
            title="Color Inspector"
            className={`p-1 rounded-[3px] transition-colors ${
              activeInspectorTab === 'color' ? 'bg-[#3A3A40] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveInspectorTab('audio')}
            title="Audio Inspector"
            className={`p-1 rounded-[3px] transition-colors ${
              activeInspectorTab === 'audio' ? 'bg-[#3A3A40] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveInspectorTab('info')}
            title="Info Inspector"
            className={`p-1 rounded-[3px] transition-colors ${
              activeInspectorTab === 'info' ? 'bg-[#3A3A40] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clip Name Summary */}
        <span className="text-[10px] text-[#A1A1A6] font-medium truncate max-w-[130px]">
          {selectedClip.name}
        </span>
      </div>

      {/* INSPECTOR BODY */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5">
        {/* TAB 1: VIDEO INSPECTOR */}
        {activeInspectorTab === 'video' && (
          <div className="space-y-3">
            {/* Compositing Section */}
            <div className="bg-[#1C1C1F] p-2.5 rounded border border-[#2D2D31] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#2D2D31]">
                <div className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#0A84FF]" />
                  <span className="font-semibold text-xs">Compositing</span>
                </div>
                <button
                  onClick={() => updateClip(selectedClip.id, { transform: { ...t, opacity: 1.0, blendMode: 'normal' } })}
                  title="Reset Compositing"
                  className="text-[#8E8E93] hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#A1A1A6]">Blend Mode</span>
                  <select
                    value={t.blendMode || 'normal'}
                    onChange={(e) => updateClip(selectedClip.id, { transform: { ...t, blendMode: e.target.value } })}
                    className="bg-[#151517] border border-[#2D2D31] text-[10px] text-white rounded px-2 py-0.5 focus:outline-none"
                  >
                    {BLEND_MODES.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-0.5">
                  <div className="flex justify-between text-[11px] text-[#A1A1A6]">
                    <span>Opacity</span>
                    <span className="font-mono text-white">{Math.round((t.opacity ?? 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={t.opacity ?? 1.0}
                    onChange={(e) => updateClip(selectedClip.id, { transform: { ...t, opacity: parseFloat(e.target.value) } })}
                    className="w-full accent-[#0A84FF]"
                  />
                </div>
              </div>
            </div>

            {/* Transform Section */}
            <div className="bg-[#1C1C1F] p-2.5 rounded border border-[#2D2D31] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#2D2D31]">
                <div className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#0A84FF]" />
                  <span className="font-semibold text-xs">Transform</span>
                </div>
                <button
                  onClick={() => updateClip(selectedClip.id, { transform: { ...t, x: 0, y: 0, scale: 1.0, rotation: 0 } })}
                  title="Reset Transform"
                  className="text-[#8E8E93] hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <label className="text-[10px] text-[#8E8E93] block">Position X (px)</label>
                  <input
                    type="number"
                    value={t.x || 0}
                    onChange={(e) => updateClip(selectedClip.id, { transform: { ...t, x: parseInt(e.target.value, 10) || 0 } })}
                    className="w-full bg-[#151517] border border-[#2D2D31] rounded px-1.5 py-0.5 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8E8E93] block">Position Y (px)</label>
                  <input
                    type="number"
                    value={t.y || 0}
                    onChange={(e) => updateClip(selectedClip.id, { transform: { ...t, y: parseInt(e.target.value, 10) || 0 } })}
                    className="w-full bg-[#151517] border border-[#2D2D31] rounded px-1.5 py-0.5 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px] text-[#A1A1A6]">
                  <span>Scale All</span>
                  <span className="font-mono text-white">{Math.round((t.scale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.5"
                  step="0.05"
                  value={t.scale ?? 1.0}
                  onChange={(e) => updateClip(selectedClip.id, { transform: { ...t, scale: parseFloat(e.target.value) } })}
                  className="w-full accent-[#0A84FF]"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex justify-between text-[11px] text-[#A1A1A6]">
                  <span>Rotation</span>
                  <span className="font-mono text-white">{t.rotation || 0}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={t.rotation || 0}
                  onChange={(e) => updateClip(selectedClip.id, { transform: { ...t, rotation: parseInt(e.target.value, 10) } })}
                  className="w-full accent-[#0A84FF]"
                />
              </div>
            </div>

            {/* Crop & Ken Burns Section */}
            <div className="bg-[#1C1C1F] p-2.5 rounded border border-[#2D2D31] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#2D2D31]">
                <div className="flex items-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-[#0A84FF]" />
                  <span className="font-semibold text-xs">Crop</span>
                </div>
                <span className="text-[10px] text-[#8E8E93] font-mono">Trim</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div>
                  <span className="text-[#8E8E93]">Left:</span>
                  <input
                    type="number"
                    value={crop.left || 0}
                    onChange={(e) => updateClip(selectedClip.id, { crop: { ...crop, left: parseInt(e.target.value, 10) || 0 } })}
                    className="w-full bg-[#151517] border border-[#2D2D31] rounded px-1 py-0.5 text-white"
                  />
                </div>
                <div>
                  <span className="text-[#8E8E93]">Right:</span>
                  <input
                    type="number"
                    value={crop.right || 0}
                    onChange={(e) => updateClip(selectedClip.id, { crop: { ...crop, right: parseInt(e.target.value, 10) || 0 } })}
                    className="w-full bg-[#151517] border border-[#2D2D31] rounded px-1 py-0.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COLOR INSPECTOR (Color Board, Color Wheels, Curves) */}
        {activeInspectorTab === 'color' && (
          <div className="space-y-3">
            {/* Color Sub-Mode Dropdown Switcher */}
            <div className="flex items-center justify-between pb-1">
              <span className="text-[10px] uppercase font-mono text-[#8E8E93] font-bold">Correction 1</span>
              <select
                value={colorInspectorSubMode}
                onChange={(e) => setColorInspectorSubMode(e.target.value)}
                className="bg-[#151517] border border-[#2D2D31] text-[11px] text-white rounded px-2 py-1 font-semibold focus:outline-none"
              >
                <option value="board">Color Board (FCP Classic)</option>
                <option value="wheels">Color Wheels</option>
                <option value="curves">Color Curves</option>
              </select>
            </div>

            {/* 1. Signature FCP Color Board */}
            {colorInspectorSubMode === 'board' && (
              <FcpColorBoard
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
            )}

            {/* 2. Color Wheels */}
            {colorInspectorSubMode === 'wheels' && (
              <ColorWheelsInspector
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
            )}

            {/* 3. Color Curves Simulation */}
            {colorInspectorSubMode === 'curves' && (
              <div className="bg-[#1C1C1F] p-3 rounded border border-[#2D2D31] space-y-2">
                <span className="text-[11px] font-semibold text-white block">Luma RGB Curves</span>
                <div className="w-full h-32 bg-[#121214] border border-[#28282E] rounded relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full stroke-white fill-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="0" y1="100" x2="100" y2="0" stroke="rgba(255,255,255,0.2)" strokeDasharray="3,3" />
                    <path d="M 0 100 C 30 70, 70 30, 100 0" stroke="#0A84FF" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AUDIO INSPECTOR */}
        {activeInspectorTab === 'audio' && (
          <div className="space-y-3">
            <div className="bg-[#1C1C1F] p-2.5 rounded border border-[#2D2D31] space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#2D2D31]">
                <span className="font-semibold text-xs">Audio Dynamics</span>
                <span className="text-[10px] font-mono text-[#30D158]">FCP Audio</span>
              </div>

              {/* Volume dB */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-[#A1A1A6]">
                  <span>Volume</span>
                  <span className="font-mono text-white">{((audio.volume - 1.0) * 12).toFixed(1)} dB</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={audio.volume ?? 1.0}
                  onChange={(e) => updateClip(selectedClip.id, { audio: { ...audio, volume: parseFloat(e.target.value) } })}
                  className="w-full accent-[#30D158]"
                />
              </div>

              {/* Pan Slider */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-[#A1A1A6]">
                  <span>Pan (Stereo)</span>
                  <span className="font-mono text-white">{audio.pan === 0 ? 'C' : audio.pan < 0 ? `L ${Math.abs(audio.pan)}` : `R ${audio.pan}`}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="5"
                  value={audio.pan || 0}
                  onChange={(e) => updateClip(selectedClip.id, { audio: { ...audio, pan: parseInt(e.target.value, 10) } })}
                  className="w-full accent-[#30D158]"
                />
              </div>

              {/* Equalization Presets */}
              <div className="space-y-1 pt-1">
                <label className="text-[10px] text-[#8E8E93] uppercase font-bold block">Equalization</label>
                <select
                  value={audio.eqPreset || 'flat'}
                  onChange={(e) => updateClip(selectedClip.id, { audio: { ...audio, eqPreset: e.target.value } })}
                  className="w-full bg-[#151517] border border-[#2D2D31] text-[11px] text-white rounded p-1"
                >
                  {AUDIO_EQ_PRESETS.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                  ))}
                </select>
              </div>

              {/* Voice Isolation Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#ECECEE]">Voice Isolation</span>
                <input
                  type="checkbox"
                  checked={!!audio.voiceIsolation}
                  onChange={(e) => updateClip(selectedClip.id, { audio: { ...audio, voiceIsolation: e.target.checked } })}
                  className="accent-[#30D158] w-4 h-4"
                />
              </div>

              {/* Auto-Duck Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#ECECEE]">Auto-Duck Music (-14dB)</span>
                <input
                  type="checkbox"
                  checked={audio.autoDuck !== false}
                  onChange={(e) => updateClip(selectedClip.id, { audio: { ...audio, autoDuck: e.target.checked } })}
                  className="accent-[#30D158] w-4 h-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INFO INSPECTOR */}
        {activeInspectorTab === 'info' && (
          <div className="space-y-3 font-mono text-[11px]">
            <div className="bg-[#1C1C1F] p-3 rounded border border-[#2D2D31] space-y-2">
              <span className="font-semibold text-xs text-white block pb-1 border-b border-[#2D2D31]">
                Clip Information
              </span>

              <div className="flex justify-between">
                <span className="text-[#8E8E93]">NAME:</span>
                <span className="text-white truncate max-w-[150px]">{selectedClip.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">FORMAT:</span>
                <span className="text-white">Apple ProRes 422 HQ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">FRAME RATE:</span>
                <span className="text-white">59.94p</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">START:</span>
                <span className="text-white tabular-nums">{formatSmpteTimecode(selectedClip.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">DURATION:</span>
                <span className="text-white tabular-nums">{selectedClip.duration.toFixed(2)}s</span>
              </div>

              {/* Roles Dropdown */}
              <div className="pt-2 border-t border-[#2D2D31] space-y-1">
                <span className="text-[#8E8E93] text-[10px] block">ROLE ASSIGNMENT:</span>
                <select
                  value={currentRole}
                  onChange={(e) => updateClip(selectedClip.id, { role: e.target.value })}
                  className="w-full bg-[#151517] border border-[#2D2D31] text-[11px] text-white rounded p-1 capitalize"
                >
                  {FCP_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

