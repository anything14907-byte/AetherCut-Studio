/**
 * BRAND CONFIGURATION — SINGLE SOURCE OF TRUTH
 * Pure Pro NLE Identity (Zero AI, Pure Speed & Precision)
 */

export const BRAND_CONFIG = {
  // Core Brand Identity
  name: "AetherCut Pro",
  shortName: "AetherCut",
  logoText: "AetherCut",
  logoTag: "PRO 2.0",
  edition: "Final Cut Pro Web Workstation",

  // Marketing & Taglines
  tagline: "Ultra-Fast, Free Apple Final Cut Pro Web Workstation",
  headline: "Pro-Grade Multi-Track Editing with Zero Lag in Your Browser",
  subheadline: "Magnetic Timeline, 4-Angle Multicam, 3-Way Color Wheels, and Speed Ramping. Built for instant responsiveness on any laptop with 100% free, watermark-free export.",

  // Pledge & Guarantees
  pledge: {
    title: "100% Free & Open-Access Pro Video Pledge",
    bullets: [
      { label: "100% Free Forever", desc: "No subscriptions, no watermark stamps, and no locked features." },
      { label: "Hardware Accelerated", desc: "Decoupled 60fps render pipeline optimized for low-end & integrated-GPU laptops." },
      { label: "Zero Cloud Latency", desc: "Runs 100% locally in your browser. Media never leaves your device." },
      { label: "Instant Access", desc: "Open the workstation and start cutting immediately. No sign-up required." }
    ]
  },

  // Final Cut Pro Anodized Theme Palette
  theme: {
    bg: "#0B0B0D",
    surface: "#161619",
    surfaceElevated: "#1C1C21",
    border: "#242429",
    amberSelection: "#FF9F0A",
    proBlue: "#0A84FF",
    skimmerRed: "#FF453A",
    playheadWhite: "#FFFFFF",
    audioGreen: "#30D158"
  },

  // Supported Aspect Ratios & Smart Conform
  aspectRatios: [
    { id: "16:9", label: "16:9 Widescreen (1920x1080)", width: 1920, height: 1080, icon: "RectangleHorizontal" },
    { id: "9:16", label: "9:16 Vertical Shorts / Reels (1080x1920)", width: 1080, height: 1920, icon: "RectangleVertical" },
    { id: "1:1", label: "1:1 Square Feed (1080x1080)", width: 1080, height: 1080, icon: "Square" },
    { id: "4:5", label: "4:5 Social Portrait (1080x1350)", width: 1080, height: 1350, icon: "RectangleVertical" }
  ],

  version: "v2.0-PRO-FINAL-CUT",
  releaseDate: "2026",
  license: "Free & Open Access",
  githubUrl: "https://github.com/anything14907-byte/AetherCut-Studio",
  docsUrl: "#docs"
};
