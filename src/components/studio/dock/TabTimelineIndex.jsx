import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { formatSmpteTimecode } from '../../../types/studioTypes';
import {
  ListOrdered,
  Bookmark,
  Layers,
  Search,
  Volume2,
  VolumeX,
  Eye,
  Trash2,
  Plus
} from 'lucide-react';

export default function TabTimelineIndex() {
  const {
    project,
    setCurrentTime,
    selectedClipId,
    setSelectedClipId,
    markers,
    addMarker,
    deleteMarker,
    rolesState,
    toggleRoleMute,
    toggleRoleSolo,
    showToast
  } = useStudio();

  const [subTab, setSubTab] = useState('clips'); // 'clips' | 'markers' | 'roles'
  const [searchQuery, setSearchQuery] = useState('');

  const clips = project.clips || [];

  const filteredClips = clips.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.trackId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.role || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-3 space-y-3 select-none text-xs overflow-hidden">
      {/* Index Sub-Tabs: Clips | Markers | Roles */}
      <div className="flex items-center space-x-1 bg-[#111114] p-0.5 rounded-lg border border-[#242429] font-mono text-[10px]">
        <button
          onClick={() => setSubTab('clips')}
          className={`flex-1 py-1 rounded-md transition-all text-center ${
            subTab === 'clips' ? 'bg-[#242429] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Clips ({clips.length})
        </button>
        <button
          onClick={() => setSubTab('markers')}
          className={`flex-1 py-1 rounded-md transition-all text-center ${
            subTab === 'markers' ? 'bg-[#242429] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Markers ({markers.length})
        </button>
        <button
          onClick={() => setSubTab('roles')}
          className={`flex-1 py-1 rounded-md transition-all text-center ${
            subTab === 'roles' ? 'bg-[#242429] text-white font-bold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          Roles
        </button>
      </div>

      {/* CLIPS SUB-TAB */}
      {subTab === 'clips' && (
        <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timeline clips..."
              className="w-full bg-[#111114] border border-[#242429] rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0A84FF] font-sans"
            />
          </div>

          {/* Clips List */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1 font-mono text-[11px]">
            {filteredClips.map((clip) => {
              const isSelected = clip.id === selectedClipId;
              return (
                <div
                  key={clip.id}
                  onClick={() => {
                    setSelectedClipId(clip.id);
                    setCurrentTime(clip.startTime, true);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg border cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-white font-bold'
                      : 'bg-[#111114] border-[#242429] text-slate-300 hover:bg-[#1C1C21]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="px-1 py-0.2 rounded bg-black/40 text-[9px] text-[#0A84FF] border border-white/[0.08]">
                      {clip.trackId}
                    </span>
                    <span className="truncate max-w-[120px]">{clip.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 tabular-nums">
                    {formatSmpteTimecode(clip.startTime, 30)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MARKERS SUB-TAB */}
      {subTab === 'markers' && (
        <div className="flex-1 flex flex-col space-y-2 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
              <Bookmark className="w-3.5 h-3.5 text-[#FF9F0A]" />
              <span>Timeline Markers</span>
            </span>
            <button
              onClick={() => addMarker()}
              className="px-2 py-0.5 rounded bg-[#1C1C21] hover:bg-[#0A84FF] text-slate-300 hover:text-white flex items-center space-x-1 font-mono text-[10px] transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add (M)</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px]">
            {markers.length > 0 ? (
              markers.map((marker) => (
                <div
                  key={marker.id}
                  className="p-2 rounded-lg bg-[#111114] border border-[#242429] flex items-center justify-between group hover:border-[#FF9F0A] transition-colors"
                >
                  <div
                    onClick={() => setCurrentTime(marker.time, true)}
                    className="flex items-center space-x-2 cursor-pointer flex-1 truncate"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: marker.color || '#0A84FF' }}
                    />
                    <div className="truncate">
                      <span className="font-semibold text-slate-200 block truncate text-xs">
                        {marker.label}
                      </span>
                      <span className="text-[10px] text-slate-500 tabular-nums">
                        {formatSmpteTimecode(marker.time, 30)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteMarker(marker.id)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                No markers on timeline. Press 'M' to drop a marker.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ROLES SUB-TAB */}
      {subTab === 'roles' && (
        <div className="flex-1 flex flex-col space-y-2 overflow-y-auto pr-1">
          <div className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span>Final Cut Pro Roles</span>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {rolesState.map((role) => {
              const count = clips.filter((c) => (c.role || '').toLowerCase() === role.id.toLowerCase()).length;
              return (
                <div
                  key={role.id}
                  className="p-2.5 rounded-xl bg-[#111114] border border-[#242429] flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-md shrink-0"
                      style={{ backgroundColor: role.color }}
                    />
                    <div>
                      <span className="font-bold text-slate-200 block text-xs">
                        {role.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {count} {count === 1 ? 'Clip' : 'Clips'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleRoleMute(role.id)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        role.muted
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-[#1C1C21] text-slate-400 hover:text-white'
                      }`}
                      title={role.muted ? 'Unmute Role' : 'Mute Role'}
                    >
                      {role.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => toggleRoleSolo(role.id)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-colors ${
                        role.soloed
                          ? 'bg-[#FF9F0A] text-black'
                          : 'bg-[#1C1C21] text-slate-400 hover:text-white'
                      }`}
                      title="Solo Role"
                    >
                      S
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
