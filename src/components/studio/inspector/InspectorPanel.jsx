import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import TransformInspector from './TransformInspector';
import ColorWheelsInspector from './ColorWheelsInspector';
import TypographyInspector from './TypographyInspector';
import AudioInspector from './AudioInspector';
import {
  SlidersHorizontal,
  Copy,
  Scissors,
  Trash2,
  Settings2,
  Disc,
  Volume2,
  Layers,
  Move
} from 'lucide-react';

export default function InspectorPanel() {
  const {
    selectedClip,
    updateClip,
    duplicateClip,
    splitClipAtPlayhead,
    deleteClip,
    project,
    setProject,
    rightInspectorWidth,
    setRightInspectorWidth
  } = useStudio();

  const [activeInspectorTab, setActiveInspectorTab] = useState('auto'); // 'auto' | 'color' | 'audio' | 'transform'

  // Left Drag-Resize Handle for Inspector Panel
  const handleResizeDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = rightInspectorWidth;

    const onMove = (me) => {
      const deltaX = startX - me.clientX; // drag left increases width
      const newW = Math.max(260, Math.min(520, startW + deltaX));
      setRightInspectorWidth(newW);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div
      style={{ width: `${rightInspectorWidth}px` }}
      className="bg-[#161619] border-l border-[#242429] flex flex-col h-full select-none text-xs relative shrink-0"
    >
      {/* Left Resize Handle */}
      <div
        onPointerDown={handleResizeDown}
        title="Drag to resize Inspector panel width"
        className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-[#0A84FF] transition-colors z-30 flex items-center justify-center -ml-[3px]"
      >
        <div className="w-[1px] h-8 bg-white/20" />
      </div>

      {selectedClip ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-3 bg-[#1C1C21] border-b border-[#242429] flex items-center justify-between">
            <div className="space-y-0.5 max-w-[190px]">
              <span className="text-[10px] font-mono text-[#FF9F0A] font-bold uppercase tracking-wider block">
                {selectedClip.trackId} Inspector
              </span>
              <input
                type="text"
                value={selectedClip.name}
                onChange={(e) => updateClip(selectedClip.id, { name: e.target.value })}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none border-b border-transparent focus:border-[#FF9F0A] w-full font-sans"
              />
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => duplicateClip(selectedClip.id)}
                title="Duplicate Clip (D)"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#242429]"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => splitClipAtPlayhead(selectedClip.id)}
                title="Blade Clip (B/S)"
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#242429]"
              >
                <Scissors className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteClip(selectedClip.id)}
                title="Delete Clip (Del)"
                className="p-1 rounded text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Inspector Tabs */}
          <div className="flex items-center space-x-1 px-3 py-1.5 bg-[#121215] border-b border-[#242429] font-mono text-[10px]">
            <button
              onClick={() => setActiveInspectorTab('auto')}
              className={`px-2 py-0.5 rounded transition-all ${
                activeInspectorTab === 'auto'
                  ? 'bg-[#0A84FF] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            {(selectedClip.trackId === 'V2' || selectedClip.trackId === 'V1') && (
              <button
                onClick={() => setActiveInspectorTab('color')}
                className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all ${
                  activeInspectorTab === 'color'
                    ? 'bg-[#0A84FF] text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Disc className="w-3 h-3" />
                <span>Color Wheels</span>
              </button>
            )}
            <button
              onClick={() => setActiveInspectorTab('transform')}
              className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all ${
                activeInspectorTab === 'transform'
                  ? 'bg-[#0A84FF] text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Move className="w-3 h-3" />
              <span>Transform</span>
            </button>
          </div>

          {/* Inspector Body */}
          <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
            {/* Timing Stats Bar */}
            <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-[#1C1C21] border border-[#242429] font-mono text-[11px] tabular-nums">
              <div>
                <span className="text-slate-500 block text-[9px]">START TIME</span>
                <span className="text-slate-200">{selectedClip.startTime.toFixed(2)}s</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">DURATION</span>
                <span className="text-slate-200">{selectedClip.duration.toFixed(2)}s</span>
              </div>
            </div>

            {/* Context-aware inspectors based on clip type & active tab */}
            {activeInspectorTab === 'color' && (
              <ColorWheelsInspector
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
            )}

            {activeInspectorTab === 'transform' && (
              <TransformInspector
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
            )}

            {activeInspectorTab === 'auto' && (
              <>
                {selectedClip.trackId === 'T1' && (
                  <>
                    <TypographyInspector
                      clip={selectedClip}
                      onUpdate={(patch) => updateClip(selectedClip.id, patch)}
                    />
                    <TransformInspector
                      clip={selectedClip}
                      onUpdate={(patch) => updateClip(selectedClip.id, patch)}
                    />
                  </>
                )}

                {(selectedClip.trackId === 'V2' || selectedClip.trackId === 'V1') && (
                  <>
                    <ColorWheelsInspector
                      clip={selectedClip}
                      onUpdate={(patch) => updateClip(selectedClip.id, patch)}
                    />
                    <TransformInspector
                      clip={selectedClip}
                      onUpdate={(patch) => updateClip(selectedClip.id, patch)}
                    />
                  </>
                )}

                {selectedClip.trackId === 'A1' && (
                  <AudioInspector
                    clip={selectedClip}
                    onUpdate={(patch) => updateClip(selectedClip.id, patch)}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* Global Project Settings View */
        <div className="p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#242429]">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-white">Project Properties</span>
          </div>

          <div className="space-y-3 p-3 bg-[#1C1C21] rounded-xl border border-[#242429]">
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono">Project Name</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-[#0E0E12] border border-[#242429] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-[#0A84FF]"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                <span>Timeline Length</span>
                <span className="text-[#0A84FF] tabular-nums">{project.duration}s</span>
              </div>
              <input
                type="range"
                min="5"
                max="120"
                step="1"
                value={project.duration}
                onChange={(e) =>
                  setProject((p) => ({ ...p, duration: parseInt(e.target.value, 10) }))
                }
                className="w-full accent-[#0A84FF]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-[11px] tabular-nums">
              <div>
                <span className="text-slate-500 block text-[9px]">RESOLUTION</span>
                <span className="text-slate-200">{project.width}x{project.height}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px]">FRAME RATE</span>
                <span className="text-slate-200">{project.fps} FPS</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#1C1C21] rounded-xl border border-[#242429] space-y-1.5 text-slate-400 text-[11px]">
            <span className="font-bold text-slate-200 block">Final Cut Pro Tips</span>
            <p>• Press <kbd className="px-1 py-0.5 rounded bg-black/40 text-slate-200">B</kbd> to activate the Blade tool and cut clips anywhere.</p>
            <p>• Press <kbd className="px-1 py-0.5 rounded bg-black/40 text-slate-200">S</kbd> to toggle Live Skimming frame preview.</p>
            <p>• Press <kbd className="px-1 py-0.5 rounded bg-black/40 text-slate-200">Cmd+K</kbd> to open the Spotlight Command HUD.</p>
          </div>
        </div>
      )}
    </div>
  );
}
