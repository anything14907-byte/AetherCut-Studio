/**
 * Default Pre-loaded Demo Project
 * Fully populated with 4 synchronized tracks so users can immediately hit play or export!
 */

export const DEFAULT_DEMO_PROJECT = {
  id: "demo-aethercut-2026",
  title: "AETHERCUT // NEXT-GEN CINEMATIC SHOWCASE",
  duration: 22.0, // seconds
  fps: 30,
  aspectRatio: "16:9",
  width: 1920,
  height: 1080,
  masterVolume: 1.0,
  clips: [
    // --- V2: MAIN VIDEO & PROCEDURAL BACKGROUNDS ---
    {
      id: "v2-clip-1",
      trackId: "V2",
      type: "procedural",
      name: "Cyberpunk 3D Wireframe",
      startTime: 0.0,
      duration: 7.5,
      trimStart: 0.0,
      trimEnd: 7.5,
      sceneType: "cyberGrid",
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: { brightness: 105, contrast: 120, saturation: 140, hueRotate: 0, blur: 0, lutPreset: "cyberpunk" },
    },
    {
      id: "v2-clip-2",
      trackId: "V2",
      type: "procedural",
      name: "Deep Space Nebula Stars",
      startTime: 7.5,
      duration: 7.5,
      trimStart: 0.0,
      trimEnd: 7.5,
      sceneType: "nebulaSpace",
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: { brightness: 100, contrast: 110, saturation: 120, hueRotate: 0, blur: 0, lutPreset: "none" },
    },
    {
      id: "v2-clip-3",
      trackId: "V2",
      type: "procedural",
      name: "Obsidian Iridescent Aurora",
      startTime: 15.0,
      duration: 7.0,
      trimStart: 0.0,
      trimEnd: 7.0,
      sceneType: "auroraFluid",
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: { brightness: 110, contrast: 125, saturation: 150, hueRotate: 15, blur: 0, lutPreset: "tealOrange" },
    },

    // --- V1: OVERLAY / PIP MEDIA ---
    {
      id: "v1-clip-1",
      trackId: "V1",
      type: "procedural",
      name: "PIP Terminal Stream",
      startTime: 3.0,
      duration: 6.0,
      trimStart: 0.0,
      trimEnd: 6.0,
      sceneType: "matrixRain",
      transform: { x: 550, y: -250, scale: 0.38, rotation: -2, opacity: 0.85 },
      colorFilter: { brightness: 120, contrast: 130, saturation: 160, hueRotate: 90, blur: 0, lutPreset: "matrix" },
    },
    {
      id: "v1-clip-2",
      trackId: "V1",
      type: "procedural",
      name: "PIP Sunset Horizon",
      startTime: 12.0,
      duration: 7.0,
      trimStart: 0.0,
      trimEnd: 7.0,
      sceneType: "synthwaveSun",
      transform: { x: -550, y: 220, scale: 0.35, rotation: 3, opacity: 0.9 },
      colorFilter: { brightness: 100, contrast: 115, saturation: 130, hueRotate: 0, blur: 0, lutPreset: "vintageKodak" },
    },

    // --- T1: TEXT & KINETIC CAPTIONS ---
    {
      id: "t1-clip-1",
      trackId: "T1",
      type: "caption",
      name: "Title // AetherCut Studio",
      startTime: 0.5,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "WELCOME TO AETHERCUT STUDIO",
        fontFamily: "Syne",
        fontSize: 58,
        color: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 4,
        bgPillColor: "rgba(0, 242, 254, 0.25)",
        stylePreset: "neonGlow",
        words: [
          { word: "WELCOME", start: 0.5, end: 1.5 },
          { word: "TO", start: 1.5, end: 2.2 },
          { word: "AETHERCUT", start: 2.2, end: 3.5 },
          { word: "STUDIO", start: 3.5, end: 4.5 },
        ]
      },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-2",
      trackId: "T1",
      type: "caption",
      name: "Kinetic // Zero Watermarks",
      startTime: 5.5,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "100% FREE CLIENT-SIDE NLE",
        fontFamily: "Plus Jakarta Sans",
        fontSize: 52,
        color: "#FACC15",
        strokeColor: "#000000",
        strokeWidth: 6,
        bgPillColor: "rgba(17, 19, 26, 0.85)",
        stylePreset: "hormozi",
        words: [
          { word: "100%", start: 5.5, end: 6.3 },
          { word: "FREE", start: 6.3, end: 7.2 },
          { word: "CLIENT-SIDE", start: 7.2, end: 8.5 },
          { word: "NLE", start: 8.5, end: 10.0 },
        ]
      },
      transform: { x: 0, y: 220, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-3",
      trackId: "T1",
      type: "caption",
      name: "Kinetic // 4-Track Precision",
      startTime: 11.0,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "MULTI-TRACK 60FPS COMPOSITING",
        fontFamily: "Inter",
        fontSize: 46,
        color: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 2,
        bgPillColor: "transparent",
        stylePreset: "minimalCinema",
        words: [
          { word: "MULTI-TRACK", start: 11.0, end: 12.0 },
          { word: "60FPS", start: 12.0, end: 13.2 },
          { word: "COMPOSITING", start: 13.2, end: 15.5 },
        ]
      },
      transform: { x: 0, y: -260, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-4",
      trackId: "T1",
      type: "caption",
      name: "Outro // Zero Watermark Export",
      startTime: 16.0,
      duration: 5.5,
      trimStart: 0.0,
      trimEnd: 5.5,
      typography: {
        text: "ZERO WATERMARKS • EXPORT ANYTIME",
        fontFamily: "Syne",
        fontSize: 54,
        color: "#00F2FE",
        strokeColor: "#8A2BE2",
        strokeWidth: 4,
        bgPillColor: "rgba(138, 43, 226, 0.2)",
        stylePreset: "neonGlow",
        words: [
          { word: "ZERO", start: 16.0, end: 17.2 },
          { word: "WATERMARKS", start: 17.2, end: 18.5 },
          { word: "EXPORT", start: 18.5, end: 19.8 },
          { word: "ANYTIME", start: 19.8, end: 21.5 },
        ]
      },
      transform: { x: 0, y: 150, scale: 1.0, rotation: 0, opacity: 1.0 },
    },

    // --- A1: VOICEOVER & AUDIO ---
    {
      id: "a1-clip-1",
      trackId: "A1",
      type: "audio",
      name: "Cyberpunk Synthwave Soundtrack",
      startTime: 0.0,
      duration: 22.0,
      trimStart: 0.0,
      trimEnd: 22.0,
      audio: {
        volume: 0.65,
        fadeIn: 0.5,
        fadeOut: 1.5,
        sfxType: "synthwaveBgm",
      }
    },
    {
      id: "a1-clip-2",
      trackId: "A1",
      type: "voiceover",
      name: "AI Voiceover Intro",
      startTime: 1.0,
      duration: 4.2,
      trimStart: 0.0,
      trimEnd: 4.2,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText: "Welcome to AetherCut Studio. The ultra-fast free video editor.",
        ttsVoice: "en-US",
        ttsRate: 1.0,
        ttsPitch: 1.0
      }
    },
    {
      id: "a1-clip-3",
      trackId: "A1",
      type: "audio",
      name: "SFX Whoosh Transition",
      startTime: 7.2,
      duration: 1.5,
      trimStart: 0.0,
      trimEnd: 1.5,
      audio: {
        volume: 0.8,
        fadeIn: 0.0,
        fadeOut: 0.3,
        sfxType: "sfxWhoosh"
      }
    },
    {
      id: "a1-clip-4",
      trackId: "A1",
      type: "voiceover",
      name: "AI Voiceover Outro",
      startTime: 15.5,
      duration: 4.8,
      trimStart: 0.0,
      trimEnd: 4.8,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText: "Direct and render with zero watermarks directly on your computer.",
        ttsVoice: "en-US",
        ttsRate: 1.0,
        ttsPitch: 1.0
      }
    }
  ]
};

