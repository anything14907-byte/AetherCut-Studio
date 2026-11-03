/**
 * Studio Context & State Manager — Final Cut Pro Studio Edition (v2.0)
 * Magnetic Timeline, Live Skimming, Resizable Panes, Workspace Modes,
 * 3-Way Color Wheels, Audio Meters, Connected Storyline Stems & Audition Stacks.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_DEMO_PROJECT } from '../config/defaultProject';
import { TRACK_CONFIGS, AUDIO_EQ_PRESETS } from '../types/studioTypes';
import { projectStorage } from '../services/projectStorage';
import { audioEngine } from '../services/audioEngine';
import { aiDirectorEngine } from '../services/aiDirectorEngine';
import { exportEngine } from '../services/exportEngine';
import { renderCompositorFrame } from '../services/canvasRenderer';

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  // Query parameters: e.g. ?v=demo or ?v=space or ?v=shorts
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialVParam = urlParams ? urlParams.get('v') : null;

  // Load saved project or fall back to rich demo project
  const [project, setProjectState] = useState(() => {
    if (initialVParam === 'space') {
      return aiDirectorEngine.generateProceduralProject('Deep space cosmic journey with ambient drone and minimal cinema titles', '16:9');
    } else if (initialVParam === 'shorts' || initialVParam === 'tiktok') {
      return aiDirectorEngine.generateProceduralProject('Viral vertical hook with Hormozi kinetic captions', '9:16');
    }
    const saved = projectStorage.loadFromLocalStorage();
    return saved || DEFAULT_DEMO_PROJECT;
  });

  const [activeView, setActiveView] = useState(() => (initialVParam ? 'studio' : 'landing'));
  const [currentTime, setCurrentTimeState] = useState(0.0);
  const [isPlaying, setIsPlayingState] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [zoom, setZoom] = useState(45); // px per second
  const [tracks, setTracks] = useState(TRACK_CONFIGS);

  // --- FINAL CUT PRO 2.0 WORKSPACE ERGONOMICS ---
  const [workspaceMode, setWorkspaceMode] = useState('edit'); // 'edit' | 'color' | 'audio' | 'ai'
  const [showBrowser, setShowBrowser] = useState(true);
  const [showInspector, setShowInspector] = useState(true);
  const [showScopes, setShowScopes] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Resizable Panes Dimensions
  const [leftDockWidth, setLeftDockWidth] = useState(280);
  const [rightInspectorWidth, setRightInspectorWidth] = useState(340);
  const [timelineHeight, setTimelineHeight] = useState(240);

  // Editing Tools & Magnetic Timeline
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'blade'
  const [isMagnetic, setIsMagnetic] = useState(true);
  const [isSkimmingEnabled, setIsSkimmingEnabled] = useState(true);
  const [skimmerTime, setSkimmerTime] = useState(null);

  // Live Stereo dBFS Meter State
  const [stereoDb, setStereoDb] = useState({ leftDb: -60, rightDb: -60, leftPeak: -60, rightPeak: -60 });

  // Pro Audio Suite State
  const [voiceIsolation, setVoiceIsolationState] = useState(false);
  const [autoDuck, setAutoDuckState] = useState(true);
  const [currentEqPreset, setCurrentEqPreset] = useState('flat');

  // Modals & UI States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState({ past: [], future: [] });

  const animFrameRef = useRef(null);
  const meterIntervalRef = useRef(null);
  const lastPlayTimeRef = useRef(null);
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
    }, 4000);
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
    showToast('Undo executed');
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
    showToast('Redo executed');
  }, [showToast]);

  // Playhead scrub & clamp
  const setCurrentTime = useCallback((time) => {
    const clamped = Math.max(0, Math.min(projectRef.current.duration, time));
    setCurrentTimeState(clamped);
    audioEngine.syncTimeline(clamped, false, projectRef.current.clips);
  }, []);

  // Play / Pause playback loop
  const setIsPlaying = useCallback((playing) => {
    audioEngine.init();
    setIsPlayingState(playing);
    if (!playing) {
      audioEngine.stopAll();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      setStereoDb({ leftDb: -60, rightDb: -60, leftPeak: -60, rightPeak: -60 });
    } else {
      lastPlayTimeRef.current = performance.now();
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlayingState((prev) => {
      const next = !prev;
      audioEngine.init();
      if (!next) {
        audioEngine.stopAll();
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        setStereoDb({ leftDb: -60, rightDb: -60, leftPeak: -60, rightPeak: -60 });
      } else {
        lastPlayTimeRef.current = performance.now();
      }
      return next;
    });
  }, []);

  // Frame stepper (-1 / +1 frame, e.g. Left/Right Arrow or Rotary Jog Wheel)
  const stepFrame = useCallback((deltaFrames = 1) => {
    setIsPlaying(false);
    const fps = projectRef.current.fps || 30;
    const deltaSec = deltaFrames / fps;
    setCurrentTime(currentTime + deltaSec);
  }, [currentTime, setCurrentTime, setIsPlaying]);

  // Master playback requestAnimationFrame loop
  useEffect(() => {
    if (!isPlaying) return;

    const tick = (now) => {
      if (!lastPlayTimeRef.current) lastPlayTimeRef.current = now;
      const elapsedSec = (now - lastPlayTimeRef.current) / 1000;
      lastPlayTimeRef.current = now;

      setCurrentTimeState((prevTime) => {
        let newTime = prevTime + elapsedSec;
        if (newTime >= projectRef.current.duration) {
          newTime = 0; // loop back
        }
        audioEngine.syncTimeline(newTime, true, projectRef.current.clips);
        return newTime;
      });

      // Update Stereo dBFS Meter
      setStereoDb(audioEngine.getStereoDbLevels(true));

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // --- FINAL CUT PRO MAGNETIC TIMELINE & CONNECTED STEM MUTATIONS ---

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
      const targetClip = prev.clips.find(c => c.id === clipId);
      if (!targetClip) return prev;

      // Connected Storyline: if V2 clip is moving, also shift connected T1/A1 stems!
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
          // Shift connected children
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
      const target = prev.clips.find(c => c.id === targetId);
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
          // Also ripple tethered stems
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
    showToast(isMagnetic ? 'Ripple Deleted clip (Magnetic Snap active)' : 'Clip deleted');
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
      startTime: clip.startTime + clip.duration + 0.2
    };

    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, newClip]
    }));
    setSelectedClipId(newClip.id);
    showToast(`Duplicated clip: ${newClip.name}`);
  }, [selectedClipId, project.clips, setProject, showToast]);

  // Blade Cut at Playhead or Skimmer Point
  const splitClipAtPlayhead = useCallback((clipId, splitTime = (skimmerTime ?? currentTime)) => {
    const targetId = clipId || selectedClipId;
    const clip = targetId
      ? project.clips.find((c) => c.id === targetId)
      : project.clips.find((c) => c.startTime < splitTime && (c.startTime + c.duration) > splitTime);

    if (!clip) {
      showToast('No clip found at split location');
      return;
    }

    if (splitTime <= clip.startTime || splitTime >= (clip.startTime + clip.duration)) {
      showToast('Split point must be strictly within clip bounds');
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
    showToast(`Bladed clip "${clip.name}" at ${splitTime.toFixed(2)}s`);
  }, [currentTime, skimmerTime, selectedClipId, project.clips, setProject, showToast]);

  // Cycle Clip Audition (1/3 Stack Badge)
  const cycleClipAudition = useCallback((clipId) => {
    const clip = project.clips.find(c => c.id === clipId);
    if (!clip || !clip.auditions || clip.auditions.length <= 1) return;

    const nextIndex = ((clip.activeAuditionIndex || 0) + 1) % clip.auditions.length;
    const newTake = clip.auditions[nextIndex];

    updateClip(clipId, {
      activeAuditionIndex: nextIndex,
      name: newTake.name || clip.name,
      sceneType: newTake.sceneType || clip.sceneType,
      colorFilter: {
        ...(clip.colorFilter || {}),
        lutPreset: newTake.lutPreset || clip.colorFilter?.lutPreset || 'none'
      }
    });

    showToast(`Switched to Audition Take ${nextIndex + 1}/${clip.auditions.length}`);
  }, [project.clips, updateClip, showToast]);

  // Pro Audio Methods
  const toggleVoiceIsolation = useCallback(() => {
    setVoiceIsolationState((prev) => {
      const next = !prev;
      audioEngine.setVoiceIsolation(next);
      showToast(next ? 'Voice Isolation: Active (Vocal frequencies enhanced)' : 'Voice Isolation: Off');
      return next;
    });
  }, [showToast]);

  const toggleAutoDuck = useCallback(() => {
    setAutoDuckState((prev) => {
      const next = !prev;
      audioEngine.setAutoDuck(next);
      showToast(next ? 'Auto-Duck Music: Enabled (-14dB under voiceover)' : 'Auto-Duck Music: Disabled');
      return next;
    });
  }, [showToast]);

  const setEqPreset = useCallback((presetId) => {
    const preset = AUDIO_EQ_PRESETS.find(p => p.id === presetId) || AUDIO_EQ_PRESETS[0];
    setCurrentEqPreset(presetId);
    audioEngine.setEqPreset(preset);
    showToast(`Applied Audio EQ: ${preset.name}`);
  }, [showToast]);

  // Set Aspect Ratio
  const setAspectRatio = useCallback((ratio) => {
    let width = 1920;
    let height = 1080;
    if (ratio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (ratio === '1:1') {
      width = 1080;
      height = 1080;
    }

    setProject((prev) => ({
      ...prev,
      aspectRatio: ratio,
      width,
      height
    }));
    showToast(`Aspect ratio set to ${ratio}`);
  }, [setProject, showToast]);

  // Execute AI Command
  const executeAiCommand = useCallback(async (commandText) => {
    try {
      const res = await aiDirectorEngine.processCommand(commandText, {
        currentTime,
        selectedClipId,
        project
      });

      if (res.type === 'SPLIT_CLIP') {
        splitClipAtPlayhead(res.clipId, res.targetTime);
      } else if (res.type === 'ADD_CLIP') {
        addClip(res.clip);
      } else if (res.type === 'APPLY_COLOR_GRADE') {
        setProject((prev) => ({
          ...prev,
          clips: prev.clips.map((c) =>
            c.trackId === 'V2' || c.trackId === 'V1'
              ? { ...c, colorFilter: { ...(c.colorFilter || {}), lutPreset: res.lutPreset } }
              : c
          )
        }));
      } else if (res.type === 'SET_BGM') {
        setProject((prev) => ({
          ...prev,
          clips: prev.clips.filter((c) => !(c.trackId === 'A1' && c.audio?.sfxType?.includes('Bgm'))).concat(res.clip)
        }));
      } else if (res.type === 'SET_ASPECT_RATIO') {
        setAspectRatio(res.aspectRatio);
      } else if (res.type === 'SET_VOLUME') {
        audioEngine.setMasterVolume(res.volume);
        setProject((prev) => ({ ...prev, masterVolume: res.volume }));
      } else if (res.type === 'REPLACE_PROJECT') {
        setProject(res.project);
        setCurrentTime(0);
        setActiveView('studio');
      }

      showToast(res.message);
      return res;
    } catch (err) {
      console.error('AI Command failed:', err);
      showToast(`AI Command error: ${err.message}`);
    }
  }, [currentTime, selectedClipId, project, splitClipAtPlayhead, addClip, setProject, setAspectRatio, setCurrentTime, showToast]);

  // Project Import / Export
  const exportProjectJson = useCallback(() => {
    projectStorage.exportProjectFile(project);
    showToast('Exported Final Cut project file (.aether.json)');
  }, [project, showToast]);

  const importProjectJson = useCallback(async (file) => {
    try {
      const data = await projectStorage.importProjectFile(file);
      setProject(data);
      setCurrentTime(0);
      showToast(`Loaded project: "${data.title || 'Untitled'}"`);
    } catch (err) {
      alert(`Failed to import project: ${err.message}`);
    }
  }, [setProject, setCurrentTime, showToast]);

  // Real In-Browser Video Export
  const startVideoExport = useCallback(async () => {
    setIsPlaying(false);
    setIsExportModalOpen(true);
    setExportProgress({ percent: 0, currentTime: 0, remainingSec: '--', totalFrames: project.duration * project.fps });

    try {
      await exportEngine.exportVideo(
        project,
        (ctx, w, h, t, clips) => {
          renderCompositorFrame(ctx, w, h, t, clips, { showBoundingBox: false });
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

  // Global Keyboard Shortcuts
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

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyB') {
        // Blade Tool
        e.preventDefault();
        setActiveTool('blade');
        showToast('Blade Tool Active (B)');
      } else if (e.code === 'KeyA') {
        // Select Tool
        e.preventDefault();
        setActiveTool('select');
        showToast('Select Tool Active (A)');
      } else if (e.code === 'KeyS' && !e.metaKey && !e.ctrlKey) {
        // Toggle Skimmer
        e.preventDefault();
        setIsSkimmingEnabled((prev) => {
          const next = !prev;
          showToast(next ? 'Live Skimming: ON (S)' : 'Live Skimming: OFF (S)');
          return next;
        });
      } else if (e.code === 'KeyM') {
        // Toggle Magnetic Timeline
        e.preventDefault();
        setIsMagnetic((prev) => {
          const next = !prev;
          showToast(next ? 'Magnetic Timeline: Enabled (M)' : 'Magnetic Timeline: Disabled (M)');
          return next;
        });
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
      } else if ((e.metaKey || e.ctrlKey) && e.code === 'KeyY') {
        e.preventDefault();
        redo();
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
  }, [togglePlay, duplicateClip, deleteClip, stepFrame, undo, redo, showToast]);

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;

  const value = {
    project,
    setProject,
    tracks,
    setTracks,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    togglePlay,
    stepFrame,
    selectedClipId,
    setSelectedClipId,
    selectedClip,
    addClip,
    updateClip,
    deleteClip,
    duplicateClip,
    splitClipAtPlayhead,
    cycleClipAudition,
    zoom,
    setZoom,
    setAspectRatio,
    activeView,
    setActiveView,
    undo,
    redo,
    executeAiCommand,
    exportProjectJson,
    importProjectJson,
    startVideoExport,
    cancelVideoExport,
    isExportModalOpen,
    setIsExportModalOpen,
    exportProgress,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    toastMessage,
    showToast,
    // Final Cut Pro 2.0 Ergonomics
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
