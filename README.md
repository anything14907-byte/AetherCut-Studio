# AetherCut Studio 🎬✨
### The 100% Free, Client-Side AI Video Creation & Multi-Track NLE

[![Built with React](https://img.shields.io/badge/Built%20with-React%2018-00F2FE?style=flat-square)](https://react.dev/)
[![Engine](https://img.shields.io/badge/Engine-HTML5%20Canvas%202D%20%2B%20WebCodecs-8A2BE2?style=flat-square)](#)
[![Audio](https://img.shields.io/badge/Audio-Web%20Audio%20API%20%2B%20Web%20Speech-10B981?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-100%25%20Free%20%26%20Open%20Access-FF007A?style=flat-square)](#)

> **No Subscriptions. No Watermarks. No Credit Systems. No Server Latency.**  
> AetherCut Studio is a production-grade non-linear video editor and generative AI co-director running 100% client-side in modern web browsers.

---

## 🌌 The "Obsidian Cinema" Aesthetic
AetherCut Studio features a custom spatial glassmorphic dark interface designed for immersion:
- **Obsidian Voids:** `#07080C` ultra-deep canvas backdrop with `#0C0E15` and `#11131A` elevated slate docks.
- **Hairline Precision:** `rgba(255, 255, 255, 0.08)` borders with ambient glow highlights.
- **Electric Neon Accents:** Cyan (`#00F2FE`) to Violet (`#8A2BE2`) gradients with Emerald (`#10B981`) and Amber highlights.
- **Typography:** *Plus Jakarta Sans* & *Inter* for crisp UI ergonomics, and *JetBrains Mono* for SMPTE timecodes (`00:00:00:00`) and frame counters.

---

## ⚡ Key Architectural Modules

### 1. Dual-View SPA Architecture
- **Interactive Showcase Landing View:**
  - Hero command bar: **"Direct Your Video with AI"** with instant aspect ratio switcher (`16:9`, `9:16`, `1:1`), visual style pills, and quick suggestion prompts.
  - Interactive Bento Showcase: AI Director Co-Pilot demo, 4-Track Timeline precision, live Hormozi word-by-word active caption preview, and hardware-accelerated client-side rendering breakdown.
  - Open-Access Pledge Banner guaranteeing zero watermarks forever.
- **Studio Workspace View:**
  - Full non-linear editor with 4 professional zones, pre-loaded with a rich cyberpunk demo project so you can hit `Space` and watch it play immediately.

### 2. Zone A: Left Dock & Asset Drawer
- **AI Director Chat ("Co-Pilot"):** Natural language command parser (`"Split clip at 00:05"`, `"Add bold yellow kinetic captions: <prompt>"`, `"Apply cyberpunk color grade"`, `"Change background music to ambient drone"`, `"Generate a 4-scene script about space exploration"`). Mutates timeline state in real time with an intelligent offline procedural generator and optional BYO API key modal (Gemini / OpenAI / Pexels).
- **Media Library & Upload:** Drag-and-drop local video, image, and audio files stored in browser memory, plus procedural 60fps canvas scenes (*Cyberpunk 3D Grid*, *Deep Space Nebula*, *Obsidian Aurora*, *Matrix Data Stream*, *Retro Sunset Horizon*).
- **Text & Kinetic Captions:** Hormozi-style active word highlighting, Electric Neon Glow, Minimal Cinema uppercase, and Bold Impact presets.
- **Voiceover & Audio Suite:** Browser-native Web Speech API Text-to-Speech generator (pitch/speed controls) + procedural Web Audio API synthesizers and cinematic sound effects (*Whoosh*, *Sub Bass Drop Impact*, *Riser*, *Glitch*).
- **Transitions & FX:** One-click color grading LUTs (*Cyberpunk Neon*, *Teal & Orange*, *Film Noir B&W*, *Vintage Kodak 35mm*, *Matrix Terminal*).

### 3. Zone B: Center Real-Time Canvas Viewport
- **HTML5 Canvas 60fps Compositor:** Real-time multi-track compositor blending V2 (main visual), V1 (PIP overlay), and T1 (kinetic text overlays).
- **Interactive On-Canvas Drag Controls:** Click any clip to reveal interactive bounding boxes and drag to reposition directly on canvas.
- **Transport Bar:** Play/Pause (`Space`), Frame Step Back (`Left Arrow`), Frame Step Forward (`Right Arrow`), SMPTE timecode (`00:00:00:00`), Loop toggle, and Aspect Ratio switcher (`16:9`, `9:16`, `1:1`).

### 4. Zone C: Right Context-Aware Inspector
- **Transform & Framing:** Scale, X/Y Offset, Rotation angle, and Opacity.
- **Color Grading:** Brightness, Contrast, Saturation, Lens Blur, and LUT pills.
- **Typography:** Font family, font size, text color, stroke color/width, background pill, and kinetic style.
- **Audio Controls:** Volume gain (`0%` to `200%`), Fade In / Fade Out durations.
- **Project Properties:** Canvas dimensions, frame rate, and total project duration.

### 5. Zone D: Bottom Multi-Track Timeline Engine
- **4 Dedicated Tracks:**
  1. `T1: Text & Captions` (Violet `#8A2BE2`)
  2. `V1: Overlay / PIP Media` (Cyan `#00F2FE`)
  3. `V2: Main Video / Scene Visuals` (Blue `#3B82F6`)
  4. `A1: Voiceover & Music` (Emerald `#10B981` with live canvas waveform visualization)
- **Precision Tools:** Red draggable playhead, ruler scrubbing, clip dragging, left/right trim handles, Split at Playhead (`S`), Duplicate (`D`), Delete (`Del`), Timeline Zoom slider, and complete Undo/Redo history stack (`Ctrl+Z` / `Ctrl+Y`).

### 6. Client-Side Video Export (Zero Watermark)
- Direct in-browser export engine:
  - Binds `canvas.captureStream(30)` and taps the Web Audio API audio destination stream.
  - Encodes through `MediaRecorder` at high-bitrate WebM (`video/webm;codecs=vp9,opus` / `vp8`).
  - Displays live rendering progress modal with frame counter, preview canvas, remaining seconds estimation, and automatic download directly to user's device.
- Portable Project Save/Load: Auto-saves to `localStorage` and supports export/import of portable `.aether.json` project backups.

---

## 🎨 Single Config Brand Customization

All branding, product names, logos, colors, and legal pledges are centrally configured in **`src/config/brandConfig.js`**:

```javascript
// src/config/brandConfig.js
export const BRAND_CONFIG = {
  name: "AetherCut Studio",
  shortName: "AetherCut",
  logoText: "AetherCut",
  logoTag: "STUDIO",
  tagline: "100% Free AI Video Creation & Multi-Track NLE",
  version: "v2.5.0-PRO-FREE",
  // Modify brand colors, aspect ratios, and pledges here!
};
```
Change the values in this single file to rebrand the entire application instantly!

---

## ⌨️ Keyboard Shortcuts Cheat Sheet

| Key Shortcut | Action |
|---|---|
| `Space` | Play / Pause timeline playback |
| `S` | Split clip at current playhead position |
| `D` | Duplicate selected clip |
| `Delete` / `Backspace` | Delete selected clip |
| `Cmd` / `Ctrl` + `Z` | Undo last edit action |
| `Cmd` / `Ctrl` + `Y` | Redo action |
| `←` / `→` | Step playhead back / forward 1 frame |
| `Shift` + `←` / `→` | Step playhead back / forward 1 second |
| `Escape` | Deselect active clip |
| `?` | Toggle keyboard shortcuts modal |

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🌐 Static Deployment Guide

AetherCut Studio compiles down to 100% static HTML, CSS, and JavaScript. It can be hosted on any static hosting provider or CDN for free:

### 1. Vercel
1. Push your repository to GitHub.
2. In the Vercel Dashboard, click **New Project** and select the repository.
3. Configure build settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**.

### 2. Cloudflare Pages
1. In the Cloudflare Dashboard, go to **Workers & Pages** → **Create application** → **Pages**.
2. Connect your Git repository.
3. Set build configuration:
   - **Framework preset:** `Vite`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **Save and Deploy**. Custom domains and SSL certificates are provisioned automatically.

### 3. GitHub Pages
1. In `vite.config.js`, set `base: './'`.
2. Run `npm run build`.
3. Deploy the `dist` folder via `gh-pages` branch or GitHub Actions workflow (`actions/deploy-pages`).

---

## 🛡️ License & Open-Access Guarantee
AetherCut Studio is licensed for free and unrestricted creative use. All exported videos belong 100% to the creator without watermarks, attribution requirements, or licensing royalties.

