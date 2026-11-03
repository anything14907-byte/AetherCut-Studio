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
    setSelectedClipId
  } = useStudio();

  const scrollContainerRef = useRef(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const duration = project.duration || 20.0;
  const totalWidth = Math.max(1200, duration * zoom + 300);
  const playheadLeft = currentTime * zoom;

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

  return (
    <div className="h-64 bg-[#07080C] flex flex-col select-none relative z-10 border-t border-white/[0.08]">
      {/* Timeline Controls Toolbar */}
      <TimelineToolbar />

      {/* Main Track Grid */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Track Headers Column */}
        <div className="w-48 shrink-0 bg-[#0C0E15] border-r border-white/[0.08] flex flex-col z-20 shadow-md">
          {/* Header spacer to match ruler height */}
          <div className="h-7 border-b border-white/[0.08] bg-[#0C0E15] px-3 flex items-center">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-bold">
              Tracks (4)
            </span>
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
          onClick={(e) => {
            // Deselect clip if clicking empty area of track lanes
            if (e.target === e.currentTarget || e.target.classList.contains('track-lane')) {
              setSelectedClipId(null);
            }
          }}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#07080C]"
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
                    className="track-lane h-12 border-b border-white/[0.04] relative hover:bg-white/[0.01] transition-colors"
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

              {/* Red Draggable Playhead */}
              <div
                style={{ left: `${playheadLeft}px` }}
                onPointerDown={handlePlayheadPointerDown}
                className="absolute top-0 bottom-0 z-30 pointer-events-auto cursor-ew-resize flex flex-col items-center group -ml-2"
              >
                {/* Playhead Head Handle */}
                <div className="w-4 h-4 rounded-sm bg-red-500 shadow-md flex items-center justify-center transform group-hover:scale-125 transition-transform">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                {/* Playhead Line */}
                <div className="w-[1.5px] flex-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

