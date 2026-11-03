/**
 * Default Pre-loaded Demo Project (Apple Final Cut Pro Web Edition)
 * Featuring:
 * - 4 Synced Multicam Angles
 * - Speed Ramped Scene (1x -> 4x -> 1x)
 * - Connected Storyline Stems (Titles & Audio tethered to Primary Storyline)
 * - Timeline Markers (Beat drop, Speed ramp cut, Outro hook)
 * - Color grading with 3-Way Color Wheels
 */

export const DEFAULT_DEMO_PROJECT = {
  id: "fcp-demo-project-2026",
  title: "FINAL CUT PRO // CINEMATIC WORKSTATION DEMO",
  duration: 22.0, // seconds
  fps: 30,
  aspectRatio: "16:9",
  width: 1920,
  height: 1080,
  masterVolume: 1.0,
  markers: [
    { id: "m1", time: 3.5, label: "Beat Drop", color: "#FF9F0A" },
    { id: "m2", time: 7.5, label: "Speed Ramp Cut", color: "#0A84FF" },
    { id: "m3", time: 15.0, label: "Outro Climax", color: "#30D158" }
  ],
  clips: [
    // --- V2: PRIMARY STORYLINE (MAGNETIC) ---
    {
      id: "v2-clip-1",
      trackId: "V2",
      role: "video",
      type: "procedural",
      name: "Scene 1: Cyberpunk Master",
      startTime: 0.0,
      duration: 7.5,
      trimStart: 0.0,
      trimEnd: 7.5,
      sceneType: "cyberGrid",
      multicamAngle: 1, // Synced to Multicam Angle 1
      speedRamp: { speed: 1.0, isRamped: false, rampType: null },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: {
        brightness: 105,
        contrast: 120,
        saturation: 135,
        hueRotate: 0,
        blur: 0,
        lutPreset: "tealOrange",
        temperature: 15,
        tint: -5,
        vignette: 15,
        shadows: { hue: 200, sat: 15, luma: -5 },
        midtones: { hue: 35, sat: 20, luma: 0 },
        highlights: { hue: 45, sat: 10, luma: 5 }
      },
    },
    {
      id: "v2-clip-2",
      trackId: "V2",
      role: "video",
      type: "procedural",
      name: "Scene 2: Speed Ramped Warp",
      startTime: 7.5,
      duration: 7.5,
      trimStart: 0.0,
      trimEnd: 7.5,
      sceneType: "nebulaSpace",
      multicamAngle: 2, // Multicam Angle 2
      // Speed Ramping configured!
      speedRamp: { speed: 2.0, isRamped: true, rampType: "rampUp", label: "2x Ramp" },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: {
        brightness: 100,
        contrast: 115,
        saturation: 125,
        hueRotate: 0,
        blur: 0,
        lutPreset: "none",
        temperature: -10,
        tint: 5,
        vignette: 25,
        shadows: { hue: 240, sat: 20, luma: -8 },
        midtones: { hue: 270, sat: 15, luma: 5 },
        highlights: { hue: 180, sat: 20, luma: 10 }
      },
    },
    {
      id: "v2-clip-3",
      trackId: "V2",
      role: "video",
      type: "procedural",
      name: "Scene 3: Aurora Finale",
      startTime: 15.0,
      duration: 7.0,
      trimStart: 0.0,
      trimEnd: 7.0,
      sceneType: "auroraFluid",
      multicamAngle: 3, // Multicam Angle 3
      speedRamp: { speed: 1.0, isRamped: false },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
      colorFilter: {
        brightness: 110,
        contrast: 125,
        saturation: 145,
        hueRotate: 15,
        blur: 0,
        lutPreset: "goldenHour",
        temperature: 20,
        tint: -10,
        vignette: 20,
        shadows: { hue: 190, sat: 25, luma: -5 },
        midtones: { hue: 30, sat: 25, luma: 5 },
        highlights: { hue: 50, sat: 15, luma: 15 }
      },
    },

    // --- V1: CONNECTED B-ROLL / PIP OVERLAYS ---
    {
      id: "v1-clip-1",
      trackId: "V1",
      role: "b_roll",
      type: "procedural",
      name: "B-Roll: HUD Terminal Overlay",
      parentClipId: "v2-clip-1", // Connected to Primary Storyline Clip 1
      startTime: 2.5,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      sceneType: "matrixRain",
      blendMode: "screen",
      transform: { x: 540, y: -240, scale: 0.38, rotation: -2, opacity: 0.9 },
      colorFilter: { brightness: 120, contrast: 130, saturation: 160, hueRotate: 90, blur: 0, lutPreset: "none" },
    },
    {
      id: "v1-clip-2",
      trackId: "V1",
      role: "b_roll",
      type: "procedural",
      name: "B-Roll: Sunset Cutaway",
      parentClipId: "v2-clip-2", // Connected to Primary Storyline Clip 2
      startTime: 9.5,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      sceneType: "synthwaveSun",
      blendMode: "normal",
      transform: { x: -540, y: 220, scale: 0.35, rotation: 3, opacity: 0.9 },
      colorFilter: { brightness: 105, contrast: 115, saturation: 130, hueRotate: 0, blur: 0, lutPreset: "kodak2383" },
    },

    // --- T1: TITLES & KINETIC CAPTIONS ---
    {
      id: "t1-clip-1",
      trackId: "T1",
      role: "titles",
      type: "caption",
      name: "Title: Final Cut Pro Web",
      parentClipId: "v2-clip-1",
      startTime: 0.5,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "FINAL CUT PRO // WEB WORKSTATION",
        fontFamily: "Syne",
        fontSize: 54,
        color: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 4,
        bgPillColor: "rgba(10, 132, 255, 0.25)",
        stylePreset: "neonGlow",
        words: [
          { word: "FINAL", start: 0.5, end: 1.5 },
          { word: "CUT", start: 1.5, end: 2.2 },
          { word: "PRO", start: 2.2, end: 3.2 },
          { word: "WEB", start: 3.2, end: 4.5 },
        ]
      },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-2",
      trackId: "T1",
      role: "titles",
      type: "caption",
      name: "Title: Magnetic Timeline",
      parentClipId: "v2-clip-1",
      startTime: 5.0,
      duration: 4.0,
      trimStart: 0.0,
      trimEnd: 4.0,
      typography: {
        text: "MAGNETIC TIMELINE & SPEED RAMPING",
        fontFamily: "Plus Jakarta Sans",
        fontSize: 48,
        color: "#FF9F0A",
        strokeColor: "#000000",
        strokeWidth: 6,
        bgPillColor: "rgba(22, 22, 25, 0.9)",
        stylePreset: "hormozi",
        words: [
          { word: "MAGNETIC", start: 5.0, end: 6.0 },
          { word: "TIMELINE", start: 6.0, end: 7.2 },
          { word: "SPEED", start: 7.2, end: 8.0 },
          { word: "RAMPING", start: 8.0, end: 9.0 },
        ]
      },
      transform: { x: 0, y: 220, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-3",
      trackId: "T1",
      role: "titles",
      type: "caption",
      name: "Title: 4-Angle Multicam",
      parentClipId: "v2-clip-2",
      startTime: 10.0,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      typography: {
        text: "4-ANGLE MULTICAM & 3-WAY WHEELS",
        fontFamily: "Inter",
        fontSize: 46,
        color: "#FFFFFF",
        strokeColor: "#000000",
        strokeWidth: 2,
        bgPillColor: "transparent",
        stylePreset: "minimalCinema",
        words: [
          { word: "4-ANGLE", start: 10.0, end: 11.0 },
          { word: "MULTICAM", start: 11.0, end: 12.5 },
          { word: "WHEELS", start: 12.5, end: 14.5 },
        ]
      },
      transform: { x: 0, y: -260, scale: 1.0, rotation: 0, opacity: 1.0 },
    },
    {
      id: "t1-clip-4",
      trackId: "T1",
      role: "titles",
      type: "caption",
      name: "Title: Zero Lag Export",
      parentClipId: "v2-clip-3",
      startTime: 16.0,
      duration: 5.5,
      trimStart: 0.0,
      trimEnd: 5.5,
      typography: {
        text: "ZERO WATERMARKS • NATIVE SPEED",
        fontFamily: "Syne",
        fontSize: 52,
        color: "#30D158",
        strokeColor: "#0B0B0D",
        strokeWidth: 4,
        bgPillColor: "rgba(48, 209, 88, 0.2)",
        stylePreset: "neonGlow",
        words: [
          { word: "ZERO", start: 16.0, end: 17.2 },
          { word: "WATERMARKS", start: 17.2, end: 18.5 },
          { word: "NATIVE", start: 18.5, end: 19.8 },
          { word: "SPEED", start: 19.8, end: 21.5 },
        ]
      },
      transform: { x: 0, y: 150, scale: 1.0, rotation: 0, opacity: 1.0 },
    },

    // --- A1: DIALOGUE & MUSIC ---
    {
      id: "a1-clip-1",
      trackId: "A1",
      role: "music",
      type: "audio",
      name: "Cinematic Synth Soundtrack",
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
      role: "dialogue",
      type: "voiceover",
      name: "Dialogue: Welcome to Final Cut",
      parentClipId: "v2-clip-1",
      startTime: 1.0,
      duration: 4.2,
      trimStart: 0.0,
      trimEnd: 4.2,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText: "Welcome to Final Cut Pro Web Edition. Ultra-fast native speed video editing.",
        ttsVoice: "en-US",
        ttsRate: 1.0,
        ttsPitch: 1.0
      }
    },
    {
      id: "a1-clip-3",
      trackId: "A1",
      role: "music",
      type: "audio",
      name: "SFX: Whoosh Speed Transit",
      parentClipId: "v2-clip-1",
      startTime: 7.0,
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
      role: "dialogue",
      type: "voiceover",
      name: "Dialogue: Zero Lag Export",
      parentClipId: "v2-clip-3",
      startTime: 15.5,
      duration: 4.8,
      trimStart: 0.0,
      trimEnd: 4.8,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText: "Grade colors with 3-way wheels and export high bitrate videos with zero watermarks.",
        ttsVoice: "en-US",
        ttsRate: 1.0,
        ttsPitch: 1.0
      }
    }
  ]
};
