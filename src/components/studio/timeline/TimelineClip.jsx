import React, { useRef, useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import WaveformCanvas from './WaveformCanvas';
import { FCP_ROLES } from '../../../types/studioTypes';
import { Scissors, Film, Volume2, Link as LinkIcon, Zap, Layers, Sparkles } from 'lucide-react';

export default function TimelineClip({ clip, trackColor, zoom }) {
  const {
    selectedClipId,
    setSelectedClipId,
    updateClip,
    activeTool,
    splitClipAtPlayhead,
    setClipSpeed
  } = useStudio();

  const isSelected = selectedClipId === clip.id;
  const clipWidth = Math.max(20, clip.duration * zoom);
  const clipLeft = clip.startTime * zoom;

  const [bladeHoverPos, setBladeHoverPos] = useState(null);
  const [showRetimeMenu, setShowRetimeMenu] = useState(false);

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    origStartTime: 0,
    origDuration: 0,
    mode: null // 'move' | 'trim-left' | 'trim-right'
  });

  const handlePointerDown = (e, mode) => {
    e.stopPropagation();

    // If Blade Tool is active, perform instant cut!
    if (activeTool === 'blade') {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const cutTime = clip.startTime + (clickX / zoom);
      splitClipAtPlayhead(clip.id, cutTime);
      return;
    }

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
    // If in Blade mode, track hover cut line
    if (activeTool === 'blade') {
      const rect = e.currentTarget.getBoundingClientRect();
      setBladeHoverPos(e.clientX - rect.left);
      return;
    }

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

  // Draggable Volume Gain Line across A1 audio clip body
  const handleGainPointerDown = (e) => {
    e.stopPropagation();
    const startY = e.clientY;
    const initialVol = clip.audio?.volume ?? 1.0;

    const onMove = (me) => {
      const deltaY = startY - me.clientY;
      const newVol = Math.max(0, Math.min(2.0, initialVol + (deltaY * 0.015)));
      updateClip(clip.id, {
        audio: {
          ...(clip.audio || {}),
          volume: Math.round(newVol * 100) / 100
        }
      });
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const volumePct = Math.round((clip.audio?.volume ?? 1.0) * 100);
  const gainLineTop = Math.max(6, Math.min(36, 40 - (volumePct / 200) * 34));

  // Role color
  const roleObj = FCP_ROLES.find((r) => r.id === (clip.role || 'video'));
  const roleColor = roleObj ? roleObj.color : trackColor;

  const speed = clip.speedRamp?.speed || 1.0;
  const isRetimed = speed !== 1.0 || clip.speedRamp?.isReversed;

  return (
    <div
      onPointerDown={(e) => handlePointerDown(e, 'move')}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseLeave={() => {
        setBladeHoverPos(null);
        setShowRetimeMenu(false);
      }}
      style={{
        left: `${clipLeft}px`,
        width: `${clipWidth}px`,
        borderColor: isSelected ? '#FF9F0A' : clip.isGap ? '#242429' : `${roleColor}55`,
        backgroundColor: clip.isGap ? '#0E0E11' : clip.isCompound ? '#221935' : '#161619'
      }}
      className={`absolute top-1 bottom-1 rounded-[6px] border text-slate-100 flex items-center justify-between overflow-hidden select-none group transition-shadow ${
        activeTool === 'blade' ? 'cursor-crosshair' : 'cursor-move'
      } ${
        isSelected
          ? 'fcp-clip-selected z-20'
          : 'hover:brightness-110 z-10'
      }`}
    >
      {/* Gap Clip Pattern */}
      {clip.isGap && (
        <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#242429_10px,#242429_20px)] pointer-events-none" />
      )}

      {/* Filmstrip Frame Thumbnails Pattern for V1 & V2 Video Tracks */}
      {!clip.isGap && (clip.trackId === 'V2' || clip.trackId === 'V1') && (
        <div className="absolute inset-0 fcp-filmstrip opacity-65 pointer-events-none" />
      )}

      {/* Audio Waveform Canvas for A1 Track */}
      {!clip.isGap && clip.trackId === 'A1' && (
        <>
          <WaveformCanvas width={clipWidth} height={38} color={roleColor} />
          {/* Draggable Horizontal Volume Gain Line */}
          <div
            style={{ top: `${gainLineTop}px` }}
            onPointerDown={handleGainPointerDown}
            title={`Drag to adjust volume gain (${volumePct}%)`}
            className="absolute left-0 right-0 h-1.5 cursor-ns-resize hover:bg-[#FF9F0A] group/gain z-25 flex items-center"
          >
            <div className="w-full h-[1px] bg-white/70 group-hover/gain:bg-[#FF9F0A] shadow-sm" />
            <div className="absolute right-2 px-1 py-0.2 rounded bg-black/80 font-mono text-[8px] text-[#FF9F0A] border border-[#FF9F0A]/40 opacity-0 group-hover/gain:opacity-100 transition-opacity">
              {volumePct}%
            </div>
          </div>
        </>
      )}

      {/* Retiming / Speed Ramp Bar & Badge (Cmd+R) */}
      {isRetimed && (
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9F0A] to-[#FF375F] opacity-90 z-20 pointer-events-none" />
      )}

      {/* Connected Storyline Stem Tether Indicator */}
      {clip.parentClipId && (
        <div
          title="Connected to Primary Storyline"
          className="absolute left-1.5 top-0.5 flex items-center space-x-0.5 text-[8px] font-mono text-[#0A84FF] bg-black/70 px-1 rounded z-20"
        >
          <LinkIcon className="w-2.5 h-2.5" />
          <span>Stem</span>
        </div>
      )}

      {/* Left Trim Handle */}
      {activeTool !== 'blade' && !clip.isGap && (
        <div
          onPointerDown={(e) => handlePointerDown(e, 'trim-left')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          title="Trim Start"
          className="trim-handle absolute left-0 top-0 bottom-0 w-2.5 bg-white/30 hover:bg-[#FF9F0A] cursor-ew-resize z-30 flex items-center justify-center"
        >
          <div className="w-[1px] h-3 bg-black/80" />
        </div>
      )}

      {/* Clip Label & Metadata */}
      <div className="relative z-10 px-2 py-0.5 truncate flex items-center space-x-1.5 w-full">
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: roleColor }}
        />
        <span className="text-[11px] font-medium truncate text-white drop-shadow-sm font-sans">
          {clip.name}
        </span>

        {/* Speed Badge */}
        {isRetimed && (
          <span className="px-1 py-0.2 rounded bg-black/60 text-[#FF9F0A] font-mono text-[9px] font-bold border border-[#FF9F0A]/40 flex items-center space-x-0.5 shrink-0">
            <Zap className="w-2.5 h-2.5" />
            <span>{speed}x{clip.speedRamp?.isReversed ? 'R' : ''}</span>
          </span>
        )}

        <span className="text-[9px] font-mono text-slate-400 shrink-0 tabular-nums">
          ({clip.duration.toFixed(2)}s)
        </span>
      </div>

      {/* Right Trim Handle */}
      {activeTool !== 'blade' && !clip.isGap && (
        <div
          onPointerDown={(e) => handlePointerDown(e, 'trim-right')}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          title="Trim End"
          className="trim-handle absolute right-0 top-0 bottom-0 w-2.5 bg-white/30 hover:bg-[#FF9F0A] cursor-ew-resize z-30 flex items-center justify-center"
        >
          <div className="w-[1px] h-3 bg-black/80" />
        </div>
      )}

      {/* Blade Tool Live Hover Cut Line Indicator */}
      {activeTool === 'blade' && bladeHoverPos !== null && (
        <div
          style={{ left: `${bladeHoverPos}px` }}
          className="absolute top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_8px_red] pointer-events-none z-40 flex items-center justify-center"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-white text-[8px]">
            <Scissors className="w-2.5 h-2.5" />
          </div>
        </div>
      )}
    </div>
  );
}
