import React, { useRef, useEffect, useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { renderCompositorFrame } from '../../../services/canvasRenderer';

export default function CanvasCompositor() {
  const {
    project,
    currentTime,
    selectedClipId,
    selectedClip,
    updateClip,
    setSelectedClipId
  } = useStudio();

  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartPosRef = useRef({ x: 0, y: 0 });
  const clipStartTransformRef = useRef({ x: 0, y: 0 });

  const width = project.width || (project.aspectRatio === '9:16' ? 1080 : 1920);
  const height = project.height || (project.aspectRatio === '9:16' ? 1920 : 1080);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCompositorFrame(ctx, width, height, currentTime, project.clips, {
      selectedClipId,
      showBoundingBox: !!selectedClipId
    });
  }, [project, currentTime, selectedClipId, width, height]);

  // Pointer drag on-canvas repositioning
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
    <div className="w-full h-full flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="relative max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden border border-white/[0.12] bg-[#07080C]"
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
        {selectedClip && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] font-mono text-[#00F2FE] border border-white/[0.1] pointer-events-none">
            Selected: {selectedClip.name} (Drag to Reposition)
          </div>
        )}
      </div>
    </div>
  );
}

