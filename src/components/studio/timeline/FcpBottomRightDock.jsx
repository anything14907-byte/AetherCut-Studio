import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { FCP_EFFECT_CATEGORIES, FCP_TRANSITION_CATEGORIES } from '../../../types/studioTypes';
import { Search, X, Check, Layers, Sparkles } from 'lucide-react';

export default function FcpBottomRightDock() {
  const {
    bottomRightDock,
    setBottomRightDock,
    selectedClip,
    updateClip,
    showToast
  } = useStudio();

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  if (bottomRightDock === 'none') return null;

  const isEffects = bottomRightDock === 'effects';
  const categories = isEffects ? FCP_EFFECT_CATEGORIES : FCP_TRANSITION_CATEGORIES;

  const handleApply = (item) => {
    if (!selectedClip) {
      showToast('Select a storyline clip first');
      return;
    }
    if (isEffects) {
      updateClip(selectedClip.id, {
        colorFilter: {
          ...(selectedClip.colorFilter || {}),
          lutPreset: item.id
        }
      });
      showToast(`Applied Effect: ${item.name}`);
    } else {
      updateClip(selectedClip.id, {
        transition: { type: item.id, duration: 1.0 }
      });
      showToast(`Applied Transition: ${item.name}`);
    }
  };

  return (
    <div className="w-72 bg-[#1E1E20] border-l border-[#000000] flex flex-col h-full shrink-0 select-none text-xs text-[#ECECEE] shadow-2xl z-30">
      {/* Dock Header */}
      <div className="h-8 bg-[#18181A] border-b border-[#000000] px-3 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 font-semibold text-xs">
          {isEffects ? <Layers className="w-3.5 h-3.5 text-[#0A84FF]" /> : <Sparkles className="w-3.5 h-3.5 text-[#0A84FF]" />}
          <span>{isEffects ? 'Video & Audio Effects' : 'Transitions Browser'}</span>
        </div>
        <button
          onClick={() => setBottomRightDock('none')}
          className="text-[#8E8E93] hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search & Category Pills */}
      <div className="p-2 border-b border-[#000000] space-y-1.5 bg-[#1B1B1D]">
        <div className="relative">
          <Search className="w-3 h-3 text-[#8E8E93] absolute left-2 top-2" />
          <input
            type="text"
            placeholder={isEffects ? "Search Effects..." : "Search Transitions..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151517] border border-[#2D2D31] rounded-[4px] pl-6 pr-2 py-1 text-[11px] text-white focus:outline-none"
          />
        </div>

        <div className="flex space-x-1 overflow-x-auto pb-0.5 text-[10px]">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-2 py-0.5 rounded-[3px] font-medium whitespace-nowrap ${
              activeCategory === 'All' ? 'bg-[#0A84FF] text-white' : 'bg-[#151517] text-[#8E8E93] hover:text-white'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.category}
              onClick={() => setActiveCategory(c.category)}
              className={`px-2 py-0.5 rounded-[3px] font-medium whitespace-nowrap ${
                activeCategory === c.category ? 'bg-[#0A84FF] text-white' : 'bg-[#151517] text-[#8E8E93] hover:text-white'
              }`}
            >
              {c.category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3">
        {categories.map((catGroup) => {
          if (activeCategory !== 'All' && activeCategory !== catGroup.category) return null;
          return (
            <div key={catGroup.category} className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono text-[#8E8E93] font-bold block px-1">
                {catGroup.category}
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {catGroup.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleApply(item)}
                    className="p-2 rounded-[4px] bg-[#17171A] border border-[#2D2D31] hover:border-[#0A84FF] hover:bg-[#25252A] cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <span className="font-semibold text-[11px] text-[#ECECEE] truncate block">
                      {item.name}
                    </span>
                    <span className="text-[9px] text-[#8E8E93] line-clamp-1 pt-0.5 font-mono">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

