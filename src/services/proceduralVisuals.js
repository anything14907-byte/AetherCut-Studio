/**
 * Procedural Canvas Visual Renderers
 * Generates dynamic 60fps background scenes for V2 and V1 tracks without external video dependencies.
 */

export function renderCyberGrid(ctx, width, height, time) {
  // Deep space background
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#07080C');
  grad.addColorStop(0.55, '#12072B');
  grad.addColorStop(1, '#050B14');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  const horizonY = height * 0.52;

  // Horizon glow
  const horizonGlow = ctx.createRadialGradient(width / 2, horizonY, 10, width / 2, horizonY, width * 0.6);
  horizonGlow.addColorStop(0, 'rgba(0, 242, 254, 0.45)');
  horizonGlow.addColorStop(0.3, 'rgba(138, 43, 226, 0.3)');
  horizonGlow.addColorStop(1, 'rgba(7, 8, 12, 0)');
  ctx.fillStyle = horizonGlow;
  ctx.fillRect(0, horizonY - height * 0.35, width, height * 0.7);

  // Perspective 3D Grid floor
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, horizonY, width, height - horizonY);
  ctx.clip();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';

  // Perspective vertical lines converging to horizon center
  const vLineCount = 28;
  const vanishingX = width / 2;
  const spread = width * 1.8;

  for (let i = -vLineCount / 2; i <= vLineCount / 2; i++) {
    const bottomX = vanishingX + (i / (vLineCount / 2)) * spread;
    ctx.beginPath();
    ctx.moveTo(vanishingX + i * 2, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.stroke();
  }

  // Moving horizontal grid lines
  const speed = 0.8;
  const offset = (time * speed) % 1;
  const hLines = 14;

  for (let i = 0; i < hLines; i++) {
    const progress = (i + offset) / hLines;
    // Exponential curve for perspective foreshortening
    const y = horizonY + Math.pow(progress, 2.2) * (height - horizonY);
    const alpha = Math.min(1, Math.pow(progress, 1.5));
    ctx.strokeStyle = `rgba(138, 43, 226, ${alpha * 0.75})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Floating cyber particles
  ctx.save();
  ctx.fillStyle = '#00F2FE';
  for (let i = 0; i < 40; i++) {
    const px = (Math.sin(i * 99 + time * 0.2) * 0.5 + 0.5) * width;
    const py = (Math.cos(i * 33 + time * 0.3) * 0.5 + 0.5) * (horizonY * 0.9);
    const size = ((i % 3) + 1) * 1.2;
    ctx.globalAlpha = Math.sin(time * 2 + i) * 0.4 + 0.5;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function renderNebulaSpace(ctx, width, height, time) {
  // Deep obsidian void
  ctx.fillStyle = '#05060A';
  ctx.fillRect(0, 0, width, height);

  // Flowing chromatic nebulas
  const nebulas = [
    { x: width * 0.3 + Math.sin(time * 0.3) * 60, y: height * 0.4 + Math.cos(time * 0.2) * 40, r: width * 0.45, color: 'rgba(138, 43, 226, 0.35)' },
    { x: width * 0.7 + Math.cos(time * 0.25) * 50, y: height * 0.6 + Math.sin(time * 0.35) * 50, r: width * 0.4, color: 'rgba(0, 242, 254, 0.3)' },
    { x: width * 0.5 + Math.sin(time * 0.15) * 40, y: height * 0.3, r: width * 0.35, color: 'rgba(255, 0, 122, 0.2)' }
  ];

  nebulas.forEach(neb => {
    const g = ctx.createRadialGradient(neb.x, neb.y, 10, neb.x, neb.y, neb.r);
    g.addColorStop(0, neb.color);
    g.addColorStop(1, 'rgba(5, 6, 10, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  });

  // Starfield
  ctx.save();
  for (let i = 0; i < 90; i++) {
    const x = (Math.sin(i * 123.45) * 0.5 + 0.5) * width;
    const y = (Math.cos(i * 678.90) * 0.5 + 0.5) * height;
    const twinkle = Math.sin(time * 3 + i * 2) * 0.5 + 0.5;
    const r = (i % 4 === 0) ? 2.2 : 1.2;
    ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#00F2FE';
    ctx.globalAlpha = 0.2 + twinkle * 0.8;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function renderAuroraFluid(ctx, width, height, time) {
  // Obsidian base
  ctx.fillStyle = '#07080C';
  ctx.fillRect(0, 0, width, height);

  // Layered oscillating waves
  const waveCount = 5;
  for (let w = 0; w < waveCount; w++) {
    ctx.save();
    ctx.beginPath();
    const baseY = height * (0.35 + w * 0.12);
    ctx.moveTo(0, height);
    ctx.lineTo(0, baseY);

    for (let x = 0; x <= width; x += 25) {
      const y = baseY +
        Math.sin(x * 0.003 + time * 1.2 + w) * 50 +
        Math.cos(x * 0.006 - time * 0.8 + w * 2) * 35;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(width, height);
    ctx.closePath();

    const alpha = 0.28 - w * 0.04;
    const grad = ctx.createLinearGradient(0, baseY - 60, width, height);
    if (w % 2 === 0) {
      grad.addColorStop(0, `rgba(0, 242, 254, ${alpha})`);
      grad.addColorStop(1, `rgba(138, 43, 226, ${alpha * 0.5})`);
    } else {
      grad.addColorStop(0, `rgba(138, 43, 226, ${alpha})`);
      grad.addColorStop(1, `rgba(16, 185, 129, ${alpha * 0.4})`);
    }

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

export function renderMatrixRain(ctx, width, height, time) {
  ctx.fillStyle = 'rgba(7, 8, 12, 0.95)';
  ctx.fillRect(0, 0, width, height);

  const columns = 28;
  const colWidth = width / columns;
  const chars = "010101XYZΩΨ01AETHERCUT89#$";

  ctx.font = '16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';

  for (let i = 0; i < columns; i++) {
    const speed = ((i % 5) + 3) * 60;
    const yOffset = (time * speed + (i * 137.5)) % (height + 200);

    for (let j = 0; j < 14; j++) {
      const charY = yOffset - j * 20;
      if (charY > 0 && charY < height) {
        const char = chars[(i + j + Math.floor(time * 8)) % chars.length];
        const alpha = Math.max(0, 1 - j * 0.07);
        if (j === 0) {
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#00F2FE';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `rgba(0, 242, 254, ${alpha * 0.8})`;
          ctx.shadowBlur = 0;
        }
        ctx.fillText(char, i * colWidth + colWidth / 2, charY);
      }
    }
  }
  ctx.shadowBlur = 0;
}

export function renderSynthwaveSun(ctx, width, height, time) {
  // Sunset sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#0C0324');
  skyGrad.addColorStop(0.5, '#4B0082');
  skyGrad.addColorStop(0.7, '#FF007A');
  skyGrad.addColorStop(1, '#07080C');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  const sunX = width / 2;
  const sunY = height * 0.48;
  const sunRadius = Math.min(width, height) * 0.24;

  // Glowing Sun
  const sunGrad = ctx.createLinearGradient(sunX, sunY - sunRadius, sunX, sunY + sunRadius);
  sunGrad.addColorStop(0, '#FFE600');
  sunGrad.addColorStop(0.6, '#FF007A');
  sunGrad.addColorStop(1, '#7928CA');

  ctx.save();
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fillStyle = sunGrad;
  ctx.fill();

  // Horizontal blind cuts across lower sun
  const sliceCount = 8;
  ctx.fillStyle = '#07080C';
  for (let s = 0; s < sliceCount; s++) {
    const sliceY = sunY + (s / sliceCount) * sunRadius;
    const sliceH = 2 + s * 2.2;
    ctx.fillRect(sunX - sunRadius, sliceY, sunRadius * 2, sliceH);
  }
  ctx.restore();
}

/**
 * Master dispatcher for procedural visual rendering
 */
export function renderProceduralScene(ctx, width, height, time, sceneType) {
  switch (sceneType) {
    case 'cyberGrid':
      renderCyberGrid(ctx, width, height, time);
      break;
    case 'nebulaSpace':
      renderNebulaSpace(ctx, width, height, time);
      break;
    case 'auroraFluid':
      renderAuroraFluid(ctx, width, height, time);
      break;
    case 'matrixRain':
      renderMatrixRain(ctx, width, height, time);
      break;
    case 'synthwaveSun':
      renderSynthwaveSun(ctx, width, height, time);
      break;
    default:
      renderCyberGrid(ctx, width, height, time);
      break;
  }
}

