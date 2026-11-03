import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { DEFAULT_DEMO_PROJECT } from '../../config/defaultProject';
import {
  Play,
  Film,
  Zap,
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  Shield,
  Sliders,
  Gauge
} from 'lucide-react';

export default function HeroPromptBar() {
  const { setActiveView, setProject, setCurrentTime, showToast } = useStudio();

  const handleLaunchEmpty = () => {
    setActiveView('studio');
    showToast('Launched Studio Workspace');
  };

  const handleLoadDemo = () => {
    setProject(DEFAULT_DEMO_PROJECT);
    setCurrentTime(0, true);
    setActiveView('studio');
    showToast('Loaded 4-Angle Multicam & Speed Ramp Demo Project');
  };

  const projectPresets = [
    {
      title: '4-Angle Multicam Session',
      desc: 'Synced 4-camera live studio cut with camera switching',
      icon: Camera,
      tag: 'Multicam (1-4)'
    },
    {
      title: 'Cinematic Speed Ramp',
      desc: '2x fast-motion dynamic ramp into slow-motion impact',
      icon: Zap,
      tag: '⌘R Retiming'
    },
    {
      title: '3-Way Color & Scopes',
      desc: 'Hollywood Teal & Orange grade with Luma Waveform & RGB Parade',
      icon: Sliders,
      tag: 'Lift / Gamma / Gain'
    },
    {
      title: 'Magnetic Timeline Stems',
      desc: 'Zero-gap ripple delete with connected storyline stems',
      icon: Layers,
      tag: 'Magnetic Ripple'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 select-none">
      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <button
          onClick={handleLaunchEmpty}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#0A84FF] hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 group"
        >
          <span>Open Studio Workspace</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleLoadDemo}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1C1C21] hover:bg-[#242429] border border-white/[0.12] text-white font-semibold text-sm transition-all flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4 text-[#FF9F0A] fill-current" />
          <span>Load Demo Project (?v=demo)</span>
        </button>
      </div>

      {/* Feature Showcase Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left pt-3">
        {projectPresets.map((preset, idx) => {
          const IconComp = preset.icon;
          return (
            <div
              key={idx}
              onClick={handleLoadDemo}
              className="p-3.5 rounded-xl bg-[#161619]/90 border border-[#242429] hover:border-[#0A84FF] transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-[#1C1C21] text-[#0A84FF] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-slate-400 border border-white/[0.06]">
                    {preset.tag}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-xs group-hover:text-[#0A84FF] transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug pt-0.5">
                    {preset.desc}
                  </p>
                </div>
              </div>

              <div className="pt-2 text-[10px] font-mono text-[#0A84FF] flex items-center space-x-1 group-hover:underline">
                <span>Explore in Studio</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Zero-Lag Guarantee Badge */}
      <div className="inline-flex items-center space-x-2 text-[11px] font-mono text-slate-400 bg-[#111114] px-3.5 py-1.5 rounded-full border border-[#242429]">
        <Gauge className="w-3.5 h-3.5 text-[#30D158]" />
        <span>Decoupled 60fps Playhead · 540p Proxy Acceleration · 0% Idle CPU</span>
      </div>
    </div>
  );
}
