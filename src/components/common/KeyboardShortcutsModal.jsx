import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, Command } from 'lucide-react';

export default function KeyboardShortcutsModal() {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useStudio();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause timeline playback' },
    { key: '1, 2, 3, 4', desc: 'Multicam: Cut to Camera Angle 1, 2, 3, or 4' },
    { key: '⌘ / Ctrl + R', desc: 'Speed Retiming (2x Fast Ramp)' },
    { key: 'M', desc: 'Add Marker at playhead' },
    { key: '⌥ / Alt + W', desc: 'Insert 3-second Gap Clip on Storyline' },
    { key: '⌥ / Alt + G', desc: 'Create Compound Clip from selection' },
    { key: 'B', desc: 'Blade Tool (Cut clip at playhead)' },
    { key: 'A', desc: 'Select Tool (Default cursor)' },
    { key: 'N', desc: 'Toggle Magnetic Timeline & Snapping' },
    { key: 'S', desc: 'Toggle Live Hover Skimmer' },
    { key: '⌘ / Ctrl + K', desc: 'Spotlight Command HUD' },
    { key: 'D', desc: 'Duplicate selected clip' },
    { key: 'Delete / ⌫', desc: 'Ripple Delete clip (Magnetic Snap)' },
    { key: '⌘ / Ctrl + Z', desc: 'Undo last editor action' },
    { key: '⌘ / Ctrl + Y', desc: 'Redo previously undone action' },
    { key: '← / →', desc: 'Step playhead back / forward 1 frame' },
    { key: 'Shift + ← / →', desc: 'Step playhead back / forward 1 second' },
    { key: 'Esc', desc: 'Deselect active clip / close modals' },
    { key: '?', desc: 'Toggle keyboard shortcuts cheat sheet' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#161619] border border-[#242429] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-[#242429] flex items-center justify-between bg-[#1C1C21]">
          <div className="flex items-center space-x-2">
            <Command className="w-4 h-4 text-[#0A84FF]" />
            <h3 className="font-semibold text-sm text-white">Final Cut Pro Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto divide-y divide-[#242429]">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-300 font-sans">{item.desc}</span>
              <kbd className="px-2 py-1 font-mono font-medium text-[11px] bg-[#0E0E12] text-[#0A84FF] border border-[#242429] rounded shadow-sm tabular-nums">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-[#111114] border-t border-[#242429] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Apple Final Cut Pro Web Edition</span>
          <span className="text-[#0A84FF]">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}
