import React, { useState, useRef } from 'react';

// Draggable Circular Color Board Puck
function BoardPuck({ label, value, onChange, isColorTab }) {
  const containerRef = useRef(null);

  // value is { x: -100..100 (for color hue), y: -100..100 (amount boost/cut) }
  const puckX = value?.x ?? 0;
  const puckY = value?.y ?? 0;

  const handlePointerDown = (e) => {
    e.stopPropagation();
    const startClientX = e.clientX;
    const startClientY = e.clientY;
    const startX = puckX;
    const startY = puckY;

    const onPointerMove = (me) => {
      const deltaX = isColorTab ? (me.clientX - startClientX) * 0.8 : 0;
      const deltaY = (startClientY - me.clientY) * 0.8; // up is positive boost, down is cut

      const newX = Math.max(-100, Math.min(100, Math.round(startX + deltaX)));
      const newY = Math.max(-100, Math.min(100, Math.round(startY + deltaY)));

      onChange({ x: newX, y: newY });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Convert -100..100 to vertical position percentage (0 = center = 50%)
  const topPercent = 50 - (puckY / 2); // 0% is top (+100), 100% is bottom (-100)

  return (
    <div className="flex-1 flex flex-col items-center select-none">
      <span className="text-[10px] font-mono font-bold text-[#8E8E93] pb-1 uppercase">{label}</span>
      <div
        ref={containerRef}
        className="w-full h-36 bg-[#151517] border border-[#2A2A2E] rounded-md relative overflow-hidden shadow-inner cursor-ns-resize flex justify-center"
      >
        {/* Horizontal Center Zero Line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#3E3E44] pointer-events-none" />
        
        {/* Background Gradient for Color Tab */}
        {isColorTab && (
          <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-500 via-green-500 via-blue-500 to-red-500 pointer-events-none" />
        )}

        {/* Draggable Puck */}
        <div
          onPointerDown={handlePointerDown}
          style={{ top: `calc(${topPercent}% - 8px)` }}
          className="w-4 h-4 rounded-full bg-white border border-black shadow-md cursor-grab active:cursor-grabbing flex items-center justify-center absolute transition-shadow hover:scale-110"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
        </div>
      </div>
      <span className="text-[9px] font-mono text-slate-300 pt-1 tabular-nums">
        {puckY > 0 ? `+${puckY}%` : `${puckY}%`}
      </span>
    </div>
  );
}

export default function FcpColorBoard({ clip, onUpdate }) {
  const [activeBoardTab, setActiveBoardTab] = useState('color'); // 'color' | 'saturation' | 'exposure'

  const boardData = clip.colorBoard || {
    color: { master: { x: 0, y: 0 }, shadows: { x: 0, y: 0 }, midtones: { x: 0, y: 0 }, highlights: { x: 0, y: 0 } },
    saturation: { master: { x: 0, y: 0 }, shadows: { x: 0, y: 0 }, midtones: { x: 0, y: 0 }, highlights: { x: 0, y: 0 } },
    exposure: { master: { x: 0, y: 0 }, shadows: { x: 0, y: 0 }, midtones: { x: 0, y: 0 }, highlights: { x: 0, y: 0 } }
  };

  const updatePuck = (puckName, val) => {
    const updated = {
      ...boardData,
      [activeBoardTab]: {
        ...boardData[activeBoardTab],
        [puckName]: val
      }
    };
    onUpdate({ colorBoard: updated });
  };

  return (
    <div className="space-y-3 bg-[#1C1C1F] p-3 rounded border border-[#2D2D31]">
      {/* 3 Sub-Tabs: Color | Saturation | Exposure */}
      <div className="flex bg-[#151517] p-0.5 rounded border border-[#2D2D31] font-sans text-[11px]">
        <button
          onClick={() => setActiveBoardTab('color')}
          className={`flex-1 py-1 rounded-[3px] font-medium transition-colors ${
            activeBoardTab === 'color' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Color
        </button>
        <button
          onClick={() => setActiveBoardTab('saturation')}
          className={`flex-1 py-1 rounded-[3px] font-medium transition-colors ${
            activeBoardTab === 'saturation' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Saturation
        </button>
        <button
          onClick={() => setActiveBoardTab('exposure')}
          className={`flex-1 py-1 rounded-[3px] font-medium transition-colors ${
            activeBoardTab === 'exposure' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Exposure
        </button>
      </div>

      {/* 4 Draggable Pucks: Master | Shadows | Midtones | Highlights */}
      <div className="flex space-x-2 pt-1">
        <BoardPuck
          label="Master"
          value={boardData[activeBoardTab]?.master}
          onChange={(val) => updatePuck('master', val)}
          isColorTab={activeBoardTab === 'color'}
        />
        <BoardPuck
          label="Shadows"
          value={boardData[activeBoardTab]?.shadows}
          onChange={(val) => updatePuck('shadows', val)}
          isColorTab={activeBoardTab === 'color'}
        />
        <BoardPuck
          label="Midtones"
          value={boardData[activeBoardTab]?.midtones}
          onChange={(val) => updatePuck('midtones', val)}
          isColorTab={activeBoardTab === 'color'}
        />
        <BoardPuck
          label="Highlights"
          value={boardData[activeBoardTab]?.highlights}
          onChange={(val) => updatePuck('highlights', val)}
          isColorTab={activeBoardTab === 'color'}
        />
      </div>

      <div className="text-[10px] text-[#8E8E93] text-center font-mono">
        Drag pucks up to boost or down to cut IRE levels
      </div>
    </div>
  );
}

