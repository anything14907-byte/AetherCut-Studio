import React, { useRef } from 'react';
import CanvasCompositor from './CanvasCompositor';
import TransportControls from './TransportControls';
import VideoScopesCanvas from './VideoScopesCanvas';
import { useStudio } from '../../../context/StudioContext';
import { Activity } from 'lucide-react';

export default function CanvasViewport() {
  const { showScopes, setShowScopes } = useStudio();
  const canvasRef = useRef(null);

  return (
    <div className="flex-1 flex flex-col bg-[#0B0B0D] relative overflow-hidden select-none">
      {/* Viewport Top Bar (Scopes toggle, Aspect ratio indicator) */}
      <div className="h-7 bg-[#161619] border-b border-[#242429] px-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <span className="text-slate-300 font-bold">VIEWPORT</span>
          <span className="text-slate-600">•</span>
          <button
            onClick={() => setShowScopes(!showScopes)}
            className={`px-2 py-0.5 rounded flex items-center space-x-1 transition-all ${
              showScopes
                ? 'bg-[#0A84FF] text-white font-bold'
                : 'hover:bg-[#242429] text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Scopes</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-slate-500">
          <span>Final Cut Pro Engine</span>
          <span>60 FPS</span>
        </div>
      </div>

      {/* Compositor Work Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Subtle dot grid pattern */}
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
