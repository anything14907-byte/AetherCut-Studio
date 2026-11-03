import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { BRAND_CONFIG } from '../../config/brandConfig';
import {
  Sparkles,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  Wand2,
  ArrowRight,
  Flame,
  Film,
  Zap
} from 'lucide-react';

export default function HeroPromptBar() {
  const { setProject, setCurrentTime, setActiveView, showToast } = useStudio();

  const [prompt, setPrompt] = useState(
    'Create a 30-second cyberpunk product promo with upbeat synth music and dynamic captions'
  );
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [visualStyle, setVisualStyle] = useState('cyberGrid');
  const [isGenerating, setIsGenerating] = useState(false);

  const suggestions = [
    {
      title: 'Cyberpunk Tech Teaser',
      prompt: 'Create a 30-second cyberpunk product promo with upbeat synth music and dynamic captions',
      aspect: '16:9',
      style: 'cyberGrid'
    },
    {
      title: 'Deep Space Odyssey',
      prompt: 'Cinematic deep space journey with ambient drone and minimal cinema titles',
      aspect: '16:9',
      style: 'nebulaSpace'
    },
    {
      title: 'Viral TikTok Hook',
      prompt: 'High energy 9:16 vertical hook with Hormozi yellow captions and bass drop impact',
      aspect: '9:16',
      style: 'synthwaveSun'
    },
    {
      title: 'Obsidian Aurora Luxe',
      prompt: 'Minimal luxury brand aesthetic with iridescent aurora flow and clean typography',
      aspect: '1:1',
      style: 'auroraFluid'
    }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    showToast('AI Director crafting multi-track timeline...');

    setTimeout(() => {
      // Procedurally generate a rich project based on choices
      const duration = 22.0;
      const width = aspectRatio === '9:16' ? 1080 : 1920;
      const height = aspectRatio === '9:16' ? 1920 : (aspectRatio === '1:1' ? 1080 : 1080);

      const generatedProject = {
        id: `gen-proj-${Date.now()}`,
        title: prompt.slice(0, 36).toUpperCase(),
        duration,
        fps: 30,
        aspectRatio,
        width,
        height,
        masterVolume: 1.0,
        clips: [
          // V2: Main Visuals
          {
            id: `v2-g1-${Date.now()}`,
            trackId: 'V2',
            type: 'procedural',
            name: `Scene: ${visualStyle}`,
            startTime: 0,
            duration: 11.0,
            trimStart: 0,
            trimEnd: 11.0,
            sceneType: visualStyle,
            transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
            colorFilter: { brightness: 105, contrast: 125, saturation: 140, hueRotate: 0, blur: 0, lutPreset: 'cyberpunk' }
          },
          {
            id: `v2-g2-${Date.now()}`,
            trackId: 'V2',
            type: 'procedural',
            name: 'Scene: Secondary Warp',
            startTime: 11.0,
            duration: 11.0,
            trimStart: 0,
            trimEnd: 11.0,
            sceneType: visualStyle === 'cyberGrid' ? 'nebulaSpace' : 'auroraFluid',
            transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
            colorFilter: { brightness: 100, contrast: 120, saturation: 130, hueRotate: 15, blur: 0, lutPreset: 'tealOrange' }
          },
          // V1: Overlay PIP
          {
            id: `v1-g1-${Date.now()}`,
            trackId: 'V1',
            type: 'procedural',
            name: 'PIP HUD Terminal',
            startTime: 3.0,
            duration: 8.0,
            trimStart: 0,
            trimEnd: 8.0,
            sceneType: 'matrixRain',
            transform: { x: aspectRatio === '9:16' ? 0 : 520, y: aspectRatio === '9:16' ? -420 : -240, scale: 0.35, rotation: 0, opacity: 0.85 },
            colorFilter: { brightness: 110, contrast: 120, saturation: 150, hueRotate: 90, blur: 0, lutPreset: 'matrix' }
          },
          // T1: Captions
          {
            id: `t1-g1-${Date.now()}`,
            trackId: 'T1',
            type: 'caption',
            name: 'Prompt Title',
            startTime: 0.5,
            duration: 5.0,
            trimStart: 0,
            trimEnd: 5.0,
            typography: {
              text: 'DIRECTED WITH AETHERCUT AI',
              fontFamily: 'Syne',
              fontSize: aspectRatio === '9:16' ? 44 : 56,
              color: '#00F2FE',
              strokeColor: '#000000',
              strokeWidth: 4,
              bgPillColor: 'rgba(0, 242, 254, 0.2)',
              stylePreset: 'neonGlow',
              words: [
                { word: 'DIRECTED', start: 0.5, end: 1.8 },
                { word: 'WITH', start: 1.8, end: 2.5 },
                { word: 'AETHERCUT', start: 2.5, end: 3.8 },
                { word: 'AI', start: 3.8, end: 5.0 }
              ]
            },
            transform: { x: 0, y: aspectRatio === '9:16' ? -150 : 0, scale: 1.0, rotation: 0, opacity: 1.0 }
          },
          {
            id: `t1-g2-${Date.now()}`,
            trackId: 'T1',
            type: 'caption',
            name: 'Kinetic Hook',
            startTime: 6.0,
            duration: 5.0,
            trimStart: 0,
            trimEnd: 5.0,
            typography: {
              text: 'ZERO SUBSCRIPTIONS ZERO WATERMARKS',
              fontFamily: 'Plus Jakarta Sans',
              fontSize: aspectRatio === '9:16' ? 42 : 50,
              color: '#FACC15',
              strokeColor: '#000000',
              strokeWidth: 6,
              bgPillColor: 'rgba(17,19,26,0.9)',
              stylePreset: 'hormozi',
              words: [
                { word: 'ZERO', start: 6.0, end: 7.0 },
                { word: 'SUBSCRIPTIONS', start: 7.0, end: 8.5 },
                { word: 'ZERO', start: 8.5, end: 9.5 },
                { word: 'WATERMARKS', start: 9.5, end: 11.0 }
              ]
            },
            transform: { x: 0, y: aspectRatio === '9:16' ? 200 : 180, scale: 1.0, rotation: 0, opacity: 1.0 }
          },
          // A1: Audio & Voice
          {
            id: `a1-g1-${Date.now()}`,
            trackId: 'A1',
            type: 'audio',
            name: 'Cyberpunk Dark Synth',
            startTime: 0,
            duration,
            trimStart: 0,
            trimEnd: duration,
            audio: {
              volume: 0.65,
              fadeIn: 0.5,
              fadeOut: 1.0,
              sfxType: 'synthwaveBgm'
            }
          },
          {
            id: `a1-g2-${Date.now()}`,
            trackId: 'A1',
            type: 'voiceover',
            name: 'AI Voiceover',
            startTime: 1.0,
            duration: 4.5,
            trimStart: 0,
            trimEnd: 4.5,
            audio: {
              volume: 1.0,
              fadeIn: 0.1,
              fadeOut: 0.2,
              ttsText: 'Directed with AetherCut AI. Zero watermarks and pure creative speed.',
              ttsVoice: 'en-US',
              ttsRate: 1.0,
              ttsPitch: 1.0
            }
          }
        ]
      };

      setProject(generatedProject);
      setCurrentTime(0);
      setIsGenerating(false);
      setActiveView('studio');
      showToast('🎉 Project generated! Studio timeline ready.');
    }, 900);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Command Bar Outer Card with Gradient Halo */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00F2FE]/30 via-[#8A2BE2]/30 to-[#00F2FE]/30 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative bg-[#0C0E15]/95 backdrop-blur-xl border border-white/[0.12] rounded-2xl p-4 md:p-6 shadow-2xl space-y-4">
          {/* Top Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00F2FE] animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-300 font-mono">
                AI Direct & Multi-Track Generator
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#00F2FE] bg-electric-cyan/10 border border-[#00F2FE]/20 px-2.5 py-0.5 rounded-full">
              100% Free • No API Key Required
            </span>
          </div>

          {/* Main Prompt Textarea */}
          <div className="relative">
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video vision (e.g., '30s cyberpunk promo with energetic synth soundtrack, kinetic captions, and futuristic overlay HUD')..."
              className="w-full bg-[#11131A] border border-white/[0.08] focus:border-[#00F2FE] rounded-xl p-3.5 text-sm md:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#00F2FE]/50 transition-all resize-none font-sans"
            />
          </div>

          {/* Controls Bar: Aspect Ratio + Visual Style + CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center space-x-1.5 bg-[#11131A] p-1 rounded-xl border border-white/[0.06]">
              {BRAND_CONFIG.aspectRatios.map((item) => {
                const isSelected = aspectRatio === item.id;
                const IconComponent =
                  item.id === '16:9'
                    ? RectangleHorizontal
                    : item.id === '9:16'
                    ? RectangleVertical
                    : Square;

                return (
                  <button
                    key={item.id}
                    onClick={() => setAspectRatio(item.id)}
                    title={item.label}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{item.id}</span>
                  </button>
                );
              })}
            </div>

            {/* Visual Style Selector */}
            <div className="flex items-center space-x-1.5">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">Style:</span>
              <div className="flex items-center space-x-1 bg-[#11131A] p-1 rounded-xl border border-white/[0.06]">
                {[
                  { id: 'cyberGrid', label: 'Cyber Grid' },
                  { id: 'nebulaSpace', label: 'Deep Space' },
                  { id: 'auroraFluid', label: 'Aurora' },
                  { id: 'synthwaveSun', label: 'Retro Sun' }
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setVisualStyle(st.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                      visualStyle === st.id
                        ? 'bg-white/[0.12] text-[#00F2FE] font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 font-bold text-sm hover:brightness-110 shadow-glass-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin text-obsidian-950" />
                  <span>Generating Timeline...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Generate & Open in Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Quick Inspiration Pills */}
          <div className="pt-2 border-t border-white/[0.04] flex items-center space-x-2 overflow-x-auto text-xs pb-1">
            <span className="text-slate-500 font-mono shrink-0 flex items-center space-x-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Try:</span>
            </span>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(sug.prompt);
                  setAspectRatio(sug.aspect);
                  setVisualStyle(sug.style);
                }}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
              >
                {sug.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

