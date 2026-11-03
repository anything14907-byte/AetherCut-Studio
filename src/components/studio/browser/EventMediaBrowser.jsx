import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { PROCEDURAL_SCENES } from '../../../types/studioTypes';
import {
  Folder,
  FolderOpen,
  Film,
  Star,
  Clapperboard,
  Image as ImageIcon,
  Music,
  Search,
  Filter,
  Check,
  Plus,
  Play,
  Layers,
  Sparkles
} from 'lucide-react';

export default function EventMediaBrowser() {
  const {
    sidebarMode,
    appendClip,
    insertClip,
    browserRange,
    setBrowserRange,
    browserFilter,
    setBrowserFilter,
    browserSearch,
    setBrowserSearch,
    clipRatings,
    setClipRatings,
    showToast
  } = useStudio();

  const [activeCollection, setActiveCollection] = useState('all');
  const [selectedBrowserClipId, setSelectedBrowserClipId] = useState('b-clip-1');

  // Built-in browser clip library
  const browserClips = [
    {
      id: "b-clip-1",
      name: "Cyber Grid Neon Master",
      duration: 10.0,
      type: "video",
      sceneType: "cyberGrid",
      rating: clipRatings["b-clip-1"] || "favorite",
      thumbGradient: "from-blue-600 via-indigo-900 to-purple-900"
    },
    {
      id: "b-clip-2",
      name: "Cosmic Starfield 60p",
      duration: 12.0,
      type: "video",
      sceneType: "nebulaSpace",
      rating: clipRatings["b-clip-2"] || "none",
      thumbGradient: "from-purple-900 via-slate-900 to-black"
    },
    {
      id: "b-clip-3",
      name: "Aurora Lights Fluid Cut",
      duration: 8.5,
      type: "video",
      sceneType: "auroraFluid",
      rating: clipRatings["b-clip-3"] || "none",
      thumbGradient: "from-emerald-600 via-teal-900 to-black"
    },
    {
      id: "b-clip-4",
      name: "Synthwave Sun Horizon",
      duration: 15.0,
      type: "video",
      sceneType: "synthwaveSun",
      rating: clipRatings["b-clip-4"] || "none",
      thumbGradient: "from-amber-600 via-red-900 to-purple-900"
    },
    {
      id: "b-clip-5",
      name: "Digital Matrix Stream B-Roll",
      duration: 6.0,
      type: "video",
      sceneType: "matrixRain",
      rating: clipRatings["b-clip-5"] || "none",
      thumbGradient: "from-green-600 via-emerald-950 to-black"
    }
  ];

  // Filter clips by collection, rating, and search
  const filteredClips = browserClips.filter((c) => {
    if (browserSearch && !c.name.toLowerCase().includes(browserSearch.toLowerCase())) {
      return false;
    }
    const currentRating = clipRatings[c.id] || c.rating;
    if (browserFilter === 'favorites' && currentRating !== 'favorite') return false;
    if (browserFilter === 'rejected' && currentRating !== 'rejected') return false;
    if (browserFilter === 'unrated' && currentRating !== 'none') return false;
    return true;
  });

  const handleClipDoubleClick = (clip) => {
    appendClip({
      id: `v2-app-${Date.now()}`,
      name: clip.name,
      role: "video",
      trackId: "V2",
      startTime: 0,
      duration: 5.0,
      trimStart: 0,
      trimEnd: 5.0,
      sceneType: clip.sceneType,
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: "normal" },
      colorFilter: { exposure: 0, contrast: 1, saturation: 1, lutPreset: "none" }
    });
  };

  return (
    <div className="flex-1 flex h-full bg-[#1E1E20] border-r border-[#000000] text-xs select-none overflow-hidden">
      {/* LEFT MINI SIDEBAR: Libraries & Events Tree */}
      <div className="w-48 bg-[#18181A] border-r border-[#000000] flex flex-col shrink-0 text-[#C7C7CC]">
        <div className="h-7 border-b border-[#000000] px-2.5 flex items-center justify-between text-[10px] font-semibold text-[#8E8E93] uppercase tracking-wider bg-[#1E1E20]">
          <span>Libraries</span>
          <span className="text-[9px] font-mono">FCP Event</span>
        </div>

        <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 text-[11px]">
          {/* Library Folder Item */}
          <div className="flex items-center space-x-1.5 px-2 py-1 rounded-[3px] text-white font-medium hover:bg-[#2A2A2E] cursor-pointer">
            <Clapperboard className="w-3.5 h-3.5 text-[#0A84FF]" />
            <span className="truncate">All-In-One Library</span>
          </div>

          {/* Event Item */}
          <div className="pl-4 flex items-center space-x-1.5 px-2 py-1 rounded-[3px] text-[#E0E0E6] hover:bg-[#2A2A2E] cursor-pointer">
            <FolderOpen className="w-3.5 h-3.5 text-[#FF9F0A]" />
            <span className="truncate">2026 Studio Event</span>
          </div>

          {/* Smart Collections Sub-Tree */}
          <div className="pt-2 pl-2">
            <span className="px-2 text-[9px] uppercase font-mono text-[#6E6E73] font-bold block pb-1">
              Smart Collections
            </span>
            <div
              onClick={() => { setActiveCollection('all'); setBrowserFilter('all'); }}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-[3px] cursor-pointer ${
                activeCollection === 'all' && browserFilter === 'all' ? 'bg-[#0A84FF] text-white font-semibold' : 'text-[#8E8E93] hover:text-white hover:bg-[#242428]'
              }`}
            >
              <Film className="w-3 h-3" />
              <span>All Video</span>
            </div>
            <div
              onClick={() => { setActiveCollection('fav'); setBrowserFilter('favorites'); }}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-[3px] cursor-pointer ${
                browserFilter === 'favorites' ? 'bg-[#0A84FF] text-white font-semibold' : 'text-[#8E8E93] hover:text-white hover:bg-[#242428]'
              }`}
            >
              <Star className="w-3 h-3 text-[#30D158]" />
              <span>Favorites</span>
            </div>
            <div
              onClick={() => { setActiveCollection('audio'); }}
              className={`flex items-center space-x-1.5 px-2 py-1 rounded-[3px] cursor-pointer ${
                activeCollection === 'audio' ? 'bg-[#0A84FF] text-white font-semibold' : 'text-[#8E8E93] hover:text-white hover:bg-[#242428]'
              }`}
            >
              <Music className="w-3 h-3 text-[#4CA8E0]" />
              <span>Audio Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT FILMSTRIP / LIST BROWSER */}
      <div className="flex-1 flex flex-col bg-[#1E1E20] overflow-hidden">
        {/* Browser Top Controls (Search & Rating Filter) */}
        <div className="h-7 border-b border-[#000000] px-2 flex items-center justify-between text-[11px] bg-[#1E1E20]">
          {/* Search Box */}
          <div className="relative flex items-center w-48">
            <Search className="w-3 h-3 text-[#8E8E93] absolute left-1.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Clips..."
              value={browserSearch}
              onChange={(e) => setBrowserSearch(e.target.value)}
              className="w-full bg-[#151517] border border-[#2D2D31] rounded-[4px] pl-6 pr-2 py-0.5 text-[10px] text-white placeholder-[#6E6E73] focus:outline-none focus:border-[#0A84FF]"
            />
          </div>

          {/* Rating Filter Dropdown (All Clips, Favorites, Rejected) */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] text-[#8E8E93]">Filter:</span>
            <select
              value={browserFilter}
              onChange={(e) => setBrowserFilter(e.target.value)}
              className="bg-[#151517] border border-[#2D2D31] text-[10px] text-[#ECECEE] rounded-[3px] px-1.5 py-0.5 focus:outline-none cursor-pointer"
            >
              <option value="all">All Clips</option>
              <option value="favorites">Favorites (F)</option>
              <option value="rejected">Rejected (Del)</option>
              <option value="unrated">Unrated</option>
            </select>
          </div>
        </div>

        {/* Browser Filmstrip Clips Area */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filteredClips.map((clip) => {
            const isSelected = selectedBrowserClipId === clip.id;
            const rating = clipRatings[clip.id] || clip.rating;

            return (
              <div
                key={clip.id}
                onClick={() => setSelectedBrowserClipId(clip.id)}
                onDoubleClick={() => handleClipDoubleClick(clip)}
                className={`p-1.5 rounded-[4px] border cursor-pointer transition-all flex flex-col space-y-1 relative group ${
                  isSelected ? 'border-[#F5A623] bg-[#27272B]' : 'border-[#2D2D31] bg-[#171719] hover:border-[#424248]'
                }`}
              >
                {/* Top-Edge Colored Rating Line: Green stripe (Favorite F), Red stripe (Rejected Del) */}
                {rating === 'favorite' && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#30D158] rounded-t-[3px] z-20" />
                )}
                {rating === 'rejected' && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF453A] rounded-t-[3px] z-20" />
                )}

                {/* Filmstrip Thumbnail Row */}
                <div className={`h-14 rounded-[3px] bg-gradient-to-r ${clip.thumbGradient} relative overflow-hidden flex items-center justify-between px-2`}>
                  {/* Subtle Filmstrip Lines */}
                  <div className="absolute inset-0 fcp-filmstrip-pattern opacity-60 pointer-events-none" />

                  {/* Yellow Range Selection Box (I & O Handles) */}
                  <div className="absolute top-0 bottom-0 left-2 right-6 border-2 border-[#F5A623] rounded-[2px] bg-yellow-400/10 pointer-events-none flex justify-between items-center px-1">
                    <span className="text-[9px] font-mono font-bold text-[#F5A623] bg-black/80 px-0.5 rounded">I</span>
                    <span className="text-[9px] font-mono font-bold text-[#F5A623] bg-black/80 px-0.5 rounded">O</span>
                  </div>

                  <span className="relative z-10 text-[10px] font-mono font-bold text-white bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {clip.duration.toFixed(1)}s
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClipDoubleClick(clip);
                    }}
                    title="Append to Timeline (E)"
                    className="relative z-10 p-1 rounded bg-[#0A84FF] text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Clip Label */}
                <div className="flex items-center justify-between px-0.5 text-[10px]">
                  <span className="text-[#ECECEE] font-medium truncate max-w-[200px]">
                    {clip.name}
                  </span>
                  <span className="text-[#8E8E93] font-mono">
                    1080p60
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

