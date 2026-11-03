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
  Zap,
  Bookmark,
  Film,
  Layers
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
    setClipSpeed,
    insertGapClip,
    createCompoundClip,
    addMarker,
    zoom,
    setZoom,
    showToast
  } = useStudio();

  return (
    <div className="h-11 bg-[#161619] border-t border-b border-[#242429] px-3 flex items-center justify-between select-none text-xs">
      {/* Left: Editing Tools, Magnetic, Skimmer & Jog Wheel */}
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
            splitClipAtPlayhead();
          }}
          title="Blade Tool (B): Cut clip at playhead"
          className={`p-1.5 rounded-lg transition-all ${
            activeTool === 'blade'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-[#242429]'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-[#242429] mx-1" />

        {/* Retime (Cmd+R) */}
        <button
          onClick={() => {
            if (!selectedClipId) {
              showToast('Select a clip to retime');
              return;
            }
            setClipSpeed(selectedClipId, { speed: 2.0, isReversed: false });
          }}
          title="Retime 2x Speed (Cmd+R)"
          className="px-2 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1 text-slate-400 hover:text-[#FF9F0A] hover:bg-[#242429] transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-[#FF9F0A]" />
          <span className="hidden sm:inline">Retime (⌘R)</span>
        </button>

        {/* Gap Clip (Opt+W) */}
        <button
          onClick={insertGapClip}
          title="Insert Gap Clip (⌥W)"
          className="px-2 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1 text-slate-400 hover:text-white hover:bg-[#242429] transition-all"
        >
          <Film className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline">Gap (⌥W)</span>
        </button>

        {/* Compound Clip (Alt+G) */}
        <button
          onClick={createCompoundClip}
          title="Compound Clip (⌥G)"
          className="px-2 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1 text-slate-400 hover:text-[#BF5AF2] hover:bg-[#242429] transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-[#BF5AF2]" />
          <span className="hidden md:inline">Compound</span>
        </button>

        {/* Marker (Key M) */}
        <button
          onClick={() => addMarker()}
          title="Add Marker (M)"
          className="px-2 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1 text-slate-400 hover:text-[#30D158] hover:bg-[#242429] transition-all"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#30D158]" />
          <span className="hidden lg:inline">Marker (M)</span>
        </button>

        <div className="h-4 w-[1px] bg-[#242429] mx-1" />

        {/* Magnetic Timeline Toggle (N) */}
        <button
          onClick={() => {
            setIsMagnetic(!isMagnetic);
            showToast(!isMagnetic ? 'Magnetic Timeline: Enabled (N)' : 'Magnetic Timeline: Disabled (N)');
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
      <div className="hidden xl:flex items-center space-x-1">
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
          <span>Dup</span>
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
