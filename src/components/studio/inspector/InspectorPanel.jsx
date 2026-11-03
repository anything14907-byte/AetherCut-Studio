import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import TransformInspector from './TransformInspector';
import ColorGradingInspector from './ColorGradingInspector';
import TypographyInspector from './TypographyInspector';
import AudioInspector from './AudioInspector';
import {
  SlidersHorizontal,
  Copy,
  Scissors,
  Trash2,
  Film,
  Clock,
  Layers,
  Settings2,
  Maximize2
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
    setAspectRatio
  } = useStudio();

  return (
    <div className="w-80 bg-[#0C0E15] border-l border-white/[0.08] flex flex-col h-full select-none text-xs overflow-y-auto">
      {selectedClip ? (
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="space-y-0.5 max-w-[190px]">
              <span className="text-[10px] font-mono text-[#00F2FE] font-bold uppercase tracking-wider block">
                {selectedClip.trackId} Clip Inspector
              </span>
              <input
                type="text"
                value={selectedClip.name}
                onChange={(e) => updateClip(selectedClip.id, { name: e.target.value })}
                className="bg-transparent text-sm font-semibold text-white focus:outline-none border-b border-transparent focus:border-[#00F2FE] w-full"
              />
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => duplicateClip(selectedClip.id)}
                title="Duplicate Clip (D)"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => splitClipAtPlayhead(selectedClip.id)}
                title="Split at Playhead (S)"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08]"
              >
                <Scissors className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => deleteClip(selectedClip.id)}
                title="Delete Clip (Del)"
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timing details */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[#11131A] border border-white/[0.06] font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px]">START TIME</span>
              <span className="text-slate-200">{selectedClip.startTime.toFixed(2)}s</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">DURATION</span>
              <span className="text-slate-200">{selectedClip.duration.toFixed(2)}s</span>
            </div>
          </div>

          {/* Context-aware inspectors */}
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
              <TransformInspector
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
              <ColorGradingInspector
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
        </div>
      ) : (
        /* Global Project Settings View */
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-white/[0.08]">
            <Settings2 className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-white">Project Properties</span>
          </div>

          <div className="space-y-3 p-3 bg-[#11131A] rounded-xl border border-white/[0.06]">
            {/* Project Title */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 font-mono">Project Name</label>
              <input
                type="text"
                value={project.title}
                onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))}
                className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-[#00F2FE]"
              />
            </div>

            {/* Total Timeline Duration */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Timeline Length</span>
                <span className="font-mono text-[#00F2FE]">{project.duration}s</span>
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
                className="w-full accent-[#00F2FE]"
              />
            </div>

            {/* Canvas Dimensions */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">RESOLUTION</span>
                <span className="text-slate-200">{project.width}x{project.height}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">FRAME RATE</span>
                <span className="text-slate-200">{project.fps} FPS</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#11131A] rounded-xl border border-white/[0.06] space-y-1 text-slate-400 text-[11px]">
            <span className="font-bold text-slate-300 block">Pro Tip</span>
            <p>
              Click any clip on the multi-track timeline below to inspect and customize its transform, color grade, or typography.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

