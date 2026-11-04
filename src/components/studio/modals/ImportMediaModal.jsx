import React, { useState, useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import {
  FolderOpen,
  Film,
  Music,
  Image as ImageIcon,
  Palette,
  UploadCloud,
  Check,
  X,
  Plus,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ImportMediaModal() {
  const {
    isImportModalOpen,
    setIsImportModalOpen,
    appendClip,
    connectClip,
    showToast
  } = useStudio();

  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'stock' | 'solids'
  const [importTarget, setImportTarget] = useState('storyline'); // 'storyline' | 'connect'
  const [dragOver, setDragOver] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState('cyberGrid');
  const [solidColor, setSolidColor] = useState('#000000');
  const [solidName, setSolidName] = useState('Black Gap Matte');
  const fileInputRef = useRef(null);

  if (!isImportModalOpen) return null;

  const stockClips = [
    {
      id: 'cyberGrid',
      name: 'Cyber Grid Neon Master',
      desc: '1080p60 • Procedural Neon Horizon Studio Camera',
      gradient: 'from-blue-600 via-indigo-900 to-purple-900',
      duration: 8.0,
      role: 'video'
    },
    {
      id: 'nebulaSpace',
      name: 'Cosmic Starfield 60p',
      desc: '1080p60 • 3D Particle Deep Space Cosmic Nebula',
      gradient: 'from-purple-900 via-slate-900 to-black',
      duration: 10.0,
      role: 'video'
    },
    {
      id: 'auroraFluid',
      name: 'Aurora Lights Fluid Cut',
      desc: '1080p60 • Dynamic Atmospheric Northern Lights',
      gradient: 'from-emerald-600 via-teal-900 to-black',
      duration: 7.5,
      role: 'video'
    },
    {
      id: 'synthwaveSun',
      name: 'Synthwave Sun Horizon',
      desc: '1080p60 • Glowing Retrowave Sun & Perspective Wireframe',
      gradient: 'from-amber-600 via-red-900 to-purple-900',
      duration: 12.0,
      role: 'video'
    },
    {
      id: 'matrixRain',
      name: 'Digital Matrix Stream',
      desc: '1080p60 • High-Velocity Code Waterfall Terminal',
      gradient: 'from-green-600 via-emerald-950 to-black',
      duration: 6.0,
      role: 'video'
    }
  ];

  const solidPresets = [
    { name: 'Black Gap Matte', color: '#000000', role: 'gap', isGap: true },
    { name: '18% Neutral Gray (Rec.709)', color: '#4A4A4A', role: 'video' },
    { name: 'Pure White Flash', color: '#FFFFFF', role: 'video' },
    { name: 'Electric Cyan Glow', color: '#00F2FE', role: 'video' },
    { name: 'Hollywood Gold Solid', color: '#F5A623', role: 'video' },
    { name: 'Cinema Deep Violet', color: '#4D2E6B', role: 'titles' }
  ];

  const handleFiles = (filesList) => {
    const files = Array.from(filesList);
    if (!files.length) return;

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const isAudio = file.type.startsWith('audio');
      const isVideo = file.type.startsWith('video');

      const clip = {
        id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: file.name,
        role: isAudio ? 'dialogue' : 'video',
        trackId: isAudio ? 'A1' : (importTarget === 'connect' ? 'V1' : 'V2'),
        startTime: 0,
        duration: 5.0,
        trimStart: 0,
        trimEnd: 5.0,
        sourceUrl: url,
        sceneType: 'cyberGrid',
        transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: 'normal' },
        colorFilter: { brightness: 100, contrast: 100, saturation: 100, lutPreset: 'none' }
      };

      if (importTarget === 'connect') {
        connectClip(clip);
      } else {
        appendClip(clip);
      }
    });

    showToast(`Imported ${files.length} file(s) into storyline`);
    setIsImportModalOpen(false);
  };

  const handleImportStock = () => {
    const stock = stockClips.find((s) => s.id === selectedStockId) || stockClips[0];
    const clip = {
      id: `stock-${Date.now()}`,
      name: stock.name,
      role: 'video',
      trackId: importTarget === 'connect' ? 'V1' : 'V2',
      startTime: 0,
      duration: stock.duration,
      trimStart: 0,
      trimEnd: stock.duration,
      sceneType: stock.id,
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: 'normal' },
      colorFilter: { brightness: 100, contrast: 100, saturation: 100, lutPreset: 'none' }
    };

    if (importTarget === 'connect') {
      connectClip(clip);
    } else {
      appendClip(clip);
    }

    showToast(`Added "${stock.name}" to project`);
    setIsImportModalOpen(false);
  };

  const handleImportSolid = () => {
    const isGap = solidColor === '#000000' && solidName.includes('Gap');
    const clip = {
      id: `matte-${Date.now()}`,
      name: solidName,
      role: isGap ? 'gap' : 'video',
      isGap: isGap,
      trackId: importTarget === 'connect' ? 'V1' : 'V2',
      startTime: 0,
      duration: 4.0,
      trimStart: 0,
      trimEnd: 4.0,
      solidColor: solidColor,
      sceneType: 'cyberGrid',
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: 'normal' }
    };

    if (importTarget === 'connect') {
      connectClip(clip);
    } else {
      appendClip(clip);
    }

    showToast(`Added color matte "${solidName}"`);
    setIsImportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#1E1E20] border border-[#000000] rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs text-[#ECECEE]">
        {/* macOS Title Bar */}
        <div className="h-10 bg-[#252528] border-b border-[#000000] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-4 h-4 text-[#0A84FF]" />
            <span className="font-semibold text-sm text-white">Import Media</span>
            <kbd className="font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-slate-400 border border-white/[0.08]">
              ⌘I
            </kbd>
          </div>
          <button
            onClick={() => setIsImportModalOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Source Tabs: Local Media | Cinema Stock | Solids & Color Mattes */}
        <div className="h-9 bg-[#171719] border-b border-[#000000] px-3 flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('local')}
            className={`px-3 py-1 rounded-[4px] font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'local' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Local Files</span>
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1 rounded-[4px] font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'stock' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Cinema Stock (60p)</span>
          </button>
          <button
            onClick={() => setActiveTab('solids')}
            className={`px-3 py-1 rounded-[4px] font-medium transition-colors flex items-center space-x-1.5 ${
              activeTab === 'solids' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-[#FF9F0A]" />
            <span>Color Mattes &amp; Solids</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 min-h-[300px] flex flex-col justify-between">
          {/* TAB 1: LOCAL FILES DRAG & DROP */}
          {activeTab === 'local' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/*,audio/*,image/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
                  dragOver
                    ? 'border-[#0A84FF] bg-[#0A84FF]/10'
                    : 'border-[#323238] bg-[#151517] hover:border-[#52525A] hover:bg-[#1A1A1E]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#25252A] flex items-center justify-center mb-3 text-[#0A84FF]">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="font-semibold text-white text-sm block mb-1">
                  Drag and drop video, audio, or image files
                </span>
                <span className="text-slate-400 text-xs mb-3">
                  or click to browse from your computer
                </span>
                <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.06]">MP4</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.06]">WebM</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.06]">MOV</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.06]">MP3</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.06]">WAV</span>
                  <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/[0.06]">PNG/JPG</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CINEMA STOCK (60P) */}
          {activeTab === 'stock' && (
            <div className="space-y-2">
              <span className="text-[11px] text-[#A1A1A6] block mb-1">
                Select a synchronized 60fps procedural master scene to import:
              </span>
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {stockClips.map((stock) => {
                  const isSelected = selectedStockId === stock.id;
                  return (
                    <div
                      key={stock.id}
                      onClick={() => setSelectedStockId(stock.id)}
                      className={`p-2.5 rounded-lg border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#0A84FF] bg-[#222228] shadow-sm'
                          : 'border-[#2D2D31] bg-[#161618] hover:border-[#44444C]'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-10 rounded bg-gradient-to-r ${stock.gradient} shrink-0 fcp-filmstrip-pattern`} />
                        <div>
                          <span className="font-semibold text-white block text-xs">{stock.name}</span>
                          <span className="text-[11px] text-slate-400 block">{stock.desc}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded">
                          {stock.duration.toFixed(1)}s
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#0A84FF]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SOLIDS & COLOR MATTES */}
          {activeTab === 'solids' && (
            <div className="space-y-3">
              <span className="text-[11px] text-[#A1A1A6] block">
                Choose an authentic Final Cut Pro solid generator or custom color matte:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {solidPresets.map((solid) => {
                  const isCurrent = solidColor === solid.color;
                  return (
                    <div
                      key={solid.name}
                      onClick={() => {
                        setSolidColor(solid.color);
                        setSolidName(solid.name);
                      }}
                      className={`p-2 rounded-lg border cursor-pointer flex items-center space-x-2.5 transition-all ${
                        isCurrent
                          ? 'border-[#FF9F0A] bg-[#222228]'
                          : 'border-[#2D2D31] bg-[#161618] hover:border-[#44444C]'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: solid.color }}
                        className="w-7 h-7 rounded border border-white/20 shrink-0 shadow-sm"
                      />
                      <div className="truncate">
                        <span className="font-medium text-white block text-xs truncate">{solid.name}</span>
                        <span className="font-mono text-[10px] text-slate-400">{solid.color}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Color Picker */}
              <div className="p-2.5 rounded-lg bg-[#161618] border border-[#2D2D31] flex items-center justify-between mt-2">
                <span className="font-medium text-slate-300">Custom Color Picker</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => {
                      setSolidColor(e.target.value);
                      setSolidName('Custom Color Matte');
                    }}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={solidColor}
                    onChange={(e) => {
                      setSolidColor(e.target.value);
                      setSolidName('Custom Color Matte');
                    }}
                    className="w-20 bg-black/50 border border-[#323238] rounded px-2 py-0.5 text-xs font-mono text-white text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Destination Selector & Confirm */}
          <div className="pt-4 border-t border-[#000000] flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] text-slate-400">Target Destination:</span>
              <select
                value={importTarget}
                onChange={(e) => setImportTarget(e.target.value)}
                className="bg-[#151517] border border-[#2D2D31] text-[11px] text-white rounded px-2 py-1 font-medium focus:outline-none"
              >
                <option value="storyline">Primary Storyline Spine (V2)</option>
                <option value="connect">Connected Cutaway / Overlay (V1)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 rounded-[4px] border border-[#323238] text-slate-300 hover:text-white hover:bg-[#25252A]"
              >
                Cancel
              </button>

              {activeTab === 'stock' && (
                <button
                  onClick={handleImportStock}
                  className="px-4 py-1.5 rounded-[4px] bg-[#0A84FF] text-white font-medium hover:bg-[#0071E3] flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Import Stock Clip</span>
                </button>
              )}

              {activeTab === 'solids' && (
                <button
                  onClick={handleImportSolid}
                  className="px-4 py-1.5 rounded-[4px] bg-[#0A84FF] text-white font-medium hover:bg-[#0071E3] flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Color Matte</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
