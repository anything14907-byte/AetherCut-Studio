import React, { useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';

export default function TimelineRuler({ duration, zoom, scrollLeft }) {
  const {
    currentTime,
    setCurrentTime,
    isSkimmingEnabled,
    skimmerTime,
    setSkimmerTime
  } = useStudio();

  const rulerRef = useRef(null);
  const totalWidth = Math.max(1000, duration * zoom + 300);

  const secondMarkers = [];
  const stepSec = zoom < 30 ? 2 : 1;
  for (let s = 0; s <= duration; s += stepSec) {
    secondMarkers.push(s);
  }

  const formatRulerTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const frames = Math.floor((sec % 1) * 30);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  const handlePointerDown = (e) => {
    const rect = rulerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = Math.max(0, Math.min(duration, clickX / zoom));
    setCurrentTime(newTime);

    const onPointerMove = (me) => {
      const moveX = me.clientX - rect.left;
      const scrubTime = Math.max(0, Math.min(duration, moveX / zoom));
      setCurrentTime(scrubTime);
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
          {formatRulerTime(sec)}
        </div>
      ))}
    </div>
  );
}
