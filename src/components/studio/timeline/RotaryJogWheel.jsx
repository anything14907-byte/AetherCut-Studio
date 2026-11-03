import React, { useRef, useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { Disc3 } from 'lucide-react';

export default function RotaryJogWheel() {
  const { stepFrame } = useStudio();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const startYRef = useRef(0);

  const handlePointerDown = (e) => {
    setIsInteracting(true);
    startYRef.current = e.clientY;

    const onPointerMove = (me) => {
      const deltaY = me.clientY - startYRef.current;
      if (Math.abs(deltaY) >= 8) {
        const frames = deltaY > 0 ? 1 : -1;
        stepFrame(frames);
        setRotationAngle((prev) => prev + (frames * 18));
        startYRef.current = me.clientY;
      }
    };

    const onPointerUp = () => {
      setIsInteracting(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const frames = e.deltaY > 0 ? 1 : -1;
    stepFrame(frames);
    setRotationAngle((prev) => prev + (frames * 15));
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onWheel={handleWheel}
      title="Jog Wheel: Drag or scroll to step frame-by-frame"
      className="relative flex items-center space-x-2 px-2 py-1 rounded-lg bg-[#1C1C21] border border-[#242429] hover:border-[#0A84FF] transition-all cursor-ns-resize select-none group"
    >
      {/* Rotating Mechanical Wheel Icon */}
      <div
        className="w-7 h-7 rounded-full fcp-jog-wheel flex items-center justify-center transition-transform duration-75"
        style={{ transform: `rotate(${rotationAngle}deg)` }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] shadow-[0_0_6px_#0A84FF]" />
        {/* Subtle tick indicators */}
        <div className="absolute top-0.5 w-1 h-1 rounded-full bg-white/40" />
      </div>

      <div className="flex flex-col text-left">
        <span className="text-[9px] font-mono font-bold uppercase text-slate-300">
          Jog Wheel
        </span>
        <span className="text-[8px] font-mono text-slate-500">
          {isInteracting ? 'Stepping...' : 'Frame Step'}
        </span>
      </div>
    </div>
  );
}

