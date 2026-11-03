import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { FCP_ROLES, formatSmpteTimecode } from '../../../types/studioTypes';
import { Info, Film, Tag, Zap, Camera, Clock } from 'lucide-react';

export default function ClipInfoInspector({ clip, onUpdate }) {
  const { setMulticamAngle, project } = useStudio();
  const fps = project.fps || 30;

  const currentRole = clip.role || (clip.trackId === 'A1' ? 'music' : clip.trackId === 'T1' ? 'titles' : 'video');
  const speed = clip.speedRamp?.speed || 1.0;

  return (
    <div className="space-y-4 p-3.5 bg-[#161619] rounded-xl border border-[#242429] text-xs font-mono">
      {/* Header */}
      <div className="flex items-center space-x-1.5 text-slate-200 font-semibold text-[11px] uppercase pb-1 border-b border-[#242429]">
        <Info className="w-3.5 h-3.5 text-[#0A84FF]" />
        <span>Clip Metadata &amp; Roles</span>
      </div>

      {/* Basic File Info */}
      <div className="space-y-1.5 p-2 rounded-lg bg-[#111114] border border-[#242429] text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">FORMAT:</span>
          <span className="text-slate-200">Apple ProRes / 60 FPS</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">TRACK:</span>
          <span className="text-[#0A84FF] font-bold">{clip.trackId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">IN POINT:</span>
          <span className="text-slate-200 tabular-nums">{formatSmpteTimecode(clip.startTime, fps)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">OUT POINT:</span>
          <span className="text-slate-200 tabular-nums">{formatSmpteTimecode(clip.startTime + clip.duration, fps)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">DURATION:</span>
          <span className="text-white font-bold tabular-nums">{clip.duration.toFixed(2)}s</span>
        </div>
      </div>

      {/* Final Cut Pro Role Assignment */}
      <div className="space-y-1.5">
        <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
          <Tag className="w-3 h-3 text-[#FF9F0A]" />
          <span>FCP Role Assignment</span>
        </label>
        <select
          value={currentRole}
          onChange={(e) => onUpdate({ role: e.target.value })}
          className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#0A84FF] capitalize"
        >
          {FCP_ROLES.map((r) => (
            <option key={r.id} value={r.id} className="bg-[#161619] text-white">
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Multicam Angle Switcher (If video) */}
      {(clip.trackId === 'V2' || clip.trackId === 'V1') && (
        <div className="space-y-1.5">
          <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
            <Camera className="w-3 h-3 text-[#0A84FF]" />
            <span>Multicam Angle Source</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((ang) => (
              <button
                key={ang}
                onClick={() => onUpdate({ multicamAngle: ang, name: `${clip.name.split(' (')[0]} (Angle ${ang})` })}
                className={`py-1 rounded-lg text-center text-[10px] font-bold transition-colors ${
                  (clip.multicamAngle || 1) === ang
                    ? 'bg-[#0A84FF] text-white'
                    : 'bg-[#111114] border border-[#242429] text-slate-400 hover:text-white'
                }`}
              >
                Cam {ang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Speed / Retiming Status */}
      <div className="p-2.5 rounded-lg bg-[#111114] border border-[#242429] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="w-3.5 h-3.5 text-[#FF9F0A]" />
          <span className="text-[11px] text-slate-300">Playback Rate:</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#1C1C21] border border-white/[0.08] text-[#FF9F0A] font-bold text-[11px]">
          {speed}x {clip.speedRamp?.isReversed ? '(Rev)' : ''}
        </span>
      </div>
    </div>
  );
}
