import React, { useState, useEffect, useRef } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  Search,
  Scissors,
  MousePointer,
  Magnet,
  Activity,
  Download,
  Zap,
  Bookmark,
  Layers,
  Sparkles,
  Command,
  X,
  EyeOff,
  Pause,
  PlusSquare,
  ArrowDownCircle,
  ArrowRightCircle,
  Tag,
  HelpCircle,
  Gauge
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
    setIsShareModalOpen,
    splitClipAtPlayhead,
    createHoldFrame,
    toggleClipDisabled,
    addMarker,
    setClipSpeed,
    selectedClipId,
    playbackQuality,
    setPlaybackQuality,
    isMulticamView,
    setIsMulticamView,
    appendClip,
    insertClip,
    connectClip,
    overwriteClip,
    setIsKeywordsModalOpen,
    setIsShortcutsModalOpen,
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
      id: 'connect',
      title: 'Connect to Primary Storyline',
      desc: 'Attach selected media as a connected cutaway / title / b-roll',
      icon: PlusSquare,
      shortcut: 'Q',
      action: () => connectClip()
    },
    {
      id: 'insert',
      title: 'Insert into Primary Storyline',
      desc: 'Splice media into the magnetic storyline and ripple following clips',
      icon: ArrowDownCircle,
      shortcut: 'W',
      action: () => insertClip()
    },
    {
      id: 'append',
      title: 'Append to Primary Storyline',
      desc: 'Add clip to the very end of the primary magnetic storyline',
      icon: ArrowRightCircle,
      shortcut: 'E',
      action: () => appendClip()
    },
    {
      id: 'overwrite',
      title: 'Overwrite Clip',
      desc: 'Replace storyline footage starting at the playhead position',
      icon: ArrowDownCircle,
      shortcut: 'D',
      action: () => overwriteClip()
    },
    {
      id: 'blade',
      title: 'Blade Tool (Cut Clip)',
      desc: 'Split active clip at playhead or skimmer position',
      icon: Scissors,
      shortcut: 'B / ⌘B',
      action: () => {
        setActiveTool('blade');
        splitClipAtPlayhead();
      }
    },
    {
      id: 'disable',
      title: 'Disable / Enable Clip (Mute)',
      desc: 'Toggle clip visibility/audibility (dims clip to 35% opacity)',
      icon: EyeOff,
      shortcut: 'V',
      action: () => {
        if (selectedClipId) {
          toggleClipDisabled(selectedClipId);
        } else {
          showToast('Select a clip first to enable/disable (V)');
        }
      }
    },
    {
      id: 'hold-frame',
      title: 'Add Hold Frame (Freeze Frame)',
      desc: 'Insert a 2-second frozen frame at the current playhead position',
      icon: Pause,
      shortcut: '⇧H',
      action: () => {
        if (selectedClipId) {
          createHoldFrame(selectedClipId);
        } else {
          showToast('Select a clip first to freeze frame (Shift+H)');
        }
      }
    },
    {
      id: 'select',
      title: 'Select Tool',
      desc: 'Normal selection pointer and clip trimmer',
      icon: MousePointer,
      shortcut: 'A',
      action: () => {
        setActiveTool('select');
        showToast('Select tool active (A)');
      }
    },
    {
      id: 'marker',
      title: 'Add Marker at Playhead',
      desc: 'Drop a colored SMPTE reference marker',
      icon: Bookmark,
      shortcut: 'M',
      action: () => addMarker()
    },
    {
      id: 'retime-2x',
      title: 'Retime Clip: 2x Fast Motion',
      desc: 'Speed up selected video clip by 200% (Cyan speed bar)',
      icon: Zap,
      shortcut: '⌘R',
      action: () => setClipSpeed(selectedClipId, { speed: 2.0, isReversed: false })
    },
    {
      id: 'retime-slow',
      title: 'Retime Clip: 50% Slow Motion',
      desc: 'Smooth cinematic half-speed retiming (Orange speed bar)',
      icon: Zap,
      shortcut: 'Slow',
      action: () => setClipSpeed(selectedClipId, { speed: 0.5, isReversed: false })
    },
    {
      id: 'multicam',
      title: isMulticamView ? 'Close Multicam Angle Viewer' : 'Open 4-Angle Multicam Grid',
      desc: 'Display 2x2 synchronized multicam camera angles',
      icon: Layers,
      shortcut: '1-4',
      action: () => {
        setIsMulticamView(!isMulticamView);
        showToast(!isMulticamView ? 'Multicam: 4-Angle Grid ON' : 'Multicam Grid OFF');
      }
    },
    {
      id: 'proxy-mode',
      title: playbackQuality === 'proxy' ? 'Switch to Full 1080p HD Buffer' : 'Switch to 540p Proxy (Zero-Lag)',
      desc: 'Toggle fast laptop proxy buffer vs uncompressed 1080p canvas',
      icon: Gauge,
      shortcut: 'Proxy',
      action: () => {
        const next = playbackQuality === 'proxy' ? 'full' : 'proxy';
        setPlaybackQuality(next);
        showToast(next === 'proxy' ? 'Proxy Mode: 540p (High Performance)' : 'Proxy Mode: 1080p HD (Full Quality)');
      }
    },
    {
      id: 'magnetic',
      title: isMagnetic ? 'Disable Magnetic Timeline' : 'Enable Magnetic Timeline',
      desc: 'Close gaps and ripple storyline clips automatically',
      icon: Magnet,
      shortcut: 'N',
      action: () => {
        setIsMagnetic(!isMagnetic);
        showToast(!isMagnetic ? 'Magnetic Timeline: ON' : 'Magnetic Timeline: OFF');
      }
    },
    {
      id: 'scopes',
      title: showScopes ? 'Hide Video Scopes' : 'Open Live Video Scopes',
      desc: 'Real-time Luma Waveform & RGB Parade analyzer',
      icon: Activity,
      shortcut: '⌘7',
      action: () => {
        setShowScopes(!showScopes);
        showToast(!showScopes ? 'Video Scopes: Active' : 'Video Scopes: Hidden');
      }
    },
    {
      id: 'keywords',
      title: 'Keyword Editor',
      desc: 'Assign keywords and Smart Collection tags to selected clips',
      icon: Tag,
      shortcut: '⌘K',
      action: () => setIsKeywordsModalOpen(true)
    },
    {
      id: 'shortcuts',
      title: 'Keyboard Shortcuts Cheat Sheet',
      desc: 'View complete macOS Final Cut Pro keyboard map',
      icon: HelpCircle,
      shortcut: '?',
      action: () => setIsShortcutsModalOpen(true)
    },
    {
      id: 'export',
      title: 'Share Video (macOS Export Sheet)',
      desc: 'Render timeline to pristine MP4/ProRes with zero watermarks',
      icon: Download,
      shortcut: '⌘E',
      action: () => setIsShareModalOpen(true)
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
      <div className="w-full max-w-xl bg-[#1E1E20] border border-black rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar Header */}
        <div className="p-3.5 border-b border-black flex items-center space-x-3 bg-[#242427]">
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
            placeholder="Type a Final Cut Pro command (e.g., 'Connect', 'Blade', 'Scopes', 'Hold Frame')..."
            className="w-full bg-transparent text-sm text-white placeholder-[#8E8E93] focus:outline-none font-sans"
          />
          <button
            onClick={() => setIsSpotlightOpen(false)}
            className="p-1 rounded-md text-[#8E8E93] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#161618] p-1.5 bg-[#1E1E20]">
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
                  className={`px-3 py-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#0A84FF] text-white'
                      : 'text-[#D1D1D6] hover:bg-[#28282C]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#2A2A2E] text-[#0A84FF]'
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
                          isSelected ? 'text-white/80' : 'text-[#8E8E93]'
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
                        : 'bg-[#161618] text-[#8E8E93] border border-black'
                    }`}
                  >
                    {item.shortcut}
                  </kbd>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-[#8E8E93] text-xs font-mono">
              No matching Final Cut Pro commands found.
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-[#161618] border-t border-black flex items-center justify-between text-[11px] text-[#8E8E93] font-mono">
          <span className="flex items-center gap-1.5 text-white/70">
            <Command className="w-3.5 h-3.5 text-[#0A84FF]" /> Final Cut Pro Command HUD
          </span>
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
