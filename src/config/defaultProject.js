/**
 * Default Pre-Loaded Demo Project — Apple Final Cut Pro (macOS) Exact Specification
 * Multi-Role Storyline:
 * - Primary Storyline V2 (Magnetic, 0 unwanted gaps)
 * - Connected 2D/3D Titles T1 (#6E4594 Purple) with vertical tether stem
 * - Connected B-Roll V1 (#2B5B9E Blue) with vertical tether stem
 * - Connected Dialogue A1 (#266894 Dodger Blue) & Music A1 (#217346 Emerald Green)
 * - 50% Slow-Motion Retime Clip (Orange Retime Bar)
 * - Clip Audition take badge (1/3)
 * - Markers (M)
 */

export const DEFAULT_DEMO_PROJECT = {
  id: "fcp-project-2026",
  title: "Apple Final Cut Pro — 1080p HD 60p",
  duration: 22.0,
  fps: 30,
  aspectRatio: "16:9",
  width: 1920,
  height: 1080,
  masterVolume: 1.0,
  markers: [
    { id: "m1", time: 2.5, label: "Hero Intro", color: "#0A84FF", type: "standard" },
    { id: "m2", time: 7.5, label: "50% Slow-Mo Retime", color: "#FF9F0A", type: "chapter" },
    { id: "m3", time: 15.0, label: "Audio Climax", color: "#30D158", type: "todo" }
  ],
  clips: [
    // --- PRIMARY STORYLINE (SPINE - TRACKLESS SHELF) ---
    {
      id: "v2-clip-1",
      trackId: "V2",
      role: "video",
      name: "Cyber Grid Master Take",
      startTime: 0.0,
      duration: 7.5,
      trimStart: 0.0,
      trimEnd: 7.5,
      sceneType: "cyberGrid",
      multicamAngle: 1,
      speedRamp: { speed: 1.0, isRamped: false },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: "normal" },
      colorFilter: {
        exposure: 0.1,
        contrast: 1.15,
        saturation: 1.25,
        lutPreset: "tealOrange",
        shadows: { hue: 200, sat: 20, luma: -5 },
        midtones: { hue: 35, sat: 18, luma: 2 },
        highlights: { hue: 45, sat: 10, luma: 6 }
      },
      // Clip Auditions (Alternative takes in-place)
      auditions: [
        { name: "Cyber Grid Master Take", sceneType: "cyberGrid" },
        { name: "Cosmic Starfield Take 2", sceneType: "nebulaSpace" },
        { name: "Synthwave Horizon Take 3", sceneType: "synthwaveSun" }
      ],
      activeAuditionIndex: 0
    },
    {
      id: "v2-clip-2",
      trackId: "V2",
      role: "video",
      name: "Nebula Warp (50% Slow-Mo)",
      startTime: 7.5,
      duration: 7.5,
      trimStart: 0.0,
      trimEnd: 7.5,
      sceneType: "nebulaSpace",
      multicamAngle: 2,
      // FCP Retiming: 50% Slow Motion
      speedRamp: { speed: 0.5, label: "50% Slow", isRamped: true, isReversed: false },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: "normal" },
      colorFilter: {
        exposure: -0.05,
        contrast: 1.2,
        saturation: 1.35,
        lutPreset: "none",
        shadows: { hue: 240, sat: 25, luma: -8 },
        midtones: { hue: 270, sat: 20, luma: 4 },
        highlights: { hue: 180, sat: 15, luma: 8 }
      }
    },
    {
      id: "v2-clip-3",
      trackId: "V2",
      role: "video",
      name: "Aurora Finale Shot",
      startTime: 15.0,
      duration: 7.0,
      trimStart: 0.0,
      trimEnd: 7.0,
      sceneType: "auroraFluid",
      multicamAngle: 3,
      speedRamp: { speed: 1.0, isRamped: false },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: "normal" },
      colorFilter: {
        exposure: 0.05,
        contrast: 1.1,
        saturation: 1.4,
        lutPreset: "goldenHour",
        shadows: { hue: 190, sat: 20, luma: -4 },
        midtones: { hue: 30, sat: 22, luma: 4 },
        highlights: { hue: 50, sat: 12, luma: 12 }
      }
    },

    // --- CONNECTED TITLES (ABOVE PRIMARY STORYLINE - PURPLE #6E4594) ---
    {
      id: "t1-title-1",
      trackId: "T1",
      role: "titles",
      name: "Final Cut Pro 3D Title",
      parentClipId: "v2-clip-1", // Tethered to clip 1
      startTime: 0.8,
      duration: 4.2,
      trimStart: 0.0,
      trimEnd: 4.2,
      textOverlay: {
        text: "FINAL CUT PRO",
        subtext: "Apple Native macOS Web Edition",
        fontFamily: "Inter",
        fontSize: 52,
        color: "#FFFFFF",
        animation: "fade"
      },
      transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 }
    },
    {
      id: "t1-title-2",
      trackId: "T1",
      role: "titles",
      name: "Lower Third Director",
      parentClipId: "v2-clip-2", // Tethered to clip 2
      startTime: 8.5,
      duration: 3.8,
      trimStart: 0.0,
      trimEnd: 3.8,
      textOverlay: {
        text: "DIRECTOR // WORKSTATION",
        subtext: "Lock 60 FPS · 0% Idle CPU",
        fontFamily: "JetBrains Mono",
        fontSize: 38,
        color: "#F5A623",
        animation: "slide"
      },
      transform: { x: 0, y: 160, scale: 0.85, rotation: 0, opacity: 1.0 }
    },

    // --- CONNECTED B-ROLL / PIP OVERLAYS (BLUE #2B5B9E) ---
    {
      id: "v1-broll-1",
      trackId: "V1",
      role: "video",
      name: "Matrix Stream (Connected B-Roll)",
      parentClipId: "v2-clip-1",
      startTime: 2.0,
      duration: 4.5,
      trimStart: 0.0,
      trimEnd: 4.5,
      sceneType: "matrixRain",
      transform: { x: 480, y: -220, scale: 0.38, rotation: 0, opacity: 0.95, blendMode: "screen" },
      colorFilter: { exposure: 0, contrast: 1.2, saturation: 1.5, lutPreset: "none" }
    },

    // --- CONNECTED AUDIO LANES (BELOW PRIMARY STORYLINE) ---
    // Dialogue Role (Dodger Blue #266894)
    {
      id: "a1-dialogue-1",
      trackId: "A1",
      role: "dialogue",
      name: "Studio Voiceover (Dialogue Stem)",
      parentClipId: "v2-clip-1",
      startTime: 0.5,
      duration: 6.5,
      trimStart: 0.0,
      trimEnd: 6.5,
      audio: {
        volume: 1.1,
        pan: 0,
        fadeIn: 0.2,
        fadeOut: 0.3,
        voiceIsolation: true,
        sfxType: "voice"
      }
    },
    // Music Role (Emerald Green #217346)
    {
      id: "a1-music-1",
      trackId: "A1",
      role: "music",
      name: "Cinematic Synth Soundtrack (BGM)",
      parentClipId: "v2-clip-1",
      startTime: 0.0,
      duration: 22.0,
      trimStart: 0.0,
      trimEnd: 22.0,
      audio: {
        volume: 0.85,
        pan: 0,
        fadeIn: 0.5,
        fadeOut: 1.0,
        autoDuck: true,
        sfxType: "music"
      }
    },
    // Sound Effects Role (Teal #1B7A82)
    {
      id: "a1-sfx-1",
      trackId: "A1",
      role: "effects",
      name: "Whoosh Transition Impact (SFX)",
      parentClipId: "v2-clip-2",
      startTime: 7.2,
      duration: 2.0,
      trimStart: 0.0,
      trimEnd: 2.0,
      audio: {
        volume: 1.0,
        pan: 0,
        fadeIn: 0.1,
        fadeOut: 0.4,
        sfxType: "sfx"
      }
    }
  ]
};
