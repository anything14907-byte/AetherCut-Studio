import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import {
  Undo2,
  Redo2,
  Scissors,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Magnet,
  Maximize2
} from 'lucide-react';

export default function TimelineToolbar() {
  const {
    undo,
    redo,
    splitClipAtPlayhead,
    duplicateClip,
    deleteClip,
    selectedClipId,
    zoom,
    setZoom
  } = useStudio();

  return (
    <div className="h-10 bg-[#0C0E15] border-t border-b border-white/[0.08] px-4 flex items-center justify-between select-none text-xs">
      {/* Left: Edit Operations */}
      <div className="flex items-center space-x-1">
        <button
          onClick={undo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={redo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/[0.08] mx-1" />

        <button
          onClick={() => splitClipAtPlayhead()}
          title="Split Clip at Playhead (S)"
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center space-x-1"
        >
          <Scissors className="w-3.5 h-3.5 text-[#00F2FE]" />
          <span className="font-mono text-[11px]">Split (S)</span>
        </button>

        <button
          onClick={() => duplicateClip()}
          disabled={!selectedClipId}
          title="Duplicate Selected Clip (D)"
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center space-x-1 disabled:opacity-40"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">Duplicate (D)</span>
        </button>

        <button
          onClick={() => deleteClip()}
          disabled={!selectedClipId}
          title="Delete Clip (Del)"
          className="px-2 py-1 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-1 disabled:opacity-40"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="font-mono text-[11px]">Delete</span>
        </button>
      </div>

      {/* Right: Zoom Slider & Fit */}
      <div className="flex items-center space-x-2">
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
          className="w-24 accent-[#00F2FE]"
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
    </div>
  );
}

