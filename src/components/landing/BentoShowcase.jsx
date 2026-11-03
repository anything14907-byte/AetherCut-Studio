import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Layers,
  Subtitles,
  Cpu,
  Scissors,
  CheckCircle2,
  Terminal,
  Volume2,
  Lock
} from 'lucide-react';

export default function BentoShowcase() {
  // Interactive preview state for Hormozi captions
  const [captionWordIndex, setCaptionWordIndex] = useState(0);
  const words = ['REVOLUTIONARY', 'CLIENT-SIDE', 'VIDEO', 'CREATOR', 'WITH', 'ZERO', 'WATERMARKS'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCaptionWordIndex((prev) => (prev + 1) % words.length);
    }, 650);
    return () => clearInterval(timer);
  }, [words.length]);

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
          Engineered for <span className="gradient-text">Absolute Creative Freedom</span>
        </h2>
        <p className="text-sm text-slate-400">
          Professional-grade non-linear editing meets zero-latency browser AI. No subscriptions, no paywalls, no limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* CARD 1: AI Co-Director Agent (7 cols) */}
        <div className="md:col-span-7 bg-[#11131A]/80 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-[#00F2FE]/40 transition-all shadow-subtle-glow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#00F2FE]">
              <Sparkles className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Autonomous Co-Pilot
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">AI Director Command Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Type natural language instructions to direct your edit. Split clips at timecodes, auto-generate captions, inject procedural soundscapes, or apply cinematic color grades instantly.
            </p>

            {/* Interactive Terminal Demo */}
            <div className="bg-[#07080C] border border-white/[0.08] rounded-xl p-3.5 font-mono text-xs space-y-2 shadow-inner">
              <div className="flex items-center space-x-1.5 text-slate-500 pb-1 border-b border-white/[0.04]">
                <Terminal className="w-3.5 h-3.5 text-[#00F2FE]" />
                <span className="text-[11px]">ai_director_stream ~ active</span>
              </div>
              <div className="text-slate-300">
                <span className="text-[#00F2FE]">&gt;</span> Apply cyberpunk color grade &amp; add kinetic yellow captions
              </div>
              <div className="p-2 rounded bg-[#11131A] text-emerald-400 text-[11px] border border-emerald-500/20 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Mutated 4 timeline clips. Saturation +40%, LUT active, captions synced.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Multi-Track Timeline Precision (5 cols) */}
        <div className="md:col-span-5 bg-[#11131A]/80 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-[#8A2BE2]/40 transition-all shadow-subtle-glow">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8A2BE2]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#8A2BE2]">
              <Layers className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Precision NLE
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">4 Dedicated Tracks</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              True non-linear editing with dedicated tracks for Text (T1), Overlays (V1), Main Visuals (V2), and Audio (A1) with trim handles and split-at-playhead.
            </p>

            {/* Mini Visual Track Stack */}
            <div className="space-y-1.5 pt-1">
              <div className="h-6 rounded bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 px-2 flex items-center justify-between text-[10px] font-mono text-[#8A2BE2]">
                <span>T1: Kinetic Captions</span>
                <span>00:00 - 00:22</span>
              </div>
              <div className="h-6 rounded bg-[#00F2FE]/20 border border-[#00F2FE]/40 px-2 flex items-center justify-between text-[10px] font-mono text-[#00F2FE]">
                <span>V1: PIP Terminal HUD</span>
                <span>00:03 - 00:11</span>
              </div>
              <div className="h-6 rounded bg-[#3B82F6]/20 border border-[#3B82F6]/40 px-2 flex items-center justify-between text-[10px] font-mono text-[#3B82F6]">
                <span>V2: Cyber Grid Scene</span>
                <span>00:00 - 00:22</span>
              </div>
              <div className="h-6 rounded bg-[#10B981]/20 border border-[#10B981]/40 px-2 flex items-center justify-between text-[10px] font-mono text-[#10B981]">
                <span>A1: Dark Synthwave &amp; Voice</span>
                <span>120 BPM</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Instant Kinetic Captions (5 cols) */}
        <div className="md:col-span-5 bg-[#11131A]/80 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-amber-400/40 transition-all shadow-subtle-glow">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-400">
              <Subtitles className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Viral Subtitles
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">Hormozi Word Highlights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kinetic subtitle engine highlights each word dynamically as it is spoken. Switch to Neon Glow, Minimal Cinema, or Bold Impact with one click.
            </p>

            {/* Live Interactive Word Highlight Simulation */}
            <div className="h-20 bg-[#07080C] rounded-xl border border-white/[0.08] flex items-center justify-center p-3 text-center">
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {words.map((word, i) => {
                  const isActive = i === captionWordIndex;
                  return (
                    <span
                      key={i}
                      className={`text-xs md:text-sm font-extrabold uppercase transition-all duration-150 px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#181B26] text-[#FACC15] scale-110 shadow-lg border border-[#FACC15]'
                          : 'text-slate-400'
                      }`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Zero-Cost Client-Side Engine (7 cols) */}
        <div className="md:col-span-7 bg-[#11131A]/80 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-[#10B981]/40 transition-all shadow-subtle-glow">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#10B981]">
              <Cpu className="w-5 h-5" />
              <span className="text-xs uppercase font-mono font-semibold tracking-wider">
                Hardware Accelerated
              </span>
            </div>

            <h3 className="text-xl font-bold text-white">100% Client-Side Video Rendering</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              Composited via HTML5 Canvas 2D at 60fps and captured with native WebCodecs &amp; Web Audio API. Your video renders directly on your CPU/GPU with zero server costs and zero data transmission.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-[#07080C] border border-white/[0.06] text-center">
                <span className="block text-lg font-bold font-mono text-[#00F2FE]">0ms</span>
                <span className="text-[11px] text-slate-400">Server Latency</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080C] border border-white/[0.06] text-center">
                <span className="block text-lg font-bold font-mono text-emerald-400">100%</span>
                <span className="text-[11px] text-slate-400">Watermark Free</span>
              </div>
              <div className="p-3 rounded-xl bg-[#07080C] border border-white/[0.06] text-center">
                <span className="block text-lg font-bold font-mono text-[#8A2BE2]">$0</span>
                <span className="text-[11px] text-slate-400">Subscription Cost</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

