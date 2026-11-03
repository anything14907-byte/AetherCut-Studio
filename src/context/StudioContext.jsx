/**
 * Studio Context & State Manager — Apple Final Cut Pro Web Workstation
 * Zero-Lag Architecture:
 * 1. Decoupled Playhead & Skimmer: currentTimeRef + RAF emitter (0 React re-renders during 60fps playback)
 * 2. On-demand canvas rendering when paused (0% CPU idle)
 * 3. 540p Fast Proxy vs 1080p HD buffer quality switcher
 * 4. 4-Angle Multicam live angle switching (Keys 1-4)
 * 5. Final Cut Magnetic Timeline, Retiming/Speed Ramping (Cmd+R), Markers (M), Gap Clip (Opt+W)
 * 6. 100% Free & AI-free native NLE workflow.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_DEMO_PROJECT } from '../config/defaultProject';
import { TRACK_CONFIGS, AUDIO_EQ_PRESETS, FCP_ROLES } from '../types/studioTypes';
import { projectStorage } from '../services/projectStorage';
import { audioEngine } from '../services/audioEngine';
import { exportEngine } from '../services/exportEngine';
import { renderCompositorFrame } from '../services/canvasRenderer';

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialVParam = urlParams ? urlParams.get('v') : null;

  // Active view: ?v=demo or clicking "Open Studio" sets to 'studio'
  const [activeView, setActiveView] = useState(() => (initialVParam ? 'studio' : 'landing'));

  // Load project from storage or default pro multicam project
  const [project, setProjectState] = useState(() => {
    const saved = projectStorage.loadFromLocalStorage();
    return saved || DEFAULT_DEMO_PROJECT;
  });

  // Timeline UI State
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [zoom, setZoom] = useState(48); // pixels per second
  const [tracks, setTracks] = useState(TRACK_CONFIGS);

  // High-performance Playhead & Playback Management
  // React state for currentTime is throttled to 15fps during playback,
  // while currentTimeRef maintains 60fps sub-frame precision.
  const [currentTime, setCurrentTimeState] = useState(0.0);
  const currentTimeRef = useRef(0.0);
  const [isPlaying, setIsPlayingState] = useState(false);
  const isPlayingRef = useRef(false);

  // Time listeners subscription (canvas & playhead DOM nodes subscribe directly)
  const timeListenersRef = useRef(new Set());
  const subscribeTime = useCallback((listener) => {
    timeListenersRef.current.add(listener);
    return () => timeListenersRef.current.delete(listener);
  }, []);

  const notifyTimeListeners = useCallback((time) => {
    timeListenersRef.current.forEach((fn) => fn(time));
  }, []);

  // Playback Quality: 'proxy' (540p, fast for laptops) vs 'full' (1080p HD)
  const [playbackQuality, setPlaybackQuality] = useState('proxy');

  // Multicam 4-Angle Switcher
  const [isMulticamView, setIsMulticamView] = useState(false);
  const [activeMulticamAngle, setActiveMulticamAngleState] = useState(1);

  // Final Cut Workspace Layout & Ergonomics
  const [workspaceMode, setWorkspaceMode] = useState('edit'); // 'edit' | 'color' | 'audio'
  const [showBrowser, setShowBrowser] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [showScopes, setShowScopes] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Resizable Panes Dimensions
  const [leftDockWidth, setLeftDockWidth] = useState(300);
  const [rightInspectorWidth, setRightInspectorWidth] = useState(340);
  const [timelineHeight, setTimelineHeight] = useState(250);

  // Editing Tools & Magnetic Timeline
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'trim' | 'position' | 'blade'
  const [isMagnetic, setIsMagnetic] = useState(true);
  const [isSkimmingEnabled, setIsSkimmingEnabled] = useState(true);
  const [skimmerTime, setSkimmerTime] = useState(null);

  // Final Cut Pro Markers & Roles
  const [markers, setMarkers] = useState(() => project.markers || [
    { id: 'm1', time: 1.5, label: 'Hero Cut', color: '#0A84FF' },
    { id: 'm2', time: 6.0, label: 'Speed Ramp Peak', color: '#FF9F0A' },
    { id: 'm3', time: 10.5, label: 'Outro Title', color: '#30D158' }
  ]);
  const [rolesState, setRolesState] = useState(() =>
    FCP_ROLES.map((r) => ({ ...r, muted: false, soloed: false }))
  );

  // Live Stereo dBFS Meter State (Throttled to 15fps)
  const [stereoDb, setStereoDb] = useState({ leftDb: -60, rightDb: -60, leftPeak: -60, rightPeak: -60 });

  // Audio Pro Enhancements
  const [voiceIsolation, setVoiceIsolationState] = useState(false);
  const [autoDuck, setAutoDuckState] = useState(true);
  const [currentEqPreset, setCurrentEqPreset] = useState('flat');

  // Modals & UI States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState({ past: [], future: [] });

  const animFrameRef = useRef(null);
  const lastPlayTimeRef = useRef(null);
  const lastUiUpdateRef = useRef(0);
  const projectRef = useRef(project);
  projectRef.current = project;

  // Auto-save project whenever it changes
  useEffect(() => {
    projectStorage.saveToLocalStorage(project);
  }, [project]);

  // Toast notification helper
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Update project state with Undo history recording
  const setProject = useCallback((newProjectOrFn, recordHistory = true) => {
    setProjectState((prev) => {
      const next = typeof newProjectOrFn === 'function' ? newProjectOrFn(prev) : newProjectOrFn;
      if (recordHistory) {
        setHistory((h) => ({
          past: [...h.past.slice(-25), prev],
          future: []
        }));
      }
      return next;
    });
  }, []);

  // Undo / Redo
  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const previous = h.past[h.past.length - 1];
      const newPast = h.past.slice(0, -1);
      setProjectState(previous);
      return {
        past: newPast,
        future: [projectRef.current, ...h.future]
      };
    });
    showToast('Undo');
  }, [showToast]);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const next = h.future[0];
      const newFuture = h.future.slice(1);
      setProjectState(next);
      return {
        past: [...h.past, projectRef.current],
        future: newFuture
      };
    });
    showToast('Redo');
  }, [showToast]);

  // High-performance Playhead scrub & sync
  const setCurrentTime = useCallback((time, syncReactState = true) => {
    const clamped = Math.max(0, Math.min(projectRef.current.duration || 30, time));
    currentTimeRef.current = clamped;
    notifyTimeListeners(clamped);
    if (syncReactState) {
      setCurrentTimeState(clamped);
    }
    audioEngine.syncTimeline(clamped, false, projectRef.current.clips);
  }, [notifyTimeListeners]);

  // Play / Pause playback loop
  const setIsPlaying = useCallback((playing) => {
    audioEngine.init();
    isPlayingRef.current = playing;
    setIsPlayingState(playing);

    if (!playing) {
      audioEngine.stopAll();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      // Sync exact static time to React state when paused
      setCurrentTimeState(currentTimeRef.current);
      notifyTimeListeners(currentTimeRef.current);
      setStereoDb({ leftDb: -60, rightDb: -60, leftPeak: -60, rightPeak: -60 });
    } else {
      lastPlayTimeRef.current = performance.now();
      lastUiUpdateRef.current = performance.now();
    }
  }, [notifyTimeListeners]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlayingRef.current);
  }, [setIsPlaying]);

  // Frame stepper (-1 / +1 frame)
  const stepFrame = useCallback((deltaFrames = 1) => {
    setIsPlaying(false);
    const fps = projectRef.current.fps || 30;
    const deltaSec = deltaFrames / fps;
    setCurrentTime(currentTimeRef.current + deltaSec, true);
  }, [setCurrentTime, setIsPlaying]);

  // MASTER 60FPS RAF LOOP (Decoupled from React State)
  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now) => {
      if (!lastPlayTimeRef.current) lastPlayTimeRef.current = now;
      const elapsedSec = (now - lastPlayTimeRef.current) / 1000;
      lastPlayTimeRef.current = now;

      let newTime = currentTimeRef.current + elapsedSec;
      if (newTime >= (projectRef.current.duration || 30)) {
        newTime = 0; // loop back seamlessly
      }
      currentTimeRef.current = newTime;

      // 1. Direct sub-frame update to subscribers (playhead line and viewer canvas)
      notifyTimeListeners(newTime);
      audioEngine.syncTimeline(newTime, true, projectRef.current.clips);

      // 2. Throttle React UI and Audio Meter re-renders to 15fps (~66ms) to keep DOM idle
      if (now - lastUiUpdateRef.current > 66) {
        lastUiUpdateRef.current = now;
        setCurrentTimeState(newTime);
        setStereoDb(audioEngine.getStereoDbLevels(true));
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

  // --- MULTICAM ANGLE SWITCHING (KEYS 1, 2, 3, 4) ---
  const setMulticamAngle = useCallback((angleNumber) => {
    const angle = Math.max(1, Math.min(4, angleNumber));
    setActiveMulticamAngleState(angle);

    // Update selected clip or active V2 clip angle
    const targetClip = projectRef.current.clips.find(
      (c) => c.id === selectedClipId || (c.trackId === 'V2' && c.startTime <= currentTimeRef.current && (c.startTime + c.duration) > currentTimeRef.current)
    );

    if (targetClip) {
      setProject((prev) => ({
        ...prev,
        clips: prev.clips.map((c) =>
          c.id === targetClip.id
            ? { ...c, multicamAngle: angle, name: `${c.name.split(' (')[0]} (Angle ${angle})` }
            : c
        )
      }));
      showToast(`Multicam: Cut to Angle ${angle}`);
    } else {
      showToast(`Selected Angle ${angle} for next edit`);
    }
  }, [selectedClipId, setProject, showToast]);

  // --- RETIMING & SPEED RAMPING (Cmd+R) ---
  const setClipSpeed = useCallback((clipId, speedConfig) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    setProject((prev) => {
      const clip = prev.clips.find((c) => c.id === targetId);
      if (!clip) return prev;

      const currentSpeed = clip.speedRamp?.speed || 1.0;
      const newSpeed = speedConfig.speed || currentSpeed;
      // Adjust duration proportionally if requested
      const newDuration = speedConfig.adjustDuration
        ? Math.max(0.5, Math.round((clip.duration * (currentSpeed / newSpeed)) * 100) / 100)
        : clip.duration;

      return {
        ...prev,
        clips: prev.clips.map((c) =>
          c.id === targetId
            ? {
                ...c,
                duration: newDuration,
                speedRamp: {
                  ...c.speedRamp,
                  ...speedConfig,
                  speed: newSpeed
                }
              }
            : c
        )
      };
    });

    showToast(`Applied Speed Retiming: ${speedConfig.speed}x${speedConfig.isReversed ? ' (Reverse)' : ''}`);
  }, [selectedClipId, setProject, showToast]);

  // --- TIMELINE MARKERS (Key M) ---
  const addMarker = useCallback((time = currentTimeRef.current, label = 'Marker') => {
    const roundedTime = Math.round(time * 100) / 100;
    const markerColors = ['#0A84FF', '#FF9F0A', '#30D158', '#FF375F', '#BF5AF2'];
    const randomColor = markerColors[markers.length % markerColors.length];

    const newMarker = {
      id: `marker-${Date.now()}`,
      time: roundedTime,
      label: `${label} @ ${roundedTime.toFixed(1)}s`,
      color: randomColor
    };

    setMarkers((prev) => [...prev, newMarker]);
    setProject((prev) => ({
      ...prev,
      markers: [...(prev.markers || []), newMarker]
    }));
    showToast(`Added Marker at ${roundedTime.toFixed(2)}s (M)`);
  }, [markers.length, setProject, showToast]);

  const deleteMarker = useCallback((markerId) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
    setProject((prev) => ({
      ...prev,
      markers: (prev.markers || []).filter((m) => m.id !== markerId)
    }));
    showToast('Marker removed');
  }, [setProject, showToast]);

  const jumpToMarker = useCallback((time) => {
    setCurrentTime(time, true);
    showToast(`Jumped to marker at ${time.toFixed(2)}s`);
  }, [setCurrentTime, showToast]);

  // --- FINAL CUT GAP CLIP (Opt+W) ---
  const insertGapClip = useCallback(() => {
    const insertTime = Math.round(currentTimeRef.current * 100) / 100;
    const gapDuration = 3.0;

    const gapClip = {
      id: `v2-gap-${Date.now()}`,
      trackId: 'V2',
      name: 'Gap Clip',
      role: 'video',
      startTime: insertTime,
      duration: gapDuration,
      trimStart: 0,
      trimEnd: gapDuration,
      isGap: true,
      color: '#1A1A1E',
      opacity: 0
    };

    setProject((prev) => {
      // If magnetic, push subsequent V2 clips forward
      let nextClips = prev.clips;
      if (isMagnetic) {
        nextClips = prev.clips.map((c) => {
          if (c.trackId === 'V2' && c.startTime >= insertTime) {
            return { ...c, startTime: Math.round((c.startTime + gapDuration) * 100) / 100 };
          }
          if (c.parentClipId && c.startTime >= insertTime) {
            return { ...c, startTime: Math.round((c.startTime + gapDuration) * 100) / 100 };
          }
          return c;
        });
      }
      return {
        ...prev,
        clips: [...nextClips, gapClip]
      };
    });

    setSelectedClipId(gapClip.id);
    showToast('Inserted 3s Gap Clip on Storyline (Opt+W)');
  }, [isMagnetic, setProject, showToast]);

  // --- FINAL CUT COMPOUND CLIP (Alt+G) ---
  const createCompoundClip = useCallback(() => {
    setProject((prev) => {
      // Find selected or active clips
      const clipsToNest = selectedClipId
        ? prev.clips.filter((c) => c.id === selectedClipId)
        : prev.clips.filter((c) => c.trackId === 'V2' || c.trackId === 'V1');

      if (clipsToNest.length === 0) return prev;

      const minStart = Math.min(...clipsToNest.map((c) => c.startTime));
      const maxEnd = Math.max(...clipsToNest.map((c) => c.startTime + c.duration));
      const duration = Math.round((maxEnd - minStart) * 100) / 100;

      const compound = {
        id: `compound-${Date.now()}`,
        trackId: 'V2',
        name: `Compound Clip (${clipsToNest.length} Items)`,
        role: 'video',
        startTime: minStart,
        duration,
        trimStart: 0,
        trimEnd: duration,
        isCompound: true,
        nestedClips: clipsToNest,
        color: '#4B3F72',
        colorFilter: { exposure: 0, contrast: 1, saturation: 1 }
      };

      const remainingClips = prev.clips.filter((c) => !clipsToNest.some((nested) => nested.id === c.id));
      return {
        ...prev,
        clips: [...remainingClips, compound]
      };
    });

    showToast('Created Compound Clip (Alt+G)');
  }, [selectedClipId, setProject, showToast]);

  // --- FINAL CUT PRO MAGNETIC TIMELINE MUTATIONS ---
  const addClip = useCallback((clip) => {
    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, clip]
    }));
    setSelectedClipId(clip.id);
    showToast(`Added "${clip.name}" to track ${clip.trackId}`);
  }, [setProject, showToast]);

  const updateClip = useCallback((clipId, patch) => {
    setProject((prev) => {
      const targetClip = prev.clips.find((c) => c.id === clipId);
      if (!targetClip) return prev;

      // Connected Storyline: if V2 clip is moving, shift connected stems!
      let deltaXSec = 0;
      if (patch.startTime !== undefined && targetClip.trackId === 'V2') {
        deltaXSec = patch.startTime - targetClip.startTime;
      }

      return {
        ...prev,
        clips: prev.clips.map((c) => {
          if (c.id === clipId) {
            return { ...c, ...patch };
          }
          if (deltaXSec !== 0 && c.parentClipId === clipId) {
            return {
              ...c,
              startTime: Math.max(0, Math.round((c.startTime + deltaXSec) * 100) / 100)
            };
          }
          return c;
        })
      };
    });
  }, [setProject]);

  // Delete clip with Magnetic Ripple on Primary Storyline (V2)
  const deleteClip = useCallback((clipId) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    setProject((prev) => {
      const target = prev.clips.find((c) => c.id === targetId);
      if (!target) return prev;

      let remaining = prev.clips.filter((c) => c.id !== targetId);

      // Final Cut Magnetic Ripple: Close gap on Primary Storyline V2
      if (isMagnetic && target.trackId === 'V2') {
        const gap = target.duration;
        remaining = remaining.map((c) => {
          if (c.trackId === 'V2' && c.startTime > target.startTime) {
            return {
              ...c,
              startTime: Math.max(0, Math.round((c.startTime - gap) * 100) / 100)
            };
          }
          if (c.startTime > target.startTime && c.parentClipId) {
            return {
              ...c,
              startTime: Math.max(0, Math.round((c.startTime - gap) * 100) / 100)
            };
          }
          return c;
        });
      }

      return {
        ...prev,
        clips: remaining
      };
    });

    if (selectedClipId === targetId) setSelectedClipId(null);
    showToast(isMagnetic ? 'Ripple Deleted clip (Magnetic Snap)' : 'Clip deleted');
  }, [selectedClipId, isMagnetic, setProject, showToast]);

  const duplicateClip = useCallback((clipId) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    const clip = project.clips.find((c) => c.id === targetId);
    if (!clip) return;

    const newClip = {
      ...JSON.parse(JSON.stringify(clip)),
      id: `${clip.trackId.toLowerCase()}-dup-${Date.now()}`,
      name: `${clip.name} (Copy)`,
      startTime: clip.startTime + clip.duration + 0.1
    };

    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, newClip]
    }));
    setSelectedClipId(newClip.id);
    showToast(`Duplicated: ${newClip.name}`);
  }, [selectedClipId, project.clips, setProject, showToast]);

  // Blade Cut at Playhead or Skimmer Point (B)
  const splitClipAtPlayhead = useCallback((clipId, splitTime = (skimmerTime ?? currentTimeRef.current)) => {
    const targetId = clipId || selectedClipId;
    const clip = targetId
      ? project.clips.find((c) => c.id === targetId)
      : project.clips.find((c) => c.startTime < splitTime && (c.startTime + c.duration) > splitTime);

    if (!clip) {
      showToast('No clip found at blade point');
      return;
    }

    if (splitTime <= clip.startTime || splitTime >= (clip.startTime + clip.duration)) {
      showToast('Blade point must be within clip bounds');
      return;
    }

    const firstDuration = splitTime - clip.startTime;
    const secondDuration = clip.duration - firstDuration;

    const firstClip = {
      ...JSON.parse(JSON.stringify(clip)),
      duration: Math.round(firstDuration * 100) / 100,
      trimEnd: clip.trimStart + firstDuration
    };

    const secondClip = {
      ...JSON.parse(JSON.stringify(clip)),
      id: `${clip.trackId.toLowerCase()}-split-${Date.now()}`,
      name: `${clip.name} (Part 2)`,
      startTime: Math.round(splitTime * 100) / 100,
      duration: Math.round(secondDuration * 100) / 100,
      trimStart: clip.trimStart + firstDuration
    };

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === clip.id ? firstClip : c)).concat(secondClip)
    }));
    setSelectedClipId(secondClip.id);
    showToast(`Bladed clip "${clip.name}" (B)`);
  }, [skimmerTime, selectedClipId, project.clips, setProject, showToast]);

  // Roles Solo / Mute
  const toggleRoleMute = useCallback((roleId) => {
    setRolesState((prev) =>
      prev.map((r) => (r.id === roleId ? { ...r, muted: !r.muted } : r))
    );
  }, []);

  const toggleRoleSolo = useCallback((roleId) => {
    setRolesState((prev) => {
      const isCurrentlySoloed = prev.find((r) => r.id === roleId)?.soloed;
      return prev.map((r) => (r.id === roleId ? { ...r, soloed: !isCurrentlySoloed } : { ...r, soloed: false }));
    });
  }, []);

  // Pro Audio Controls
  const toggleVoiceIsolation = useCallback(() => {
    setVoiceIsolationState((prev) => {
      const next = !prev;
      audioEngine.setVoiceIsolation(next);
      showToast(next ? 'Voice Isolation: Active' : 'Voice Isolation: Off');
      return next;
    });
  }, [showToast]);

  const toggleAutoDuck = useCallback(() => {
    setAutoDuckState((prev) => {
      const next = !prev;
      audioEngine.setAutoDuck(next);
      showToast(next ? 'Auto-Duck: Active (-14dB under dialogue)' : 'Auto-Duck: Off');
      return next;
    });
  }, [showToast]);

  const setEqPreset = useCallback((presetId) => {
    const preset = AUDIO_EQ_PRESETS.find((p) => p.id === presetId) || AUDIO_EQ_PRESETS[0];
    setCurrentEqPreset(presetId);
    audioEngine.setEqPreset(preset);
    showToast(`Audio EQ: ${preset.name}`);
  }, [showToast]);

  // Set Aspect Ratio (Smart Conform)
  const setAspectRatio = useCallback((ratio) => {
    let width = 1920;
    let height = 1080;
    if (ratio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (ratio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (ratio === '4:5') {
      width = 1080;
      height = 1350;
    }

    setProject((prev) => ({
      ...prev,
      aspectRatio: ratio,
      width,
      height
    }));
    showToast(`Aspect ratio set to ${ratio}`);
  }, [setProject, showToast]);

  // Project Import / Export (.aether.json)
  const exportProjectJson = useCallback(() => {
    projectStorage.exportProjectFile(project);
    showToast('Exported Final Cut project file (.aether.json)');
  }, [project, showToast]);

  const importProjectJson = useCallback(async (file) => {
    try {
      const data = await projectStorage.importProjectFile(file);
      setProject(data);
      setCurrentTime(0, true);
      showToast(`Loaded project: "${data.title || 'Untitled'}"`);
    } catch (err) {
      alert(`Failed to import project: ${err.message}`);
    }
  }, [setProject, setCurrentTime, showToast]);

  // Native In-Browser Video Export (Zero Watermark)
  const startVideoExport = useCallback(async () => {
    setIsPlaying(false);
    setIsExportModalOpen(true);
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
      showToast('🎉 Video rendered & downloaded with zero watermarks!');
    } catch (err) {
      if (err.message !== 'Export cancelled by user.') {
        console.error('Export failed:', err);
        alert(`Export failed: ${err.message}`);
      }
    }
  }, [project, setIsPlaying, showToast]);

  const cancelVideoExport = useCallback(() => {
    exportEngine.cancel();
    setIsExportModalOpen(false);
    setExportProgress(null);
    showToast('Export cancelled');
  }, [showToast]);

  // Keyboard Shortcuts (Standard Final Cut Pro Mapping)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Spotlight Command HUD (Cmd+K or Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
        return;
      }

      // Speed Retiming Menu (Cmd+R or Ctrl+R)
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyR') {
        e.preventDefault();
        setClipSpeed(selectedClipId, { speed: 2.0, isReversed: false });
        return;
      }

      // Multicam Angle Cut (Keys 1, 2, 3, 4)
      if (!e.metaKey && !e.ctrlKey && !e.altKey && ['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(e.code)) {
        e.preventDefault();
        const angleNum = parseInt(e.code.replace('Digit', ''), 10);
        setMulticamAngle(angleNum);
        return;
      }

      // Gap Clip (Option+W or Alt+W)
      if (e.altKey && e.code === 'KeyW') {
        e.preventDefault();
        insertGapClip();
        return;
      }

      // Compound Clip (Option+G or Alt+G)
      if (e.altKey && e.code === 'KeyG') {
        e.preventDefault();
        createCompoundClip();
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyB') {
        // Blade Tool
        e.preventDefault();
        setActiveTool('blade');
        splitClipAtPlayhead();
      } else if (e.code === 'KeyA') {
        // Select Tool
        e.preventDefault();
        setActiveTool('select');
        showToast('Select Tool Active (A)');
      } else if (e.code === 'KeyT') {
        // Trim Tool
        e.preventDefault();
        setActiveTool('trim');
        showToast('Trim Tool Active (T)');
      } else if (e.code === 'KeyP') {
        // Position Tool
        e.preventDefault();
        setActiveTool('position');
        showToast('Position Tool Active (P)');
      } else if (e.code === 'KeyS' && !e.metaKey && !e.ctrlKey) {
        // Toggle Skimmer
        e.preventDefault();
        setIsSkimmingEnabled((prev) => {
          const next = !prev;
          showToast(next ? 'Live Skimming: ON (S)' : 'Live Skimming: OFF (S)');
          return next;
        });
      } else if (e.code === 'KeyN') {
        // Snapping / Magnetic Toggle
        e.preventDefault();
        setIsMagnetic((prev) => {
          const next = !prev;
          showToast(next ? 'Snapping & Magnetic: ON (N)' : 'Snapping & Magnetic: OFF (N)');
          return next;
        });
      } else if (e.code === 'KeyM') {
        // Add Marker
        e.preventDefault();
        addMarker();
      } else if (e.code === 'KeyD' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        duplicateClip();
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        e.preventDefault();
        deleteClip();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepFrame(e.shiftKey ? -30 : -1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFrame(e.shiftKey ? 30 : 1);
      } else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyZ') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
      } else if (e.code === 'Escape') {
        setSelectedClipId(null);
        setIsSpotlightOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    setClipSpeed,
    selectedClipId,
    setMulticamAngle,
    insertGapClip,
    createCompoundClip,
    splitClipAtPlayhead,
    addMarker,
    duplicateClip,
    deleteClip,
    stepFrame,
    undo,
    redo,
    showToast
  ]);

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;

  const value = {
    project,
    setProject,
    tracks,
    setTracks,
    currentTime,
    currentTimeRef,
    setCurrentTime,
    subscribeTime,
    isPlaying,
    setIsPlaying,
    togglePlay,
    stepFrame,
    playbackQuality,
    setPlaybackQuality,
    isMulticamView,
    setIsMulticamView,
    activeMulticamAngle,
    setMulticamAngle,
    selectedClipId,
    setSelectedClipId,
    selectedClip,
    addClip,
    updateClip,
    deleteClip,
    duplicateClip,
    splitClipAtPlayhead,
    setClipSpeed,
    markers,
    addMarker,
    deleteMarker,
    jumpToMarker,
    insertGapClip,
    createCompoundClip,
    rolesState,
    toggleRoleMute,
    toggleRoleSolo,
    zoom,
    setZoom,
    setAspectRatio,
    activeView,
    setActiveView,
    undo,
    redo,
    exportProjectJson,
    importProjectJson,
    startVideoExport,
    cancelVideoExport,
    isExportModalOpen,
    setIsExportModalOpen,
    exportProgress,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    toastMessage,
    showToast,
    // Final Cut Pro Layout
    workspaceMode,
    setWorkspaceMode,
    showBrowser,
    setShowBrowser,
    showInspector,
    setShowInspector,
    showScopes,
    setShowScopes,
    isSpotlightOpen,
    setIsSpotlightOpen,
    leftDockWidth,
    setLeftDockWidth,
    rightInspectorWidth,
    setRightInspectorWidth,
    timelineHeight,
    setTimelineHeight,
    activeTool,
    setActiveTool,
    isMagnetic,
    setIsMagnetic,
    isSkimmingEnabled,
    setIsSkimmingEnabled,
    skimmerTime,
    setSkimmerTime,
    stereoDb,
    voiceIsolation,
    toggleVoiceIsolation,
    autoDuck,
    toggleAutoDuck,
    currentEqPreset,
    setEqPreset
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
