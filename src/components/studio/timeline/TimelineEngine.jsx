import React, { useRef, useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import TimelineToolbar from './TimelineToolbar';
import TimelineRuler from './TimelineRuler';
import TrackHeader from './TrackHeader';
import TimelineClip from './TimelineClip';

export default function TimelineEngine() {
  const {
    project,
    tracks,
    setTracks,
    currentTime,
    setCurrentTime,
    zoom,
    setSelectedClipId,
    timelineHeight,
    setTimelineHeight,
    isSkimmingEnabled,
    skimmerTime,
    setSkimmerTime
  } = useStudio();

  const scrollContainerRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const duration = project.duration || 22.0;
  const totalWidth = Math.max(1200, duration * zoom + 350);
  const playheadLeft = currentTime * zoom;
  const skimmerLeft = skimmerTime !== null ? skimmerTime * zoom : null;

  const handleScroll = (e) => {
    setScrollLeft(e.target.scrollLeft);
  };

  const toggleTrackMute = (trackId) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
  };

  const toggleTrackLock = (trackId) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, locked: !t.locked } : t))
    );
  };

  // Drag-Resize Timeline Height from Top Border
  const handleHeightResizeDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startH = timelineHeight;

    const onMove = (me) => {
      const deltaY = startY - me.clientY; // drag up expands timeline
      const newH = Math.max(150, Math.min(480, startH + deltaY));
      setTimelineHeight(newH);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  // Playhead scrubber drag
  const handlePlayheadPointerDown = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startTime = currentTime;

    const onPointerMove = (me) => {
      const deltaX = me.clientX - startX;
      const newTime = Math.max(0, Math.min(duration, startTime + deltaX / zoom));
      setCurrentTime(newTime);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  // Skimmer mouse tracking over tracks
  const handleTracksMouseMove = (e) => {
    if (!isSkimmingEnabled) return;
    const rect = scrollContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left + scrollLeft;
    const hoverTime = Math.max(0, Math.min(duration, mouseX / zoom));
    setSkimmerTime(hoverTime);
  };

  const handleTracksMouseLeave = () => {
    setSkimmerTime(null);
  };

  // Format Timecode for Skimmer Tooltip
  const formatSmpte = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}:${pad(frames)}`;
  };

  // Find connected storyline stems: connecting T1/A1 clips to their parent V2 clip
  const stemConnections = [];
  const v2Clips = project.clips.filter((c) => c.trackId === 'V2');

  project.clips.forEach((clip) => {
    if (clip.parentClipId) {
      const parent = v2Clips.find((p) => p.id === clip.parentClipId);
      if (parent) {
        // Child X & Parent X
        const childX = (clip.startTime + 0.3) * zoom;
        const isAbove = clip.trackId === 'T1' || clip.trackId === 'V1';
        stemConnections.push({
          id: `stem-${clip.id}`,
          x: childX,
          isAbove,
          clipId: clip.id,
          parentId: parent.id
        });
      }
    }
  });

  return (
    <div
      style={{ height: `${timelineHeight}px` }}
      className="bg-[#0B0B0D] flex flex-col select-none relative z-10 border-t border-[#242429]"
    >
      {/* Top Drag-Resize Handle */}
      <div
        onPointerDown={handleHeightResizeDown}
        title="Drag up/down to resize timeline height"
        className="h-1.5 w-full bg-[#161619] hover:bg-[#0A84FF] cursor-row-resize flex items-center justify-center transition-colors z-30"
      >
        <div className="w-12 h-[2px] bg-white/20 rounded-full" />
      </div>

      {/* Timeline Controls Toolbar */}
      <TimelineToolbar />

      {/* Main Track Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Track Headers Column */}
        <div className="w-48 shrink-0 bg-[#161619] border-r border-[#242429] flex flex-col z-20 shadow-md">
          {/* Header spacer to match ruler height */}
          <div className="h-7 border-b border-[#242429] bg-[#111114] px-3 flex items-center justify-between">
            <span className="font-mono text-[10px] text-slate-400 uppercase font-bold">
              Tracks (4)
            </span>
            <span className="font-mono text-[9px] text-[#0A84FF]">Final Cut</span>
          </div>

          {/* Track Headers */}
          <div className="flex-1 overflow-hidden">
            {tracks.map((track) => (
              <TrackHeader
                key={track.id}
                track={track}
                onToggleMute={() => toggleTrackMute(track.id)}
                onToggleLock={() => toggleTrackLock(track.id)}
              />
            ))}
          </div>
        </div>

        {/* Right Scrollable Timeline Lanes */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          onMouseMove={handleTracksMouseMove}
          onMouseLeave={handleTracksMouseLeave}
          onClick={(e) => {
            if (e.target === e.currentTarget || e.target.classList.contains('track-lane')) {
              setSelectedClipId(null);
            }
          }}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#0B0B0D]"
        >
          <div style={{ width: `${totalWidth}px` }} className="relative h-full flex flex-col">
            {/* Top Ruler */}
            <TimelineRuler duration={duration} zoom={zoom} scrollLeft={scrollLeft} />

            {/* Track Lanes */}
            <div className="flex-1 flex flex-col relative">
              {tracks.map((track) => {
                const trackClips = project.clips.filter((c) => c.trackId === track.id);
                return (
                  <div
                    key={track.id}
                    className="track-lane h-12 border-b border-[#1C1C21] relative hover:bg-white/[0.01] transition-colors"
                  >
                    {trackClips.map((clip) => (
                      <TimelineClip
                        key={clip.id}
                        clip={clip}
                        trackColor={track.color}
                        zoom={zoom}
                      />
                    ))}
                  </div>
                );
              })}

              {/* Connected Storyline Stems: Vertical Tether Lines */}
              {stemConnections.map((stem) => (
                <div
                  key={stem.id}
                  style={{ left: `${stem.x}px` }}
                  className="absolute pointer-events-none z-15"
                >
                  {/* Stem notch dot */}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF] shadow-[0_0_6px_#0A84FF] -ml-[2px]" />
                </div>
              ))}

              {/* Red Live Hover Skimmer (FF453A) with Floating Timecode */}
              {isSkimmingEnabled && skimmerLeft !== null && (
                <div
                  style={{ left: `${skimmerLeft}px` }}
                  className="absolute top-0 bottom-0 z-35 pointer-events-none flex flex-col items-center -ml-[1px]"
                >
                  {/* Floating Timecode Badge */}
                  <div className="px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-bold shadow-md -mt-5 tabular-nums">
                    {formatSmpte(skimmerTime)}
                  </div>
                  {/* Red Skimmer Line */}
                  <div className="w-[1.5px] flex-1 bg-[#FF453A] shadow-[0_0_6px_rgba(255,69,58,0.9)]" />
                </div>
              )}

              {/* Parked Playhead (White #FFFFFF with Arrow Head) */}
              <div
                style={{ left: `${playheadLeft}px` }}
                onPointerDown={handlePlayheadPointerDown}
                className="absolute top-0 bottom-0 z-40 pointer-events-auto cursor-ew-resize flex flex-col items-center group -ml-2"
              >
                {/* Playhead Head (Solid White) */}
                <div className="w-4 h-4 rounded-sm bg-white shadow-md flex items-center justify-center transform group-hover:scale-125 transition-transform border border-black/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A84FF]" />
                </div>
                {/* White Playhead Line */}
                <div className="w-[2px] flex-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
