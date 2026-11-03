/**
 * BRAND CONFIGURATION — SINGLE SOURCE OF TRUTH
 * Easily change the branding across the entire application by modifying this file.
 */

export const BRAND_CONFIG = {
  // Core Brand Identity
  name: "AetherCut Studio",
  shortName: "AetherCut",
  logoText: "AetherCut",
  logoTag: "STUDIO",
  
  // Marketing & Taglines
  tagline: "100% Free AI Video Creation & Multi-Track NLE",
  headline: "Direct, Composite, and Render Cinematic Videos in Your Browser",
  subheadline: "Zero subscription tiers. Zero credit walls. Zero watermarks. Pure local-first creative power with an Obsidian Cinema aesthetic.",
  
  // Pledge & Guarantees
  pledge: {
    title: "The Open-Access Creator Pledge",
    bullets: [
      { label: "100% Free Forever", desc: "No credit meters, no subscriptions, no locked exports." },
      { label: "Zero Watermarks", desc: "Export pristine 1080p WebM/MP4 videos completely unbranded." },
      { label: "Client-Side Privacy", desc: "All video compositing runs locally in your browser. Media never leaves your machine." },
      { label: "No Account Required", desc: "Open the studio and start cutting immediately. No friction." }
    ]
  },
  
  // Theme & Accents
  theme: {
    obsidianBg: "#07080C",
    surfaceSlate: "#11131A",
    cardSurface: "#181B26",
    borderHairline: "rgba(255, 255, 255, 0.08)",
    cyanGradientStart: "#00F2FE",
    violetGradientEnd: "#8A2BE2",
    emeraldTrack: "#10B981",
    violetTrack: "#8A2BE2",
    cyanTrack: "#00F2FE",
    blueTrack: "#3B82F6"
  },
  
  // Supported Aspect Ratios
  aspectRatios: [
    { id: "16:9", label: "16:9 Cinema / YouTube", width: 1920, height: 1080, icon: "RectangleHorizontal" },
    { id: "9:16", label: "9:16 Shorts / TikTok / Reels", width: 1080, height: 1920, icon: "RectangleVertical" },
    { id: "1:1", label: "1:1 Square Feed", width: 1080, height: 1080, icon: "Square" }
  ],
  
  // App Version & Metadata
  version: "v2.5.0-PRO-FREE",
  releaseDate: "2026",
  license: "Free & Open Access",
  githubUrl: "https://github.com/aethercut/aethercut-studio",
  docsUrl: "#docs"
};

