import React from 'react';
import { useStudio } from '../../../context/StudioContext';
import { LUT_PRESETS } from '../../../types/studioTypes';
import { Sliders, Sparkles, Check, Eye } from 'lucide-react';

export default function TabTransitionsFx() {
  const { project, setProject, selectedClip, updateClip, showToast } = useStudio();

  const handleApplyLut = (lutId) => {
    if (selectedClip && (selectedClip.trackId === 'V2' || selectedClip.trackId === 'V1')) {
      updateClip(selectedClip.id, {
        colorFilter: {
          ...(selectedClip.colorFilter || {}),
          lutPreset: lutId
        }
      });
      showToast(`Applied LUT "${lutId}" to selected clip`);
    } else {
      // Apply globally to all visual clips
      setProject((prev) => ({
        ...prev,
        clips: prev.clips.map((c) =>
          c.trackId === 'V2' || c.trackId === 'V1'
            ? { ...c, colorFilter: { ...(c.colorFilter || {}), lutPreset: lutId } }
            : c
        )
      }));
      showToast(`Applied LUT "${lutId}" across all visual tracks`);
    }
  };

  return (
    <div className="h-full flex flex-col p-3.5 space-y-4 select-none text-xs overflow-y-auto">
      <div className="flex items-center space-x-2 pb-2 border-b border-white/[0.08]">
        <Sliders className="w-4 h-4 text-[#00F2FE]" />
        <span className="font-semibold text-white">Cinematic LUTs &amp; FX</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold">
            Color Grading LUTs
          </span>
          <span className="text-[10px] text-slate-500">1-Click Grade</span>
        </div>

        <div className="space-y-2">
          {LUT_PRESETS.map((lut) => {
            const isCurrent = selectedClip?.colorFilter?.lutPreset === lut.id;
            return (
              <div
                key={lut.id}
                onClick={() => handleApplyLut(lut.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                  isCurrent
                    ? 'bg-[#181B26] border-[#00F2FE] shadow-sm'
                    : 'bg-[#11131A] border-white/[0.06] hover:border-white/[0.15]'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-slate-200 text-xs group-hover:text-[#00F2FE] transition-colors">
                      {lut.label}
                    </span>
                    {isCurrent && <Check className="w-3.5 h-3.5 text-[#00F2FE]" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {lut.id === 'none' ? 'Natural unfiltered colors' : 'Cinematic color matrix'}
                  </span>
                </div>

                <button
                  className="px-2 py-1 rounded bg-[#181B26] text-[10px] font-mono text-slate-300 group-hover:text-white border border-white/[0.06]"
                >
                  Apply
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

