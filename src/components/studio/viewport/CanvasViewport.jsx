import React, { useRef } from 'react';
import CanvasCompositor from './CanvasCompositor';
import TransportControls from './TransportControls';
import VideoScopesCanvas from './VideoScopesCanvas';
import { useStudio } from '../../../context/StudioContext';
import { Activity, Gauge, Film, Ratio } from 'lucide-react';

export default function CanvasViewport() {
  const {
    showScopes,
    setShowScopes,
    playbackQuality,
    setPlaybackQuality,
    isMulticamView,
    setIsMulticamView,
    project,
    setAspectRatio,
    showToast
  } = useStudio();

  const canvasRef = useRef(null);

  const aspectRatios = [
    { id: '16:9', label: '16:9 Cinema' },
    { id: '9:16', label: '9:16 Reels' },
    { id: '1:1', label: '1:1 Square' },
    { id: '4:5', label: '4:5 Social' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#0B0B0D] relative overflow-hidden select-none">
      {/* Final Cut Pro Viewport Top Bar */}
      <div className="h-8 bg-[#161619] border-b border-[#242429] px-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          {/* Playback Quality / Proxy Switcher */}
          <div className="flex items-center space-x-1 bg-[#111114] px-1.5 py-0.5 rounded border border-[#242429]">
            <Gauge className="w-3 h-3 text-[#0A84FF]" />
            <select
              value={playbackQuality}
              onChange={(e) => {
                setPlaybackQuality(e.target.value);
                showToast(e.target.value === 'proxy' ? 'Proxy Mode: 540p (High Performance)' : 'Full Mode: 1080p HD');
              }}
              className="bg-transparent text-[10px] text-slate-300 font-mono focus:outline-none cursor-pointer"
            >
              <option value="proxy" className="bg-[#161619] text-white">Better Performance (540p)</option>
              <option value="full" className="bg-[#161619] text-white">Better Quality (1080p HD)</option>
            </select>
          </div>

          {/* Multicam 4-Angle Switcher */}
          <button
            onClick={() => {
              setIsMulticamView(!isMulticamView);
              showToast(!isMulticamView ? 'Multicam: 4-Angle Grid ON' : 'Multicam Grid OFF');
            }}
            className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all ${
              isMulticamView
                ? 'bg-[#0A84FF] text-white font-bold'
                : 'hover:bg-[#242429] text-slate-400 hover:text-white border border-[#242429]'
            }`}
            title="Toggle 4-Angle Multicam 2x2 Grid (Switch with keys 1-4)"
          >
            <Film className="w-3 h-3" />
            <span>Multicam 4X</span>
          </button>

          {/* Video Scopes Toggle */}
          <button
            onClick={() => setShowScopes(!showScopes)}
            className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all ${
              showScopes
                ? 'bg-[#0A84FF] text-white font-bold'
                : 'hover:bg-[#242429] text-slate-400 hover:text-white border border-[#242429]'
            }`}
            title="Video Scopes: Luma Waveform & RGB Parade"
          >
            <Activity className="w-3 h-3" />
            <span>Scopes</span>
          </button>
        </div>

        {/* Smart Conform Aspect Ratio Dropdown */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-[#111114] px-2 py-0.5 rounded border border-[#242429]">
            <span className="text-[10px] text-slate-500 uppercase">Aspect:</span>
            <select
              value={project.aspectRatio || '16:9'}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="bg-transparent text-[10px] text-slate-200 font-mono focus:outline-none cursor-pointer font-bold"
            >
              {aspectRatios.map((r) => (
                <option key={r.id} value={r.id} className="bg-[#161619] text-white">
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[10px] text-slate-600 hidden sm:inline">•</span>
          <span className="text-[10px] text-slate-500 hidden sm:inline">60 FPS Native</span>
        </div>
      </div>

      {/* Compositor Work Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        <CanvasCompositor canvasRef={canvasRef} />

        {/* Video Scopes Live Overlay */}
        {showScopes && (
          <VideoScopesCanvas
            sourceCanvasRef={canvasRef}
            onClose={() => setShowScopes(false)}
          />
        )}
      </div>

      {/* Floating / Anchored Transport Controls */}
      <TransportControls />
    </div>
  );
}
