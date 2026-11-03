import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { BRAND_CONFIG } from '../../../config/brandConfig';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  RectangleHorizontal,
  RectangleVertical,
  Square
} from 'lucide-react';

export default function TransportControls() {
  const {
    currentTime,
    isPlaying,
    togglePlay,
    stepFrame,
    project,
    setAspectRatio
  } = useStudio();

  // SMPTE Timecode Formatter: HH:MM:SS:FF with forced tabular numbers
  const formatSmpte = (seconds, fps = 30) => {
    const totalFrames = Math.floor(seconds * fps);
    const hrs = Math.floor(totalFrames / (fps * 3600));
    const mins = Math.floor((totalFrames % (fps * 3600)) / (fps * 60));
    const secs = Math.floor((totalFrames % (fps * 60)) / fps);
    const frames = totalFrames % fps;

    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  return (
    <div className="h-11 bg-[#161619] border-t border-[#242429] px-4 flex items-center justify-between select-none text-xs">
      {/* Left: SMPTE Timecode */}
      <div className="flex items-center space-x-3">
        <div className="bg-[#0B0B0D] px-2.5 py-1 rounded-[5px] border border-[#242429] font-mono text-sm tracking-wider text-white font-bold tabular-nums shadow-inner">
          {formatSmpte(currentTime, project.fps || 30)}
        </div>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline tabular-nums">
          / {formatSmpte(project.duration, project.fps || 30)}
        </span>
      </div>

      {/* Center: Play/Pause and Frame Steppers */}
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
      </div>

      {/* Right: Aspect Ratio Switcher */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-0.5 bg-[#0B0B0D] p-0.5 rounded-[6px] border border-[#242429]">
          {BRAND_CONFIG.aspectRatios.map((item) => {
            const isSelected = project.aspectRatio === item.id;
            const IconComp =
              item.id === '16:9'
                ? RectangleHorizontal
                : item.id === '9:16'
                ? RectangleVertical
                : Square;

            return (
              <button
                key={item.id}
                onClick={() => setAspectRatio(item.id)}
                title={item.label}
                className={`px-2 py-1 rounded-[4px] text-[10px] font-mono flex items-center space-x-1 transition-all ${
                  isSelected
                    ? 'bg-[#0A84FF] text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <IconComp className="w-3 h-3" />
                <span>{item.id}</span>
              </button>
            );
          })}
        </div>

        <span className="hidden md:inline text-[9px] font-mono px-2 py-0.5 rounded bg-[#1C1C21] text-slate-400 border border-[#242429] tabular-nums">
          1080p FHD
        </span>
      </div>
    </div>
  );
}
