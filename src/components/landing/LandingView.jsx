import React from 'react';
import HeroPromptBar from './HeroPromptBar';
import BentoShowcase from './BentoShowcase';
import FreePledgeBanner from './FreePledgeBanner';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { Sparkles, Film, ArrowRight, Github, Shield, Cpu } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export default function LandingView() {
  const { setActiveView } = useStudio();

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col selection:bg-[#00F2FE]/20 selection:text-[#00F2FE]">
      {/* Background radial cinema glow */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-cinema" />

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-12 md:pt-16 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
            <span className="text-[#00F2FE] font-bold">100% FREE</span>
            <span className="text-slate-500">•</span>
            <span>NO WATERMARK</span>
            <span className="text-slate-500">•</span>
            <span>RUNS IN BROWSER</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.08]">
            Direct Your Next Video with <br />
            <span className="gradient-text">Zero Latency AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The next-generation non-linear editor running locally on your hardware. Multi-track 60fps compositing, kinetic auto-captions, and instant export.
          </p>

          {/* Command Bar Component */}
          <div className="pt-4">
            <HeroPromptBar />
          </div>
        </div>

        {/* Bento Grid Feature Showcase */}
        <BentoShowcase />

        {/* Free Pledge Section */}
        <FreePledgeBanner />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#0C0E15] py-8 px-6 text-xs text-slate-400 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00F2FE] to-[#8A2BE2] flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-obsidian-950 font-bold" />
            </div>
            <span className="font-display font-bold text-white text-sm">
              {BRAND_CONFIG.name}
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-400">
              {BRAND_CONFIG.version}
            </span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400 text-xs">
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-[#00F2FE]" />
              <span>Canvas 2D + WebCodecs Engine</span>
            </span>
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side Privacy</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView('studio')}
              className="text-[#00F2FE] hover:underline font-medium"
            >
              Open Studio Workspace →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

