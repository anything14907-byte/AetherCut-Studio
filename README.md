# AetherCut Studio 2.0 // Final Cut Pro Studio Edition 🎬⚡
### 100% Free, Client-Side AI Video Creation & Non-Linear Editor

[![Version](https://img.shields.io/badge/Version-v2.0%20Final%20Cut%20Pro%20Edition-0A84FF?style=flat-square)](#)
[![Built with React](https://img.shields.io/badge/Built%20with-React%2018%20%2B%20Vite-00F2FE?style=flat-square)](https://react.dev/)
[![Engine](https://img.shields.io/badge/Engine-60fps%20HTML5%20Compositor%20%2B%20WebCodecs-8A2BE2?style=flat-square)](#)
[![Audio](https://img.shields.io/badge/Audio-Stereo%20dBFS%20%2B%20Voice%20Isolation-30D158?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-100%25%20Free%20%26%20Open%20Access-FF9F0A?style=flat-square)](#)

> **No Subscriptions. No Watermarks. No Credit Systems. No Cloud Latency.**  
> AetherCut Studio 2.0 brings Apple Final Cut Pro-grade ergonomics, calibrated anodized dark theme (`#0B0B0D`), magnetic timeline physics, live hover skimming, 3-way circular color wheels, and real-time video scopes directly to your web browser.

---

## 🌟 What's New in Version 2.0 ("Final Cut Pro Studio Edition")

### 1. Apple Final Cut Pro Calibrated Anodized Dark Theme
- **Pro Display Palette:** `#0B0B0D` reference background, `#161619` panel surfaces with top specular borders (`rgba(255, 255, 255, 0.08)`) and `#242429` precision dividers.
- **Iconic Amber/Gold Clip Selection:** Active clips highlight in `2px solid #FF9F0A` with 6px rounded corners and subtle outer glow.
- **Dual Playhead & Skimmer:** Solid white parked playhead (`#FFFFFF`) alongside an ultra-responsive red live hover skimmer (`#FF453A`) with floating SMPTE timecode tooltips.
- **Jitter-Free Typography:** Forced `tabular-nums` and `JetBrains Mono` across all frame counters, SMPTE timecodes (`00:00:00:00`), dB meters, and numeric scrub inputs.

### 2. Resizable 4-Zone Workspace & Segmented Switcher
- **Smooth Drag-Resize Dividers:** Adjust panel widths and timeline height on the fly.
- **Workspace Switcher:** Instant 1-click modes in the top bar: `Edit` | `Color & Scopes` | `Audio Mixing` | `AI Co-Director`.
- **Spotlight Command HUD (`Cmd/Ctrl + K`):** Quick-launch floating palette for instant fuzzy-search actions (*"Blade All at Playhead"*, *"Toggle Magnetic Timeline"*, *"Open Video Scopes"*, *"Apply Teal & Orange LUT"*, *"Auto-Duck Audio"*, *"Export Video"*).

### 3. Magnetic Timeline, Live Skimming & Tactile Jog Wheel
- **Filmstrip Frame Thumbnails:** Clips on `V1` and `V2` display repeating multi-frame filmstrip backgrounds.
- **Magnetic Timeline (`M` key):** Ripple-delete and trim automatically snaps subsequent clips together on the Primary Storyline (`V2`) with zero black gaps.
- **Connected Storyline Stems:** Visual vertical tether lines connect titles (`T1`) and audio (`A1`) to their parent `V2` clip so they stay perfectly in sync during edits.
- **Live Hover Skimming (`S` key):** Move your cursor over timeline tracks to preview frames instantly on the canvas without dislodging the parked playhead.
- **Dedicated Blade Tool (`B` key):** Hover over clips with a red dashed cut line preview and split clips with a single click.
- **Tactile Rotary Jog Wheel:** Final Cut iPad-style jog wheel widget for precise frame-by-frame scrubbing (`-1` / `+1` frame).
- **Clip Audition Stacks (`Take 1/3`):** Click the audition badge on clips to cycle between alternative AI takes in-place without altering timeline timing.

### 4. Live Video Scopes & 3-Way Interactive Color Wheels
- **Real-Time Video Scopes:** Toggleable overlay analyzing canvas pixels at 60fps to render **Luma Waveform (0 to 100 IRE)** and **RGB Parade / Histogram**.
- **3-Way Color Wheels:** Separate circular wheels for `Shadows (Lift)`, `Midtones (Gamma)`, and `Highlights (Gain)` with 360° chromatic puck dragging and vertical luminance faders.
- **Scrubby Numeric Inputs:** Drag horizontally to adjust Temperature (K), Tint, Contrast, Saturation, Lens Vignette, and Blur.

### 5. Live Stereo dBFS Peak Meters & Pro Audio Suite
- **Stereo Peak Meter:** Dual-channel vertical L/R audio meter (`-60dB` to `0dB`) with Green (`< -12dB`), Amber (`-12dB` to `-3dB`), and Red peak indicators.
- **Voice Isolation:** Enhance vocal frequencies and filter room rumble using Web Audio bandpass filters.
- **1-Click Auto-Duck Music:** Automatically attenuates background soundtracks by `-14dB` whenever voiceover or speech is detected at the playhead.
- **Audio EQ Presets:** `Studio Vocal`, `Warm Cinema`, `Deep Bass Punch`, `Lo-Fi Telephone`.

---

## ⌨️ Final Cut Pro Keyboard Shortcuts

| Shortcut | Command |
|---|---|
| `Space` | Play / Pause Timeline Playback |
| `B` | **Blade Tool** (Activate razor cut mode) |
| `A` | **Select Tool** (Default pointer) |
| `S` | Toggle **Live Hover Skimming** |
| `M` | Toggle **Magnetic Timeline** (Ripple snapping) |
| `Cmd` / `Ctrl` + `K` | Open **Spotlight Command HUD** |
| `D` | Duplicate Selected Clip |
| `Delete` / `Backspace` | Ripple Delete Clip (snaps subsequent clips) |
| `Cmd` / `Ctrl` + `Z` | Undo Last Action |
| `Cmd` / `Ctrl` + `Y` | Redo Action |
| `←` / `→` | Step Backward / Forward 1 Frame |
| `Shift` + `←` / `→` | Jump Backward / Forward 1 Second |
| `?` | Keyboard Shortcuts Cheat Sheet Modal |

---

## 🌐 Live URLs

- **Official Live Website:**  
  [https://anything14907-byte.github.io/AetherCut-Studio/](https://anything14907-byte.github.io/AetherCut-Studio/)
- **Direct Video Showcase (`?v=demo`):**  
  [https://anything14907-byte.github.io/AetherCut-Studio/?v=demo](https://anything14907-byte.github.io/AetherCut-Studio/?v=demo)
- **Deep Space Cosmic Odyssey (`?v=space`):**  
  [https://anything14907-byte.github.io/AetherCut-Studio/?v=space](https://anything14907-byte.github.io/AetherCut-Studio/?v=space)
- **Vertical TikTok/Reels (`?v=shorts`):**  
  [https://anything14907-byte.github.io/AetherCut-Studio/?v=shorts](https://anything14907-byte.github.io/AetherCut-Studio/?v=shorts)

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Compile optimized production bundle
npm run build
```
