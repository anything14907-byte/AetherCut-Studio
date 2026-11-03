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
  Square,
  Maximize2
} from 'lucide-react';

export default function TransportControls() {
  const {
    currentTime,
    setCurrentTime,
    isPlaying,
    togglePlay,
    stepFrame,
    project,
    setAspectRatio
  } = useStudio();

  // SMPTE Timecode Formatter: HH:MM:SS:FF
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
    <div className="h-12 bg-[#0C0E15]/95 border-t border-white/[0.08] px-4 flex items-center justify-between select-none text-xs">
      {/* Left: SMPTE Timecode & Resolution */}
      <div className="flex items-center space-x-3">
        <div className="bg-[#11131A] px-3 py-1 rounded-lg border border-white/[0.08] font-mono text-sm tracking-widest text-[#00F2FE] font-bold shadow-inner">
          {formatSmpte(currentTime, project.fps || 30)}
        </div>
        <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
          / {formatSmpte(project.duration, project.fps || 30)}
        </span>
      </div>

      {/* Center: Play/Pause and Frame Steppers */}
      <div className="flex items-center space-x-1.5">
        <button
          onClick={() => stepFrame(-1)}
          title="Previous Frame (Left Arrow)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 flex items-center justify-center hover:brightness-110 shadow-glass-glow transition-all"
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
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Aspect Ratio Switcher & Resolution Badge */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-[#11131A] p-0.5 rounded-lg border border-white/[0.06]">
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
                className={`px-2 py-1 rounded text-[11px] font-mono flex items-center space-x-1 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <IconComp className="w-3 h-3" />
                <span>{item.id}</span>
              </button>
            );
          })}
        </div>

        <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06]">
          1080p FHD
        </span>
      </div>
    </div>
  );
}

