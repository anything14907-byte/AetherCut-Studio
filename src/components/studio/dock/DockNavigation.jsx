import React from 'react';
import {
  Sparkles,
  FolderOpen,
  Subtitles,
  Mic,
  Sliders,
  Settings
} from 'lucide-react';

export default function DockNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'ai', label: 'AI Co-Director', icon: Sparkles },
    { id: 'media', label: 'Media Library', icon: FolderOpen },
    { id: 'text', label: 'Captions & Text', icon: Subtitles },
    { id: 'audio', label: 'Audio & Voice', icon: Mic },
    { id: 'fx', label: 'Grading & FX', icon: Sliders },
  ];

  return (
    <div className="w-14 bg-[#0C0E15] border-r border-white/[0.08] flex flex-col items-center py-3 space-y-2 select-none z-20">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group relative ${
              isActive
                ? 'bg-gradient-to-br from-[#00F2FE]/20 to-[#8A2BE2]/20 text-[#00F2FE] border border-[#00F2FE]/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <IconComponent className="w-5 h-5 transition-transform group-hover:scale-110" />

            {/* Tooltip pill */}
            <div className="absolute left-14 px-2 py-1 bg-[#11131A] text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/[0.1] pointer-events-none shadow-xl z-50">
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

