# Implementation Plan — AetherCut Studio

AetherCut Studio is a production-grade, 100% free, client-side AI Video Creation and Multi-Track Non-Linear Editor (NLE). It features the original **Obsidian Cinema** glassmorphic aesthetic (`#07080C` obsidian base, `#11131A` slate surfaces, hairline borders, and electric cyan-to-violet gradient accents), a seamless dual-view SPA (Interactive Showcase Landing View + Full Studio Workspace), and a completely watermark-free, zero-paywall browser-native rendering pipeline.

---

## 1. Architectural Overview & File Structure

```
aethercut-studio/
├── public/
│   ├── favicon.svg               # Modern AetherCut geometric prism icon
│   └── audio/                    # Procedural/fallback audio samples
├── src/
│   ├── config/
│   │   ├── brandConfig.js        # Single source of truth for branding, app title, philosophy
│   │   └── defaultProject.js     # Rich pre-loaded demo project (cyberpunk sci-fi promo)
│   ├── types/
│   │   └── studioTypes.js        # Data structures for Clips, Tracks, Filters, Transforms
│   ├── context/
│   │   ├── StudioContext.jsx     # Global editor state, timeline time, playhead, selection, undo/redo
│   │   └── useStudio.js          # Custom hook for easy access to editor actions
│   ├── services/
│   │   ├── audioEngine.js        # Web Audio API synthesizer, BGM loops, SFX generator & mixer
│   │   ├── speechService.js      # Web Speech API Text-to-Speech generator
│   │   ├── proceduralVisuals.js  # Procedural canvas animations (Nebula, Cyber Grid, Aurora, Matrix)
│   │   ├── aiDirectorEngine.js   # Smart NLP command parser + Gemini/OpenAI API + offline fallback
│   │   ├── exportEngine.js       # Canvas captureStream + Web Audio MediaRecorder video exporter
│   │   └── projectStorage.js     # LocalStorage / JSON portable project import & export (.aether.json)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx        # Dual-view navigation, brand logo, Launch Studio CTA, Help/Keys
│   │   │   ├── KeyboardShortcutsModal.jsx # Comprehensive hotkey cheat sheet ('?')
│   │   │   ├── ApiKeyModal.jsx   # Bring Your Own Key (Gemini, OpenAI, Pexels) settings modal
│   │   │   └── ExportModal.jsx   # Real-time video render progress modal with download
│   │   ├── landing/
│   │   │   ├── LandingView.jsx   # Showcase landing page container
│   │   │   ├── HeroPromptBar.jsx # Interactive "Direct Your Video with AI" prompt command bar
│   │   │   ├── BentoShowcase.jsx # 4 interactive bento cards (AI Director, 4-Track NLE, Captions, WebCodecs)
│   │   │   └── FreePledgeBanner.jsx # 100% Free & Open-Access guarantee
│   │   └── studio/
│   │       ├── StudioWorkspace.jsx # 4-Zone studio container layout
│   │       ├── dock/             # Zone A: Left Dock & Collapsible Asset Drawer
│   │       │   ├── DockNavigation.jsx   # Tab switcher icons (AI, Media, Text, Audio, FX, Settings)
│   │       │   ├── TabAiDirector.jsx    # Conversational AI Co-Pilot chat & timeline executor
│   │       │   ├── TabMediaLibrary.jsx  # File uploads + procedural stock generator
│   │       │   ├── TabTextCaptions.jsx  # Kinetic subtitles (Hormozi, Neon, Cinema) & Titles
│   │       │   ├── TabAudioVoice.jsx    # Web Speech TTS + procedural BGM & sound FX
│   │       │   └── TabTransitionsFx.jsx # Color grading presets (LUTs) & transition animations
│   │       ├── viewport/         # Zone B: Center Real-Time Canvas Viewport
│   │       │   ├── CanvasViewport.jsx   # Responsive container with aspect ratio framing
│   │       │   ├── CanvasCompositor.jsx # HTML5 60fps multi-track canvas renderer & overlays
│   │       │   └── TransportControls.jsx# SMPTE timecode, play/pause, step frame, loop, aspect switcher
│   │       ├── inspector/        # Zone C: Right Context-Aware Inspector
│   │       │   ├── InspectorPanel.jsx   # Switcher for Clip Inspector vs Project Settings
│   │       │   ├── TransformInspector.jsx # Scale, X/Y position, rotation, opacity
│   │       │   ├── ColorGradingInspector.jsx # Brightness, contrast, saturation, hue, blur, LUT pills
│   │       │   ├── TypographyInspector.jsx # Font, size, stroke, kinetic highlight style, animation
│   │       │   └── AudioInspector.jsx   # Volume gain (0-200%), fade in/out
│   │       └── timeline/         # Zone D: Bottom Multi-Track Timeline Engine
│   │           ├── TimelineEngine.jsx   # Track container, ruler, playhead, zooming & snapping
│   │           ├── TimelineToolbar.jsx  # Split, Duplicate, Delete, Ripple, Zoom slider, Undo/Redo
│   │           ├── TimelineRuler.jsx    # Time markers & scrub handle
│   │           ├── TrackHeader.jsx      # Track badges (T1, V1, V2, A1), mute/solo/lock
│   │           ├── TrackLane.jsx        # Horizontal clip lane with drop targets
│   │           ├── TimelineClip.jsx     # Drag-repositionable clip with left/right trim handles
│   │           └── WaveformCanvas.jsx   # Real-time audio waveform renderer
│   ├── App.jsx                   # View routing (Landing vs Studio) & modal coordinator
│   ├── index.css                 # Obsidian Cinema design system, glassmorphism, animations
│   └── main.jsx                  # React DOM mount point
├── tailwind.config.js            # Custom obsidian palette, hairline borders, neon gradients
├── vite.config.js                # Vite build config
└── package.json                  # Dependencies
```

