/**
 * Studio Types and Data Schemas (Final Cut Pro Studio Edition)
 */

export const TRACK_CONFIGS = [
  {
    id: "T1",
    name: "Titles & Captions",
    type: "text",
    color: "#BF5AF2", // Apple Pro Violet
    badge: "T1",
    description: "Kinetic Captions, Lower Thirds & 3D Titles",
    muted: false,
    locked: false,
  },
  {
    id: "V1",
    name: "Connected B-Roll / PIP",
    type: "overlay",
    color: "#64D2FF", // Apple Pro Light Blue
    badge: "V1",
    description: "Cutaways, Overlays, Motion Graphics & Stickers",
    muted: false,
    locked: false,
  },
  {
    id: "V2",
    name: "Primary Storyline",
    type: "video",
    color: "#0A84FF", // Apple Pro Deep Blue
    badge: "V2",
    description: "Magnetic Primary Storyline & Base Camera Visuals",
    muted: false,
    locked: false,
  },
  {
    id: "A1",
    name: "Audio & Music",
    type: "audio",
    color: "#30D158", // Apple Pro Green
    badge: "A1",
    description: "Voiceover, Synths, Sound FX & Auto-Ducking Music",
    muted: false,
    locked: false,
  },
];

export const LUT_PRESETS = [
  { id: 'none', label: 'Rec.709 Natural', filter: '' },
  { id: 'tealOrange', label: 'Hollywood Teal & Orange', filter: 'contrast(1.25) saturate(1.4) sepia(0.25) hue-rotate(160deg)' },
  { id: 'cyberpunk', label: 'Cyberpunk Neon', filter: 'contrast(1.3) saturate(1.8) hue-rotate(-20deg) brightness(1.05)' },
  { id: 'noir', label: 'Arri Monochrome Noir', filter: 'grayscale(1) contrast(1.6) brightness(0.95)' },
  { id: 'vintageKodak', label: 'Kodak 5219 35mm', filter: 'sepia(0.35) contrast(1.15) saturate(1.2) brightness(1.02)' },
  { id: 'matrix', label: 'Matrix Terminal', filter: 'hue-rotate(85deg) saturate(2.0) contrast(1.4)' },
];

export const AUDIO_EQ_PRESETS = [
  { id: 'flat', name: 'Flat Reference', low: 0, mid: 0, high: 0 },
  { id: 'studioVocal', name: 'Studio Vocal', low: -3, mid: 4, high: 2.5 },
  { id: 'warmCinema', name: 'Warm Cinema', low: 3.5, mid: 1, high: -1 },
  { id: 'deepBass', name: 'Deep Bass Punch', low: 6, mid: -2, high: 1 },
  { id: 'lofiPhone', name: 'Lo-Fi Telephone', low: -12, mid: 6, high: -8 },
];

export const CAPTION_STYLES = [
  { id: 'hormozi', name: 'Hormozi Kinetic', desc: 'Active spoken word pops in bold yellow/green with dark drop pill' },
  { id: 'neonGlow', name: 'Electric Neon', desc: 'Glowing electric cyan text with violet halo' },
  { id: 'minimalCinema', name: 'Minimal Cinema', desc: 'Clean tracked uppercase sans-serif with subtle drop shadow' },
  { id: 'boldImpact', name: 'Bold Impact', desc: 'Heavy white lettering with heavy black stroke' },
];

export const PROCEDURAL_SCENES = [
  { id: 'cyberGrid', name: 'Cyberpunk 3D Grid', desc: 'Infinite neon wireframe landscape with pulsing horizon' },
  { id: 'nebulaSpace', name: 'Deep Space Nebula', desc: 'Cosmic starfield with floating chromatic dust clouds' },
  { id: 'auroraFluid', name: 'Obsidian Aurora', desc: 'Flowing iridescent gradient waves and liquid light' },
  { id: 'matrixRain', name: 'Matrix Data Stream', desc: 'Cascading digital glyphs and glowing green terminals' },
  { id: 'synthwaveSun', name: 'Retro Sunset Horizon', desc: 'Neon sun with gradient sky and moving ground plane' },
];

export const PROCEDURAL_AUDIO_TRACKS = [
  { id: 'synthwaveBgm', name: 'Cyberpunk Dark Synth', bpm: 120, key: 'Cm', type: 'bgm', desc: 'Pumping bassline with arpeggiated synth leads' },
  { id: 'ambientDrone', name: 'Cinematic Ambient Drone', bpm: 75, key: 'Dm', type: 'bgm', desc: 'Deep cosmic atmospheric pads and subtle risers' },
  { id: 'techPulse', name: 'Tech Upbeat Pulse', bpm: 128, key: 'Am', type: 'bgm', desc: 'Energetic modern tech beat for product teasers' },
  { id: 'lofiChill', name: 'Obsidian Lo-Fi Beats', bpm: 85, key: 'Fm', type: 'bgm', desc: 'Warm vinyl crackle with smooth melodic chords' },
];

export const PROCEDURAL_SFX = [
  { id: 'sfxWhoosh', name: 'Cinematic Whoosh', duration: 1.2, desc: 'Aerodynamic fast transit transition effect' },
  { id: 'sfxImpact', name: 'Sub Bass Drop Impact', duration: 2.0, desc: 'Deep earth-shaking cinematic hit' },
  { id: 'sfxRiser', name: 'Tension Riser', duration: 3.0, desc: 'High-frequency pitch builder before drop' },
  { id: 'sfxGlitch', name: 'Digital Glitch Chirp', duration: 0.6, desc: 'Electromagnetic static burst' },
];
