/**
 * Apple Final Cut Pro (macOS) Studio Context & Zero-Lag Core Engine
 * 1. Zero-Lag Architecture:
 *    - currentTimeRef & skimmerTimeRef: DOM direct transform3d (0 React re-renders during 60fps playback)
 *    - 0% Idle CPU: RAF loop runs ONLY during active playback; cancels immediately when paused.
 *    - LCD timecode DOM updates throttled to 12fps (80ms).
 *    - Default View: Better Performance (Proxy) for buttery-smooth scrubbing on any laptop.
 * 2. Exact FCP Tools & Mechanics:
 *    - Tools: Select (A), Trim (T), Position (P), Range (R), Blade (B), Zoom (Z), Hand (H)
 *    - 3-Point Edits: Connect (Q), Insert (W), Overwrite (D), Append (E)
 *    - J / K / L Shuttle Transport (-4x, -2x, -1x, 0, 1x, 2x, 4x)
 *    - Range Selection (I/O, Alt+X) & Ratings (Favorite F, Reject Del)
 *    - Clip Disable/Mute (V) with 35% opacity dimming
 *    - Hold / Freeze Frame (Shift+H), Retime Speed Bar (Cmd+R), Auditions (Y), Compound Clips (Alt+G)
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_DEMO_PROJECT } from '../config/defaultProject';
import { FCP_ROLES, FCP_TOOLS, parseSmpteTimecode, formatSmpteTimecode } from '../types/studioTypes';
import { projectStorage } from '../services/projectStorage';
import { audioEngine } from '../services/audioEngine';
import { exportEngine } from '../services/exportEngine';
import { renderCompositorFrame } from '../services/canvasRenderer';

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  // Always load authentic FCP interface (with demo project)
  const [project, setProjectState] = useState(() => {
    const saved = projectStorage.loadFromLocalStorage();
    return saved || DEFAULT_DEMO_PROJECT;
  });

  const [activeView, setActiveView] = useState('studio');

  // Selected Clip and Navigation
  const [selectedClipId, setSelectedClipId] = useState('v2-clip-1');
  const [zoom, setZoom] = useState(50); // pixels per second
  const [clipHeight, setClipHeight] = useState(48); // 36px to 96px
  const [clipStyle, setClipStyle] = useState('both'); // 'both' | 'filmstrip' | 'waveform' | 'names'

  // --- ZERO-LAG 60FPS ENGINE REFS ---
  const currentTimeRef = useRef(0.0);
  const skimmerTimeRef = useRef(null);
  const isPlayingRef = useRef(false);
  const shuttleSpeedRef = useRef(1.0); // -4x, -2x, -1x, 1x, 2x, 4x
  const animFrameRef = useRef(null);
  const lastPlayTimeRef = useRef(null);
  const lastLcdUpdateRef = useRef(0);
  const projectRef = useRef(project);
  projectRef.current = project;

  // Direct Timecode DOM ref for LCD Dashboard (avoids React re-renders)
  const lcdTimecodeRef = useRef(null);

  // Time listener subscribers (DOM playhead node & viewer canvas subscribe directly)
  const timeListenersRef = useRef(new Set());
  const subscribeTime = useCallback((listener) => {
    timeListenersRef.current.add(listener);
    return () => timeListenersRef.current.delete(listener);
  }, []);

  const notifyTimeListeners = useCallback((time) => {
    timeListenersRef.current.forEach((fn) => fn(time));
  }, []);

  // React state for throttled UI display (when needed)
  const [currentTime, setCurrentTimeState] = useState(0.0);
  const [isPlaying, setIsPlayingState] = useState(false);
  const [skimmerTime, setSkimmerTime] = useState(null);

  // --- FCP TOOLS & EDITING MECHANICS ---
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'trim' | 'position' | 'range' | 'blade' | 'zoom' | 'hand'
  const [isMagnetic, setIsMagnetic] = useState(true);
  const [isSnapping, setIsSnapping] = useState(true);
  const [isSkimmingEnabled, setIsSkimmingEnabled] = useState(true);
  const [isSoloAudio, setIsSoloAudio] = useState(false);

  // Browser Range Selection & Ratings (I & O)
  const [browserRange, setBrowserRange] = useState({ in: 0.0, out: 5.0, clipId: null });
  const [browserFilter, setBrowserFilter] = useState('all'); // 'all' | 'favorites' | 'rejected' | 'unrated'
  const [browserSearch, setBrowserSearch] = useState('');
  const [clipRatings, setClipRatings] = useState({}); // { [clipId]: 'favorite' | 'rejected' }

  // Window Layout Toggles (macOS Header & Toolbar)
  const [sidebarMode, setSidebarMode] = useState('libraries'); // 'libraries' | 'media' | 'titles'
  const [showBrowser, setShowBrowser] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [showTimelineIndex, setShowTimelineIndex] = useState(false);
  const [bottomRightDock, setBottomRightDock] = useState('none'); // 'none' | 'effects' | 'transitions'

  // Viewer Display Settings
  const [playbackQuality, setPlaybackQuality] = useState('proxy'); // 'proxy' (Better Performance - Default!) | 'full'
  const [viewerZoom, setViewerZoom] = useState('fit'); // 'fit' | '25' | '50' | '100' | '200'
  const [isMulticamView, setIsMulticamView] = useState(false);
  const [activeMulticamAngle, setActiveMulticamAngle] = useState(1);
  const [showScopes, setShowScopes] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [onScreenControlMode, setOnScreenControlMode] = useState('transform'); // 'transform' | 'crop' | 'distort'

  // Modals & Panels
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isKeywordsModalOpen, setIsKeywordsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [exportProgress, setExportProgress] = useState(null);

  // Markers
  const [markers, setMarkers] = useState(() => project.markers || []);

  // Auto-save project changes
  useEffect(() => {
    projectStorage.saveToLocalStorage(project);
  }, [project]);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // Update project helper
  const setProject = useCallback((newProjectOrFn) => {
    setProjectState((prev) => {
      const next = typeof newProjectOrFn === 'function' ? newProjectOrFn(prev) : newProjectOrFn;
      return next;
    });
  }, []);

  // --- SUB-FRAME HIGH PERFORMANCE PLAYHEAD SYNC ---
  const updateLcdDisplay = (time) => {
    if (lcdTimecodeRef.current) {
      lcdTimecodeRef.current.textContent = formatSmpteTimecode(time, projectRef.current.fps || 30);
    }
  };

  const setCurrentTime = useCallback((time, syncReact = true) => {
    const clamped = Math.max(0, Math.min(projectRef.current.duration || 22.0, time));
    currentTimeRef.current = clamped;
    notifyTimeListeners(clamped);
    updateLcdDisplay(clamped);
    if (syncReact) {
      setCurrentTimeState(clamped);
    }
    audioEngine.syncTimeline(clamped, false, projectRef.current.clips);
  }, [notifyTimeListeners]);

  // Master Play / Pause / Shuttle (J/K/L)
  const setIsPlaying = useCallback((playing, speed = 1.0) => {
    audioEngine.init();
    isPlayingRef.current = playing;
    shuttleSpeedRef.current = speed;
    setIsPlayingState(playing);

    if (!playing) {
      audioEngine.stopAll();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      // Sync exact static time when paused
      setCurrentTimeState(currentTimeRef.current);
      notifyTimeListeners(currentTimeRef.current);
      updateLcdDisplay(currentTimeRef.current);
    } else {
      lastPlayTimeRef.current = performance.now();
      lastLcdUpdateRef.current = performance.now();
    }
  }, [notifyTimeListeners]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlayingRef.current, 1.0);
  }, [setIsPlaying]);

  // J / K / L Shuttle Engine
  const shuttle = useCallback((direction) => {
    if (direction === 'stop') {
      setIsPlaying(false);
      shuttleSpeedRef.current = 1.0;
      return;
    }
    if (direction === 'forward') {
      const current = isPlayingRef.current ? shuttleSpeedRef.current : 0;
      const next = current <= 0 ? 1.0 : current === 1.0 ? 2.0 : 4.0;
      setIsPlaying(true, next);
      showToast(`Shuttle Forward ${next}x (L)`);
    } else if (direction === 'reverse') {
      const current = isPlayingRef.current ? shuttleSpeedRef.current : 0;
      const next = current >= 0 ? -1.0 : current === -1.0 ? -2.0 : -4.0;
      setIsPlaying(true, next);
      showToast(`Shuttle Reverse ${Math.abs(next)}x (J)`);
    }
  }, [setIsPlaying, showToast]);

  // Step Frame (-1 / +1)
  const stepFrame = useCallback((deltaFrames = 1) => {
    setIsPlaying(false);
    const fps = projectRef.current.fps || 30;
    const deltaSec = deltaFrames / fps;
    setCurrentTime(currentTimeRef.current + deltaSec, true);
  }, [setCurrentTime, setIsPlaying]);

  // MASTER ZERO-LAG RAF LOOP (Runs ONLY when playing; 0% CPU when paused)
  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now) => {
      if (!lastPlayTimeRef.current) lastPlayTimeRef.current = now;
      const elapsedSec = (now - lastPlayTimeRef.current) / 1000;
      lastPlayTimeRef.current = now;

      let newTime = currentTimeRef.current + (elapsedSec * shuttleSpeedRef.current);
      const dur = projectRef.current.duration || 22.0;

      if (newTime >= dur) {
        newTime = 0; // loop forward
      } else if (newTime < 0) {
        newTime = dur; // loop backward
      }

      currentTimeRef.current = newTime;

      // 1. Direct sub-frame update to DOM subscribers (Playhead line & Viewport layer)
      notifyTimeListeners(newTime);
      audioEngine.syncTimeline(newTime, true, projectRef.current.clips);

      // 2. Throttle LCD timecode DOM text update to ~12fps (80ms)
      if (now - lastLcdUpdateRef.current > 80) {
        lastLcdUpdateRef.current = now;
        updateLcdDisplay(newTime);
      }

      if (isPlayingRef.current) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, notifyTimeListeners]);

  // --- THREE-POINT EDITING COMMANDS (Q, W, E, D) ---
  const getSourceClip = () => {
    // Returns browser clip or default clip to insert
    return {
      id: `clip-${Date.now()}`,
      name: "New Media Clip",
      role: "video",
      trackId: "V2",
      startTime: 0,
      duration: browserRange.out - browserRange.in || 4.0,
      trimStart: browserRange.in,
      trimEnd: browserRange.out || 4.0,
      sceneType: "cyberGrid",
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: "normal" },
      colorFilter: { exposure: 0, contrast: 1, saturation: 1, lutPreset: "none" }
    };
  };

  // Append (E): adds clip to the end of the Primary Storyline
  const appendClip = useCallback((customClip) => {
    const clipToAdd = customClip || getSourceClip();
    setProject((prev) => {
      const v2Clips = prev.clips.filter((c) => c.trackId === 'V2');
      const lastEnd = v2Clips.length > 0 ? Math.max(...v2Clips.map((c) => c.startTime + c.duration)) : 0;
      const appended = {
        ...clipToAdd,
        id: `v2-append-${Date.now()}`,
        trackId: 'V2',
        role: 'video',
        startTime: Math.round(lastEnd * 100) / 100
      };
      return {
        ...prev,
        clips: [...prev.clips, appended],
        duration: Math.max(prev.duration, appended.startTime + appended.duration)
      };
    });
    showToast(`Appended to Storyline (E)`);
  }, [setProject, showToast]);

  // Insert (W): inserts clip at playhead and ripples subsequent clips right
  const insertClip = useCallback((customClip) => {
    const playheadTime = currentTimeRef.current;
    const clipToAdd = customClip || getSourceClip();
    const insertDuration = clipToAdd.duration || 4.0;

    setProject((prev) => {
      const rippled = prev.clips.map((c) => {
        if (c.trackId === 'V2' && c.startTime >= playheadTime) {
          return { ...c, startTime: Math.round((c.startTime + insertDuration) * 100) / 100 };
        }
        if (c.parentClipId && c.startTime >= playheadTime) {
          return { ...c, startTime: Math.round((c.startTime + insertDuration) * 100) / 100 };
        }
        return c;
      });

      const inserted = {
        ...clipToAdd,
        id: `v2-insert-${Date.now()}`,
        trackId: 'V2',
        role: 'video',
        startTime: playheadTime
      };

      return {
        ...prev,
        clips: [...rippled, inserted],
        duration: prev.duration + insertDuration
      };
    });
    showToast(`Inserted at Playhead (W)`);
  }, [setProject, showToast]);

  // Connect (Q): connects clip as a B-Roll (V1) or Title (T1) attached to clip under playhead
  const connectClip = useCallback((customClip, trackId = 'V1') => {
    const playheadTime = currentTimeRef.current;
    const parent = projectRef.current.clips.find(
      (c) => c.trackId === 'V2' && c.startTime <= playheadTime && (c.startTime + c.duration) > playheadTime
    );

    const connected = {
      ...(customClip || getSourceClip()),
      id: `${trackId.toLowerCase()}-connect-${Date.now()}`,
      trackId,
      role: trackId === 'T1' ? 'titles' : trackId === 'A1' ? 'dialogue' : 'video',
      startTime: playheadTime,
      parentClipId: parent ? parent.id : null
    };

    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, connected]
    }));
    setSelectedClipId(connected.id);
    showToast(`Connected to Primary Storyline (Q)`);
  }, [setProject, showToast]);

  // Overwrite (D): overwrites timeline at playhead
  const overwriteClip = useCallback((customClip) => {
    const playheadTime = currentTimeRef.current;
    const clipToAdd = customClip || getSourceClip();

    const overwritten = {
      ...clipToAdd,
      id: `v2-over-${Date.now()}`,
      trackId: 'V2',
      role: 'video',
      startTime: playheadTime
    };

    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, overwritten]
    }));
    setSelectedClipId(overwritten.id);
    showToast(`Overwritten at Playhead (D)`);
  }, [setProject, showToast]);

  // Clip Mute / Disable (Key V) - dims to 35% opacity
  const toggleClipDisabled = useCallback((clipId) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) =>
        c.id === targetId ? { ...c, disabled: !c.disabled } : c
      )
    }));
    showToast('Toggled Clip Active / Disabled (V)');
  }, [selectedClipId, setProject, showToast]);

  // Hold / Freeze Frame (Shift+H)
  const createHoldFrame = useCallback(() => {
    const playheadTime = currentTimeRef.current;
    const target = projectRef.current.clips.find(
      (c) => c.trackId === 'V2' && c.startTime < playheadTime && (c.startTime + c.duration) > playheadTime
    );
    if (!target) {
      showToast('No storyline clip at playhead to freeze');
      return;
    }

    const holdDuration = 2.0;
    const firstDuration = playheadTime - target.startTime;
    const remainingDuration = target.duration - firstDuration;

    const firstClip = { ...target, duration: firstDuration, trimEnd: target.trimStart + firstDuration };
    const holdClip = {
      ...target,
      id: `hold-${Date.now()}`,
      name: `${target.name} (Hold Frame)`,
      startTime: playheadTime,
      duration: holdDuration,
      speedRamp: { speed: 0.0, isFreeze: true, isRamped: true, label: "Hold 0%" },
      colorFilter: { ...target.colorFilter }
    };
    const secondClip = {
      ...target,
      id: `after-hold-${Date.now()}`,
      startTime: playheadTime + holdDuration,
      duration: remainingDuration,
      trimStart: target.trimStart + firstDuration
    };

    setProject((prev) => {
      // Ripple subsequent clips
      const others = prev.clips
        .filter((c) => c.id !== target.id)
        .map((c) => {
          if (c.startTime >= playheadTime) {
            return { ...c, startTime: Math.round((c.startTime + holdDuration) * 100) / 100 };
          }
          return c;
        });

      return {
        ...prev,
        clips: [...others, firstClip, holdClip, secondClip],
        duration: prev.duration + holdDuration
      };
    });
    showToast('Created 2s Freeze Frame (Shift+H)');
  }, [setProject, showToast]);

  // Retiming Speed (Cmd+R)
  const setClipSpeed = useCallback((clipId, speedConfig) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => {
        if (c.id === targetId) {
          const newSpeed = speedConfig.speed !== undefined ? speedConfig.speed : 1.0;
          return {
            ...c,
            speedRamp: {
              ...c.speedRamp,
              ...speedConfig,
              speed: newSpeed,
              isRamped: newSpeed !== 1.0 || speedConfig.isReversed,
              label: `${newSpeed}x${speedConfig.isReversed ? ' Rev' : ''}`
            }
          };
        }
        return c;
      })
    }));
    showToast(`Applied Retiming: ${speedConfig.speed || 1}x`);
  }, [selectedClipId, setProject, showToast]);

  // Compound Clip (Alt+G)
  const createCompoundClip = useCallback((clipId) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) {
      showToast('Select a clip to create Compound Clip (⌥G)');
      return;
    }

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => {
        if (c.id === targetId) {
          return {
            ...c,
            name: `${c.name} [Compound]`,
            isCompound: true,
            role: 'video'
          };
        }
        return c;
      })
    }));
    showToast('Created Compound Clip (⌥G)');
  }, [selectedClipId, setProject, showToast]);

  // Audition Cycle (Key Y)
  const cycleAudition = useCallback((clipId) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => {
        if (c.id === targetId && c.auditions && c.auditions.length > 1) {
          const nextIndex = ((c.activeAuditionIndex || 0) + 1) % c.auditions.length;
          const nextTake = c.auditions[nextIndex];
          showToast(`Audition: Switched to Take ${nextIndex + 1}/${c.auditions.length} (Y)`);
          return {
            ...c,
            activeAuditionIndex: nextIndex,
            sceneType: nextTake.sceneType || c.sceneType,
            name: `${c.name.split(' (Take')[0]} (Take ${nextIndex + 1})`
          };
        }
        return c;
      })
    }));
  }, [selectedClipId, setProject, showToast]);

  // Markers (Key M)
  const addMarker = useCallback((time = currentTimeRef.current, label = "Marker") => {
    const rounded = Math.round(time * 100) / 100;
    const newMarker = {
      id: `m-${Date.now()}`,
      time: rounded,
      label: `${label} @ ${formatSmpteTimecode(rounded)}`,
      color: "#0A84FF",
      type: "standard"
    };
    setMarkers((prev) => [...prev, newMarker]);
    setProject((prev) => ({ ...prev, markers: [...(prev.markers || []), newMarker] }));
    showToast(`Added Marker at ${rounded.toFixed(2)}s (M)`);
  }, [setProject, showToast]);

  const jumpToMarker = useCallback((time) => {
    setCurrentTime(time, true);
    showToast(`Jumped to marker at ${time.toFixed(2)}s`);
  }, [setCurrentTime, showToast]);

  // Blade cut at playhead (Cmd+B or B)
  const splitClipAtPlayhead = useCallback((clipId) => {
    const splitTime = currentTimeRef.current;
    const target = (clipId
      ? projectRef.current.clips.find((c) => c.id === clipId)
      : projectRef.current.clips.find((c) => c.startTime < splitTime && (c.startTime + c.duration) > splitTime))
      || projectRef.current.clips.find((c) => c.id === selectedClipId);

    if (!target) {
      showToast('No clip found at playhead to blade');
      return;
    }
    if (splitTime <= target.startTime || splitTime >= (target.startTime + target.duration)) {
      showToast('Playhead must be inside clip bounds');
      return;
    }

    const firstDur = splitTime - target.startTime;
    const secondDur = target.duration - firstDur;

    const first = { ...target, duration: Math.round(firstDur * 100) / 100, trimEnd: target.trimStart + firstDur };
    const second = {
      ...target,
      id: `${target.trackId.toLowerCase()}-cut-${Date.now()}`,
      name: `${target.name} (Cut)`,
      startTime: Math.round(splitTime * 100) / 100,
      duration: Math.round(secondDur * 100) / 100,
      trimStart: target.trimStart + firstDur
    };

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === target.id ? first : c)).concat(second)
    }));
    setSelectedClipId(second.id);
    showToast(`Bladed clip "${target.name}" (Cmd+B)`);
  }, [selectedClipId, setProject, showToast]);

  // Delete clip with Magnetic Ripple
  const deleteClip = useCallback((clipId) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    setProject((prev) => {
      const target = prev.clips.find((c) => c.id === targetId);
      if (!target) return prev;

      let remaining = prev.clips.filter((c) => c.id !== targetId);

      // If Position Tool (P) is active, leave a gray Gap Clip instead of rippling!
      if (activeTool === 'position' && target.trackId === 'V2') {
        const gap = {
          id: `gap-${Date.now()}`,
          trackId: 'V2',
          role: 'gap',
          name: 'Gap',
          startTime: target.startTime,
          duration: target.duration,
          isGap: true
        };
        return { ...prev, clips: [...remaining, gap] };
      }

      // Magnetic Ripple on Primary Storyline (V2)
      if (isMagnetic && target.trackId === 'V2') {
        const gap = target.duration;
        remaining = remaining.map((c) => {
          if (c.trackId === 'V2' && c.startTime > target.startTime) {
            return { ...c, startTime: Math.max(0, Math.round((c.startTime - gap) * 100) / 100) };
          }
          if (c.parentClipId && c.startTime > target.startTime) {
            return { ...c, startTime: Math.max(0, Math.round((c.startTime - gap) * 100) / 100) };
          }
          return c;
        });
      }

      return { ...prev, clips: remaining };
    });

    if (selectedClipId === targetId) setSelectedClipId(null);
    showToast(isMagnetic ? 'Ripple Deleted Clip (Magnetic Snap)' : 'Deleted Clip');
  }, [selectedClipId, activeTool, isMagnetic, setProject, showToast]);

  // Update clip
  const updateClip = useCallback((clipId, patch) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === clipId ? { ...c, ...patch } : c))
    }));
  }, [setProject]);

  // Native In-Browser Video Export (Zero Watermark)
  const startVideoExport = useCallback(async () => {
    setIsPlaying(false);
    setIsShareModalOpen(true);
    setExportProgress({ percent: 0, currentTime: 0, remainingSec: '--', totalFrames: project.duration * project.fps });

    try {
      await exportEngine.exportVideo(
        project,
        (ctx, w, h, t, clips) => {
          renderCompositorFrame(ctx, w, h, t, clips, { showBoundingBox: false, quality: 'full' });
        },
        (progress) => {
          setExportProgress(progress);
        }
      );
      showToast('🎉 Exported Final Cut Master File with zero watermarks!');
    } catch (err) {
      if (err.message !== 'Export cancelled by user.') {
        console.error('Export failed:', err);
      }
    }
  }, [project, setIsPlaying, showToast]);

  // Global Final Cut Pro Keyboard Mapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Share / Export (Cmd+E or Ctrl+E)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyE') {
        e.preventDefault();
        setIsShareModalOpen(true);
        return;
      }

      // Import Media (Cmd+I or Ctrl+I)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyI') {
        e.preventDefault();
        setIsImportModalOpen(true);
        return;
      }

      // Toggle Video Scopes (Cmd+7 or Ctrl+7)
      if ((e.metaKey || e.ctrlKey) && (e.code === 'Digit7' || e.key === '7')) {
        e.preventDefault();
        setShowScopes((prev) => !prev);
        return;
      }

      // Toggle Inspector (Cmd+4 or Ctrl+4)
      if ((e.metaKey || e.ctrlKey) && (e.code === 'Digit4' || e.key === '4')) {
        e.preventDefault();
        setShowInspector((prev) => !prev);
        return;
      }

      // Compound Clip (Alt+G)
      if (e.altKey && e.code === 'KeyG') {
        e.preventDefault();
        createCompoundClip();
        return;
      }

      // Audition Take Swap (Y)
      if (e.code === 'KeyY' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        cycleAudition();
        return;
      }

      // Keyboard Shortcuts Cheat Sheet (?)
      if (e.key === '?' || (e.shiftKey && e.code === 'Slash')) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      // Spotlight Command HUD (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
        return;
      }

      // Retime Speed Bar (Cmd+R or Ctrl+R)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyR') {
        e.preventDefault();
        setClipSpeed(selectedClipId, { speed: 2.0 });
        return;
      }

      // Blade Cut (Cmd+B or Ctrl+B)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyB') {
        e.preventDefault();
        splitClipAtPlayhead();
        return;
      }

      // Hold Frame (Shift+H)
      if (e.shiftKey && e.code === 'KeyH') {
        e.preventDefault();
        createHoldFrame();
        return;
      }

      // Range Clear (Alt+X)
      if (e.altKey && e.code === 'KeyX') {
        e.preventDefault();
        setBrowserRange({ in: 0, out: 0, clipId: null });
        showToast('Cleared In/Out Range (Alt+X)');
        return;
      }

      // J / K / L Shuttle
      if (e.code === 'KeyJ') {
        e.preventDefault();
        shuttle('reverse');
      } else if (e.code === 'KeyK') {
        e.preventDefault();
        shuttle('stop');
      } else if (e.code === 'KeyL') {
        e.preventDefault();
        shuttle('forward');
      }

      // Space Play / Pause
      else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }

      // 3-Point Edits: Q, W, E, D
      else if (e.code === 'KeyQ') {
        e.preventDefault();
        connectClip();
      } else if (e.code === 'KeyW' && !e.altKey && !e.metaKey) {
        e.preventDefault();
        insertClip();
      } else if (e.code === 'KeyE' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        appendClip();
      } else if (e.code === 'KeyD' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        overwriteClip();
      }

      // Tool Selection: A, T, P, R, B, Z, H
      else if (e.code === 'KeyA') {
        e.preventDefault();
        setActiveTool('select');
        showToast('Select Tool (A)');
      } else if (e.code === 'KeyT') {
        e.preventDefault();
        setActiveTool('trim');
        showToast('Trim Tool (T)');
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        setActiveTool('position');
        showToast('Position Tool (P)');
      } else if (e.code === 'KeyR' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setActiveTool('range');
        showToast('Range Selection Tool (R)');
      } else if (e.code === 'KeyB' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setActiveTool('blade');
        showToast('Blade Tool (B)');
      } else if (e.code === 'KeyZ' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setActiveTool('zoom');
        showToast('Zoom Tool (Z)');
      } else if (e.code === 'KeyH' && !e.shiftKey) {
        e.preventDefault();
        setActiveTool('hand');
        showToast('Hand Tool (H)');
      }

      // Range In (I) & Out (O)
      else if (e.code === 'KeyI') {
        e.preventDefault();
        setBrowserRange((prev) => ({ ...prev, in: currentTimeRef.current }));
        showToast(`Set Range In: ${currentTimeRef.current.toFixed(2)}s (I)`);
      } else if (e.code === 'KeyO') {
        e.preventDefault();
        setBrowserRange((prev) => ({ ...prev, out: currentTimeRef.current }));
        showToast(`Set Range Out: ${currentTimeRef.current.toFixed(2)}s (O)`);
      }

      // Clip Ratings: Favorite (F) / Reject (Backspace)
      else if (e.code === 'KeyF') {
        e.preventDefault();
        if (selectedClipId) {
          setClipRatings((prev) => ({ ...prev, [selectedClipId]: 'favorite' }));
          showToast('Marked Favorite (F)');
        }
      }

      // Clip Mute/Disable (V)
      else if (e.code === 'KeyV') {
        e.preventDefault();
        toggleClipDisabled();
      }

      // Markers (M)
      else if (e.code === 'KeyM') {
        e.preventDefault();
        addMarker();
      }

      // Snapping (N)
      else if (e.code === 'KeyN') {
        e.preventDefault();
        setIsSnapping((prev) => {
          showToast(!prev ? 'Snapping: ON (N)' : 'Snapping: OFF (N)');
          return !prev;
        });
      }

      // Skimmer (S)
      else if (e.code === 'KeyS' && !e.altKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsSkimmingEnabled((prev) => {
          showToast(!prev ? 'Skimming: ON (S)' : 'Skimming: OFF (S)');
          return !prev;
        });
      }

      // Solo Audio (Alt+S)
      else if (e.altKey && e.code === 'KeyS') {
        e.preventDefault();
        setIsSoloAudio((prev) => {
          showToast(!prev ? 'Audio Solo: ON (⌥S)' : 'Audio Solo: OFF (⌥S)');
          return !prev;
        });
      }

      // Step Frame
      else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepFrame(e.shiftKey ? -30 : -1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFrame(e.shiftKey ? 30 : 1);
      }

      // Multicam 1-4
      else if (!e.metaKey && !e.ctrlKey && !e.altKey && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        e.preventDefault();
        const angle = parseInt(e.code.replace('Digit', ''), 10);
        setActiveMulticamAngle(angle);
        showToast(`Cut to Multicam Angle ${angle}`);
      }

      // Delete
      else if (e.code === 'Delete' || e.code === 'Backspace') {
        e.preventDefault();
        deleteClip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    shuttle,
    connectClip,
    insertClip,
    appendClip,
    overwriteClip,
    splitClipAtPlayhead,
    createHoldFrame,
    setClipSpeed,
    toggleClipDisabled,
    addMarker,
    stepFrame,
    deleteClip,
    selectedClipId,
    showToast
  ]);

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;

  const value = {
    project,
    setProject,
    activeView,
    setActiveView,
    currentTime,
    currentTimeRef,
    skimmerTimeRef,
    lcdTimecodeRef,
    setCurrentTime,
    subscribeTime,
    isPlaying,
    setIsPlaying,
    togglePlay,
    shuttle,
    stepFrame,
    // FCP Tools & 3-Point Edits
    activeTool,
    setActiveTool,
    isMagnetic,
    setIsMagnetic,
    isSnapping,
    setIsSnapping,
    isSkimmingEnabled,
    setIsSkimmingEnabled,
    isSoloAudio,
    setIsSoloAudio,
    browserRange,
    setBrowserRange,
    browserFilter,
    setBrowserFilter,
    browserSearch,
    setBrowserSearch,
    clipRatings,
    setClipRatings,
    appendClip,
    insertClip,
    connectClip,
    overwriteClip,
    toggleClipDisabled,
    createHoldFrame,
    setClipSpeed,
    splitClipAtPlayhead,
    deleteClip,
    updateClip,
    selectedClipId,
    setSelectedClipId,
    selectedClip,
    // Markers
    markers,
    addMarker,
    jumpToMarker,
    // Layout Toggles
    sidebarMode,
    setSidebarMode,
    showBrowser,
    setShowBrowser,
    showTimeline,
    setShowTimeline,
    showInspector,
    setShowInspector,
    showTimelineIndex,
    setShowTimelineIndex,
    bottomRightDock,
    setBottomRightDock,
    // Viewer Settings
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
    // Timeline Appearance
    zoom,
    setZoom,
    clipHeight,
    setClipHeight,
    clipStyle,
    setClipStyle,
    // Modals
    isImportModalOpen,
    setIsImportModalOpen,
    isShareModalOpen,
    setIsShareModalOpen,
    isSpotlightOpen,
    setIsSpotlightOpen,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    isKeywordsModalOpen,
    setIsKeywordsModalOpen,
    createCompoundClip,
    cycleAudition,
    startVideoExport,
    exportProgress,
    toastMessage,
    showToast
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
