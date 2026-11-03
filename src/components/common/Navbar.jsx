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
  Share2
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

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#0C0E15]/90 backdrop-blur-md px-4 flex items-center justify-between z-40 select-none">
      {/* Brand & Dual View Switcher */}
      <div className="flex items-center space-x-6">
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F2FE] to-[#8A2BE2] flex items-center justify-center p-0.5 shadow-glass-glow group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0C0E15] rounded-[6px] flex items-center justify-center">
              <Film className="w-4 h-4 text-[#00F2FE]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-bold text-base tracking-tight text-white group-hover:text-[#00F2FE] transition-colors">
                {BRAND_CONFIG.logoText}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-electric-cyan border border-white/[0.08]">
                {BRAND_CONFIG.logoTag}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-[#11131A] p-0.5 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => setActiveView('landing')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center space-x-1.5 ${
              activeView === 'landing'
                ? 'bg-gradient-to-r from-[#00F2FE]/20 to-[#8A2BE2]/20 text-[#00F2FE] border border-[#00F2FE]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Showcase & Direct</span>
          </button>
          <button
            onClick={() => setActiveView('studio')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center space-x-1.5 ${
              activeView === 'studio'
                ? 'bg-gradient-to-r from-[#00F2FE]/20 to-[#8A2BE2]/20 text-[#00F2FE] border border-[#00F2FE]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Studio Workspace</span>
          </button>
        </div>
      </div>

      {/* Middle: Project Title Display */}
      {activeView === 'studio' && (
        <div className="hidden lg:flex items-center space-x-2 text-xs text-slate-400 bg-obsidian-800 px-3 py-1.5 rounded-md border border-white/[0.06]">
          <span className="text-slate-400 font-mono">PROJECT:</span>
          <span className="font-medium text-slate-200 truncate max-w-[200px]">
            {project.title}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-electric-cyan/10 text-electric-cyan">
            {project.aspectRatio}
          </span>
        </div>
      )}

      {/* Right Controls: Project Save/Load, Keys, Export Video */}
      <div className="flex items-center space-x-2">
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
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
        >
          <FolderOpen className="w-4 h-4" />
        </button>

        <button
          onClick={exportProjectJson}
          title="Save Project Backup (.aether.json)"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
        >
          <Save className="w-4 h-4" />
        </button>

        {/* BYO API Key Modal */}
        <button
          onClick={() => setIsApiKeyModalOpen(true)}
          title="AI API Keys & Settings"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
        >
          <Key className="w-4 h-4" />
        </button>

        {/* Share Direct Video Link (?v=demo) */}
        <button
          onClick={() => {
            const shareUrl = `https://anything14907-byte.github.io/AetherCut-Studio/?v=demo`;
            if (navigator.clipboard) {
              navigator.clipboard.writeText(shareUrl);
            }
            showToast('Copied direct link: ' + shareUrl);
          }}
          title="Share Direct Video Link (?v=demo)"
          className="p-2 rounded-lg text-slate-400 hover:text-[#00F2FE] hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Shortcuts Cheat Sheet */}
        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          title="Keyboard Shortcuts (?)"
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/[0.08]"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-white/[0.1] mx-1" />

        {/* Primary Action Button */}
        {activeView === 'landing' ? (
          <button
            onClick={() => setActiveView('studio')}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 hover:brightness-110 shadow-glass-glow transition-all flex items-center space-x-1.5"
          >
            <span>Launch Studio</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        ) : (
          <button
            onClick={startVideoExport}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 hover:brightness-110 shadow-glass-glow transition-all flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export Video (Free)</span>
          </button>
        )}
      </div>
    </header>
  );
}

