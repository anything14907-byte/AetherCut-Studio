import React, { useRef, useEffect } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { renderCompositorFrame } from '../../../services/canvasRenderer';

export default function CanvasCompositor({ canvasRef }) {
  const {
    project,
    currentTime,
    currentTimeRef,
    subscribeTime,
    isPlaying,
    skimmerTime,
    selectedClipId,
    selectedClip,
    updateClip,
    playbackQuality,
    isMulticamView,
    activeMulticamAngle
  } = useStudio();

  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const clipStartTransformRef = useRef({ x: 0, y: 0 });

  const width = project.width || (project.aspectRatio === '9:16' ? 1080 : 1920);
  const height = project.height || (project.aspectRatio === '9:16' ? 1920 : 1080);

  // Render on-demand helper (0% CPU when idle)
  const drawFrame = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCompositorFrame(ctx, width, height, time, project.clips, {
      selectedClipId,
      showBoundingBox: !!selectedClipId,
      skimmerTime,
      quality: playbackQuality,
      isMulticam: isMulticamView,
      activeMulticamAngle
    });
  };

  // 1. When playback is ACTIVE: Subscribe directly to sub-frame RAF updates (0 React re-renders)
  useEffect(() => {
    if (!isPlaying) return;

    const unsubscribe = subscribeTime((time) => {
      drawFrame(time);
    });

    return () => unsubscribe();
  }, [isPlaying, subscribeTime, project, selectedClipId, skimmerTime, playbackQuality, isMulticamView, activeMulticamAngle, width, height]);

  // 2. When PAUSED: Render exactly ONCE on state/clip/time changes (0% idle CPU)
  useEffect(() => {
    if (isPlaying) return;
    const timeToRender = skimmerTime !== null ? skimmerTime : currentTime;
    drawFrame(timeToRender);
  }, [isPlaying, currentTime, skimmerTime, project, selectedClipId, playbackQuality, isMulticamView, activeMulticamAngle, width, height]);

  // Direct pointer drag on-canvas repositioning
  const handlePointerDown = (e) => {
    if (!selectedClip) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleFactorX = width / rect.width;
    const scaleFactorY = height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleFactorX - width / 2;
    const clickY = (e.clientY - rect.top) * scaleFactorY - height / 2;

    isDraggingRef.current = true;
    dragStartPosRef.current = { x: clickX, y: clickY };
    clipStartTransformRef.current = {
      x: selectedClip.transform?.x || 0,
      y: selectedClip.transform?.y || 0
    };
    canvas.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !selectedClip) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleFactorX = width / rect.width;
    const scaleFactorY = height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleFactorX - width / 2;
    const currentY = (e.clientY - rect.top) * scaleFactorY - height / 2;

    const deltaX = currentX - dragStartPosRef.current.x;
    const deltaY = currentY - dragStartPosRef.current.y;

    const newX = Math.round(clipStartTransformRef.current.x + deltaX);
    const newY = Math.round(clipStartTransformRef.current.y + deltaY);

    updateClip(selectedClip.id, {
      transform: {
        ...(selectedClip.transform || {}),
        x: newX,
        y: newY
      }
    });
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    try {
      canvasRef.current?.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-3 relative overflow-hidden">
      <div
        className="relative max-w-full max-h-full shadow-2xl rounded-[6px] overflow-hidden border border-[#242429] bg-[#07080C]"
        style={{
          aspectRatio: `${width} / ${height}`,
          height: project.aspectRatio === '9:16' ? '88%' : 'auto',
          width: project.aspectRatio === '9:16' ? 'auto' : '88%'
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="w-full h-full object-contain cursor-crosshair select-none"
        />

        {/* Selected Clip Overlay Hint */}
        {selectedClip && !isMulticamView && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur text-[10px] font-mono text-[#FF9F0A] border border-[#FF9F0A]/40 pointer-events-none">
            {selectedClip.name} ({selectedClip.role || 'Video'})
          </div>
        )}

        {/* Multicam Angle Switcher Hint */}
        {isMulticamView && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#0A84FF]/90 backdrop-blur text-[10px] font-mono text-white font-bold border border-white/20 pointer-events-none flex items-center space-x-1">
            <span>MULTICAM: ANGLE {activeMulticamAngle} ACTIVE (PRESS 1-4)</span>
          </div>
        )}

        {/* Skimmer Preview Badge */}
        {skimmerTime !== null && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600/90 backdrop-blur text-[10px] font-mono text-white font-bold border border-white/20 pointer-events-none flex items-center space-x-1 tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>SKIM: {skimmerTime.toFixed(2)}s</span>
          </div>
        )}
      </div>
    </div>
  );
}
