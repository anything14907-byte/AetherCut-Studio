import React, { useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import WaveformCanvas from './WaveformCanvas';

export default function TimelineClip({ clip, trackColor, zoom }) {
  const {
    selectedClipId,
    setSelectedClipId,
    updateClip,
    project
  } = useStudio();

  const isSelected = selectedClipId === clip.id;
  const clipWidth = Math.max(16, clip.duration * zoom);
  const clipLeft = clip.startTime * zoom;

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    origStartTime: 0,
    origDuration: 0,
    mode: null // 'move' | 'trim-left' | 'trim-right'
  });

  const handlePointerDown = (e, mode) => {
    e.stopPropagation();
    setSelectedClipId(clip.id);

    dragRef.current = {
      isDragging: true,
      startX: e.clientX,
      origStartTime: clip.startTime,
      origDuration: clip.duration,
      mode
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current.isDragging) return;

    const deltaPx = e.clientX - dragRef.current.startX;
    const deltaSec = deltaPx / zoom;
    const { mode, origStartTime, origDuration } = dragRef.current;

    if (mode === 'move') {
      const newStartTime = Math.max(0, origStartTime + deltaSec);
      updateClip(clip.id, { startTime: Math.round(newStartTime * 100) / 100 });
    } else if (mode === 'trim-left') {
      const newStartTime = Math.max(0, Math.min(origStartTime + origDuration - 0.2, origStartTime + deltaSec));
      const newDuration = origDuration - (newStartTime - origStartTime);
      updateClip(clip.id, {
        startTime: Math.round(newStartTime * 100) / 100,
        duration: Math.round(newDuration * 100) / 100
      });
    } else if (mode === 'trim-right') {
      const newDuration = Math.max(0.2, origDuration + deltaSec);
      updateClip(clip.id, {
        duration: Math.round(newDuration * 100) / 100
      });
    }
  };

  const handlePointerUp = (e) => {
    dragRef.current.isDragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  return (
    <div
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        left: `${clipLeft}px`,
        width: `${clipWidth}px`,
        borderColor: isSelected ? '#FFFFFF' : `${trackColor}55`
      }}
      className={`absolute top-1 bottom-1 rounded-md border text-slate-100 flex items-center justify-between overflow-hidden cursor-move select-none group transition-shadow ${
        isSelected
          ? 'shadow-lg ring-1 ring-white/50 z-20'
          : 'hover:brightness-110 z-10'
      }`}
    >
      {/* Background tint */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundColor: trackColor }}
      />

      {/* Audio Waveform Visualization if A1 track */}
      {clip.trackId === 'A1' && (
        <WaveformCanvas width={clipWidth} height={36} color={trackColor} />
      )}

      {/* Left Trim Handle */}
      <div
        onPointerDown={(e) => handlePointerDown(e, 'trim-left')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="Trim Start"
        className="trim-handle absolute left-0 top-0 bottom-0 w-2.5 bg-white/40 hover:bg-white cursor-ew-resize z-30 flex items-center justify-center"
      >
        <div className="w-[1px] h-3 bg-black/60" />
      </div>

      {/* Clip Content & Label */}
      <div className="relative z-10 px-2 py-0.5 truncate flex items-center space-x-1.5 w-full">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: trackColor }}
        />
        <span className="text-[11px] font-medium truncate text-white drop-shadow-sm">
          {clip.name}
        </span>
        <span className="text-[9px] font-mono text-slate-400 shrink-0">
          ({clip.duration.toFixed(1)}s)
        </span>
      </div>

      {/* Right Trim Handle */}
      <div
        onPointerDown={(e) => handlePointerDown(e, 'trim-right')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        title="Trim End"
        className="trim-handle absolute right-0 top-0 bottom-0 w-2.5 bg-white/40 hover:bg-white cursor-ew-resize z-30 flex items-center justify-center"
      >
        <div className="w-[1px] h-3 bg-black/60" />
      </div>
    </div>
  );
}

