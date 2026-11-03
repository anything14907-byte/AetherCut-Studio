import React, { useRef, useState, useEffect } from 'react';
import { useStudio } from '../../../context/StudioContext';
import FcpTimelineIndexDrawer from './FcpTimelineIndexDrawer';
import FcpBottomRightDock from './FcpBottomRightDock';
import { formatSmpteTimecode, FCP_ROLES } from '../../../types/studioTypes';
import {
  Bookmark,
  Layers,
  Link as LinkIcon,
  Zap,
  Scissors,
  Check,
  RotateCcw,
  Volume2
} from 'lucide-react';

export default function FcpTimeline() {
  const {
    project,
    currentTime,
    currentTimeRef,
    skimmerTimeRef,
    setCurrentTime,
    subscribeTime,
    zoom,
    clipHeight,
    selectedClipId,
    setSelectedClipId,
    updateClip,
    activeTool,
    splitClipAtPlayhead,
    isMagnetic,
    isSkimmingEnabled,
    isSnapping,
    setClipSpeed,
    markers,
    jumpToMarker,
    showTimelineIndex,
    bottomRightDock,
    showToast
  } = useStudio();

  const scrollContainerRef = useRef(null);
  const playheadRef = useRef(null);
  const skimmerRef = useRef(null);
  const skimmerTimecodeRef = useRef(null);
  const [activeAuditionClipId, setActiveAuditionClipId] = useState(null);

  const duration = project.duration || 22.0;
  const totalTimelineWidth = Math.max(1200, duration * zoom + 350);

  // ZERO-LAG PLAYHEAD DOM ANIMATION (Subscribes directly to 60fps RAF loop with 0 React re-renders)
  useEffect(() => {
    if (playheadRef.current) {
      playheadRef.current.style.transform = `translate3d(${currentTimeRef.current * zoom}px, 0, 0)`;
    }

    const unsubscribe = subscribeTime((time) => {
      if (playheadRef.current) {
        playheadRef.current.style.transform = `translate3d(${time * zoom}px, 0, 0)`;
      }
    });

    return () => unsubscribe();
  }, [subscribeTime, zoom, currentTimeRef]);

  // Sync static playhead on user scrub/pause
  useEffect(() => {
    if (playheadRef.current) {
      playheadRef.current.style.transform = `translate3d(${currentTime * zoom}px, 0, 0)`;
    }
  }, [currentTime, zoom]);

  // Ruler scrub interaction
  const handleRulerPointerDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left + (scrollContainerRef.current?.scrollLeft || 0);
    const newTime = Math.max(0, Math.min(duration, clickX / zoom));
    setCurrentTime(newTime, true);

    const onPointerMove = (me) => {
      const moveX = me.clientX - rect.left + (scrollContainerRef.current?.scrollLeft || 0);
      const scrubTime = Math.max(0, Math.min(duration, moveX / zoom));
      setCurrentTime(scrubTime, true);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Direct Live Hover Skimmer (FF453A) - Direct DOM transform for 0 React re-renders!
  const handleTimelineMouseMove = (e) => {
    if (!isSkimmingEnabled) return;
    const rect = scrollContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left + (scrollContainerRef.current?.scrollLeft || 0);
    const hoverTime = Math.max(0, Math.min(duration, mouseX / zoom));
    skimmerTimeRef.current = hoverTime;

    if (skimmerRef.current) {
      skimmerRef.current.style.display = 'flex';
      skimmerRef.current.style.transform = `translate3d(${mouseX}px, 0, 0)`;
    }
    if (skimmerTimecodeRef.current) {
      skimmerTimecodeRef.current.textContent = formatSmpteTimecode(hoverTime);
    }
  };

  const handleTimelineMouseLeave = () => {
    if (skimmerRef.current) {
      skimmerRef.current.style.display = 'none';
    }
    skimmerTimeRef.current = null;
  };

  // Dragging Playhead from Scrubber Head
  const handlePlayheadDrag = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startTime = currentTimeRef.current;

    const onMove = (me) => {
      const deltaSec = (me.clientX - startX) / zoom;
      const newTime = Math.max(0, Math.min(duration, startTime + deltaSec));
      setCurrentTime(newTime, true);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Separate clips by role & lane
  const clips = project.clips || [];
  const primaryClips = clips.filter((c) => c.trackId === 'V2'); // Primary Storyline
  const connectedAbove = clips.filter((c) => c.trackId === 'T1' || c.trackId === 'V1'); // Titles & B-Roll Above
  const connectedBelow = clips.filter((c) => c.trackId === 'A1'); // Audio Lanes Below

  // Timeline Clip Click & Drag Handler
  const handleClipPointerDown = (e, clip) => {
    e.stopPropagation();
    if (activeTool === 'blade') {
      splitClipAtPlayhead(clip.id);
      return;
    }

    setSelectedClipId(clip.id);

    // Clip position drag
    const startClientX = e.clientX;
    const startClipTime = clip.startTime;

    const onPointerMove = (me) => {
      const deltaSec = (me.clientX - startClientX) / zoom;
      const newStart = Math.max(0, Math.round((startClipTime + deltaSec) * 100) / 100);
      updateClip(clip.id, { startTime: newStart });
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-[#161618] relative select-none">
      {/* TIMELINE INDEX COLLAPSIBLE DRAWER (LEFT) */}
      <FcpTimelineIndexDrawer />

      {/* CENTER TIMELINE WELL */}
      <div
        ref={scrollContainerRef}
        onMouseMove={handleTimelineMouseMove}
        onMouseLeave={handleTimelineMouseLeave}
        onClick={(e) => {
          if (e.target === e.currentTarget || e.target.classList.contains('timeline-well')) {
            setSelectedClipId(null);
          }
        }}
        className="timeline-well flex-1 overflow-x-auto overflow-y-auto relative bg-[#161618] border-r border-[#000000]"
      >
        <div style={{ width: `${totalTimelineWidth}px` }} className="relative min-h-full flex flex-col">
          {/* ZERO-DOM-BLOAT RULER (CSS Repeating Linear Gradient Pattern) */}
          <div
            onPointerDown={handleRulerPointerDown}
            className="h-7 bg-[#1E1E20] border-b border-[#000000] fcp-ruler-ticks relative cursor-pointer flex items-center shrink-0 z-30"
          >
            {/* Markers (Pins on Ruler) */}
            {markers.map((marker) => (
              <div
                key={marker.id}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToMarker(marker.time);
                }}
                title={`${marker.label} (${formatSmpteTimecode(marker.time)})`}
                style={{ left: `${marker.time * zoom}px` }}
                className="absolute top-0 bottom-0 z-40 flex flex-col items-center cursor-pointer group -ml-1.5"
              >
                <div
                  className="w-3 h-3 rotate-45 shadow-sm group-hover:scale-125 transition-transform"
                  style={{ backgroundColor: marker.color || '#0A84FF' }}
                />
                <div className="absolute top-4 px-1 py-0.5 rounded bg-black/90 text-white text-[9px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {marker.label}
                </div>
              </div>
            ))}
          </div>

          {/* TIMELINE TRACKS AREA */}
          <div className="flex-1 flex flex-col py-4 relative space-y-4">
            {/* 1. CONNECTED CLIPS ABOVE PRIMARY STORYLINE (TITLES #6E4594 & B-ROLL #2B5B9E) */}
            <div className="h-12 relative flex items-center">
              {connectedAbove.map((clip) => {
                const isSelected = selectedClipId === clip.id;
                const isTitle = clip.role === 'titles' || clip.trackId === 'T1';
                const bodyColor = isTitle ? '#6E4594' : '#2B5B9E';
                const headerColor = isTitle ? '#4D2E6B' : '#1D3F70';

                return (
                  <div
                    key={clip.id}
                    onPointerDown={(e) => handleClipPointerDown(e, clip)}
                    style={{
                      left: `${clip.startTime * zoom}px`,
                      width: `${clip.duration * zoom}px`,
                      backgroundColor: bodyColor
                    }}
                    className={`absolute h-10 rounded-[3px] border border-[#000000] overflow-hidden cursor-move transition-shadow flex flex-col justify-between ${
                      isSelected ? 'fcp-selected' : ''
                    } ${clip.disabled ? 'fcp-clip-disabled' : ''}`}
                  >
                    {/* Top Header Bar */}
                    <div
                      style={{ backgroundColor: headerColor }}
                      className="h-3.5 px-1.5 flex items-center justify-between text-[9px] font-medium text-white truncate"
                    >
                      <span className="truncate">{clip.name}</span>
                      <span className="font-mono text-[8px] opacity-70">
                        {clip.duration.toFixed(1)}s
                      </span>
                    </div>

                    {/* Clip Body (Filmstrip Pattern) */}
                    <div className="flex-1 relative fcp-filmstrip-pattern flex items-center px-2">
                      <span className="text-[10px] text-white/90 font-medium truncate drop-shadow">
                        {isTitle ? '3D Title' : 'Connected B-Roll'}
                      </span>
                    </div>

                    {/* 1px Vertical Stem Line Tethering Down to Storyline */}
                    <div
                      style={{ top: '100%', left: '4px', height: '18px' }}
                      className="absolute w-[1px] bg-white/40 pointer-events-none z-10"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] -ml-[2.5px] -bottom-1 absolute" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 2. RECESSED PRIMARY STORYLINE SPINE (#0D0D0F RECESSED SHELF) */}
            <div
              style={{ height: `${clipHeight + 12}px` }}
              className="bg-[#0D0D0F] border-t border-b border-[#000000] relative flex items-center shadow-inner"
            >
              {primaryClips.map((clip) => {
                const isSelected = selectedClipId === clip.id;
                const isGap = clip.isGap;
                const isRetimed = clip.speedRamp?.isRamped || clip.speedRamp?.speed !== 1.0;
                const retimeColor = clip.speedRamp?.isFreeze ? '#FF453A' :
                                   clip.speedRamp?.speed < 1.0 ? '#FF9F0A' : '#0A84FF';

                return (
                  <div
                    key={clip.id}
                    onPointerDown={(e) => handleClipPointerDown(e, clip)}
                    style={{
                      left: `${clip.startTime * zoom}px`,
                      width: `${clip.duration * zoom}px`,
                      height: `${clipHeight}px`,
                      backgroundColor: isGap ? '#2A2A2D' : '#2B5B9E'
                    }}
                    className={`absolute rounded-[3px] border border-[#000000] overflow-hidden cursor-move transition-shadow flex flex-col justify-between ${
                      isSelected ? 'fcp-selected' : ''
                    } ${clip.disabled ? 'fcp-clip-disabled' : ''}`}
                  >
                    {/* Retime Speed Bar Above Clip (Cmd+R: Orange for Slow, Blue for Fast, Red for Hold) */}
                    {isRetimed && !isGap && (
                      <div
                        style={{ backgroundColor: retimeColor }}
                        className="h-2.5 px-1 flex items-center justify-between text-[8px] font-mono font-bold text-white uppercase tracking-wider relative"
                      >
                        <span className="flex items-center space-x-1">
                          <Zap className="w-2 h-2" />
                          <span>{clip.speedRamp?.label || `${clip.speedRamp?.speed}x`}</span>
                        </span>
                        {/* Draggable Retime Stretch Handle */}
                        <div
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            setClipSpeed(clip.id, { speed: clip.speedRamp?.speed === 0.5 ? 1.0 : 0.5 });
                          }}
                          className="w-2 h-full bg-black/40 hover:bg-white/80 cursor-ew-resize"
                        />
                      </div>
                    )}

                    {/* Top Header Bar */}
                    {!isRetimed && !isGap && (
                      <div className="h-3.5 bg-[#1D3F70] px-1.5 flex items-center justify-between text-[9px] font-medium text-white truncate">
                        <span className="truncate">{clip.name}</span>
                        <span className="font-mono text-[8px] opacity-70">
                          {clip.duration.toFixed(1)}s
                        </span>
                      </div>
                    )}

                    {/* Clip Body (Filmstrip Pattern) */}
                    <div className="flex-1 relative fcp-filmstrip-pattern flex items-center justify-between px-2">
                      <span className="text-[10px] text-white font-medium truncate drop-shadow">
                        {isGap ? 'Gap Clip' : clip.name}
                      </span>

                      {/* Clip Audition Stack Badge (Take 1/3) */}
                      {clip.auditions && clip.auditions.length > 1 && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveAuditionClipId(activeAuditionClipId === clip.id ? null : clip.id);
                          }}
                          title="Click to cycle Audition alternative takes (Y)"
                          className="px-1.5 py-0.2 rounded bg-black/75 border border-[#F5A623] text-[#F5A623] text-[8px] font-mono font-bold flex items-center space-x-1 cursor-pointer hover:bg-[#F5A623] hover:text-black transition-colors"
                        >
                          <Layers className="w-2.5 h-2.5" />
                          <span>Take {(clip.activeAuditionIndex || 0) + 1}/{clip.auditions.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. CONNECTED AUDIO LANES BELOW PRIMARY STORYLINE (DIALOGUE, MUSIC, SFX) */}
            <div className="h-20 relative flex flex-col space-y-2">
              {connectedBelow.map((clip) => {
                const isSelected = selectedClipId === clip.id;
                const isMusic = clip.role === 'music';
                const isDialogue = clip.role === 'dialogue';
                const bodyBg = isMusic ? '#217346' : isDialogue ? '#266894' : '#1B7A82';
                const waveClass = isMusic ? 'fcp-waveform-pattern-music' : isDialogue ? 'fcp-waveform-pattern-dialogue' : 'fcp-waveform-pattern-sfx';

                return (
                  <div
                    key={clip.id}
                    onPointerDown={(e) => handleClipPointerDown(e, clip)}
                    style={{
                      left: `${clip.startTime * zoom}px`,
                      width: `${clip.duration * zoom}px`,
                      backgroundColor: bodyBg
                    }}
                    className={`h-9 rounded-[3px] border border-[#000000] overflow-hidden cursor-move transition-shadow relative flex flex-col justify-between ${
                      isSelected ? 'fcp-selected' : ''
                    } ${clip.disabled ? 'fcp-clip-disabled' : ''}`}
                  >
                    {/* Audio Waveform CSS Background (0 Child DIVs!) */}
                    <div className={`absolute inset-0 ${waveClass} pointer-events-none`} />

                    {/* Draggable Horizontal dB Volume Gain Line */}
                    <div
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        const startY = e.clientY;
                        const initialVol = clip.audio?.volume ?? 1.0;
                        const onMove = (me) => {
                          const delta = (startY - me.clientY) * 0.015;
                          const newV = Math.max(0, Math.min(2.0, initialVol + delta));
                          updateClip(clip.id, { audio: { ...(clip.audio || {}), volume: Math.round(newV * 100) / 100 } });
                        };
                        const onUp = () => {
                          window.removeEventListener('pointermove', onMove);
                          window.removeEventListener('pointerup', onUp);
                        };
                        window.addEventListener('pointermove', onMove);
                        window.addEventListener('pointerup', onUp);
                      }}
                      title="Drag to adjust volume gain line"
                      style={{ top: '50%' }}
                      className="absolute left-0 right-0 h-2 cursor-ns-resize z-20 flex items-center group/gain"
                    >
                      <div className="w-full h-[1px] bg-white/75 group-hover/gain:bg-[#F5A623]" />
                    </div>

                    {/* Clip Title & Audio Role */}
                    <div className="relative z-10 px-1.5 py-0.5 flex items-center justify-between text-[9px] text-white drop-shadow">
                      <span className="truncate">{clip.name}</span>
                      <span className="font-mono text-[8px] opacity-75">{((clip.audio?.volume ?? 1.0) * 100).toFixed(0)}%</span>
                    </div>

                    {/* 1px Vertical Stem Tethering Up to Storyline */}
                    <div
                      style={{ bottom: '100%', left: '4px', height: '14px' }}
                      className="absolute w-[1px] bg-white/40 pointer-events-none z-10"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#30D158] -ml-[2.5px] -top-1 absolute" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* LIVE RED HOVER SKIMMER LINE (FF453A) - Direct DOM transform (0 React re-renders) */}
            <div
              ref={skimmerRef}
              style={{ display: 'none', willChange: 'transform' }}
              className="absolute top-0 bottom-0 left-0 z-40 pointer-events-none flex flex-col items-center -ml-[1px]"
            >
              <div
                ref={skimmerTimecodeRef}
                className="px-1.5 py-0.5 rounded bg-[#FF453A] text-white font-mono text-[9px] font-bold shadow-md -mt-5 tabular-nums"
              >
                00:00:00:00
              </div>
              <div className="w-[1.5px] flex-1 bg-[#FF453A] shadow-[0_0_6px_#FF453A]" />
            </div>

            {/* PARKED PLAYHEAD LINE (WHITE #FFFFFF) - Direct DOM transform (0 React re-renders) */}
            <div
              ref={playheadRef}
              onPointerDown={handlePlayheadDrag}
              style={{ willChange: 'transform' }}
              className="absolute top-0 bottom-0 left-0 z-50 pointer-events-auto cursor-ew-resize flex flex-col items-center group -ml-2"
            >
              <div className="w-4 h-4 rounded-sm bg-white shadow-md flex items-center justify-center transform group-hover:scale-125 transition-transform border border-black">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
              </div>
              <div className="w-[2px] flex-1 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
            </div>
          </div>
        </div>
      </div>

      {/* DOCKED RIGHT-EDGE VERTICAL STEREO PEAK METERS */}
      <div className="w-6 bg-[#18181A] border-l border-[#000000] flex flex-col items-center justify-between py-2 shrink-0 select-none">
        <span className="text-[8px] font-mono text-[#8E8E93]">0</span>
        <div className="w-2.5 flex-1 bg-[#101012] rounded-sm flex items-center justify-center space-x-[1px] p-[1px] my-1">
          {/* L Channel */}
          <div className="w-1 bg-[#1E1E24] h-full rounded-sm overflow-hidden flex flex-col justify-end">
            <div className="w-full bg-[#30D158] h-3/4 animate-pulse" />
          </div>
          {/* R Channel */}
          <div className="w-1 bg-[#1E1E24] h-full rounded-sm overflow-hidden flex flex-col justify-end">
            <div className="w-full bg-[#30D158] h-2/3 animate-pulse" />
          </div>
        </div>
        <span className="text-[8px] font-mono text-[#8E8E93]">-60</span>
      </div>

      {/* BOTTOM-RIGHT EFFECTS & TRANSITIONS BROWSER DOCK */}
      <FcpBottomRightDock />
    </div>
  );
}

