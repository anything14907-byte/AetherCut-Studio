import React, { useRef } from 'react';
import { useStudio } from '../../../context/StudioContext';
import {
  Film,
  FolderTree,
  Music,
  Type,
  Download,
  Key,
  CheckCircle2,
  PanelLeft,
  PanelBottom,
  PanelRight,
  Share2,
  ArrowUpRight
} from 'lucide-react';

export default function FcpTopBar() {
  const {
    project,
    setProject,
    sidebarMode,
    setSidebarMode,
    showBrowser,
    setShowBrowser,
    showTimeline,
    setShowTimeline,
    showInspector,
    setShowInspector,
    setIsShareModalOpen,
    setIsKeywordsModalOpen,
    setIsImportModalOpen,
    appendClip,
    showToast
  } = useStudio();

  const fileInputRef = useRef(null);

  const handleImportFile = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      const isAudio = file.type.startsWith('audio');

      const newClip = {
        id: `imported-${Date.now()}`,
        name: file.name,
        role: isAudio ? "dialogue" : "video",
        trackId: isAudio ? "A1" : "V2",
        startTime: 0,
        duration: 5.0,
        trimStart: 0,
        trimEnd: 5.0,
        sourceUrl: url,
        sceneType: "cyberGrid",
        transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: "normal" },
        colorFilter: { exposure: 0, contrast: 1, saturation: 1, lutPreset: "none" }
      };
      appendClip(newClip);
    });

    e.target.value = '';
    showToast(`Imported ${files.length} media file(s) (Cmd+I)`);
  };

  return (
    <header className="h-9 bg-[#1E1E20] border-b border-[#000000] px-2.5 flex items-center justify-between z-40 select-none text-xs text-[#ECECEE] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      {/* LEFT GROUP: 3 Segmented Sidebar Icons, Import Media, Keywords, Background Tasks */}
      <div className="flex items-center space-x-1">
        {/* 3 Segmented Sidebar Toggles */}
        <div className="flex items-center bg-[#151517] p-0.5 rounded-[4px] border border-[#2D2D31]">
          <button
            onClick={() => setSidebarMode('libraries')}
            title="Libraries Sidebar"
            className={`px-1.5 py-0.5 rounded-[3px] transition-colors flex items-center ${
              sidebarMode === 'libraries' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSidebarMode('media')}
            title="Photos, Videos & Audio Sidebar"
            className={`px-1.5 py-0.5 rounded-[3px] transition-colors flex items-center ${
              sidebarMode === 'media' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSidebarMode('titles')}
            title="Titles & Generators Sidebar"
            className={`px-1.5 py-0.5 rounded-[3px] transition-colors flex items-center ${
              sidebarMode === 'titles' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hidden Native File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,audio/*,image/*"
          onChange={handleImportFile}
          className="hidden"
        />

        {/* Import Media Button (Cmd+I) */}
        <button
          onClick={() => setIsImportModalOpen(true)}
          title="Import Media (Cmd+I)"
          className="px-2 py-0.5 rounded-[4px] text-[#ECECEE] hover:text-white bg-[#151517] border border-[#2D2D31] hover:bg-[#2A2A2E] transition-colors flex items-center space-x-1 shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span className="font-medium text-[11px] hidden sm:inline">Import</span>
        </button>

        {/* Keyword Editor (Cmd+K) */}
        <button
          onClick={() => setIsKeywordsModalOpen(true)}
          title="Keyword Editor (Cmd+K)"
          className="p-1 rounded-[4px] text-[#A1A1A6] hover:text-white hover:bg-[#2A2A2E] transition-colors"
        >
          <Key className="w-3.5 h-3.5" />
        </button>

        {/* Background Tasks Indicator (100% Circle) */}
        <div
          title="Background Tasks (100% Idle / Complete)"
          className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-[#151517] border border-[#2D2D31] text-[10px] font-mono text-[#30D158]"
        >
          <div className="w-2.5 h-2.5 rounded-full border border-[#30D158] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
          </div>
          <span className="text-[9px]">100%</span>
        </div>
      </div>

      {/* CENTER GROUP: Project Title with Saved Indicator Dot */}
      <div className="flex items-center space-x-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#30D158] shadow-[0_0_6px_#30D158]" />
        <span className="font-semibold text-[11px] text-[#F2F2F7] tracking-tight">
          {project.title || "Untitled Project — 1080p HD 60p"}
        </span>
      </div>

      {/* RIGHT GROUP: 3 Layout Toggles (Apple Blue #0A84FF when active) & Share/Export */}
      <div className="flex items-center space-x-2">
        {/* Layout Toggles */}
        <div className="flex items-center space-x-0.5 bg-[#151517] p-0.5 rounded-[4px] border border-[#2D2D31]">
          <button
            onClick={() => setShowBrowser(!showBrowser)}
            title={showBrowser ? "Hide Browser (Ctrl+Cmd+1)" : "Show Browser (Ctrl+Cmd+1)"}
            className={`p-1 rounded-[3px] transition-colors ${
              showBrowser ? 'text-[#0A84FF] bg-[#1E1E24]' : 'text-[#6E6E73] hover:text-white'
            }`}
          >
            <PanelLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            title={showTimeline ? "Hide Timeline (Ctrl+Cmd+2)" : "Show Timeline (Ctrl+Cmd+2)"}
            className={`p-1 rounded-[3px] transition-colors ${
              showTimeline ? 'text-[#0A84FF] bg-[#1E1E24]' : 'text-[#6E6E73] hover:text-white'
            }`}
          >
            <PanelBottom className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowInspector(!showInspector)}
            title={showInspector ? "Hide Inspector (Cmd+4)" : "Show Inspector (Cmd+4)"}
            className={`p-1 rounded-[3px] transition-colors ${
              showInspector ? 'text-[#0A84FF] bg-[#1E1E24]' : 'text-[#6E6E73] hover:text-white'
            }`}
          >
            <PanelRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Share / Export (Cmd+E) */}
        <button
          onClick={() => setIsShareModalOpen(true)}
          title="Share / Export Destination (Cmd+E)"
          className="px-2.5 py-1 rounded-[4px] bg-[#2A2A2E] hover:bg-[#323238] border border-[#3E3E44] text-[#ECECEE] font-medium text-[11px] flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <div className="w-3.5 h-3.5 rounded border border-white/60 flex items-center justify-center text-[9px] font-bold">
            ↑
          </div>
          <span>Share</span>
        </button>
      </div>
    </header>
  );
}

