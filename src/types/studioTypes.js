/**
 * Apple Final Cut Pro (macOS) Types and Data Schemas
 * Official Pixel-Calibrated Colors and Exact Role Specs
 */

export const FCP_ROLES = [
  {
    id: "video",
    name: "Video",
    color: "#2B5B9E",
    headerColor: "#1D3F70",
    trackId: "V2",
    isAudio: false
  },
  {
    id: "titles",
    name: "Titles",
    color: "#6E4594",
    headerColor: "#4D2E6B",
    trackId: "T1",
    isAudio: false
  },
  {
    id: "dialogue",
    name: "Dialogue",
    color: "#266894",
    waveColor: "#4CA8E0",
    trackId: "A1",
    isAudio: true
  },
  {
    id: "music",
    name: "Music",
    color: "#217346",
    waveColor: "#42B874",
    trackId: "A1",
    isAudio: true
  },
  {
    id: "effects",
    name: "Effects",
    color: "#1B7A82",
    waveColor: "#3AC5D1",
    trackId: "A1",
    isAudio: true
  }
];

export const FCP_TOOLS = [
  { id: 'select', name: 'Select', shortcut: 'A', iconName: 'MousePointer' },
  { id: 'trim', name: 'Trim', shortcut: 'T', iconName: 'Scissors' },
  { id: 'position', name: 'Position', shortcut: 'P', iconName: 'Move' },
  { id: 'range', name: 'Range Selection', shortcut: 'R', iconName: 'ScanLine' },
  { id: 'blade', name: 'Blade', shortcut: 'B', iconName: 'Razor' },
  { id: 'zoom', name: 'Zoom', shortcut: 'Z', iconName: 'ZoomIn' },
  { id: 'hand', name: 'Hand', shortcut: 'H', iconName: 'Hand' }
];

export const MULTICAM_ANGLES = [
  { id: 1, name: "Angle 1 (Wide Master)", sceneType: "cyberGrid", color: "#2B5B9E" },
  { id: 2, name: "Angle 2 (Close-Up)", sceneType: "nebulaSpace", color: "#217346" },
  { id: 3, name: "Angle 3 (Overhead)", sceneType: "auroraFluid", color: "#F5A623" },
  { id: 4, name: "Angle 4 (B-Roll Action)", sceneType: "synthwaveSun", color: "#6E4594" }
];

export const PROCEDURAL_SCENES = [
  { id: 'cyberGrid', name: 'Cyber Grid Master', desc: 'Perspective neon master studio camera' },
  { id: 'nebulaSpace', name: 'Cosmic Starfield', desc: 'Deep space 3D particle camera' },
  { id: 'auroraFluid', name: 'Aurora Borealis', desc: 'Fluid procedural northern lights wave' },
  { id: 'synthwaveSun', name: 'Synthwave Horizon', desc: 'Retrowave glowing sun and horizon' },
  { id: 'matrixRain', name: 'Digital Stream', desc: 'High-speed matrix terminal data flow' }
];

