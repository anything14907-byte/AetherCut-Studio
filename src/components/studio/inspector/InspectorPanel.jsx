import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import VideoCompositingInspector from './VideoCompositingInspector';
import ColorWheelsInspector from './ColorWheelsInspector';
import AudioInspector from './AudioInspector';
import ClipInfoInspector from './ClipInfoInspector';
import TypographyInspector from './TypographyInspector';
import {
  Film,
  Disc,
  Volume2,
  Info,
  Copy,
  Scissors,
  Trash2,
  Type
} from 'lucide-react';

export default function InspectorPanel() {
  const {
    selectedClip,
    updateClip,
    duplicateClip,
    splitClipAtPlayhead,
    deleteClip,
    rightInspectorWidth,
    setRightInspectorWidth
  } = useStudio();

  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'color' | 'audio' | 'info'

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
      {/* Left Drag Resize Handle */}
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
                {selectedClip.trackId} Clip Inspector
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
                title="Blade Clip (B)"
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

          {/* 4 Final Cut Pro Inspector Tabs */}
          <div className="flex items-center space-x-0.5 px-2 py-1 bg-[#121215] border-b border-[#242429] font-mono text-[10px]">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex-1 py-1 rounded flex items-center justify-center space-x-1 transition-all ${
                activeTab === 'video' ? 'bg-[#0A84FF] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>Video</span>
            </button>
            <button
              onClick={() => setActiveTab('color')}
              className={`flex-1 py-1 rounded flex items-center justify-center space-x-1 transition-all ${
                activeTab === 'color' ? 'bg-[#0A84FF] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Disc className="w-3 h-3" />
              <span>Color</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex-1 py-1 rounded flex items-center justify-center space-x-1 transition-all ${
                activeTab === 'audio' ? 'bg-[#0A84FF] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>Audio</span>
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1 rounded flex items-center justify-center space-x-1 transition-all ${
                activeTab === 'info' ? 'bg-[#0A84FF] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-3 h-3" />
              <span>Info</span>
            </button>
          </div>

          {/* Inspector Body */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {activeTab === 'video' && (
              <>
                {selectedClip.trackId === 'T1' && (
                  <TypographyInspector
                    clip={selectedClip}
                    onUpdate={(patch) => updateClip(selectedClip.id, patch)}
                  />
                )}
                <VideoCompositingInspector
                  clip={selectedClip}
                  onUpdate={(patch) => updateClip(selectedClip.id, patch)}
                />
              </>
            )}

            {activeTab === 'color' && (
              <ColorWheelsInspector
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
            )}

            {activeTab === 'audio' && (
              <AudioInspector
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
            )}

            {activeTab === 'info' && (
              <ClipInfoInspector
                clip={selectedClip}
                onUpdate={(patch) => updateClip(selectedClip.id, patch)}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500 font-mono text-xs">
          <Film className="w-8 h-8 mb-2 opacity-30 text-[#0A84FF]" />
          <span className="font-semibold text-slate-400 block mb-1">No Clip Selected</span>
          <p className="text-[11px] leading-relaxed max-w-[200px]">
            Click any clip on the Magnetic Timeline to inspect its Transform, 3-Way Color Wheels, Audio EQ, and Roles.
          </p>
        </div>
      )}
    </div>
  );
}
