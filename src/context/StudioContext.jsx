/**
 * Studio Context & State Manager
 * Centralized state for Timeline, Canvas Engine, Tracks, History, and AI Mutations.
 */

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_DEMO_PROJECT } from '../config/defaultProject';
import { TRACK_CONFIGS } from '../types/studioTypes';
import { projectStorage } from '../services/projectStorage';
import { audioEngine } from '../services/audioEngine';
import { aiDirectorEngine } from '../services/aiDirectorEngine';
import { exportEngine } from '../services/exportEngine';
import { renderCompositorFrame } from '../services/canvasRenderer';

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  // Load saved project or fall back to rich demo project
  const [project, setProjectState] = useState(() => {
    const saved = projectStorage.loadFromLocalStorage();
    return saved || DEFAULT_DEMO_PROJECT;
  });

  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'studio'
  const [currentTime, setCurrentTimeState] = useState(0.0);
  const [isPlaying, setIsPlayingState] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState(null);
  const [zoom, setZoom] = useState(45); // px per second
  const [tracks, setTracks] = useState(TRACK_CONFIGS);
  
  // Modals & UI States
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportProgress, setExportProgress] = useState(null);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState({ past: [], future: [] });

  // Playback animation frame ref
  const animFrameRef = useRef(null);
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
          past: [...h.past.slice(-20), prev],
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
    // sync audio engine
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
      } else {
        lastPlayTimeRef.current = performance.now();
      }
      return next;
    });
  }, []);

  // Frame stepper (e.g. Left/Right arrow keys)
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

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // --- CLIP MUTATION ACTIONS ---

  const addClip = useCallback((clip) => {
    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, clip]
    }));
    setSelectedClipId(clip.id);
    showToast(`Added "${clip.name}" to track ${clip.trackId}`);
  }, [setProject, showToast]);

  const updateClip = useCallback((clipId, patch) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === clipId ? { ...c, ...patch } : c))
    }));
  }, [setProject]);

  const deleteClip = useCallback((clipId) => {
    const targetId = clipId || selectedClipId;
    if (!targetId) return;

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.filter((c) => c.id !== targetId)
    }));
    if (selectedClipId === targetId) setSelectedClipId(null);
    showToast('Clip deleted');
  }, [selectedClipId, setProject, showToast]);

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

  const splitClipAtPlayhead = useCallback((clipId, splitTime = currentTime) => {
    const targetId = clipId || selectedClipId;
    const clip = targetId
      ? project.clips.find((c) => c.id === targetId)
      : project.clips.find((c) => c.startTime < splitTime && (c.startTime + c.duration) > splitTime);

    if (!clip) {
      showToast('No clip found at playhead to split');
      return;
    }

    if (splitTime <= clip.startTime || splitTime >= (clip.startTime + clip.duration)) {
      showToast('Split point must be strictly within clip duration');
      return;
    }

    const firstDuration = splitTime - clip.startTime;
    const secondDuration = clip.duration - firstDuration;

    const firstClip = {
      ...JSON.parse(JSON.stringify(clip)),
      duration: firstDuration,
      trimEnd: clip.trimStart + firstDuration
    };

    const secondClip = {
      ...JSON.parse(JSON.stringify(clip)),
      id: `${clip.trackId.toLowerCase()}-split-${Date.now()}`,
      name: `${clip.name} (Part 2)`,
      startTime: splitTime,
      duration: secondDuration,
      trimStart: clip.trimStart + firstDuration
    };

    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === clip.id ? firstClip : c)).concat(secondClip)
    }));
    setSelectedClipId(secondClip.id);
    showToast(`Split clip "${clip.name}" into two`);
  }, [currentTime, selectedClipId, project.clips, setProject, showToast]);

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

  // Execute AI Natural Language Command
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
        // apply lut to visual clips
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
    showToast('Exported project file (.aether.json)');
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
      showToast('🎉 Video rendered & downloaded successfully with ZERO watermarks!');
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

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyS' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        splitClipAtPlayhead();
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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, splitClipAtPlayhead, duplicateClip, deleteClip, stepFrame, undo, redo]);

  // Selected clip object helper
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

