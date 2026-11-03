/**
 * AI Director Engine
 * Natural language command parser + timeline state mutator + procedural project generator
 * Supports offline mode out-of-the-box + BYO API Key (Gemini / OpenAI).
 */

export class AiDirectorEngine {
  constructor() {
    this.apiKeys = {
      gemini: localStorage.getItem('aethercut_key_gemini') || '',
      openai: localStorage.getItem('aethercut_key_openai') || '',
      pexels: localStorage.getItem('aethercut_key_pexels') || '',
    };
  }

  saveKey(provider, key) {
    this.apiKeys[provider] = key;
    localStorage.setItem(`aethercut_key_${provider}`, key);
  }

  getKey(provider) {
    return this.apiKeys[provider] || '';
  }

  /**
   * Main command dispatcher
   * Parses natural language command string and returns an actionable mutation object
   */
  async processCommand(commandText, contextState) {
    const text = commandText.trim();
    const lower = text.toLowerCase();

    // 1. SPLIT COMMAND
    // e.g. "split clip at 00:05" or "split at 5s" or "split at playhead"
    if (lower.startsWith('split')) {
      let targetTime = contextState.currentTime;
      const timeMatch = text.match(/at\s+([0-9]+(?::[0-9]+)?(?:\.[0-9]+)?)/i);
      if (timeMatch) {
        const rawTime = timeMatch[1];
        if (rawTime.includes(':')) {
          const parts = rawTime.split(':').map(Number);
          targetTime = parts[0] * 60 + parts[1];
        } else {
          targetTime = parseFloat(rawTime);
        }
      }
      return {
        type: 'SPLIT_CLIP',
        targetTime,
        clipId: contextState.selectedClipId,
        message: `Split operation executed at time ${this.formatTime(targetTime)}.`,
        success: true
      };
    }

    // 2. ADD CAPTION OR TITLE
    // e.g. "add bold yellow kinetic captions: Explore the unknown"
    if (lower.includes('caption') || lower.includes('title') || lower.includes('text:')) {
      let extractedText = "THE FUTURE OF DIGITAL CREATIVITY";
      let stylePreset = "hormozi";
      let color = "#FACC15";

      if (lower.includes('neon')) {
        stylePreset = "neonGlow";
        color = "#00F2FE";
      } else if (lower.includes('minimal') || lower.includes('cinema')) {
        stylePreset = "minimalCinema";
        color = "#FFFFFF";
      } else if (lower.includes('yellow')) {
        color = "#FACC15";
      }

      const colonIdx = text.indexOf(':');
      const quoteMatch = text.match(/["']([^"']+)["']/);
      if (colonIdx !== -1) {
        extractedText = text.slice(colonIdx + 1).trim();
      } else if (quoteMatch) {
        extractedText = quoteMatch[1];
      }

      // Generate timed word tokens
      const words = extractedText.split(/\s+/).map((word, i, arr) => {
        const seg = 4.0 / arr.length;
        return {
          word,
          start: contextState.currentTime + (i * seg),
          end: contextState.currentTime + ((i + 1) * seg)
        };
      });

      const newClip = {
        id: `t1-ai-${Date.now()}`,
        trackId: "T1",
        type: "caption",
        name: `AI Caption: ${extractedText.slice(0, 16)}...`,
        startTime: contextState.currentTime,
        duration: 4.5,
        trimStart: 0,
        trimEnd: 4.5,
        typography: {
          text: extractedText.toUpperCase(),
          fontFamily: stylePreset === 'neonGlow' ? 'Syne' : 'Plus Jakarta Sans',
          fontSize: 50,
          color: color,
          strokeColor: "#000000",
          strokeWidth: 4,
          bgPillColor: stylePreset === 'hormozi' ? 'rgba(17, 19, 26, 0.85)' : 'transparent',
          stylePreset,
          words
        },
        transform: { x: 0, y: 180, scale: 1.0, rotation: 0, opacity: 1.0 }
      };

      return {
        type: 'ADD_CLIP',
        clip: newClip,
        message: `Added kinetic caption "${extractedText}" to T1 track.`,
        success: true
      };
    }

    // 3. COLOR GRADING / LUT
    // e.g. "apply cyberpunk color grade" or "apply noir lut"
    if (lower.includes('color grade') || lower.includes('lut') || lower.includes('filter')) {
      let lutPreset = 'cyberpunk';
      if (lower.includes('noir') || lower.includes('black and white')) lutPreset = 'noir';
      else if (lower.includes('teal') || lower.includes('orange')) lutPreset = 'tealOrange';
      else if (lower.includes('vintage') || lower.includes('kodak')) lutPreset = 'vintageKodak';
      else if (lower.includes('matrix')) lutPreset = 'matrix';
      else if (lower.includes('neutral') || lower.includes('none')) lutPreset = 'none';

      return {
        type: 'APPLY_COLOR_GRADE',
        lutPreset,
        targetClipId: contextState.selectedClipId,
        message: `Applied ${lutPreset.toUpperCase()} color LUT to visual tracks.`,
        success: true
      };
    }

    // 4. MUSIC / BGM CHANGE
    // e.g. "change background music to cinematic ambient"
    if (lower.includes('music') || lower.includes('bgm') || lower.includes('soundtrack')) {
      let sfxType = 'synthwaveBgm';
      let title = 'Cyberpunk Dark Synth';

      if (lower.includes('ambient') || lower.includes('drone')) {
        sfxType = 'ambientDrone';
        title = 'Cinematic Ambient Drone';
      } else if (lower.includes('tech') || lower.includes('pulse')) {
        sfxType = 'techPulse';
        title = 'Tech Upbeat Pulse';
      } else if (lower.includes('lofi') || lower.includes('chill')) {
        sfxType = 'lofiChill';
        title = 'Obsidian Lo-Fi Beats';
      }

      const newAudioClip = {
        id: `a1-ai-bgm-${Date.now()}`,
        trackId: "A1",
        type: "audio",
        name: title,
        startTime: 0,
        duration: contextState.project.duration,
        trimStart: 0,
        trimEnd: contextState.project.duration,
        audio: {
          volume: 0.65,
          fadeIn: 0.5,
          fadeOut: 1.0,
          sfxType
        }
      };

      return {
        type: 'SET_BGM',
        clip: newAudioClip,
        message: `Set background music to ${title}.`,
        success: true
      };
    }

    // 5. ASPECT RATIO
    if (lower.includes('9:16') || lower.includes('vertical') || lower.includes('shorts') || lower.includes('tiktok')) {
      return {
        type: 'SET_ASPECT_RATIO',
        aspectRatio: '9:16',
        message: 'Switched canvas viewport aspect ratio to 9:16 Vertical Shorts.',
        success: true
      };
    }
    if (lower.includes('16:9') || lower.includes('horizontal') || lower.includes('cinema') || lower.includes('widescreen')) {
      return {
        type: 'SET_ASPECT_RATIO',
        aspectRatio: '16:9',
        message: 'Switched canvas viewport aspect ratio to 16:9 Cinema Widescreen.',
        success: true
      };
    }
    if (lower.includes('1:1') || lower.includes('square')) {
      return {
        type: 'SET_ASPECT_RATIO',
        aspectRatio: '1:1',
        message: 'Switched canvas viewport aspect ratio to 1:1 Square Feed.',
        success: true
      };
    }

    // 6. VOLUME ADJUSTMENT
    const volMatch = lower.match(/(?:volume|gain)\s+(?:to\s+)?([0-9]+)%?/);
    if (volMatch) {
      const volPercent = parseInt(volMatch[1], 10);
      const gainVal = Math.min(2.0, volPercent / 100);
      return {
        type: 'SET_VOLUME',
        volume: gainVal,
        message: `Set timeline volume to ${volPercent}%.`,
        success: true
      };
    }

    // 7. MULTI-SCENE SCRIPT & PROJECT GENERATION
    // e.g. "Generate a 4-scene script about space exploration"
    if (lower.includes('generate') || lower.includes('script') || lower.includes('create a video')) {
      const generated = this.generateProceduralProject(text, contextState.project.aspectRatio);
      return {
        type: 'REPLACE_PROJECT',
        project: generated,
        message: `AI Director generated a complete ${generated.clips.length}-clip multi-track project for: "${text}".`,
        success: true
      };
    }

    // Fallback general guidance
    return {
      type: 'INFO',
      message: `I understood: "${text}". You can tell me commands like "Add bold yellow kinetic captions: Your Text", "Split clip at 00:05", "Apply noir LUT", "Change music to ambient drone", or "Generate a 4-scene video about space".`,
      success: true
    };
  }

