import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { BRAND_CONFIG } from '../../config/brandConfig';
import { ShieldCheck, Sparkles, Play, Award, CheckCircle } from 'lucide-react';

export default function FreePledgeBanner() {
  const { setActiveView } = useStudio();

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#11131A] to-[#0C0E15] border border-white/[0.1] p-8 md:p-12 text-center space-y-8 shadow-2xl">
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#00F2FE]/15 to-[#8A2BE2]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>Uncompromising Creator Commitment</span>
          </div>

          <h2 className="text-2xl md:text-4xl font-display font-extrabold text-white tracking-tight">
            {BRAND_CONFIG.pledge.title}
          </h2>

          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every feature in AetherCut Studio is unlocked by default. No hidden paywalls, no trial expirations, no credit rationing, and absolutely no exported watermarks.
          </p>
        </div>

        {/* 4 Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 text-left">
          {BRAND_CONFIG.pledge.bullets.map((b, idx) => (
            <div
              key={idx}
              className="bg-[#181B26]/60 border border-white/[0.06] rounded-xl p-4 space-y-1.5"
            >
              <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>{b.label}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="pt-2 relative z-10">
          <button
            onClick={() => setActiveView('studio')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 font-bold text-sm hover:brightness-110 shadow-glass-glow transition-all inline-flex items-center space-x-2"
          >
            <span>Open Studio Workspace Now</span>
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}

