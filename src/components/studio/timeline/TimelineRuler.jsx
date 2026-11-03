import React, { useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';

export default function TimelineRuler({ duration, zoom, scrollLeft }) {
  const { currentTime, setCurrentTime } = useStudio();
  const rulerRef = useRef(null);

  const totalWidth = Math.max(1000, duration * zoom + 200);

  // Seconds markers
  const secondMarkers = [];
  const stepSec = zoom < 30 ? 2 : 1;
  for (let s = 0; s <= duration; s += stepSec) {
    secondMarkers.push(s);
  }

  const formatRulerTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

  return (
    <div
      ref={rulerRef}
      onPointerDown={handlePointerDown}
      style={{ width: `${totalWidth}px` }}
      className="h-7 border-b border-white/[0.08] bg-[#0C0E15] relative select-none cursor-pointer timeline-scrub-ruler"
    >
      {/* Second Numbers */}
      {secondMarkers.map((sec) => (
        <div
          key={sec}
          style={{ left: `${sec * zoom}px` }}
          className="absolute top-1 font-mono text-[9px] text-slate-500 pl-1 pointer-events-none"
        >
          {formatRulerTime(sec)}
        </div>
      ))}
    </div>
  );
}