  /**
   * Procedural Multi-Scene Video Project Generator
   * Runs 100% offline without requiring any API keys.
   */
  generateProceduralProject(prompt, aspectRatio = '16:9') {
    const lower = prompt.toLowerCase();
    const duration = 20.0;

    // Detect theme
    let scenes = ['cyberGrid', 'nebulaSpace', 'auroraFluid'];
    let lut = 'cyberpunk';
    let bgm = 'synthwaveBgm';
    let captions = [
      { text: "INNOVATION UNLEASHED", style: "neonGlow" },
      { text: "POWERED BY ZERO-LATENCY AI", style: "hormozi" },
      { text: "RENDER WITH ZERO WATERMARKS", style: "minimalCinema" },
      { text: "AETHERCUT STUDIO 2026", style: "boldImpact" }
    ];

    if (lower.includes('space') || lower.includes('cosmos') || lower.includes('galaxy')) {
      scenes = ['nebulaSpace', 'auroraFluid', 'cyberGrid'];
      lut = 'tealOrange';
      bgm = 'ambientDrone';
      captions = [
        { text: "EXPLORE THE UNKNOWN VOID", style: "minimalCinema" },
        { text: "BEYOND THE BILLION STARS", style: "neonGlow" },
        { text: "JOURNEY TO DEEP SPACE", style: "hormozi" },
        { text: "THE COSMIC ODYSSEY BEGINS", style: "boldImpact" }
      ];
    } else if (lower.includes('product') || lower.includes('promo') || lower.includes('app')) {
      scenes = ['synthwaveSun', 'matrixRain', 'auroraFluid'];
      lut = 'tealOrange';
      bgm = 'techPulse';
      captions = [
        { text: "INTRODUCING THE REVOLUTION", style: "neonGlow" },
        { text: "ULTRA-FAST 60FPS COMPOSITING", style: "hormozi" },
        { text: "100% FREE CLIENT-SIDE NLE", style: "boldImpact" },
        { text: "TRY IT IN YOUR BROWSER TODAY", style: "minimalCinema" }
      ];
    }

    const sceneDuration = duration / 3;
    const clips = [];

    // Visual scenes (V2)
    scenes.forEach((sceneType, idx) => {
      clips.push({
        id: `v2-ai-gen-${idx}-${Date.now()}`,
        trackId: "V2",
        type: "procedural",
        name: `Scene ${idx + 1}: ${sceneType}`,
        startTime: idx * sceneDuration,
        duration: sceneDuration,
        trimStart: 0,
        trimEnd: sceneDuration,
        sceneType,
        transform: { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0 },
        colorFilter: { brightness: 105, contrast: 120, saturation: 130, hueRotate: 0, blur: 0, lutPreset: lut }
      });
    });

    // Overlay HUD (V1)
    clips.push({
      id: `v1-ai-hud-${Date.now()}`,
      trackId: "V1",
      type: "procedural",
      name: "HUD Overlay",
      startTime: 3.0,
      duration: 10.0,
      trimStart: 0,
      trimEnd: 10.0,
      sceneType: "matrixRain",
      transform: { x: 500, y: -260, scale: 0.35, rotation: 0, opacity: 0.8 },
      colorFilter: { brightness: 110, contrast: 120, saturation: 150, hueRotate: 90, blur: 0, lutPreset: "matrix" }
    });

    // Captions (T1)
    const capDuration = duration / captions.length;
    captions.forEach((cap, idx) => {
      const words = cap.text.split(/\s+/).map((word, wIdx, arr) => ({
        word,
        start: (idx * capDuration) + (wIdx * (capDuration / arr.length)),
        end: (idx * capDuration) + ((wIdx + 1) * (capDuration / arr.length))
      }));

      clips.push({
        id: `t1-ai-cap-${idx}-${Date.now()}`,
        trackId: "T1",
        type: "caption",
        name: `Kinetic: ${cap.text.slice(0, 16)}`,
        startTime: idx * capDuration + 0.3,
        duration: capDuration - 0.5,
        trimStart: 0,
        trimEnd: capDuration - 0.5,
        typography: {
          text: cap.text,
          fontFamily: cap.style === 'neonGlow' ? 'Syne' : 'Plus Jakarta Sans',
          fontSize: 54,
          color: cap.style === 'hormozi' ? '#FACC15' : '#00F2FE',
          strokeColor: "#000000",
          strokeWidth: 4,
          bgPillColor: cap.style === 'hormozi' ? 'rgba(17,19,26,0.85)' : 'transparent',
          stylePreset: cap.style,
          words
        },
        transform: { x: 0, y: 160, scale: 1.0, rotation: 0, opacity: 1.0 }
      });
    });

    // Audio & Voiceover (A1)
    clips.push({
      id: `a1-ai-bgm-${Date.now()}`,
      trackId: "A1",
      type: "audio",
      name: "AI Soundtrack",
      startTime: 0,
      duration,
      trimStart: 0,
      trimEnd: duration,
      audio: {
        volume: 0.65,
        fadeIn: 0.5,
        fadeOut: 1.0,
        sfxType: bgm
      }
    });

    clips.push({
      id: `a1-ai-tts-${Date.now()}`,
      trackId: "A1",
      type: "voiceover",
      name: "AI Voiceover Narration",
      startTime: 1.0,
      duration: 5.0,
      trimStart: 0,
      trimEnd: 5.0,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText: captions[0].text + ". " + captions[1].text,
        ttsVoice: "en-US",
        ttsRate: 1.0,
        ttsPitch: 1.0
      }
    });

    return {
      id: `proj-${Date.now()}`,
      title: prompt.slice(0, 36).toUpperCase(),
      duration,
      fps: 30,
      aspectRatio,
      width: aspectRatio === '9:16' ? 1080 : (aspectRatio === '1:1' ? 1080 : 1920),
      height: aspectRatio === '9:16' ? 1920 : (aspectRatio === '1:1' ? 1080 : 1080),
      masterVolume: 1.0,
      clips
    };
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  }
}

export const aiDirectorEngine = new AiDirectorEngine();

