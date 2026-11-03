import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import RotaryJogWheel from './RotaryJogWheel';
import StereoPeakMeter from './StereoPeakMeter';
import {
  MousePointer,
  Scissors,
  Magnet,
  Eye,
  EyeOff,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';

export default function TimelineToolbar() {
  const {
    activeTool,
    setActiveTool,
    isMagnetic,
    setIsMagnetic,
    isSkimmingEnabled,
    setIsSkimmingEnabled,
    undo,
    redo,
    splitClipAtPlayhead,
    duplicateClip,
    deleteClip,
    selectedClipId,
    zoom,
    setZoom,
    showToast
  } = useStudio();

  return (
    <div className="h-11 bg-[#161619] border-t border-b border-[#242429] px-3 flex items-center justify-between select-none text-xs">
      {/* Left: Tools, Magnetic Toggle, Skimmer & Rotary Jog Wheel */}
      <div className="flex items-center space-x-1.5">
        {/* Select Tool (A) */}
        <button
          onClick={() => {
            setActiveTool('select');
            showToast('Select Tool (A)');
          }}
          title="Select Tool (A)"
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'select'
              ? 'bg-[#0A84FF] text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#242429]'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
        </button>

        {/* Blade Tool (B) */}
        <button
          onClick={() => {
            setActiveTool('blade');
            showToast('Blade Tool (B): Click any clip to cut');
          }}
          title="Blade Tool (B)"
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'blade'
              ? 'bg-red-500 text-white shadow-sm animate-pulse'
              : 'text-slate-400 hover:text-white hover:bg-[#242429]'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-[#242429] mx-1" />

        {/* Magnetic Timeline Toggle (M) */}
        <button
          onClick={() => {
            setIsMagnetic(!isMagnetic);
            showToast(!isMagnetic ? 'Magnetic Timeline: Enabled (M)' : 'Magnetic Timeline: Disabled (M)');
          }}
          title={isMagnetic ? 'Magnetic Timeline Active (Clips snap automatically)' : 'Magnetic Timeline Off'}
          className={`px-2 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1 transition-all ${
            isMagnetic
              ? 'bg-[#0A84FF]/20 text-[#0A84FF] border border-[#0A84FF]/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#242429]'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Magnetic</span>
        </button>

        {/* Live Hover Skimming Toggle (S) */}
        <button
          onClick={() => {
            setIsSkimmingEnabled(!isSkimmingEnabled);
            showToast(!isSkimmingEnabled ? 'Live Skimming: ON (S)' : 'Live Skimming: OFF (S)');
          }}
          title={isSkimmingEnabled ? 'Skimming Active (Hover to preview frames)' : 'Skimming Disabled'}
          className={`px-2 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1 transition-all ${
            isSkimmingEnabled
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#242429]'
          }`}
        >
          {isSkimmingEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Skimmer</span>
        </button>

        <div className="h-4 w-[1px] bg-[#242429] mx-1" />

        {/* Rotary Tactile Jog Wheel */}
        <RotaryJogWheel />
      </div>

      {/* Center: Standard Edit Operations (Undo, Redo, Duplicate, Delete) */}
      <div className="hidden lg:flex items-center space-x-1">
        <button
          onClick={undo}
          title="Undo (Cmd+Z)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#242429]"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={redo}
          title="Redo (Cmd+Y)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#242429]"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => duplicateClip()}
          disabled={!selectedClipId}
          title="Duplicate Selected Clip (D)"
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-[#242429] disabled:opacity-30 text-[11px] font-mono flex items-center space-x-1"
        >
          <Copy className="w-3 h-3" />
          <span>Dup (D)</span>
        </button>

        <button
          onClick={() => deleteClip()}
          disabled={!selectedClipId}
          title="Delete Clip (Del)"
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-30 text-[11px] font-mono flex items-center space-x-1"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </button>
      </div>

      {/* Right: Timeline Zoom Slider & Docked Stereo Peak Meter */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setZoom(Math.max(15, zoom - 10))}
            title="Zoom Out"
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="15"
            max="120"
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value, 10))}
            className="w-20 accent-[#0A84FF]"
            title="Timeline Zoom"
          />

          <button
            onClick={() => setZoom(Math.min(120, zoom + 10))}
            title="Zoom In"
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Docked Stereo dBFS Peak Meter */}
        <StereoPeakMeter />
      </div>
    </div>
  );
}
