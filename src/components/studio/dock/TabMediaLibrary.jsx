import React, { useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { PROCEDURAL_SCENES } from '../../../types/studioTypes';
import { Upload, Plus, Film, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function TabMediaLibrary() {
  const { addClip, currentTime, showToast } = useStudio();
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
          const duration = Math.min(30, videoEl.duration || 10);
          addClip({
            id: `v2-up-${Date.now()}`,
            trackId: 'V2',
            type: 'video',
            name: file.name,
            startTime: currentTime,
            duration,
            trimStart: 0,
            trimEnd: duration,
            videoElement: videoEl,
            sourceUrl: url,
            transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
            colorFilter: { brightness: 100, contrast: 100, saturation: 100, hueRotate: 0, blur: 0, lutPreset: 'none' }
          });
        };
      } else if (isImage) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          addClip({
            id: `v1-img-${Date.now()}`,
            trackId: 'V1',
            type: 'image',
            name: file.name,
            startTime: currentTime,
            duration: 5.0,
            trimStart: 0,
            trimEnd: 5.0,
            imageElement: img,
            sourceUrl: url,
            transform: { x: 0, y: 0, scale: 0.5, rotation: 0, opacity: 1.0 },
            colorFilter: { brightness: 100, contrast: 100, saturation: 100, hueRotate: 0, blur: 0, lutPreset: 'none' }
          });
        };
      } else if (isAudio) {
        addClip({
          id: `a1-up-${Date.now()}`,
          trackId: 'A1',
          type: 'audio',
          name: file.name,
          startTime: currentTime,
          duration: 10.0,
          trimStart: 0,
          trimEnd: 10.0,
          sourceUrl: url,
          audio: { volume: 1.0, fadeIn: 0.2, fadeOut: 0.2 }
        });
      }
    });

    e.target.value = '';
    showToast('Uploaded local media file to timeline');
  };

  const addProceduralClip = (sceneType, trackId = 'V2') => {
    const sceneInfo = PROCEDURAL_SCENES.find((s) => s.id === sceneType);
    const newClip = {
      id: `${trackId.toLowerCase()}-proc-${Date.now()}`,
      trackId,
      type: 'procedural',
      name: sceneInfo?.name || 'Procedural Scene',
      startTime: currentTime,
      duration: 6.0,
      trimStart: 0,
      trimEnd: 6.0,
      sceneType,
      transform: {
        x: trackId === 'V1' ? 450 : 0,
        y: trackId === 'V1' ? -220 : 0,
        scale: trackId === 'V1' ? 0.35 : 1.0,
        rotation: 0,
        opacity: 1.0
      },
      colorFilter: { brightness: 100, contrast: 110, saturation: 120, hueRotate: 0, blur: 0, lutPreset: 'none' }
    };
    addClip(newClip);
  };

  return (
    <div className="h-full flex flex-col p-3.5 space-y-4 select-none text-xs overflow-y-auto">
      {/* Upload Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-white/[0.12] hover:border-[#00F2FE]/50 rounded-xl p-4 text-center cursor-pointer transition-all bg-[#11131A] hover:bg-[#181B26] group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          multiple
          accept="video/*,image/*,audio/*"
          className="hidden"
        />
        <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#00F2FE] mx-auto mb-1.5 transition-colors" />
        <span className="font-semibold text-slate-200 block text-xs">
          Drop Video, Photo, or Audio
        </span>
        <span className="text-[10px] text-slate-500">
          Stored locally in your browser memory
        </span>
      </div>

      {/* Procedural Visual Backgrounds */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span>Procedural 60fps Scenes</span>
          </span>
          <span className="text-[10px] text-electric-cyan font-mono">Zero Assets</span>
        </div>

        <div className="space-y-2">
          {PROCEDURAL_SCENES.map((scene) => (
            <div
              key={scene.id}
              className="p-2.5 rounded-xl bg-[#11131A] border border-white/[0.06] hover:border-white/[0.15] transition-all flex items-center justify-between group"
            >
              <div className="space-y-0.5 max-w-[170px]">
                <span className="font-semibold text-slate-200 block truncate text-xs group-hover:text-[#00F2FE] transition-colors">
                  {scene.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {scene.desc}
                </span>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => addProceduralClip(scene.id, 'V2')}
                  title="Add to Main Video track (V2)"
                  className="px-2 py-1 rounded bg-[#181B26] hover:bg-[#3B82F6]/20 text-[#3B82F6] hover:text-white border border-white/[0.08] text-[10px] font-mono flex items-center space-x-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>V2</span>
                </button>
                <button
                  onClick={() => addProceduralClip(scene.id, 'V1')}
                  title="Add as PIP Overlay (V1)"
                  className="px-2 py-1 rounded bg-[#181B26] hover:bg-[#00F2FE]/20 text-[#00F2FE] hover:text-white border border-white/[0.08] text-[10px] font-mono flex items-center space-x-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>V1</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

