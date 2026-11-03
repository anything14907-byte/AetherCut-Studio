import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { X, Key, Plus, Tag } from 'lucide-react';

export default function FcpKeywordsModal() {
  const {
    isKeywordsModalOpen,
    setIsKeywordsModalOpen,
    selectedClip,
    updateClip,
    showToast
  } = useStudio();

  const [newKeyword, setNewKeyword] = useState('');
  const [keywords, setKeywords] = useState([
    'B-Roll',
    'Interview',
    'Hero Shot',
    'Cyberpunk',
    'Music Video',
    'Cinematic'
  ]);

  if (!isKeywordsModalOpen) return null;

  const handleAdd = (kw) => {
    if (!kw) return;
    if (!keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
    }
    if (selectedClip) {
      const current = selectedClip.keywords || [];
      if (!current.includes(kw)) {
        updateClip(selectedClip.id, { keywords: [...current, kw] });
        showToast(`Tagged clip with keyword: ${kw}`);
      }
    }
    setNewKeyword('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-[#1E1E20] border border-[#000000] rounded-xl shadow-2xl overflow-hidden text-xs text-[#ECECEE] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        {/* Header */}
        <div className="h-9 bg-[#18181A] border-b border-[#000000] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span className="font-semibold text-sm text-white">Keyword Editor (Cmd+K)</span>
          </div>
          <button
            onClick={() => setIsKeywordsModalOpen(false)}
            className="text-[#8E8E93] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="New Keyword Shortcut..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd(newKeyword);
              }}
              className="flex-1 bg-[#151517] border border-[#2D2D31] rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-[#0A84FF]"
            />
            <button
              onClick={() => handleAdd(newKeyword)}
              className="px-3 py-1 rounded bg-[#0A84FF] text-white font-medium hover:bg-blue-500"
            >
              Add
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#8E8E93] block">Preset Keyword Shortcuts</span>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {keywords.map((kw, idx) => (
                <button
                  key={kw}
                  onClick={() => handleAdd(kw)}
                  className="px-2.5 py-1.5 rounded-[4px] bg-[#171719] border border-[#2D2D31] hover:border-[#0A84FF] text-left text-[11px] text-[#ECECEE] flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-1.5 truncate">
                    <Tag className="w-3 h-3 text-[#0A84FF]" />
                    <span className="truncate">{kw}</span>
                  </div>
                  <kbd className="font-mono text-[9px] text-[#6E6E73] group-hover:text-white">
                    ^{idx + 1}
                  </kbd>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

