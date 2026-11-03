import React from 'react';
import CanvasCompositor from './CanvasCompositor';
import TransportControls from './TransportControls';

export default function CanvasViewport() {
  return (
    <div className="flex-1 flex flex-col bg-[#07080C] relative overflow-hidden select-none">
      {/* Compositor Work Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />
        <CanvasCompositor />
      </div>

      {/* Floating / Anchored Transport Controls */}
      <TransportControls />
    </div>
  );
}

