/**
 * Master Canvas Compositor Renderer
 * Composites V2, V1, and T1 layers, filters, transforms, and kinetic text at 60fps.
 */

import { renderProceduralScene } from './proceduralVisuals';
import { LUT_PRESETS } from '../types/studioTypes';

export function renderCompositorFrame(ctx, width, height, currentTime, clips, options = {}) {
  const { selectedClipId = null, showBoundingBox = false } = options;

  // 1. Clear & Paint Deep Obsidian Base
  ctx.save();
  ctx.fillStyle = '#07080C';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Sort tracks bottom to top: V2 (Main) -> V1 (Overlay) -> T1 (Text/Captions)
  const trackOrder = ['V2', 'V1', 'T1'];

  trackOrder.forEach(trackId => {
    // Find active clip on this track
    const activeClip = clips.find(c =>
      c.trackId === trackId &&
      c.startTime <= currentTime &&
      (c.startTime + c.duration) > currentTime
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

    // Setup Color Filter
    const filter = activeClip.colorFilter;
    if (filter) {
      let filterStr = '';
      if (filter.brightness && filter.brightness !== 100) filterStr += `brightness(${filter.brightness}%) `;
      if (filter.contrast && filter.contrast !== 100) filterStr += `contrast(${filter.contrast}%) `;
      if (filter.saturation && filter.saturation !== 100) filterStr += `saturate(${filter.saturation}%) `;
      if (filter.hueRotate && filter.hueRotate !== 0) filterStr += `hue-rotate(${filter.hueRotate}deg) `;
      if (filter.blur && filter.blur > 0) filterStr += `blur(${filter.blur}px) `;

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
      // Visual track
      if (activeClip.type === 'procedural') {
        renderProceduralScene(ctx, width, height, currentTime - activeClip.startTime, activeClip.sceneType);
      } else if (activeClip.type === 'image' && activeClip.imageElement) {
        ctx.drawImage(activeClip.imageElement, 0, 0, width, height);
      } else if (activeClip.type === 'video' && activeClip.videoElement) {
        ctx.drawImage(activeClip.videoElement, 0, 0, width, height);
      } else {
        // Fallback procedural
        renderProceduralScene(ctx, width, height, currentTime - activeClip.startTime, 'cyberGrid');
      }

      // Add a sleek hairline border for V1 PIP clips
      if (trackId === 'V1') {
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.lineWidth = 4;
        ctx.strokeRect(4, 4, width - 8, height - 8);
      }
    } else if (trackId === 'T1') {
      // Text & Kinetic Caption Track
      renderTextAndKineticCaptions(ctx, width, height, currentTime, activeClip);
    }

    ctx.restore();

    // On-Canvas Selection Bounding Box
    if (showBoundingBox && selectedClipId === activeClip.id) {
      drawBoundingBox(ctx, width, height, t);
    }
  });
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
    // HORMOZI KINETIC STYLE: Active word highlight
    ctx.font = `800 ${fontSize}px "${fontName}", sans-serif`;

    // Measure total width to center words horizontally
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
        const pillW = wordW + 16;
        const pillH = fontSize * 1.35;
        ctx.fillStyle = 'rgba(17, 19, 26, 0.95)';
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(wordCenterX - pillW / 2, posY - pillH / 2, pillW, pillH, 12);
        ctx.fill();
        ctx.stroke();

        // Active Word Glowing Yellow
        ctx.fillStyle = '#FACC15';
        ctx.shadowColor = '#FACC15';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.strokeText(wObj.word, wordCenterX, posY);
        ctx.fillText(wObj.word, wordCenterX, posY);
      } else {
        // Inactive Word (Muted White/Cream)
        ctx.fillStyle = '#E2E8F0';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText(wObj.word, wordCenterX, posY);
        ctx.fillText(wObj.word, wordCenterX, posY);
      }
      ctx.restore();

      startX += wordW;
    });

  } else if (stylePreset === 'neonGlow') {
    // ELECTRIC NEON GLOW STYLE
    ctx.font = `800 ${fontSize}px "${fontName}", sans-serif`;

    // Outer glow pass
    ctx.save();
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 25;
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 6;
    ctx.strokeText(fullText, posX, posY);

    // Inner bright text pass
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(fullText, posX, posY);
    ctx.restore();

  } else if (stylePreset === 'minimalCinema') {
    // MINIMAL CINEMA STYLE: elegant letter-spaced uppercase
    ctx.font = `600 ${fontSize * 0.85}px "${fontName}", sans-serif`;
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#FFFFFF';
    ctx.letterSpacing = '4px';
    ctx.fillText(fullText.toUpperCase(), posX, posY);
    ctx.restore();

  } else {
    // BOLD IMPACT / DEFAULT
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

  ctx.strokeStyle = '#00F2FE';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  ctx.strokeRect(-boxW / 2, -boxH / 2, boxW, boxH);

  // Corner handles
  ctx.fillStyle = '#00F2FE';
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

