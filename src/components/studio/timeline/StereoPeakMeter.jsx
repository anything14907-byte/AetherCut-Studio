import React from 'react';
import { useStudio } from '../../../context/StudioContext';

export default function StereoPeakMeter() {
  const { stereoDb, isPlaying } = useStudio();

  // Map -60dB to 0dB into a percentage (0% to 100%)
  const dbToPercent = (db) => {
    if (!isPlaying) return 0;
    const clamped = Math.max(-60, Math.min(0, db));
    return Math.round(((clamped + 60) / 60) * 100);
  };

  const pctL = dbToPercent(stereoDb.leftDb);
  const pctR = dbToPercent(stereoDb.rightDb);

  const getMeterColor = (db) => {
    if (db >= -3) return '#FF453A'; // Red Peak
    if (db >= -12) return '#FF9F0A'; // Amber Warning
    return '#30D158'; // Green Pro Audio
  };

  return (
    <div className="w-16 h-full bg-[#161619] border-l border-[#242429] flex flex-col items-center justify-between py-2 px-1.5 select-none shrink-0 font-mono text-[9px] tabular-nums">
      {/* Top Peak Status Badge */}
      <div className="flex items-center space-x-1">
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            stereoDb.leftDb >= -3 ? 'bg-red-500 shadow-[0_0_6px_red]' : 'bg-slate-600'
          }`}
        />
        <span className="text-slate-400 font-bold">dBFS</span>
      </div>

      {/* Dual Channel Bars (Left & Right) */}
      <div className="flex-1 w-full flex items-center justify-center space-x-1.5 py-1">
        {/* Left Channel */}
        <div className="relative w-2.5 h-full bg-[#0E0E12] rounded-sm overflow-hidden flex flex-col justify-end border border-white/[0.04]">
          <div
            className="w-full transition-all duration-75 rounded-sm"
            style={{
              height: `${pctL}%`,
              backgroundColor: getMeterColor(stereoDb.leftDb)
            }}
          />
        </div>

        {/* Right Channel */}
        <div className="relative w-2.5 h-full bg-[#0E0E12] rounded-sm overflow-hidden flex flex-col justify-end border border-white/[0.04]">
          <div
            className="w-full transition-all duration-75 rounded-sm"
            style={{
              height: `${pctR}%`,
              backgroundColor: getMeterColor(stereoDb.rightDb)
            }}
          />
        </div>

        {/* Scale Ticks (-0, -6, -12, -24, -40, -60) */}
        <div className="flex flex-col justify-between h-full text-[8px] text-slate-500 leading-none">
          <span>0</span>
          <span>-6</span>
          <span className="text-amber-500">-12</span>
          <span>-24</span>
          <span>-40</span>
          <span>-60</span>
        </div>
      </div>

      {/* Readout Numbers */}
      <div className="text-center font-bold text-slate-300">
        <span style={{ color: getMeterColor(stereoDb.leftDb) }}>
          {isPlaying ? stereoDb.leftDb : '-∞'}
        </span>
      </div>
    </div>
  );
}

