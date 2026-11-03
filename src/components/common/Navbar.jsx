import React, { useRef } from 'react';
import { useStudio } from '../../context/StudioContext';
import { BRAND_CONFIG } from '../../config/brandConfig';
import {
  Film,
  Sparkles,
  Download,
  FolderOpen,
  Save,
  HelpCircle,
  Key,
  LayoutGrid,
  Play,
  Share2,
  Sliders,
  Volume2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  PanelBottomClose,
  PanelBottomOpen,
  Search,
  Command
} from 'lucide-react';

export default function Navbar() {
  const {
    activeView,
    setActiveView,
    project,
    exportProjectJson,
    importProjectJson,
    startVideoExport,
    setIsShortcutsModalOpen,
    setIsApiKeyModalOpen,
    setIsSpotlightOpen,
    workspaceMode,
    setWorkspaceMode,
    showBrowser,
    setShowBrowser,
    showInspector,
    setShowInspector,
    timelineHeight,
    setTimelineHeight,
    setShowScopes,
    showToast
  } = useStudio();

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importProjectJson(file);
      e.target.value = '';
    }
  };

  const handleWorkspaceChange = (mode) => {
    setWorkspaceMode(mode);
    if (mode === 'color') {
      setShowScopes(true);
      setShowInspector(true);
    } else if (mode === 'audio') {
      setShowInspector(true);
    } else if (mode === 'ai') {
      setShowBrowser(true);
    }
    showToast(`Workspace: ${mode.toUpperCase()}`);
  };

  const toggleTimeline = () => {
    setTimelineHeight(timelineHeight > 160 ? 140 : 280);
  };

  return (
    <header className="h-12 border-b border-[#242429] bg-[#161619] px-3 flex items-center justify-between z-40 select-none text-xs">
      {/* Brand & Dual View Switcher */}
      <div className="flex items-center space-x-4">
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00F2FE] to-[#8A2BE2] flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#161619] rounded-[6px] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-[#0A84FF]" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-display font-bold text-sm tracking-tight text-white group-hover:text-[#0A84FF] transition-colors">
              {BRAND_CONFIG.logoText}
            </span>
            <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-white/[0.08] text-[#0A84FF] border border-white/[0.08] font-bold">
              PRO 2.0
            </span>
          </div>
        </div>

        {/* View Switcher Tabs (Landing vs Studio) */}
        <div className="hidden md:flex items-center space-x-0.5 bg-[#0B0B0D] p-0.5 rounded-lg border border-[#242429]">
          <button
            onClick={() => setActiveView('landing')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center space-x-1 ${
              activeView === 'landing'
                ? 'bg-[#1C1C21] text-white shadow-sm border border-white/[0.08]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Showcase</span>
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all flex items-center space-x-1 ${
              activeView === 'studio'
                ? 'bg-[#0A84FF] text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Studio</span>
          </button>
        </div>
      </div>

      {/* Middle: Final Cut Pro Segmented Workspace Switcher */}
      {activeView === 'studio' && (
        <div className="hidden lg:flex items-center space-x-0.5 bg-[#0B0B0D] p-0.5 rounded-lg border border-[#242429] font-mono text-[10px]">
          <button
            onClick={() => handleWorkspaceChange('edit')}
            className={`px-3 py-1 rounded-md transition-all ${
              workspaceMode === 'edit'
                ? 'bg-[#242429] text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => handleWorkspaceChange('color')}
            className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
              workspaceMode === 'color'
                ? 'bg-[#242429] text-[#0A84FF] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Color &amp; Scopes</span>
          </button>
          <button
            onClick={() => handleWorkspaceChange('audio')}
            className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
              workspaceMode === 'audio'
                ? 'bg-[#242429] text-[#30D158] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Volume2 className="w-3 h-3" />
            <span>Audio Mixing</span>
          </button>
          <button
            onClick={() => handleWorkspaceChange('ai')}
            className={`px-3 py-1 rounded-md transition-all flex items-center space-x-1 ${
              workspaceMode === 'ai'
                ? 'bg-[#242429] text-[#BF5AF2] font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Co-Director</span>
          </button>
        </div>
      )}

      {/* Right Controls: Window Toggles, Spotlight, Export */}
      <div className="flex items-center space-x-1.5">
        {activeView === 'studio' && (
          <>
            {/* 3 Quick-Toggle Window Buttons (Left Browser, Right Inspector, Timeline) */}
            <div className="hidden sm:flex items-center space-x-0.5 bg-[#0B0B0D] p-0.5 rounded-lg border border-[#242429] mr-1">
              <button
                onClick={() => setShowBrowser(!showBrowser)}
                title={showBrowser ? 'Hide Left Browser' : 'Show Left Browser'}
                className={`p-1.5 rounded transition-colors ${
                  showBrowser ? 'text-[#0A84FF]' : 'text-slate-500 hover:text-white'
                }`}
              >
                {showBrowser ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={toggleTimeline}
                title="Toggle Timeline Compact/Expanded"
                className="p-1.5 rounded text-slate-400 hover:text-white transition-colors"
              >
                {timelineHeight > 180 ? <PanelBottomClose className="w-3.5 h-3.5" /> : <PanelBottomOpen className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setShowInspector(!showInspector)}
                title={showInspector ? 'Hide Right Inspector' : 'Show Right Inspector'}
                className={`p-1.5 rounded transition-colors ${
                  showInspector ? 'text-[#0A84FF]' : 'text-slate-500 hover:text-white'
                }`}
              >
                {showInspector ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Spotlight Command HUD (Cmd+K) */}
            <button
              onClick={() => setIsSpotlightOpen(true)}
              title="Spotlight Command HUD (Cmd+K)"
              className="px-2 py-1 rounded-lg bg-[#0B0B0D] text-slate-300 hover:text-white hover:border-[#0A84FF] border border-[#242429] flex items-center space-x-1.5 transition-colors"
            >
              <Search className="w-3 h-3 text-[#0A84FF]" />
              <span className="hidden xl:inline text-[11px] font-mono">Commands</span>
              <kbd className="text-[9px] font-mono bg-[#1C1C21] px-1 py-0.2 rounded text-slate-400">⌘K</kbd>
            </button>
          </>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json,.aether.json"
          className="hidden"
        />

        {/* Project File IO */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import Project (.aether.json)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#242429] transition-colors"
        >
          <FolderOpen className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={exportProjectJson}
          title="Save Project Backup (.aether.json)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#242429] transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
        </button>

        {/* Share Direct Video Link (?v=demo) */}
        <button
          onClick={() => {
            const shareUrl = `${window.location.origin}${window.location.pathname}?v=demo`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(shareUrl);
            }
            showToast('Copied share link: ' + shareUrl);
          }}
          title="Share Direct Video Link (?v=demo)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0A84FF] hover:bg-[#242429] transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Shortcuts Cheat Sheet */}
        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          title="Keyboard Shortcuts (?)"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#242429] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-[#242429] mx-1" />

        {/* Primary Action Button */}
        {activeView === 'landing' ? (
          <button
            onClick={() => setActiveView('studio')}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0A84FF] hover:bg-blue-500 text-white shadow-sm transition-all flex items-center space-x-1.5"
          >
            <span>Launch Studio</span>
            <Play className="w-3 h-3 fill-current" />
          </button>
        ) : (
          <button
            onClick={startVideoExport}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#0A84FF] hover:bg-blue-500 text-white shadow-sm transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export (Free)</span>
          </button>
        )}
      </div>
    </header>
  );
}
