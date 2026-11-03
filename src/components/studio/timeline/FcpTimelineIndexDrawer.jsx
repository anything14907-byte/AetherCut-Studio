import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { FCP_ROLES, formatSmpteTimecode } from '../../../types/studioTypes';
import { Search, X, Bookmark, Layers, Volume2, VolumeX, Eye } from 'lucide-react';

export default function FcpTimelineIndexDrawer() {
  const {
    showTimelineIndex,
    setShowTimelineIndex,
    project,
    selectedClipId,
    setSelectedClipId,
    setCurrentTime,
    markers,
    jumpToMarker,
    updateClip
  } = useStudio();

  const [activeTab, setActiveTab] = useState('clips'); // 'clips' | 'tags' | 'roles'
  const [search, setSearch] = useState('');

  if (!showTimelineIndex) return null;

  const clips = project.clips || [];
  const filteredClips = clips.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-64 bg-[#1E1E20] border-r border-[#000000] flex flex-col h-full shrink-0 select-none text-xs text-[#ECECEE] z-30">
      {/* Drawer Header */}
      <div className="h-8 bg-[#18181A] border-b border-[#000000] px-3 flex items-center justify-between">
        <span className="font-semibold text-xs text-white">Timeline Index</span>
        <button
          onClick={() => setShowTimelineIndex(false)}
          className="text-[#8E8E93] hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs: Clips | Tags | Roles */}
      <div className="flex bg-[#161618] p-0.5 border-b border-[#000000] text-[10px] font-mono">
        <button
          onClick={() => setActiveTab('clips')}
          className={`flex-1 py-1 rounded-[3px] font-semibold transition-colors ${
            activeTab === 'clips' ? 'bg-[#3A3A40] text-white' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Clips ({clips.length})
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex-1 py-1 rounded-[3px] font-semibold transition-colors ${
            activeTab === 'tags' ? 'bg-[#3A3A40] text-white' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Tags ({markers.length})
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex-1 py-1 rounded-[3px] font-semibold transition-colors ${
            activeTab === 'roles' ? 'bg-[#3A3A40] text-white' : 'text-[#8E8E93] hover:text-white'
          }`}
        >
          Roles
        </button>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-[#000000] bg-[#18181A]">
        <div className="relative">
          <Search className="w-3 h-3 text-[#8E8E93] absolute left-2 top-2" />
          <input
            type="text"
            placeholder="Search Index..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121214] border border-[#2D2D31] rounded-[4px] pl-6 pr-2 py-0.5 text-[11px] text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        {/* Clips List */}
        {activeTab === 'clips' && (
          <div className="space-y-0.5">
            {filteredClips.map((clip) => {
              const isSelected = selectedClipId === clip.id;
              return (
                <div
                  key={clip.id}
                  onClick={() => {
                    setSelectedClipId(clip.id);
                    setCurrentTime(clip.startTime, true);
                  }}
                  className={`px-2 py-1.5 rounded-[3px] cursor-pointer flex items-center justify-between text-[11px] ${
                    isSelected ? 'bg-[#0A84FF] text-white font-semibold' : 'hover:bg-[#2A2A30] text-[#D1D1D6]'
                  }`}
                >
                  <span className="truncate max-w-[130px]">{clip.name}</span>
                  <span className="font-mono text-[9px] text-slate-400 tabular-nums">
                    {formatSmpteTimecode(clip.startTime)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Tags / Markers */}
        {activeTab === 'tags' && (
          <div className="space-y-1">
            {markers.map((marker) => (
              <div
                key={marker.id}
                onClick={() => jumpToMarker(marker.time)}
                className="px-2 py-1.5 rounded-[3px] bg-[#17171A] border border-[#2A2A30] hover:border-[#0A84FF] cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <Bookmark className="w-3 h-3 text-[#FF9F0A] shrink-0" />
                  <span className="text-[11px] font-medium truncate">{marker.label}</span>
                </div>
                <span className="font-mono text-[9px] text-[#A1A1A6] tabular-nums">
                  {formatSmpteTimecode(marker.time)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Roles Management */}
        {activeTab === 'roles' && (
          <div className="space-y-1">
            {FCP_ROLES.map((role) => (
              <div
                key={role.id}
                className="px-2 py-1.5 rounded-[3px] bg-[#17171A] border border-[#2A2A30] flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                  <span className="font-semibold text-white">{role.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    className="p-1 rounded text-[#8E8E93] hover:text-white"
                    title={`Mute ${role.name}`}
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

