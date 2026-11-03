/**
 * Default Pre-loaded Demo Project (Final Cut Pro Studio Edition)
 * Fully populated with 4 synchronized tracks, connected stems, and clip auditions!
 */

export const DEFAULT_DEMO_PROJECT = {
  id: "demo-aethercut-2026",
  title: "FINAL CUT PRO // NEXT-GEN V2.0 SHOWCASE",
  duration: 22.0, // seconds
  fps: 30,
  aspectRatio: "16:9",
  width: 1920,
  height: 1080,
  masterVolume: 1.0,
  clips: [
    // --- V2: PRIMARY STORYLINE (MAGNETIC) ---
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
      // Audition stack: allows cycling between 3 visual takes in-place!
      activeAuditionIndex: 0,
      auditions: [
        { name: "Take 1: Cyber Grid", sceneType: "cyberGrid", lutPreset: "cyberpunk" },
        { name: "Take 2: Space Nebula", sceneType: "nebulaSpace", lutPreset: "none" },
        { name: "Take 3: Retro Sunset", sceneType: "synthwaveSun", lutPreset: "vintageKodak" }
      ],
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: {
        brightness: 105,
        contrast: 120,
        saturation: 140,
        hueRotate: 0,
        blur: 0,
        lutPreset: "cyberpunk",
        temperature: 15,
        tint: -5,
        vignette: 10,
        shadows: { hue: 200, sat: 15, luma: -5 },
        midtones: { hue: 35, sat: 20, luma: 0 },
        highlights: { hue: 45, sat: 10, luma: 5 }
      },
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
      activeAuditionIndex: 0,
      auditions: [
        { name: "Take 1: Deep Space", sceneType: "nebulaSpace", lutPreset: "none" },
        { name: "Take 2: Matrix Rain", sceneType: "matrixRain", lutPreset: "matrix" },
        { name: "Take 3: Aurora Flow", sceneType: "auroraFluid", lutPreset: "tealOrange" }
      ],
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: {
        brightness: 100,
        contrast: 110,
        saturation: 120,
        hueRotate: 0,
        blur: 0,
        lutPreset: "none",
        temperature: -10,
        tint: 5,
        vignette: 25,
        shadows: { hue: 240, sat: 25, luma: -10 },
        midtones: { hue: 270, sat: 15, luma: 5 },
        highlights: { hue: 180, sat: 20, luma: 10 }
      },
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
      activeAuditionIndex: 0,
      auditions: [
        { name: "Take 1: Aurora Flow", sceneType: "auroraFluid", lutPreset: "tealOrange" },
        { name: "Take 2: Cyber Grid", sceneType: "cyberGrid", lutPreset: "cyberpunk" }
      ],
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: {
        brightness: 110,
        contrast: 125,
        saturation: 150,
        hueRotate: 15,
        blur: 0,
        lutPreset: "tealOrange",
        temperature: 20,
        tint: -10,
        vignette: 15,
        shadows: { hue: 190, sat: 30, luma: -5 },
        midtones: { hue: 30, sat: 25, luma: 5 },
        highlights: { hue: 50, sat: 15, luma: 15 }
      },
    },

    // --- V1: CONNECTED B-ROLL / PIP OVERLAYS ---
    {
      id: "v1-clip-1",
      trackId: "V1",
      type: "procedural",
      name: "PIP Terminal Stream",
      parentClipId: "v2-clip-1", // Connected to Primary Storyline Clip 1!
      startTime: 3.0,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      sceneType: "matrixRain",
      transform: { x: 550, y: -250, scale: 0.38, rotation: -2, opacity: 0.85 },
      colorFilter: { brightness: 120, contrast: 130, saturation: 160, hueRotate: 90, blur: 0, lutPreset: "matrix" },
    },
    {
      id: "v1-clip-2",
      trackId: "V1",
      type: "procedural",
      name: "PIP Sunset Horizon",
      parentClipId: "v2-clip-2", // Connected to Primary Storyline Clip 2!
      startTime: 10.0,
      duration: 5.0,
      trimStart: 0.0,
      trimEnd: 5.0,
      sceneType: "synthwaveSun",
      transform: { x: -550, y: 220, scale: 0.35, rotation: 3, opacity: 0.9 },
      colorFilter: { brightness: 100, contrast: 115, saturation: 130, hueRotate: 0, blur: 0, lutPreset: "vintageKodak" },
    },

    // --- T1: TITLES & KINETIC CAPTIONS ---
    {
      id: "t1-clip-1",
      trackId: "T1",
      type: "caption",
      name: "Title // AetherCut Pro",
      parentClipId: "v2-clip-1", // Connected to V2-clip-1!
      startTime: 0.5,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "AETHERCUT PRO 2.0 // FINAL CUT EDITION",
        fontFamily: "Syne",
        fontSize: 56,
        color: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 4,
        bgPillColor: "rgba(10, 132, 255, 0.25)",
        stylePreset: "neonGlow",
        words: [
          { word: "AETHERCUT", start: 0.5, end: 1.5 },
          { word: "PRO", start: 1.5, end: 2.2 },
          { word: "2.0", start: 2.2, end: 3.2 },
          { word: "EDITION", start: 3.2, end: 4.5 },
        ]
      },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-2",
      trackId: "T1",
      type: "caption",
      name: "Kinetic // Magnetic Timeline",
      parentClipId: "v2-clip-1",
      startTime: 5.2,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "MAGNETIC TIMELINE & LIVE SKIMMING",
        fontFamily: "Plus Jakarta Sans",
        fontSize: 50,
        color: "#FF9F0A", // Iconic Amber
        strokeColor: "#000000",
        strokeWidth: 6,
        bgPillColor: "rgba(22, 22, 25, 0.9)",
        stylePreset: "hormozi",
        words: [
          { word: "MAGNETIC", start: 5.2, end: 6.2 },
          { word: "TIMELINE", start: 6.2, end: 7.4 },
          { word: "LIVE", start: 7.4, end: 8.5 },
          { word: "SKIMMING", start: 8.5, end: 9.7 },
        ]
      },
      transform: { x: 0, y: 220, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-3",
      trackId: "T1",
      type: "caption",
      name: "Kinetic // 3-Way Color Wheels",
      parentClipId: "v2-clip-2",
      startTime: 10.5,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "3-WAY COLOR WHEELS & LIVE SCOPES",
        fontFamily: "Inter",
        fontSize: 46,
        color: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 2,
        bgPillColor: "transparent",
        stylePreset: "minimalCinema",
        words: [
          { word: "3-WAY", start: 10.5, end: 11.5 },
          { word: "COLOR", start: 11.5, end: 12.8 },
          { word: "SCOPES", start: 12.8, end: 15.0 },
        ]
      },
      transform: { x: 0, y: -260, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-4",
      trackId: "T1",
      type: "caption",
      name: "Outro // Watermark Free",
      parentClipId: "v2-clip-3",
      startTime: 16.0,
      duration: 5.5,
      trimStart: 0.0,
      trimEnd: 5.5,
      typography: {
        text: "ZERO WATERMARKS • 100% FREE",
        fontFamily: "Syne",
        fontSize: 54,
        color: "#30D158", // Pro Green
        strokeColor: "#0B0B0D",
        strokeWidth: 4,
        bgPillColor: "rgba(48, 209, 88, 0.2)",
        stylePreset: "neonGlow",
        words: [
          { word: "ZERO", start: 16.0, end: 17.2 },
          { word: "WATERMARKS", start: 17.2, end: 18.5 },
          { word: "100%", start: 18.5, end: 19.8 },
          { word: "FREE", start: 19.8, end: 21.5 },
        ]
      },
      transform: { x: 0, y: 150, scale: 1.0, rotation: 0, opacity: 1.0 },
    },

    // --- A1: AUDIO, VOICEOVER & MUSIC ---
    {
      id: "a1-clip-1",
      trackId: "A1",
      type: "audio",
      name: "Cyberpunk Dark Synth Soundtrack",
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
      parentClipId: "v2-clip-1",
      startTime: 1.0,
      duration: 4.2,
      trimStart: 0.0,
      trimEnd: 4.2,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText: "Welcome to Final Cut Pro Studio Edition. The ultra-fast client-side editor.",
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
      parentClipId: "v2-clip-1",
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
      parentClipId: "v2-clip-3",
      startTime: 15.5,
      duration: 4.8,
      trimStart: 0.0,
      trimEnd: 4.8,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText: "Color grade with 3-way wheels and render client-side with zero watermarks.",
        ttsVoice: "en-US",
        ttsRate: 1.0,
        ttsPitch: 1.0
      }
    }
  ]
};
