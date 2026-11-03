import React, { useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { formatSmpteTimecode } from '../../../types/studioTypes';

export default function TimelineRuler({ duration, zoom, scrollLeft }) {
  const {
    setCurrentTime,
    isSkimmingEnabled,
    setSkimmerTime,
    markers,
    jumpToMarker,
    project
  } = useStudio();

  const rulerRef = useRef(null);
  const totalWidth = Math.max(1000, duration * zoom + 300);
  const fps = project.fps || 30;

  const secondMarkers = [];
  const stepSec = zoom < 30 ? 2 : 1;
  for (let s = 0; s <= duration; s += stepSec) {
    secondMarkers.push(s);
  }

  const handlePointerDown = (e) => {
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(duration, clickX / zoom));
    setCurrentTime(newTime, true);

    const onPointerMove = (me) => {
      const moveX = me.clientX - rect.left;
      const scrubTime = Math.max(0, Math.min(duration, moveX / zoom));
      setCurrentTime(scrubTime, true);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleMouseMove = (e) => {
    if (!isSkimmingEnabled) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const hoverTime = Math.max(0, Math.min(duration, mouseX / zoom));
    setSkimmerTime(hoverTime);
  };

  const handleMouseLeave = () => {
    setSkimmerTime(null);
  };

  return (
    <div
      ref={rulerRef}
      onPointerDown={handlePointerDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ width: `${totalWidth}px` }}
      className="h-7 border-b border-[#242429] bg-[#111114] relative select-none cursor-pointer timeline-scrub-ruler"
    >
      {/* Second Numbers */}
      {secondMarkers.map((sec) => (
        <div
          key={sec}
          style={{ left: `${sec * zoom}px` }}
          className="absolute top-1 font-mono text-[9px] text-slate-500 pl-1.5 pointer-events-none tabular-nums"
        >
          {formatSmpteTimecode(sec, fps)}
        </div>
      ))}

      {/* Timeline Markers (Pins on Ruler) */}
      {(markers || []).map((marker) => (
        <div
          key={marker.id}
          style={{ left: `${marker.time * zoom}px` }}
          onClick={(e) => {
            e.stopPropagation();
            jumpToMarker(marker.time);
          }}
          title={`${marker.label} (${marker.time.toFixed(2)}s)`}
          className="absolute top-0 bottom-0 z-20 flex flex-col items-center cursor-pointer group -ml-1.5"
        >
          {/* Marker diamond icon */}
          <div
            className="w-3 h-3 rotate-45 border border-black shadow-sm group-hover:scale-125 transition-transform"
            style={{ backgroundColor: marker.color || '#0A84FF' }}
          />
          {/* Tooltip */}
          <div className="absolute top-4 px-1.5 py-0.5 rounded bg-black/90 text-white text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/20 z-30">
            {marker.label}
          </div>
        </div>
      ))}
    </div>
  );
}
