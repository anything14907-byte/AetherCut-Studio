/**
 * Master Canvas Compositor Renderer — Final Cut Pro Studio Edition
 * Composites V2, V1, and T1 layers, filters, 3-way color wheels, and kinetic text at 60fps.
 * Also provides real-time Luma Waveform & RGB Parade pixel analyzer for Live Video Scopes!
 */

import { renderProceduralScene } from './proceduralVisuals';
import { LUT_PRESETS } from '../types/studioTypes';

export function renderCompositorFrame(ctx, width, height, currentTime, clips, options = {}) {
  const { selectedClipId = null, showBoundingBox = false, skimmerTime = null } = options;
  const renderTime = (skimmerTime !== null && skimmerTime !== undefined) ? skimmerTime : currentTime;

  // 1. Clear & Paint Calibrated Anodized Obsidian Base
  ctx.save();
  ctx.fillStyle = '#0B0B0D';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Sort tracks: V2 (Primary Storyline) -> V1 (Connected B-Roll/PIP) -> T1 (Titles & Captions)
  const trackOrder = ['V2', 'V1', 'T1'];

  trackOrder.forEach(trackId => {
    // Find active clip on this track at renderTime
    const activeClip = clips.find(c =>
      c.trackId === trackId &&
      c.startTime <= renderTime &&
      (c.startTime + c.duration) > renderTime
    );

    if (!activeClip) return;

    ctx.save();

    // Setup transform
    const t = activeClip.transform || { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 };
    ctx.globalAlpha = Math.max(0, Math.min(1, t.opacity ?? 1));

    // Center pivot
    const centerX = width / 2 + (t.x || 0);
    const centerY = height / 2 + (t.y || 0);
    ctx.translate(centerX, centerY);
    if (t.rotation) {
      ctx.rotate((t.rotation * Math.PI) / 180);
    }
    const scale = t.scale || 1.0;
    ctx.scale(scale, scale);
    ctx.translate(-width / 2, -height / 2);

    // Setup Color Grading (LUTs, 3-Way Wheels, Temp/Tint)
    const filter = activeClip.colorFilter;
    if (filter) {
      let filterStr = '';
      if (filter.brightness && filter.brightness !== 100) filterStr += `brightness(${filter.brightness}%) `;
      if (filter.contrast && filter.contrast !== 100) filterStr += `contrast(${filter.contrast}%) `;
      if (filter.saturation && filter.saturation !== 100) filterStr += `saturate(${filter.saturation}%) `;
      if (filter.hueRotate && filter.hueRotate !== 0) filterStr += `hue-rotate(${filter.hueRotate}deg) `;
      if (filter.blur && filter.blur > 0) filterStr += `blur(${filter.blur}px) `;

      // Temperature / Tint
      if (filter.temperature && filter.temperature !== 0) {
        if (filter.temperature > 0) filterStr += `sepia(${Math.min(0.5, filter.temperature / 100)}) `;
      }

      if (filter.lutPreset && filter.lutPreset !== 'none') {
        const preset = LUT_PRESETS.find(p => p.id === filter.lutPreset);
        if (preset && preset.filter) {
          filterStr += preset.filter;
        }
      }

      if (filterStr.trim()) {
        ctx.filter = filterStr.trim();
      }
    }

    // --- RENDER TRACK CONTENT ---
    if (trackId === 'V2' || trackId === 'V1') {
      const activeSceneType = (activeClip.auditions && activeClip.activeAuditionIndex !== undefined)
        ? activeClip.auditions[activeClip.activeAuditionIndex]?.sceneType || activeClip.sceneType
        : activeClip.sceneType;

      if (activeClip.type === 'procedural') {
        renderProceduralScene(ctx, width, height, renderTime - activeClip.startTime, activeSceneType);
      } else if (activeClip.type === 'image' && activeClip.imageElement) {
        ctx.drawImage(activeClip.imageElement, 0, 0, width, height);
      } else if (activeClip.type === 'video' && activeClip.videoElement) {
        ctx.drawImage(activeClip.videoElement, 0, 0, width, height);
      } else {
        renderProceduralScene(ctx, width, height, renderTime - activeClip.startTime, 'cyberGrid');
      }

      // Vignette effect if configured
      if (filter && filter.vignette && filter.vignette > 0) {
        renderVignette(ctx, width, height, filter.vignette);
      }

      // Add Final Cut specular border for V1 PIP clips
      if (trackId === 'V1') {
        ctx.strokeStyle = 'rgba(100, 210, 255, 0.6)';
        ctx.lineWidth = 3;
        ctx.strokeRect(3, 3, width - 6, height - 6);
      }
    } else if (trackId === 'T1') {
      // Text & Kinetic Caption Track
      renderTextAndKineticCaptions(ctx, width, height, renderTime, activeClip);
    }

    ctx.restore();

    // On-Canvas Selection Bounding Box
    if (showBoundingBox && selectedClipId === activeClip.id) {
      drawBoundingBox(ctx, width, height, t);
    }
  });
}

