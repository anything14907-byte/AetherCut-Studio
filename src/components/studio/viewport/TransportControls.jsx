import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { formatSmpteTimecode } from '../../../types/studioTypes';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Bookmark,
  Zap,
  Film
} from 'lucide-react';

export default function TransportControls() {
  const {
    currentTime,
    isPlaying,
    togglePlay,
    stepFrame,
    project,
    addMarker,
    activeMulticamAngle,
    setMulticamAngle
  } = useStudio();

  const fps = project.fps || 30;

  return (
    <div className="h-11 bg-[#161619] border-t border-[#242429] px-4 flex items-center justify-between select-none text-xs">
      {/* Left: SMPTE Timecode (Throttled to 15fps to keep DOM idle) */}
      <div className="flex items-center space-x-3">
        <div className="bg-[#0B0B0D] px-2.5 py-1 rounded-[5px] border border-[#242429] font-mono text-sm tracking-wider text-white font-bold tabular-nums shadow-inner">
          {formatSmpteTimecode(currentTime, fps)}
        </div>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline tabular-nums">
          / {formatSmpteTimecode(project.duration || 30, fps)}
        </span>
      </div>

      {/* Center: Play/Pause, Frame Steppers, Marker */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => stepFrame(-1)}
          title="Previous Frame (Left Arrow)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#242429] transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-all shadow-sm"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        <button
          onClick={() => stepFrame(1)}
          title="Next Frame (Right Arrow)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#242429] transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-[#242429] mx-1" />

        <button
          onClick={() => addMarker()}
          title="Add Marker at Current Time (Key M)"
          className="px-2 py-1 rounded-md bg-[#1C1C21] hover:bg-[#242429] text-slate-300 hover:text-[#FF9F0A] flex items-center space-x-1 border border-white/[0.06] transition-colors"
        >
          <Bookmark className="w-3.5 h-3.5 text-[#FF9F0A]" />
          <span className="text-[10px] font-mono font-bold">M</span>
        </button>
      </div>

      {/* Right: Multicam Quick Angle Indicators (1-4) */}
      <div className="flex items-center space-x-1.5">
        <span className="text-[10px] font-mono text-slate-500 hidden md:inline">Angle:</span>
        <div className="flex items-center space-x-0.5 bg-[#0B0B0D] p-0.5 rounded-[6px] border border-[#242429]">
          {[1, 2, 3, 4].map((ang) => (
            <button
              key={ang}
              onClick={() => setMulticamAngle(ang)}
              title={`Switch to Multicam Angle ${ang} (Key ${ang})`}
              className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all ${
                activeMulticamAngle === ang
                  ? 'bg-[#0A84FF] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {ang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
