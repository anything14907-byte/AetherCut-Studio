/**
 * Studio Types and Data Schemas (Apple Final Cut Pro Web Edition)
 */

export const FCP_ROLES = [
  { id: "video", name: "Primary Video", color: "#0A84FF", trackId: "V2" },
  { id: "b_roll", name: "B-Roll / PIP", color: "#64D2FF", trackId: "V1" },
  { id: "titles", name: "Titles & Captions", color: "#BF5AF2", trackId: "T1" },
  { id: "dialogue", name: "Dialogue & Voice", color: "#30D158", trackId: "A1" },
  { id: "music", name: "Music & Effects", color: "#5E5CE6", trackId: "A1" }
];

export const TRACK_CONFIGS = [
  {
    id: "T1",
    name: "Titles & Captions",
    type: "text",
    color: "#BF5AF2", // Apple Pro Violet
    badge: "T1",
    role: "titles",
    description: "Final Cut Titles, Lower Thirds & Kinetic Captions",
    muted: false,
    locked: false,
  },
  {
    id: "V1",
    name: "Connected B-Roll",
    type: "overlay",
    color: "#64D2FF", // Apple Pro Light Blue
    badge: "V1",
    role: "b_roll",
    description: "Connected B-Roll, Cutaways & Overlays",
    muted: false,
    locked: false,
  },
  {
    id: "V2",
    name: "Primary Storyline",
    type: "video",
    color: "#0A84FF", // Apple Pro Deep Blue
    badge: "V2",
    role: "video",
    description: "Magnetic Primary Storyline (Multicam Angle 1-4)",
    muted: false,
    locked: false,
  },
  {
    id: "A1",
    name: "Audio & Music",
    type: "audio",
    color: "#30D158", // Apple Pro Green
    badge: "A1",
    role: "dialogue",
    description: "Dialogue, Voiceover, Sound Effects & Music",
    muted: false,
    locked: false,
  },
];

export const MULTICAM_ANGLES = [
  { id: 1, name: "Angle 1: Wide Master", sceneType: "cyberGrid", color: "#0A84FF" },
  { id: 2, name: "Angle 2: Medium Shot", sceneType: "nebulaSpace", color: "#30D158" },
  { id: 3, name: "Angle 3: Close-Up", sceneType: "auroraFluid", color: "#FF9F0A" },
  { id: 4, name: "Angle 4: B-Roll Action", sceneType: "synthwaveSun", color: "#BF5AF2" }
];

export const PROCEDURAL_SCENES = [
  { id: 'cyberGrid', name: 'Cyber Grid Neon', desc: 'Synthesizer perspective 3D neon floor grid' },
  { id: 'nebulaSpace', name: 'Cosmic Starfield', desc: 'Deep space 3D starfield particles' },
  { id: 'auroraFluid', name: 'Aurora Borealis', desc: 'Fluid procedural northern lights wave' },
  { id: 'synthwaveSun', name: 'Synthwave Sun Horizon', desc: 'Retrowave glowing sun and horizon' },
  { id: 'studioMesh', name: 'Obsidian Studio Mesh', desc: 'Minimal dark Apple Pro geometric motion' }
];

export const CAPTION_STYLES = [
  { id: 'hormozi', name: 'Hormozi Bold Yellow', desc: 'Active word highlighted in vibrant yellow' },
  { id: 'neonGlow', name: 'Neon Electric Glow', desc: 'Pulsing cyan-violet neon text' },
  { id: 'minimalCinema', name: 'Minimal Cinema', desc: 'Crisp serif typography with letter spacing' },
  { id: 'boldImpact', name: 'Bold Impact', desc: 'Heavy uppercase text with black outline' }
];

export const TRANSITIONS = [
  { id: "crossDissolve", name: "Cross Dissolve", description: "Smooth standard dissolve between clips" },
  { id: "fadeToBlack", name: "Fade to Black", description: "Classic cinematic dip to black" },
  { id: "zoomPunch", name: "Zoom Punch", description: "Energetic fast optical zoom transition" },
  { id: "wipe", name: "Directional Wipe", description: "Horizontal wipe reveal" },
  { id: "slide", name: "Push Slide", description: "Next scene slides in from right" },
  { id: "flash", name: "White Flash Impact", description: "High-exposure white burst transition" }
];

export const TRANSITION_PRESETS = TRANSITIONS;

export const BLEND_MODES = [
  { id: "normal", name: "Normal" },
  { id: "screen", name: "Screen" },
  { id: "multiply", name: "Multiply" },
  { id: "overlay", name: "Overlay" },
  { id: "lighten", name: "Lighten" },
  { id: "darken", name: "Darken" }
];

export const LUT_PRESETS = [
  { id: 'none', name: 'Rec.709 Natural', filter: '' },
  { id: 'tealOrange', name: 'Hollywood Teal & Orange', filter: 'contrast(1.25) saturate(1.4) sepia(0.25) hue-rotate(160deg)' },
  { id: 'kodak2383', name: 'Kodak 2383 Film Print', filter: 'contrast(1.2) saturate(1.15) sepia(0.18)' },
  { id: 'fujiEterna', name: 'Fuji Eterna Soft Cine', filter: 'contrast(1.05) saturate(1.1) brightness(1.02)' },
  { id: 'noir', name: 'Arri Monochrome Noir', filter: 'grayscale(1) contrast(1.6) brightness(0.95)' },
  { id: 'goldenHour', name: 'Warm Golden Hour', filter: 'sepia(0.3) saturate(1.3) contrast(1.1) brightness(1.04)' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', filter: 'contrast(1.3) saturate(1.8) hue-rotate(-20deg) brightness(1.05)' },
];

export const AUDIO_EQ_PRESETS = [
  { id: 'flat', name: 'Flat Reference', low: 0, mid: 0, high: 0 },
  { id: 'voiceEnhance', name: 'Voice Enhance', low: -3, mid: 4.5, high: 3 },
  { id: 'musicWarmth', name: 'Music Warmth', low: 3.5, mid: 1, high: -1.5 },
  { id: 'bassBoost', name: 'Bass Boost', low: 6.5, mid: -2, high: 1 },
  { id: 'trebleCrisp', name: 'Treble Crisp', low: -2, mid: 1, high: 5 },
  { id: 'podcast', name: 'Broadcast Podcast', low: -4, mid: 3, high: 2 }
];

export const TITLE_TEMPLATES = [
  { id: "centerTitle", name: "Cinematic Center Title", style: "neonGlow", text: "FINAL CUT PRO WEB", duration: 4.0 },
  { id: "lowerThird", name: "Pro Lower Third", style: "minimalCinema", text: "DIRECTOR // FINAL CUT PRO", duration: 4.0 },
  { id: "kineticHook", name: "Hormozi Kinetic Captions", style: "hormozi", text: "ZERO LAG NATIVE SPEED EDITING", duration: 3.5 },
  { id: "minimalChapter", name: "Minimal Chapter Header", style: "minimalCinema", text: "CHAPTER 01 // OVERVIEW", duration: 4.0 },
  { id: "boldImpact", name: "Bold Impact Title", style: "boldImpact", text: "100% FREE • ZERO WATERMARKS", duration: 3.0 }
];

export function formatSmpteTimecode(seconds, fps = 30) {
  const safeSec = Math.max(0, seconds || 0);
  const totalFrames = Math.floor(safeSec * fps);
  const hrs = Math.floor(totalFrames / (fps * 3600));
  const mins = Math.floor((totalFrames % (fps * 3600)) / (fps * 60));
  const secs = Math.floor((totalFrames % (fps * 60)) / fps);
  const frames = totalFrames % fps;

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
}
