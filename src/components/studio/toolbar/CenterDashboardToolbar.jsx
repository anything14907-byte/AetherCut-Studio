import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { formatSmpteTimecode, parseSmpteTimecode, FCP_TOOLS } from '../../../types/studioTypes';
import {
  MousePointer,
  Scissors,
  Move,
  ScanLine,
  ZoomIn,
  Hand,
  Gauge,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Headphones,
  Magnet,
  Layers,
  ChevronDown,
  Sparkles,
  Zap,
  Bookmark
} from 'lucide-react';

export default function CenterDashboardToolbar() {
  const {
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
    showTimelineIndex,
    setShowTimelineIndex,
    bottomRightDock,
    setBottomRightDock,
    zoom,
    setZoom,
    clipHeight,
    setClipHeight,
    clipStyle,
    setClipStyle,
    appendClip,
    insertClip,
    connectClip,
    overwriteClip,
    setClipSpeed,
    createHoldFrame,
    selectedClipId,
    lcdTimecodeRef,
    currentTime,
    setCurrentTime,
    showToast
  } = useStudio();

  const [isToolDropdownOpen, setIsToolDropdownOpen] = useState(false);
  const [isRetimeMenuOpen, setIsRetimeMenuOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isEditingTimecode, setIsEditingTimecode] = useState(false);
  const [timecodeInput, setTimecodeInput] = useState('');

  const handleTimecodeSubmit = (e) => {
    e.preventDefault();
    const parsedSec = parseSmpteTimecode(timecodeInput);
    setCurrentTime(parsedSec, true);
    setIsEditingTimecode(false);
    showToast(`Jumped to timecode: ${timecodeInput}`);
  };

  const getToolIcon = (toolId) => {
    switch (toolId) {
      case 'select': return <MousePointer className="w-3.5 h-3.5" />;
      case 'trim': return <Scissors className="w-3.5 h-3.5" />;
      case 'position': return <Move className="w-3.5 h-3.5" />;
      case 'range': return <ScanLine className="w-3.5 h-3.5" />;
      case 'blade': return <div className="text-[11px] font-mono font-bold">✂</div>;
      case 'zoom': return <ZoomIn className="w-3.5 h-3.5" />;
      case 'hand': return <Hand className="w-3.5 h-3.5" />;
      default: return <MousePointer className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="h-9 bg-[#222225] border-t border-b border-[#000000] px-2.5 flex items-center justify-between select-none z-30 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
      {/* FAR LEFT: Index Button + 4 Three-Point Edit Buttons + Tool Selector */}
      <div className="flex items-center space-x-1.5">
        {/* Index Button */}
        <button
          onClick={() => setShowTimelineIndex(!showTimelineIndex)}
          title="Timeline Index (Search Clips, Markers, Roles)"
          className={`px-2 py-0.5 rounded-[3px] text-[11px] font-medium transition-colors border ${
            showTimelineIndex ? 'bg-[#0A84FF] text-white border-[#0A84FF]' : 'bg-[#18181A] text-[#ECECEE] border-[#323238] hover:bg-[#2C2C32]'
          }`}
        >
          Index
        </button>

        <div className="h-4 w-[1px] bg-[#323238] mx-0.5" />

        {/* 4 Three-Point Edit Buttons: Q, W, E, D */}
        <div className="flex items-center bg-[#18181A] p-0.5 rounded-[4px] border border-[#323238] space-x-0.5">
          <button
            onClick={() => connectClip()}
            title="Connect to Primary Storyline (Q)"
            className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono text-[#ECECEE] hover:bg-[#323238] transition-colors flex items-center space-x-1"
          >
            <span className="text-[#64D2FF]">Q</span>
          </button>
          <button
            onClick={() => insertClip()}
            title="Insert into Storyline (W)"
            className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono text-[#ECECEE] hover:bg-[#323238] transition-colors flex items-center space-x-1"
          >
            <span className="text-[#FF9F0A]">W</span>
          </button>
          <button
            onClick={() => overwriteClip()}
            title="Overwrite (D)"
            className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono text-[#ECECEE] hover:bg-[#323238] transition-colors flex items-center space-x-1"
          >
            <span className="text-[#30D158]">D</span>
          </button>
          <button
            onClick={() => appendClip()}
            title="Append to Storyline (E)"
            className="px-1.5 py-0.5 rounded-[3px] text-[10px] font-mono text-[#ECECEE] hover:bg-[#323238] transition-colors flex items-center space-x-1"
          >
            <span className="text-[#0A84FF]">E</span>
          </button>
        </div>

        {/* Tool Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsToolDropdownOpen(!isToolDropdownOpen)}
            className="flex items-center space-x-1 px-1.5 py-0.5 rounded-[4px] bg-[#18181A] border border-[#323238] text-white hover:bg-[#2C2C32] text-xs"
          >
            {getToolIcon(activeTool)}
            <ChevronDown className="w-2.5 h-2.5 text-[#8E8E93]" />
          </button>

          {isToolDropdownOpen && (
            <div
              onMouseLeave={() => setIsToolDropdownOpen(false)}
              className="absolute left-0 top-7 w-40 bg-[#1C1C1F] border border-[#3A3A40] rounded shadow-2xl p-1 z-50 text-[11px] text-[#ECECEE] space-y-0.5"
            >
              {FCP_TOOLS.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTool(t.id);
                    setIsToolDropdownOpen(false);
                    showToast(`${t.name} Tool (${t.shortcut})`);
                  }}
                  className={`px-2 py-1 rounded flex items-center justify-between cursor-pointer ${
                    activeTool === t.id ? 'bg-[#0A84FF] text-white' : 'hover:bg-[#2D2D35]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {getToolIcon(t.id)}
                    <span>{t.name}</span>
                  </div>
                  <kbd className="font-mono text-[9px] bg-black/30 px-1 py-0.2 rounded text-slate-400">
                    {t.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DEAD CENTER: THE RECESSED BLACK LCD DASHBOARD */}
      <div className="fcp-lcd-panel px-3 py-1 rounded-[5px] flex items-center space-x-2.5 shadow-inner">
        {/* Left: Mini Live Stereo Audio Meter Bars */}
        <div className="flex items-center space-x-0.5 h-3.5">
          <div className="w-1 bg-[#1A1A1E] h-full rounded-sm overflow-hidden flex flex-col justify-end">
            <div className="w-full bg-[#30D158] h-3/4 animate-pulse" />
          </div>
          <div className="w-1 bg-[#1A1A1E] h-full rounded-sm overflow-hidden flex flex-col justify-end">
            <div className="w-full bg-[#30D158] h-2/3 animate-pulse" />
          </div>
        </div>

        {/* Center: Large Tabular SMPTE Timecode Text (Click to Jump) */}
        {isEditingTimecode ? (
          <form onSubmit={handleTimecodeSubmit}>
            <input
              type="text"
              autoFocus
              value={timecodeInput}
              onChange={(e) => setTimecodeInput(e.target.value)}
              onBlur={() => setIsEditingTimecode(false)}
              placeholder="00:00:00:00"
              className="w-28 bg-black text-[#0A84FF] font-mono text-xs font-bold text-center px-1 rounded border border-[#0A84FF] focus:outline-none"
            />
          </form>
        ) : (
          <div
            onClick={() => {
              setTimecodeInput(formatSmpteTimecode(currentTime));
              setIsEditingTimecode(true);
            }}
            title="Click to type timecode jump (e.g. +100 or 00:00:05:00)"
            className="cursor-pointer group flex items-center"
          >
            <span
              ref={lcdTimecodeRef}
              className="font-mono text-xs font-bold text-[#ECECEE] tracking-wider tabular-nums group-hover:text-[#0A84FF] transition-colors"
            >
              {formatSmpteTimecode(currentTime)}
            </span>
          </div>
        )}

        {/* Right: Active Audition / Marker Icon */}
        <Bookmark className="w-3 h-3 text-[#FF9F0A]" />
      </div>

      {/* FAR RIGHT: Retime Menu + Clip Appearance + Skimming Toggles + Bottom-Right Dock Toggles */}
      <div className="flex items-center space-x-1.5">
        {/* Retime Menu (Cmd+R) */}
        <div className="relative">
          <button
            onClick={() => setIsRetimeMenuOpen(!isRetimeMenuOpen)}
            title="Retime / Speed Menu (Cmd+R)"
            className="p-1 rounded-[4px] text-[#A1A1A6] hover:text-[#FF9F0A] hover:bg-[#2C2C32] transition-colors"
          >
            <Gauge className="w-3.5 h-3.5" />
          </button>

          {isRetimeMenuOpen && (
            <div
              onMouseLeave={() => setIsRetimeMenuOpen(false)}
              className="absolute right-0 top-7 w-48 bg-[#1C1C1F] border border-[#3A3A40] rounded shadow-2xl p-1 z-50 text-[11px] text-[#ECECEE] space-y-0.5 divide-y divide-[#2A2A30]"
            >
              <div className="py-0.5">
                <button
                  onClick={() => { setClipSpeed(selectedClipId, { speed: 1.0 }); setIsRetimeMenuOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-[#0A84FF] hover:text-white"
                >
                  Normal (100%)
                </button>
                <button
                  onClick={() => { setClipSpeed(selectedClipId, { speed: 0.5 }); setIsRetimeMenuOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-[#0A84FF] hover:text-white"
                >
                  Slow (50%)
                </button>
                <button
                  onClick={() => { setClipSpeed(selectedClipId, { speed: 2.0 }); setIsRetimeMenuOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-[#0A84FF] hover:text-white"
                >
                  Fast (2x)
                </button>
                <button
                  onClick={() => { createHoldFrame(); setIsRetimeMenuOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-[#0A84FF] hover:text-white flex justify-between"
                >
                  <span>Hold (Freeze Frame)</span>
                  <span className="font-mono text-[9px] text-slate-400">⇧H</span>
                </button>
                <button
                  onClick={() => { setClipSpeed(selectedClipId, { isReversed: true }); setIsRetimeMenuOpen(false); }}
                  className="w-full text-left px-2 py-1 rounded hover:bg-[#0A84FF] hover:text-white"
                >
                  Reverse Clip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clip Appearance & Zoom Popover */}
        <div className="relative">
          <button
            onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
            title="Clip Appearance & Zoom"
            className="p-1 rounded-[4px] text-[#A1A1A6] hover:text-white hover:bg-[#2C2C32] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {isAppearanceOpen && (
            <div
              onMouseLeave={() => setIsAppearanceOpen(false)}
              className="absolute right-0 top-7 w-52 bg-[#1C1C1F] border border-[#3A3A40] rounded shadow-2xl p-2.5 z-50 text-[11px] text-[#ECECEE] space-y-2.5"
            >
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#8E8E93]">
                  <span>Timeline Zoom</span>
                  <span className="font-mono">{zoom}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={zoom}
                  onChange={(e) => setZoom(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0A84FF]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#8E8E93]">
                  <span>Clip Height</span>
                  <span className="font-mono">{clipHeight}px</span>
                </div>
                <input
                  type="range"
                  min="36"
                  max="96"
                  value={clipHeight}
                  onChange={(e) => setClipHeight(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0A84FF]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Skimming Toggle (S) */}
        <button
          onClick={() => {
            setIsSkimmingEnabled(!isSkimmingEnabled);
            showToast(!isSkimmingEnabled ? "Skimming: ON (S)" : "Skimming: OFF (S)");
          }}
          title={isSkimmingEnabled ? "Skimming Active (S)" : "Skimming Off (S)"}
          className={`p-1 rounded-[4px] transition-colors ${
            isSkimmingEnabled ? 'text-[#FF453A] bg-[#2C2C32]' : 'text-[#6E6E73] hover:text-white'
          }`}
        >
          {isSkimmingEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>

        {/* Audio Solo Toggle (Alt+S) */}
        <button
          onClick={() => {
            setIsSoloAudio(!isSoloAudio);
            showToast(!isSoloAudio ? "Solo Audio: ON (⌥S)" : "Solo Audio: OFF (⌥S)");
          }}
          title={isSoloAudio ? "Solo Audio Active (⌥S)" : "Solo Audio Off"}
          className={`p-1 rounded-[4px] transition-colors ${
            isSoloAudio ? 'text-[#30D158] bg-[#2C2C32]' : 'text-[#6E6E73] hover:text-white'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
        </button>

        {/* Snapping Toggle (N) */}
        <button
          onClick={() => {
            setIsSnapping(!isSnapping);
            showToast(!isSnapping ? "Snapping: ON (N)" : "Snapping: OFF (N)");
          }}
          title={isSnapping ? "Snapping Active (N)" : "Snapping Off"}
          className={`p-1 rounded-[4px] transition-colors ${
            isSnapping ? 'text-[#0A84FF] bg-[#2C2C32]' : 'text-[#6E6E73] hover:text-white'
          }`}
        >
          <Magnet className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-[1px] bg-[#323238] mx-0.5" />

        {/* Right-Side Bottom Dock Toggles: Effects (Cmd+5) & Transitions (Ctrl+Cmd+5) */}
        <div className="flex items-center space-x-1 bg-[#18181A] p-0.5 rounded-[4px] border border-[#323238]">
          <button
            onClick={() => setBottomRightDock(bottomRightDock === 'effects' ? 'none' : 'effects')}
            title="Effects Browser (Cmd+5)"
            className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-sans flex items-center space-x-1 transition-colors ${
              bottomRightDock === 'effects' ? 'bg-[#0A84FF] text-white' : 'text-[#A1A1A6] hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden xl:inline">Effects</span>
          </button>
          <button
            onClick={() => setBottomRightDock(bottomRightDock === 'transitions' ? 'none' : 'transitions')}
            title="Transitions Browser (Ctrl+Cmd+5)"
            className={`px-1.5 py-0.5 rounded-[3px] text-[10px] font-sans flex items-center space-x-1 transition-colors ${
              bottomRightDock === 'transitions' ? 'bg-[#0A84FF] text-white' : 'text-[#A1A1A6] hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden xl:inline">Transitions</span>
          </button>
        </div>
      </div>
    </div>
  );
}

