import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Volume2, VolumeX } from 'lucide-react';

export default function TrackHeader({ track, onToggleMute, onToggleLock }) {
  return (
    <div className="h-12 border-b border-white/[0.06] bg-[#0C0E15] px-3 flex items-center justify-between select-none border-r border-white/[0.08]">
      <div className="flex items-center space-x-2">
        {/* Track Badge */}
        <span
          className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded text-obsidian-950 shadow-sm"
          style={{ backgroundColor: track.color }}
        >
          {track.badge}
        </span>
        <span className="text-xs font-semibold text-slate-200 truncate max-w-[90px]">
          {track.name}
        </span>
      </div>

      <div className="flex items-center space-x-1 text-slate-400">
        {/* Mute / Visibility Toggle */}
        <button
          onClick={onToggleMute}
          title={track.muted ? 'Unmute Track' : 'Mute Track'}
          className={`p-1 rounded hover:text-white transition-colors ${
            track.muted ? 'text-red-400' : 'text-slate-400'
          }`}
        >
          {track.type === 'audio' ? (
            track.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />
          ) : (
            track.muted ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Lock Toggle */}
        <button
          onClick={onToggleLock}
          title={track.locked ? 'Unlock Track' : 'Lock Track'}
          className={`p-1 rounded hover:text-white transition-colors ${
            track.locked ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          {track.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

