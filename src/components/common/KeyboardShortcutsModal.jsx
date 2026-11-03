import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, Command, Scissors, Copy, Trash2, ArrowLeft, ArrowRight, CornerDownLeft } from 'lucide-react';

export default function KeyboardShortcutsModal() {
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useStudio();

  if (!isShortcutsModalOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause timeline playback' },
    { key: 'S', desc: 'Split clip at current playhead position' },
    { key: 'D', desc: 'Duplicate currently selected clip' },
    { key: 'Delete / Backspace', desc: 'Delete currently selected clip' },
    { key: 'Cmd / Ctrl + Z', desc: 'Undo last editor action' },
    { key: 'Cmd / Ctrl + Y (or Shift+Cmd+Z)', desc: 'Redo previously undone action' },
    { key: '← / →', desc: 'Step playhead back / forward 1 frame' },
    { key: 'Shift + ← / →', desc: 'Step playhead back / forward 1 second' },
    { key: 'Esc', desc: 'Deselect active clip' },
    { key: '?', desc: 'Toggle keyboard shortcuts cheat sheet' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0C0E15] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Command className="w-4 h-4 text-[#00F2FE]" />
            <h3 className="font-semibold text-sm text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={() => setIsShortcutsModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[70vh] overflow-y-auto divide-y divide-white/[0.04]">
          {shortcuts.map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-300">{item.desc}</span>
              <kbd className="px-2 py-1 font-mono font-medium text-[11px] bg-[#181B26] text-[#00F2FE] border border-white/[0.1] rounded shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 bg-[#11131A] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <span>Obsidian Cinema Engine</span>
          <span className="font-mono text-[#00F2FE]">Press Esc to close</span>
        </div>
      </div>
    </div>
  );
}

