import React, { useRef, useState, useEffect } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { renderCompositorFrame } from '../../../services/canvasRenderer';
import VideoScopesCanvas from './VideoScopesCanvas';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Maximize2,
  Move,
  Crop,
  Layers,
  Check,
  Film,
  Camera,
  Activity,
  ChevronDown
} from 'lucide-react';

export default function FcpViewer() {
  const {
    project,
    currentTime,
    currentTimeRef,
    subscribeTime,
    isPlaying,
    togglePlay,
    stepFrame,
    playbackQuality,
    setPlaybackQuality,
    viewerZoom,
    setViewerZoom,
    isMulticamView,
    setIsMulticamView,
    activeMulticamAngle,
    setActiveMulticamAngle,
    showScopes,
    setShowScopes,
    showSafeZones,
    setShowSafeZones,
    onScreenControlMode,
    setOnScreenControlMode,
    selectedClip,
    selectedClipId,
    updateClip,
    showToast
  } = useStudio();

  const canvasRef = useRef(null);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isLooping, setIsLooping] = useState(true);

  const width = project.width || 1920;
  const height = project.height || 1080;

  // Single Frame Renderer (0% CPU when idle / paused)
  const drawFrame = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderCompositorFrame(ctx, width, height, time, project.clips, {
      selectedClipId,
      showBoundingBox: false,
      quality: playbackQuality,
      isMulticam: isMulticamView,
      activeMulticamAngle
    });
  };

  // 1. When playback is active: Subscribe directly to sub-frame RAF updates (0 React re-renders)
  useEffect(() => {
    if (!isPlaying) return;

    const unsubscribe = subscribeTime((time) => {
      drawFrame(time);
    });

    return () => unsubscribe();
  }, [isPlaying, subscribeTime, project, selectedClipId, playbackQuality, isMulticamView, activeMulticamAngle, width, height]);

  // 2. When paused: Render exactly ONCE on time/clip changes (0% idle CPU)
  useEffect(() => {
    if (isPlaying) return;
    drawFrame(currentTime);
  }, [isPlaying, currentTime, project, selectedClipId, playbackQuality, isMulticamView, activeMulticamAngle, width, height]);

  // Handle Multicam Angle Cut Click
  const handleAngleCut = (angle) => {
    setActiveMulticamAngle(angle);
    showToast(`Multicam: Cut to Angle ${angle}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#000000] border-r border-[#000000] relative overflow-hidden select-none">
      {/* ZONE 3: VIEWER TOP BAR */}
      <div className="h-7 bg-[#1E1E20] border-b border-[#000000] px-3 flex items-center justify-between text-[11px] text-[#A1A1A6] font-mono z-30">
        {/* Left: Resolution & FPS Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-[#ECECEE] font-bold">
            {width}x{height} | {project.fps || 30}p
          </span>
          <span className="text-[#545458]">•</span>
          <span className={`text-[10px] px-1 py-0.2 rounded font-sans ${
            playbackQuality === 'proxy' ? 'bg-[#0A84FF]/20 text-[#0A84FF] font-bold' : 'bg-white/10 text-slate-300'
          }`}>
            {playbackQuality === 'proxy' ? 'Proxy 540p (Zero-Lag)' : 'Original 1080p'}
          </span>
        </div>

        {/* Right: Zoom Dropdown & View Menu Dropdown */}
        <div className="flex items-center space-x-2">
          {/* Zoom Dropdown */}
          <select
            value={viewerZoom}
            onChange={(e) => setViewerZoom(e.target.value)}
            className="bg-[#151517] border border-[#2D2D31] text-[10px] text-[#ECECEE] rounded-[3px] px-1.5 py-0.5 focus:outline-none cursor-pointer"
          >
            <option value="fit">Fit</option>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="100">100%</option>
            <option value="200">200%</option>
          </select>

          {/* View Menu Popover */}
          <div className="relative">
            <button
              onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
              className="px-2 py-0.5 rounded-[3px] bg-[#151517] border border-[#2D2D31] text-[10px] text-[#ECECEE] flex items-center space-x-1 hover:bg-[#25252A]"
            >
              <span>View</span>
              <ChevronDown className="w-3 h-3 text-[#8E8E93]" />
            </button>

            {isViewMenuOpen && (
              <div
                onMouseLeave={() => setIsViewMenuOpen(false)}
                className="absolute right-0 top-7 w-56 bg-[#1C1C1F] border border-[#3A3A40] rounded-md shadow-2xl p-1.5 z-50 text-[11px] font-sans text-[#ECECEE] divide-y divide-[#2A2A30]"
              >
                <div className="py-1 space-y-0.5">
                  <div
                    onClick={() => { setShowScopes(!showScopes); setIsViewMenuOpen(false); }}
                    className="px-2 py-1 rounded flex items-center justify-between hover:bg-[#0A84FF] hover:text-white cursor-pointer"
                  >
                    <span>Video Scopes</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-slate-400">⌘7</span>
                      {showScopes && <Check className="w-3 h-3 text-[#0A84FF]" />}
                    </div>
                  </div>

                  <div
                    onClick={() => { setIsMulticamView(!isMulticamView); setIsViewMenuOpen(false); }}
                    className="px-2 py-1 rounded flex items-center justify-between hover:bg-[#0A84FF] hover:text-white cursor-pointer"
                  >
                    <span>Show Angles (Multicam)</span>
                    {isMulticamView && <Check className="w-3 h-3 text-[#0A84FF]" />}
                  </div>

                  <div
                    onClick={() => { setShowSafeZones(!showSafeZones); setIsViewMenuOpen(false); }}
                    className="px-2 py-1 rounded flex items-center justify-between hover:bg-[#0A84FF] hover:text-white cursor-pointer"
                  >
                    <span>Title/Action Safe Zones</span>
                    {showSafeZones && <Check className="w-3 h-3 text-[#0A84FF]" />}
                  </div>
                </div>

                {/* Quality options */}
                <div className="py-1 space-y-0.5">
                  <div
                    onClick={() => { setPlaybackQuality('proxy'); setIsViewMenuOpen(false); }}
                    className="px-2 py-1 rounded flex items-center justify-between hover:bg-[#0A84FF] hover:text-white cursor-pointer"
                  >
                    <span>Better Performance (Proxy)</span>
                    {playbackQuality === 'proxy' && <Check className="w-3 h-3 text-[#0A84FF]" />}
                  </div>
                  <div
                    onClick={() => { setPlaybackQuality('full'); setIsViewMenuOpen(false); }}
                    className="px-2 py-1 rounded flex items-center justify-between hover:bg-[#0A84FF] hover:text-white cursor-pointer"
                  >
                    <span>Better Quality (1080p HD)</span>
                    {playbackQuality === 'full' && <Check className="w-3 h-3 text-[#0A84FF]" />}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* VIEWER CANVAS & MULTICAM / SCOPES AREA */}
      <div className="flex-1 relative flex items-center justify-center bg-[#000000] overflow-hidden">
        {/* Left Side Scopes Overlay */}
        {showScopes && (
          <VideoScopesCanvas
            sourceCanvasRef={canvasRef}
            onClose={() => setShowScopes(false)}
          />
        )}

        {/* Multicam 4-Angle 2x2 Live Split Grid */}
        {isMulticamView ? (
          <div className="w-full h-full p-2 grid grid-cols-2 gap-2 bg-[#050507]">
            {[1, 2, 3, 4].map((ang) => (
              <div
                key={ang}
                onClick={() => handleAngleCut(ang)}
                className={`relative rounded border-2 cursor-pointer overflow-hidden flex flex-col justify-between p-2 transition-all ${
                  activeMulticamAngle === ang ? 'border-[#0A84FF] shadow-[0_0_12px_rgba(10,132,255,0.6)]' : 'border-[#242428] hover:border-white/40'
                }`}
                style={{
                  background: ang === 1 ? 'linear-gradient(135deg, #1B3B6F, #000)' :
                              ang === 2 ? 'linear-gradient(135deg, #2D1B69, #000)' :
                              ang === 3 ? 'linear-gradient(135deg, #0A5C36, #000)' :
                                          'linear-gradient(135deg, #5C2D0A, #000)'
                }}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-white bg-black/60 px-1.5 py-0.5 rounded">Angle {ang}</span>
                  {activeMulticamAngle === ang && (
                    <span className="bg-[#0A84FF] text-white px-1.5 py-0.2 rounded font-bold text-[9px]">LIVE CUT</span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">Press '{ang}' to switch</div>
              </div>
            ))}
          </div>
        ) : (
          /* Single Master Hardware-Accelerated Canvas */
          <div
            className="relative shadow-2xl overflow-hidden border border-[#1A1A1E]"
            style={{
              aspectRatio: `${width} / ${height}`,
              height: project.aspectRatio === '9:16' ? '86%' : 'auto',
              width: project.aspectRatio === '9:16' ? 'auto' : '86%',
              transform: viewerZoom === '50' ? 'scale(0.5)' : viewerZoom === '25' ? 'scale(0.25)' : viewerZoom === '200' ? 'scale(2.0)' : 'scale(1.0)',
              transition: 'transform 0.15s ease'
            }}
          >
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className="w-full h-full object-contain select-none"
            />

            {/* Safe Zones Hairline Guides */}
            {showSafeZones && (
              <div className="absolute inset-0 pointer-events-none">
                {/* 90% Action Safe */}
                <div className="absolute inset-[5%] border border-[#0A84FF]/40" />
                {/* 80% Title Safe */}
                <div className="absolute inset-[10%] border border-[#30D158]/40" />
              </div>
            )}

            {/* On-Screen Controls: Transform 8 Blue Handles */}
            {selectedClip && onScreenControlMode === 'transform' && (
              <div className="absolute inset-0 border border-[#0A84FF] pointer-events-none">
                {/* 8 Control Dots */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute -top-1 -left-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute -top-1 left-1/2 -translate-x-1/2" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute -top-1 -right-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute top-1/2 -left-1 -translate-y-1/2" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute top-1/2 -right-1 -translate-y-1/2" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute -bottom-1 -left-1" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute -bottom-1 left-1/2 -translate-x-1/2" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white absolute -bottom-1 -right-1" />
                {/* Rotation Stem */}
                <div className="w-[1px] h-6 bg-[#0A84FF] absolute -top-6 left-1/2 -translate-x-1/2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0A84FF] border border-white -top-1 -left-1 absolute" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ZONE 3: VIEWER BOTTOM BAR */}
      <div className="h-8 bg-[#1E1E20] border-t border-[#000000] px-3 flex items-center justify-between text-xs text-[#A1A1A6]">
        {/* Left: 3 On-Screen Control Mode Icons (Transform, Crop, Distort) */}
        <div className="flex items-center space-x-1 bg-[#151517] p-0.5 rounded-[4px] border border-[#2D2D31]">
          <button
            onClick={() => setOnScreenControlMode('transform')}
            title="Transform (Bounding Box)"
            className={`p-1 rounded-[3px] transition-colors ${
              onScreenControlMode === 'transform' ? 'bg-[#0A84FF] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Move className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setOnScreenControlMode('crop')}
            title="Crop (Trim / Ken Burns)"
            className={`p-1 rounded-[3px] transition-colors ${
              onScreenControlMode === 'crop' ? 'bg-[#0A84FF] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Crop className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setOnScreenControlMode('distort')}
            title="Distort (Corner Pins)"
            className={`p-1 rounded-[3px] transition-colors ${
              onScreenControlMode === 'distort' ? 'bg-[#0A84FF] text-white' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Center: Transport Buttons (Prev, Play/Pause, Next, Loop) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => stepFrame(-1)}
            title="Previous Frame (Left Arrow)"
            className="p-1 rounded text-[#8E8E93] hover:text-white"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-colors shadow-sm"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => stepFrame(1)}
            title="Next Frame (Right Arrow)"
            className="p-1 rounded text-[#8E8E93] hover:text-white"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsLooping(!isLooping)}
            title={isLooping ? "Loop Playback (Active)" : "Loop Playback (Off)"}
            className={`p-1 rounded transition-colors ${isLooping ? 'text-[#0A84FF]' : 'text-[#6E6E73] hover:text-white'}`}
          >
            <Repeat className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Fullscreen Viewer Button */}
        <button
          onClick={() => {
            const el = canvasRef.current;
            if (el && el.requestFullscreen) el.requestFullscreen();
          }}
          title="Toggle Full Screen (Shift+Cmd+F)"
          className="p-1 rounded text-[#8E8E93] hover:text-white"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