export const LUT_PRESETS = [
  { id: 'none', name: 'None (Rec.709 Standard)', filter: '' },
  { id: 'tealOrange', name: 'Hollywood Teal & Orange', filter: 'contrast(125%) saturate(135%) hue-rotate(-10deg)' },
  { id: 'kodak2383', name: 'Kodak 2383 35mm Print', filter: 'contrast(115%) saturate(110%) sepia(20%)' },
  { id: 'fujiVelvia', name: 'Fujifilm Velvia 50', filter: 'contrast(130%) saturate(145%) brightness(102%)' },
  { id: 'noir', name: 'Arri Monochrome Noir', filter: 'grayscale(100%) contrast(150%)' },
  { id: 'goldenHour', name: 'Sunset Golden Hour', filter: 'sepia(35%) saturate(140%) brightness(105%)' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', filter: 'hue-rotate(90deg) saturate(180%) contrast(120%)' },
  { id: 'fujiChrome', name: 'Fuji Astia Chrome', filter: 'saturate(125%) contrast(110%)' },
  { id: 'bleachBypass', name: '90s Bleach Bypass', filter: 'contrast(160%) saturate(60%) brightness(95%)' },
  { id: 'vintage70s', name: 'Super 8 Warm Vintage', filter: 'sepia(45%) contrast(110%) saturate(90%) hue-rotate(-5deg)' },
  { id: 'technicolor', name: 'Technicolor 3-Strip', filter: 'saturate(170%) contrast(130%)' },
  { id: 'cinematicCool', name: 'Nordic Frost Cool', filter: 'hue-rotate(190deg) saturate(90%) contrast(115%)' },
  { id: 'monochromeContrast', name: 'Ansel Adams High B&W', filter: 'grayscale(100%) contrast(180%) brightness(90%)' },
  { id: 'warmEktachrome', name: 'Kodak Ektachrome Vivid', filter: 'contrast(120%) saturate(135%) brightness(104%)' },
  { id: 'pastelCinema', name: 'Wes Anderson Pastel', filter: 'saturate(85%) contrast(95%) brightness(110%) sepia(15%)' },
  { id: 'blockbusterAction', name: 'Action Blockbuster Punch', filter: 'contrast(140%) saturate(125%) brightness(98%)' },
  { id: 'sciFiMatrix', name: 'Sci-Fi Terminal Matrix', filter: 'hue-rotate(75deg) saturate(130%) contrast(125%)' }
];

export const FCP_EFFECT_CATEGORIES = [
  {
    category: "Basics",
    items: [
      { id: "keyer", name: "Keyer (Chroma)", desc: "1-Click green/blue screen removal" },
      { id: "colorCorrection", name: "Color Correction", desc: "Native FCP 3-way color grade" },
      { id: "broadcastSafe", name: "Broadcast Safe", desc: "Clamps IRE luma levels to 0-100" }
    ]
  },
  {
    category: "Blur",
    items: [
      { id: "gaussianBlur", name: "Gaussian Blur", desc: "Smooth cinema lens defocus" },
      { id: "directionalBlur", name: "Directional Blur", desc: "Linear motion speed blur" },
      { id: "prismBlur", name: "Prism Blur", desc: "Chromatic aberration optical distortion" }
    ]
  },
  {
    category: "Color & LUTs",
    items: [
      { id: "tealOrange", name: "Hollywood Teal & Orange", desc: "Blockbuster complementary color grade" },
      { id: "kodak2383", name: "Kodak 2383 Film Print", desc: "Classic 35mm photochemical film look" },
      { id: "noir", name: "Arri Monochrome Noir", desc: "Deep contrast black and white cinema" },
      { id: "goldenHour", name: "Golden Hour Glow", desc: "Warm amber sunset illumination" }
    ]
  },
  {
    category: "Distortion",
    items: [
      { id: "lensDistort", name: "Fisheye Lens", desc: "Curved optical lens distortion" },
      { id: "glitchWarp", name: "Glitch Scanlines", desc: "Digital compression artifact glitch" }
    ]
  }
];

export const FCP_TRANSITION_CATEGORIES = [
  {
    category: "Dissolves",
    items: [
      { id: "crossDissolve", name: "Cross Dissolve", desc: "Smooth standard dissolve (Default)" },
      { id: "fadeToBlack", name: "Dip to Black", desc: "Classic cinema fade to black" },
      { id: "fadeToWhite", name: "Dip to White", desc: "High-exposure white flash impact" }
    ]
  },
  {
    category: "Movements",
    items: [
      { id: "pushSlide", name: "Slide Right", desc: "Incoming scene pushes previous scene" },
      { id: "zoomPunch", name: "Zoom In Punch", desc: "Energetic optical crash zoom" }
    ]
  },
  {
    category: "Wipes",
    items: [
      { id: "bandWipe", name: "Directional Wipe", desc: "Crisp horizontal wipe bar reveal" },
      { id: "clockWipe", name: "Clock Wipe", desc: "360-degree radial clock transition" }
    ]
  }
];

export const AUDIO_EQ_PRESETS = [
  { id: 'flat', name: 'Flat Reference', low: 0, mid: 0, high: 0 },
  { id: 'voiceEnhance', name: 'Voice Enhance', low: -3, mid: 4.5, high: 3 },
  { id: 'musicEnhance', name: 'Music Enhance', low: 3.5, mid: 1, high: -1.5 },
  { id: 'loudness', name: 'Loudness Booster', low: 4.0, mid: -1.5, high: 3.5 },
  { id: 'humRemoval', name: 'Hum Removal (60Hz)', low: -12, mid: 0, high: 0 }
];

export const BLEND_MODES = [
  { id: "normal", name: "Normal" },
  { id: "add", name: "Add" },
  { id: "subtract", name: "Subtract" },
  { id: "multiply", name: "Multiply" },
  { id: "screen", name: "Screen" },
  { id: "overlay", name: "Overlay" },
  { id: "hardLight", name: "Hard Light" },
  { id: "softLight", name: "Soft Light" }
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

export function parseSmpteTimecode(str, fps = 30) {
  if (!str) return 0;
  // Handle relative input: e.g. "+100" or "+10" (frames)
  if (str.startsWith('+') || str.startsWith('-')) {
    const isNegative = str.startsWith('-');
    const val = parseInt(str.slice(1), 10) || 0;
    return (isNegative ? -val : val) / fps;
  }
  // Standard timecode: HH:MM:SS:FF or HHMMSSFF
  const clean = str.replace(/[^0-9:]/g, '');
  if (clean.includes(':')) {
    const parts = clean.split(':').map((p) => parseInt(p, 10) || 0);
    if (parts.length === 4) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2] + parts[3] / fps;
    }
    if (parts.length === 3) {
      return parts[0] * 60 + parts[1] + parts[2] / fps;
    }
  } else {
    // 8 digits: HHMMSSFF
    const padded = clean.padStart(8, '0');
    const hrs = parseInt(padded.slice(0, 2), 10);
    const mins = parseInt(padded.slice(2, 4), 10);
    const secs = parseInt(padded.slice(4, 6), 10);
    const frames = parseInt(padded.slice(6, 8), 10);
    return hrs * 3600 + mins * 60 + secs + frames / fps;
  }
  return 0;
}
