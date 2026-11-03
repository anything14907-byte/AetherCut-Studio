import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, Command } from 'lucide-react';

export default function KeyboardShortcutsModal() {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useStudio();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause timeline playback' },
    { key: 'J / K / L', desc: 'Shuttle Reverse / Stop / Forward (-4x, -2x, -1x, 1x, 2x, 4x)' },
    { key: 'Q', desc: 'Connect to Primary Storyline (as B-Roll, Title, or Audio)' },
    { key: 'W', desc: 'Insert at playhead with magnetic ripple' },
    { key: 'E', desc: 'Append to the end of the Primary Storyline' },
    { key: 'D', desc: 'Overwrite timeline at playhead' },
    { key: 'I / O', desc: 'Set Range In / Out boundary markers' },
    { key: '⌥ / Alt + X', desc: 'Clear Range In / Out selection' },
    { key: 'A', desc: 'Select Tool (Default pointer)' },
    { key: 'T', desc: 'Trim Tool (Roll / slip edit)' },
    { key: 'P', desc: 'Position Tool (Breaks magnetic snapping, leaves Gap)' },
    { key: 'R', desc: 'Range Selection Tool' },
    { key: 'B', desc: 'Blade Tool (Razor cut)' },
    { key: '⌘ / Ctrl + B', desc: 'Blade cut clip at playhead' },
    { key: 'Shift + H', desc: 'Create 2s Hold (Freeze Frame) segment' },
    { key: '⌘ / Ctrl + R', desc: 'Show/Hide Retime Speed Bar' },
    { key: 'V', desc: 'Enable / Disable (Mute) selected clip (dims to 35%)' },
    { key: 'M', desc: 'Add Marker at playhead' },
    { key: 'F', desc: 'Mark Browser clip as Favorite (Green stripe)' },
    { key: 'Delete / ⌫', desc: 'Reject clip in Browser / Ripple Delete in Timeline' },
    { key: 'N', desc: 'Toggle Snapping' },
    { key: 'S', desc: 'Toggle Hover Skimming' },
    { key: '⌥ / Alt + S', desc: 'Toggle Audio Solo' },
    { key: '1, 2, 3, 4', desc: 'Multicam: Cut live to Camera Angle 1, 2, 3, or 4' },
    { key: '⌘ / Ctrl + E', desc: 'Open macOS Share / Export Destination Sheet' },
    { key: '⌘ / Ctrl + K', desc: 'Spotlight Command HUD / Keyword Editor' },
    { key: '← / →', desc: 'Step playhead back / forward 1 frame' },
    { key: 'Shift + ← / →', desc: 'Step playhead back / forward 1 second' },
    { key: 'Esc', desc: 'Deselect active clip / close modals' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-xl bg-[#1E1E20] border border-[#000000] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs text-[#ECECEE] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="h-9 bg-[#18181A] border-b border-[#000000] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Command className="w-4 h-4 text-[#0A84FF]" />
            <span className="font-semibold text-sm text-white">Apple Final Cut Pro Keyboard Shortcuts</span>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="text-[#8E8E93] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto divide-y divide-[#2A2A2E]">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="py-2 flex items-center justify-between">
              <span className="text-[#D1D1D6]">{item.desc}</span>
              <kbd className="px-2 py-0.5 font-mono font-medium text-[10px] bg-[#141416] text-[#0A84FF] border border-[#2D2D31] rounded shadow-sm tabular-nums">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="h-9 bg-[#18181A] border-t border-[#000000] px-4 flex items-center justify-between text-[11px] text-[#8E8E93] font-mono">
          <span>macOS Final Cut Pro Keyboard Map</span>
          <span className="text-[#0A84FF]">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}
