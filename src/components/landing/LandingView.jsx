import React from 'react';
import HeroPromptBar from './HeroPromptBar';
import BentoShowcase from './BentoShowcase';
import FreePledgeBanner from './FreePledgeBanner';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { Film, ArrowRight, Shield, Cpu, Gauge, Zap } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function LandingView() {
  const { setActiveView } = useStudio();

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-slate-100 flex flex-col selection:bg-[#0A84FF]/25 selection:text-[#0A84FF]">
      {/* Background subtle radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-cinema opacity-40" />

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-10 md:pt-14 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#161619] border border-white/[0.08] text-xs font-mono text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#30D158]" />
            <span className="text-[#30D158] font-bold">100% FREE</span>
            <span className="text-slate-600">•</span>
            <span>ZERO WATERMARKS</span>
            <span className="text-slate-600">•</span>
            <span className="text-[#0A84FF]">60 FPS NATIVE SPEED</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.08]">
            Professional Video Editing. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0A84FF] via-[#5AC8FA] to-[#30D158]">
              Native-Speed in Your Browser.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Experience the precision of Apple Final Cut Pro without high subscription fees or heavy desktop installs. Magnetic Timeline, 4-Angle Multicam, Speed Ramping, 3-Way Color Wheels, and zero latency on any laptop.
          </p>

          {/* Command Hero */}
          <div className="pt-2">
            <HeroPromptBar />
          </div>
        </div>

        {/* Bento Grid Feature Showcase */}
        <BentoShowcase />

        {/* Free Pledge Section */}
        <FreePledgeBanner />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#242429] bg-[#111114] py-8 px-6 text-xs text-slate-400 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#0A84FF] to-[#30D158] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-white font-bold" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              {BRAND_CONFIG.name}
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400">
              {BRAND_CONFIG.version}
            </span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400 text-xs font-mono">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-[#0A84FF]" />
              <span>Canvas 2D + WebCodecs 60 FPS</span>
            </span>
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-[#30D158]" />
              <span>100% Client-Side Privacy</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView('studio')}
              className="text-[#0A84FF] hover:underline font-medium"
            >
              Open Studio Workspace →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
