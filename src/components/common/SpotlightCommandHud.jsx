import React, { useState, useEffect, useRef } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Search,
  Scissors,
  MousePointer,
  Magnet,
  Activity,
  Mic,
  Volume2,
  Sliders,
  Download,
  Layout,
  RefreshCw,
  Sparkles,
  Command,
  X
} from 'lucide-react';

export default function SpotlightCommandHud() {
  const {
    isSpotlightOpen,
    setIsSpotlightOpen,
    setActiveTool,
    setIsMagnetic,
    isMagnetic,
    setShowScopes,
    showScopes,
    toggleVoiceIsolation,
    toggleAutoDuck,
    autoDuck,
    voiceIsolation,
    startVideoExport,
    setWorkspaceMode,
    setLeftDockWidth,
    setRightInspectorWidth,
    setTimelineHeight,
    splitClipAtPlayhead,
    executeAiCommand,
    showToast
  } = useStudio();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isSpotlightOpen]);

  if (!isSpotlightOpen) return null;

  const commands = [
    {
      id: 'blade',
      title: 'Blade Tool (Cut Clip)',
      desc: 'Activate razor cut mode at playhead or skimmer',
      icon: Scissors,
      shortcut: 'B',
      action: () => {
        setActiveTool('blade');
        showToast('Blade tool activated (B)');
      }
    },
    {
      id: 'select',
      title: 'Select Tool',
      desc: 'Normal selection and trimming pointer',
      icon: MousePointer,
      shortcut: 'A',
      action: () => {
        setActiveTool('select');
        showToast('Select tool activated (A)');
      }
    },
    {
      id: 'split',
      title: 'Blade at Playhead',
      desc: 'Immediately split the active clip into two at the current frame',
      icon: Scissors,
      shortcut: 'S',
      action: () => splitClipAtPlayhead()
    },
    {
      id: 'magnetic',
      title: isMagnetic ? 'Disable Magnetic Timeline' : 'Enable Magnetic Timeline',
      desc: 'Ripple and close gaps on Primary Storyline V2 automatically',
      icon: Magnet,
      shortcut: 'M',
      action: () => {
        setIsMagnetic(!isMagnetic);
        showToast(!isMagnetic ? 'Magnetic Timeline: Enabled' : 'Magnetic Timeline: Disabled');
      }
    },
    {
      id: 'scopes',
      title: showScopes ? 'Hide Video Scopes' : 'Open Live Video Scopes',
      desc: 'Real-time Luma Waveform & RGB Parade pixel analyzer',
      icon: Activity,
      shortcut: 'Scopes',
      action: () => {
        setShowScopes(!showScopes);
        showToast(!showScopes ? 'Video Scopes: Active' : 'Video Scopes: Hidden');
      }
    },
    {
      id: 'voiceIso',
      title: voiceIsolation ? 'Disable Voice Isolation' : 'Enable Voice Isolation',
      desc: 'Enhance vocal clarity frequencies and filter ambient noise',
      icon: Mic,
      shortcut: 'Audio',
      action: () => toggleVoiceIsolation()
    },
    {
      id: 'autoduck',
      title: autoDuck ? 'Disable Auto-Duck Music' : 'Enable Auto-Duck Music (-14dB)',
      desc: 'Automatically lowers background soundtrack whenever voiceover is active',
      icon: Volume2,
      shortcut: 'Mixer',
      action: () => toggleAutoDuck()
    },
    {
      id: 'ws-color',
      title: 'Workspace: Color Grading & Scopes',
      desc: 'Switch layout to 3-Way Color Wheels and live scopes',
      icon: Sliders,
      shortcut: 'Color',
      action: () => {
        setWorkspaceMode('color');
        setShowScopes(true);
      }
    },
    {
      id: 'ws-audio',
      title: 'Workspace: Audio Mixing Suite',
      desc: 'Switch layout to stereo dBFS peak meters and vocal EQ',
      icon: Volume2,
      shortcut: 'Audio',
      action: () => setWorkspaceMode('audio')
    },
    {
      id: 'ws-ai',
      title: 'Workspace: AI Co-Director',
      desc: 'Open natural language generative editing terminal',
      icon: Sparkles,
      shortcut: 'AI',
      action: () => setWorkspaceMode('ai')
    },
    {
      id: 'lut-teal',
      title: 'Apply Hollywood Teal & Orange LUT',
      desc: 'Cinematic complementary color grading matrix',
      icon: Sliders,
      shortcut: 'LUT',
      action: () => executeAiCommand('Apply teal and orange LUT')
    },
    {
      id: 'lut-noir',
      title: 'Apply Arri Monochrome Noir LUT',
      desc: 'High contrast black and white cinema grade',
      icon: Sliders,
      shortcut: 'LUT',
      action: () => executeAiCommand('Apply noir LUT')
    },
    {
      id: 'reset-layout',
      title: 'Reset Panel Sizes to Default',
      desc: 'Restore standard Final Cut Pro workspace ergonomics',
      icon: RefreshCw,
      shortcut: 'Layout',
      action: () => {
        setLeftDockWidth(280);
        setRightInspectorWidth(340);
        setTimelineHeight(240);
        showToast('Workspace panel dimensions reset');
      }
    },
    {
      id: 'export',
      title: 'Export Video (1080p WebM/MP4)',
      desc: 'Render timeline client-side with zero watermarks',
      icon: Download,
      shortcut: 'Export',
      action: () => startVideoExport()
    }
  ];

  const filtered = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        filtered[selectedIndex].action();
        setIsSpotlightOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsSpotlightOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-[#161619] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar Header */}
        <div className="p-3.5 border-b border-[#242429] flex items-center space-x-3 bg-[#1C1C21]">
          <Search className="w-5 h-5 text-[#0A84FF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search action (e.g., 'Blade', 'Scopes', 'Audio', 'LUT')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <button
            onClick={() => setIsSpotlightOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#242429] p-1.5">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const IconComp = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setIsSpotlightOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#0A84FF] text-white'
                      : 'text-slate-300 hover:bg-[#1C1C21]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#242429] text-[#0A84FF]'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs block">
                        {item.title}
                      </span>
                      <span
                        className={`text-[11px] block ${
                          isSelected ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        {item.desc}
                      </span>
                    </div>
                  </div>

                  <kbd
                    className={`px-2 py-0.5 rounded font-mono text-[10px] uppercase font-bold shrink-0 ${
                      isSelected
                        ? 'bg-black/30 text-white'
                        : 'bg-[#1C1C21] text-slate-400 border border-white/[0.08]'
                    }`}
                  >
                    {item.shortcut}
                  </kbd>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs font-mono">
              No matching Final Cut Pro commands found.
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-[#101013] border-t border-[#242429] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Final Cut Pro Spotlight HUD</span>
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Execute</span>
            <span>Esc Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
