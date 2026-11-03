import React, { useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { PROCEDURAL_SCENES } from '../../../types/studioTypes';
import { Upload, Plus, Film, Layers, Sparkles, Music, Camera } from 'lucide-react';

export default function TabMediaLibrary() {
  const {
    addClip,
    currentTime,
    insertGapClip,
    createCompoundClip,
    isMulticamView,
    setIsMulticamView,
    showToast
  } = useStudio();
  const fileInputRef = useRef(null);

  // Handle local file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      const isImage = file.type.startsWith('image');
      const isAudio = file.type.startsWith('audio');

      if (isVideo) {
        const videoEl = document.createElement('video');
        videoEl.src = url;
        videoEl.muted = true;
        videoEl.onloadedmetadata = () => {
          const duration = Math.min(60, videoEl.duration || 10);
          addClip({
            id: `v2-up-${Date.now()}`,
            trackId: 'V2',
            role: 'video',
            name: file.name,
            startTime: currentTime,
            duration,
            trimStart: 0,
            trimEnd: duration,
            videoElement: videoEl,
            sourceUrl: url,
            transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: 'normal' },
            colorFilter: { exposure: 0, contrast: 1.0, saturation: 1.0, lutPreset: 'none' }
          });
        };
      } else if (isImage) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          addClip({
            id: `v1-img-${Date.now()}`,
            trackId: 'V1',
            role: 'broll',
            name: file.name,
            startTime: currentTime,
            duration: 5.0,
            trimStart: 0,
            trimEnd: 5.0,
            imageElement: img,
            sourceUrl: url,
            transform: { x: 300, y: -180, scale: 0.4, rotation: 0, opacity: 1.0, blendMode: 'normal' },
            colorFilter: { exposure: 0, contrast: 1.0, saturation: 1.0, lutPreset: 'none' }
          });
        };
      } else if (isAudio) {
        addClip({
          id: `a1-up-${Date.now()}`,
          trackId: 'A1',
          role: 'music',
          name: file.name,
          startTime: currentTime,
          duration: 15.0,
          trimStart: 0,
          trimEnd: 15.0,
          sourceUrl: url,
          audio: { volume: 1.0, fadeIn: 0.2, fadeOut: 0.2, sfxType: 'custom' }
        });
      }
    });

    e.target.value = '';
    showToast('Imported local media file');
  };

  const addProceduralClip = (sceneType, trackId = 'V2') => {
    const sceneInfo = PROCEDURAL_SCENES.find((s) => s.id === sceneType);
    const newClip = {
      id: `${trackId.toLowerCase()}-proc-${Date.now()}`,
      trackId,
      role: trackId === 'V2' ? 'video' : 'broll',
      name: sceneInfo?.name || 'Procedural Scene',
      startTime: currentTime,
      duration: 6.0,
      trimStart: 0,
      trimEnd: 6.0,
      sceneType,
      transform: {
        x: trackId === 'V1' ? 380 : 0,
        y: trackId === 'V1' ? -200 : 0,
        scale: trackId === 'V1' ? 0.35 : 1.0,
        rotation: 0,
        opacity: 1.0,
        blendMode: 'normal'
      },
      colorFilter: { exposure: 0, contrast: 1.05, saturation: 1.1, lutPreset: 'none' }
    };
    addClip(newClip);
  };

  return (
    <div className="h-full flex flex-col p-3 space-y-3.5 select-none text-xs overflow-y-auto">
      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#242429] hover:border-[#0A84FF] rounded-xl p-3.5 text-center cursor-pointer transition-all bg-[#111114] hover:bg-[#18181D] group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="video/*,image/*,audio/*"
          className="hidden"
        />
        <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#0A84FF] mx-auto mb-1 transition-colors" />
        <span className="font-semibold text-slate-200 block text-xs">
          Import Local Video / Audio / Stills
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          Zero cloud upload · 100% private in-memory
        </span>
      </div>

      {/* Pro NLE Fast Clip Insertion Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={insertGapClip}
          className="px-2.5 py-2 rounded-lg bg-[#1C1C21] hover:bg-[#242429] border border-white/[0.08] text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Film className="w-3.5 h-3.5 text-[#FF9F0A]" />
          <span className="text-[11px] font-medium">Gap Clip (⌥W)</span>
        </button>
        <button
          onClick={createCompoundClip}
          className="px-2.5 py-2 rounded-lg bg-[#1C1C21] hover:bg-[#242429] border border-white/[0.08] text-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Layers className="w-3.5 h-3.5 text-[#BF5AF2]" />
          <span className="text-[11px] font-medium">Compound (⌥G)</span>
        </button>
      </div>

      {/* Multicam Switcher Toggle Pill */}
      <div className="p-2.5 rounded-xl bg-[#161619] border border-[#242429] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-[#0A84FF]" />
          <div>
            <span className="font-semibold text-white block text-xs">4-Angle Multicam</span>
            <span className="text-[10px] text-slate-400">Keys 1-4 switch camera angles</span>
          </div>
        </div>
        <button
          onClick={() => setIsMulticamView(!isMulticamView)}
          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-colors ${
            isMulticamView ? 'bg-[#0A84FF] text-white' : 'bg-[#242429] text-slate-400 hover:text-white'
          }`}
        >
          {isMulticamView ? 'VIEWING 4X' : 'ENABLE'}
        </button>
      </div>

      {/* Built-in Procedural Cinema Visuals */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Procedural Generators</span>
          </span>
          <span className="text-[10px] text-[#0A84FF] font-mono">60fps Zero-Lag</span>
        </div>

        <div className="space-y-1.5">
          {PROCEDURAL_SCENES.map((scene) => (
            <div
              key={scene.id}
              className="p-2.5 rounded-xl bg-[#111114] border border-[#242429] hover:border-white/[0.15] transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5 max-w-[170px]">
                <span className="font-semibold text-slate-200 block truncate text-xs group-hover:text-[#0A84FF] transition-colors">
                  {scene.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1 font-mono">
                  {scene.desc}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => addProceduralClip(scene.id, 'V1')}
                  title="Insert as PIP / B-Roll (Track V1)"
                  className="p-1.5 rounded-lg bg-[#1C1C21] hover:bg-[#0A84FF] text-slate-300 hover:text-white transition-colors"
                >
                  <span className="text-[10px] font-mono font-bold px-0.5">V1</span>
                </button>
                <button
                  onClick={() => addProceduralClip(scene.id, 'V2')}
                  title="Insert onto Primary Storyline (Track V2)"
                  className="p-1.5 rounded-lg bg-[#1C1C21] hover:bg-[#0A84FF] text-slate-300 hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