function renderVignette(ctx, width, height, intensity) {
  ctx.save();
  const radius = Math.max(width, height) * 0.75;
  const gradient = ctx.createRadialGradient(width / 2, height / 2, radius * 0.4, width / 2, height / 2, radius);
  const alpha = Math.min(0.85, (intensity / 100) * 0.9);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, `rgba(0,0,0,${alpha})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function renderTextAndKineticCaptions(ctx, width, height, currentTime, clip) {
  const typo = clip.typography;
  if (!typo) return;

  const fontName = typo.fontFamily || 'Plus Jakarta Sans';
  const fontSize = typo.fontSize || 52;
  const stylePreset = typo.stylePreset || 'hormozi';
  const fullText = typo.text || '';

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const posX = width / 2;
  const posY = height / 2;

  if (stylePreset === 'hormozi' && typo.words && typo.words.length > 0) {
    // HORMOZI KINETIC STYLE: Active word highlight with Apple Final Cut amber contrast pill
    ctx.font = `800 ${fontSize}px "${fontName}", sans-serif`;

    const wordSpacings = typo.words.map(w => ctx.measureText(w.word + ' ').width);
    const totalW = wordSpacings.reduce((a, b) => a + b, 0);
    let startX = posX - (totalW / 2);

    typo.words.forEach((wObj, idx) => {
      const isActive = currentTime >= wObj.start && currentTime <= wObj.end;
      const wordW = wordSpacings[idx];
      const wordCenterX = startX + wordW / 2;

      ctx.save();
      if (isActive) {
        // Hormozi Active Pill background
        const pillW = wordW + 18;
        const pillH = fontSize * 1.35;
        ctx.fillStyle = 'rgba(22, 22, 25, 0.96)';
        ctx.strokeStyle = '#FF9F0A'; // Final Cut Iconic Amber
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(wordCenterX - pillW / 2, posY - pillH / 2, pillW, pillH, 10);
        ctx.fill();
        ctx.stroke();

        // Active Word Glowing Amber/Gold
        ctx.fillStyle = '#FF9F0A';
        ctx.shadowColor = 'rgba(255, 159, 10, 0.6)';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.strokeText(wObj.word, wordCenterX, posY);
        ctx.fillText(wObj.word, wordCenterX, posY);
      } else {
        // Inactive Word (Clean White)
        ctx.fillStyle = '#F2F2F7';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(wObj.word, wordCenterX, posY);
        ctx.fillText(wObj.word, wordCenterX, posY);
      }
      ctx.restore();

      startX += wordW;
    });

  } else if (stylePreset === 'neonGlow') {
    ctx.font = `800 ${fontSize}px "${fontName}", sans-serif`;

    ctx.save();
    ctx.shadowColor = '#0A84FF';
    ctx.shadowBlur = 25;
    ctx.strokeStyle = '#0A84FF';
    ctx.lineWidth = 6;
    ctx.strokeText(fullText, posX, posY);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(fullText, posX, posY);
    ctx.restore();

  } else if (stylePreset === 'minimalCinema') {
    ctx.font = `600 ${fontSize * 0.85}px "${fontName}", sans-serif`;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#FFFFFF';
    ctx.letterSpacing = '5px';
    ctx.fillText(fullText.toUpperCase(), posX, posY);
    ctx.restore();

  } else {
    ctx.font = `900 ${fontSize}px "${fontName}", sans-serif`;
    ctx.save();
    ctx.strokeStyle = typo.strokeColor || '#000000';
    ctx.lineWidth = typo.strokeWidth || 6;
    ctx.strokeText(fullText, posX, posY);
    ctx.fillStyle = typo.color || '#FFFFFF';
    ctx.fillText(fullText, posX, posY);
    ctx.restore();
  }
}

function drawBoundingBox(ctx, width, height, transform) {
  ctx.save();
  const centerX = width / 2 + (transform.x || 0);
  const centerY = height / 2 + (transform.y || 0);
  const scale = transform.scale || 1.0;

  ctx.translate(centerX, centerY);
  if (transform.rotation) {
    ctx.rotate((transform.rotation * Math.PI) / 180);
  }

  const boxW = width * scale * 0.96;
  const boxH = height * scale * 0.96;

  ctx.strokeStyle = '#FF9F0A'; // Final Cut Iconic Amber outline
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);

  // Corner handles
  ctx.fillStyle = '#FF9F0A';
  ctx.setLineDash([]);
  const handleSize = 10;
  const corners = [
    [-boxW / 2, -boxH / 2],
    [boxW / 2, -boxH / 2],
    [-boxW / 2, boxH / 2],
    [boxW / 2, boxH / 2]
  ];
  corners.forEach(([hx, hy]) => {
    ctx.fillRect(hx - handleSize / 2, hy - handleSize / 2, handleSize, handleSize);
  });

  ctx.restore();
}

/**
 * Real-Time Video Scope Pixel Analyzer
 * Samples canvas pixels to compute Luma Waveform & RGB Parade / Histogram data.
 */
export function extractScopeData(canvas) {
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;

  const w = canvas.width;
  const h = canvas.height;
  // Downsample to 120x80 for high-performance 60fps analysis
  const sampleW = 120;
  const sampleH = 80;

  try {
    const off = document.createElement('canvas');
    off.width = sampleW;
    off.height = sampleH;
    const offCtx = off.getContext('2d');
    offCtx.drawImage(canvas, 0, 0, sampleW, sampleH);

    const imgData = offCtx.getImageData(0, 0, sampleW, sampleH).data;
    const lumaHistogram = new Array(100).fill(0);
    const rHistogram = new Array(100).fill(0);
    const gHistogram = new Array(100).fill(0);
    const bHistogram = new Array(100).fill(0);

    for (let i = 0; i < imgData.length; i += 4) {
      const r = imgData[i];
      const g = imgData[i + 1];
      const b = imgData[i + 2];

      // ITU-R BT.709 Luma formula
      const luma = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
      const lumaBucket = Math.min(99, Math.floor((luma / 255) * 100));
      const rBucket = Math.min(99, Math.floor((r / 255) * 100));
      const gBucket = Math.min(99, Math.floor((g / 255) * 100));
      const bBucket = Math.min(99, Math.floor((b / 255) * 100));

      lumaHistogram[lumaBucket]++;
      rHistogram[rBucket]++;
      gHistogram[gBucket]++;
      bHistogram[bBucket]++;
    }

    return { luma: lumaHistogram, r: rHistogram, g: gHistogram, b: bHistogram, sampleW, sampleH };
  } catch (err) {
    return null;
  }
}
