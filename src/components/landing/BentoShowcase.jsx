import React from 'react';
import {
  Layers,
  Magnet,
  Camera,
  Zap,
  Sliders,
  Volume2,
  Gauge,
  Film,
  CheckCircle2,
  Bookmark
} from 'lucide-react';

export default function BentoShowcase() {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 space-y-6 select-none">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
          Crafted for <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A84FF] to-[#30D158]">Native Speed &amp; Precision</span>
        </h2>
        <p className="text-sm text-slate-400">
          Professional non-linear video editing workstation running 100% in your browser. Zero subscription fees, zero watermark extortion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* CARD 1: Magnetic Timeline (7 cols) */}
        <div className="md:col-span-7 bg-[#161619] border border-[#242429] rounded-2xl p-6 relative overflow-hidden group hover:border-[#0A84FF]/50 transition-all shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#0A84FF]">
              <Magnet className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Magnetic Storyline Engine
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">Apple Magnetic Timeline &amp; Connected Stems</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Primary Storyline clips automatically ripple and close gaps when trimmed or deleted. Secondary audio stems and titles stay tethered to their primary anchor clips without drifting out of sync.
            </p>

            {/* Visual Timeline Track Simulation */}
            <div className="space-y-2 pt-1 font-mono text-[10px]">
              <div className="h-7 rounded-lg bg-[#BF5AF2]/20 border border-[#BF5AF2]/40 px-3 flex items-center justify-between text-[#BF5AF2]">
                <span>T1: Titles &amp; Captions</span>
                <span className="text-slate-400">Tethered Stem</span>
              </div>
              <div className="h-9 rounded-lg bg-[#0A84FF]/25 border-2 border-[#FF9F0A] px-3 flex items-center justify-between text-white font-bold shadow-sm">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF9F0A]" />
                  <span>V2: Primary Storyline (Active Clip)</span>
                </span>
                <span className="text-[#FF9F0A]">Magnetic Ripple ON</span>
              </div>
              <div className="h-7 rounded-lg bg-[#30D158]/20 border border-[#30D158]/40 px-3 flex items-center justify-between text-[#30D158]">
                <span>A1: Stereo Audio &amp; Waveforms</span>
                <span className="text-slate-400">dBFS Monitored</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: 4-Angle Multicam (5 cols) */}
        <div className="md:col-span-5 bg-[#161619] border border-[#242429] rounded-2xl p-6 relative overflow-hidden group hover:border-[#30D158]/50 transition-all shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#30D158]">
              <Camera className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Multi-Angle Switching
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">4-Angle Multicam Grid</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synchronize up to four camera angles simultaneously in a live 2x2 grid. Switch or cut angles on-the-fly using hotkeys 1, 2, 3, and 4 during playback.
            </p>

            {/* 2x2 Mini Multicam Matrix */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px]">
              <div className="h-12 rounded-lg bg-[#111114] border border-[#0A84FF] p-2 flex flex-col justify-between text-[#0A84FF] font-bold">
                <span>Angle 1 (Wide)</span>
                <span className="text-[9px] text-white bg-[#0A84FF] px-1 rounded w-fit">ACTIVE</span>
              </div>
              <div className="h-12 rounded-lg bg-[#111114] border border-[#242429] p-2 flex flex-col justify-between text-slate-400">
                <span>Angle 2 (Close-Up)</span>
                <span className="text-[9px] text-slate-500">Key 2</span>
              </div>
              <div className="h-12 rounded-lg bg-[#111114] border border-[#242429] p-2 flex flex-col justify-between text-slate-400">
                <span>Angle 3 (Overhead)</span>
                <span className="text-[9px] text-slate-500">Key 3</span>
              </div>
              <div className="h-12 rounded-lg bg-[#111114] border border-[#242429] p-2 flex flex-col justify-between text-slate-400">
                <span>Angle 4 (B-Roll)</span>
                <span className="text-[9px] text-slate-500">Key 4</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Speed Ramping (4 cols) */}
        <div className="md:col-span-4 bg-[#161619] border border-[#242429] rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF9F0A]/50 transition-all shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#FF9F0A]">
              <Zap className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Retiming Suite
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">Speed Ramping (⌘R)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create smooth cinematic ramps from 25% super slow-motion up to 400% hyperlapse, instant freeze frames, and reverse playback with one keystroke.
            </p>
          </div>
        </div>

        {/* CARD 4: 3-Way Color Wheels & Scopes (4 cols) */}
        <div className="md:col-span-4 bg-[#161619] border border-[#242429] rounded-2xl p-6 relative overflow-hidden group hover:border-[#BF5AF2]/50 transition-all shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#BF5AF2]">
              <Sliders className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Color Grading
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">3-Way Color Wheels &amp; Scopes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Individual Lift (shadows), Gamma (midtones), and Gain (highlights) color wheels with live Luma Waveform and RGB Parade analyzers downsampled for 0% UI lag.
            </p>
          </div>
        </div>

        {/* CARD 5: Zero-Lag Hardware Acceleration (4 cols) */}
        <div className="md:col-span-4 bg-[#161619] border border-[#242429] rounded-2xl p-6 relative overflow-hidden group hover:border-[#30D158]/50 transition-all shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-[#30D158]">
              <Gauge className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Zero-Lag Architecture
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">540p Fast Proxy Mode</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decoupled playhead eliminates 60fps React re-renders. Paused on-demand rendering yields 0% idle CPU, delivering buttery playback on any budget laptop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
