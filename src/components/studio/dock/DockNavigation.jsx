import React from 'react';
import {
  FolderOpen,
  Type,
  Layers,
  ListOrdered
} from 'lucide-react';

export default function DockNavigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'media', label: 'Media Browser', icon: FolderOpen },
    { id: 'titles', label: 'Titles & Generators', icon: Type },
    { id: 'effects', label: 'Transitions & FX', icon: Layers },
    { id: 'index', label: 'Timeline Index & Roles', icon: ListOrdered },
  ];

  return (
    <div className="w-13 bg-[#111114] border-r border-[#242429] flex flex-col items-center py-2.5 space-y-1.5 select-none z-20">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all group relative ${
              isActive
                ? 'bg-[#0A84FF] text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#1C1C21]'
            }`}
          >
            <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />

            {/* Tooltip pill */}
            <div className="absolute left-12 px-2.5 py-1 bg-[#161619] text-white text-[11px] font-mono rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-[#242429] pointer-events-none shadow-xl z-50">
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
