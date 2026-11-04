import React, { useRef } from 'react';
import { Sliders, Sun, Contrast, Droplet, Sparkles, Thermometer, Disc } from 'lucide-react';
import { LUT_PRESETS } from '../../../types/studioTypes';

// Interactive Circular Color Wheel Component
function ColorWheel({ label, value, onChange }) {
  const wheelRef = useRef(null);

  const hue = value?.hue || 0;
  const sat = value?.sat || 0;
  const luma = value?.luma || 0;

  // Convert hue and sat to puck Cartesian coordinates (radius 36px)
  const radius = 36;
  const angleRad = (hue * Math.PI) / 180;
  const dist = (sat / 100) * radius;
  const puckX = 40 + Math.cos(angleRad) * dist;
  const puckY = 40 + Math.sin(angleRad) * dist;

  const handlePointerDown = (e) => {
    const rect = wheelRef.current.getBoundingClientRect();
    const handleMove = (me) => {
      const dx = me.clientX - (rect.left + 40);
      const dy = me.clientY - (rect.top + 40);
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      if (angle < 0) angle += 360;
      const distance = Math.min(radius, Math.sqrt(dx * dx + dy * dy));
      const newSat = Math.round((distance / radius) * 100);
      onChange({ hue: Math.round(angle), sat: newSat, luma });
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    handleMove(e);
  };

  return (
    <div className="flex flex-col items-center space-y-1.5 p-2 rounded-xl bg-[#1C1C21] border border-[#242429]">
      <span className="text-[10px] font-mono text-slate-300 uppercase font-bold tracking-wider">
        {label}
      </span>

      <div className="flex items-center space-x-2">
        {/* 360 Chromatic Disc */}
        <div
          ref={wheelRef}
          onPointerDown={handlePointerDown}
          className="relative w-20 h-20 rounded-full cursor-crosshair shadow-inner select-none"
          style={{
            background:
              'radial-gradient(circle, #FFFFFF 0%, transparent 80%), conic-gradient(from 0deg, red, yellow, lime, cyan, blue, magenta, red)'
          }}
        >
          {/* Subtle center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-full h-[1px] bg-black" />
            <div className="h-full w-[1px] bg-black absolute" />
          </div>

          {/* Draggable Puck */}
          <div
            style={{ left: `${puckX - 5}px`, top: `${puckY - 5}px` }}
            className="absolute w-2.5 h-2.5 rounded-full bg-white border border-black shadow-md pointer-events-none"
          />
        </div>

        {/* Vertical Luminance Slider */}
        <div className="flex flex-col items-center space-y-1">
          <input
            type="range"
            min="-50"
            max="50"
            value={luma}
            onChange={(e) => onChange({ hue, sat, luma: parseInt(e.target.value, 10) })}
            orient="vertical"
            className="h-16 w-2 accent-[#0A84FF] cursor-ns-resize"
          />
          <span className="text-[9px] font-mono text-slate-400">
            {luma > 0 ? `+${luma}` : luma}
          </span>
        </div>
      </div>
    </div>
  );
}

// Scrubbable Horizontal Drag Number Input
function ScrubbyInput({ label, value, min, max, step = 1, unit = '', onChange }) {
  const handlePointerDown = (e) => {
    const startX = e.clientX;
    const startVal = value ?? 0;

    const onPointerMove = (me) => {
      const delta = (me.clientX - startX) * step;
      const newVal = Math.max(min, Math.min(max, Math.round(startVal + delta)));
      onChange(newVal);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      className="scrubby-input p-2 rounded-lg bg-[#1C1C21] border border-[#242429] flex items-center justify-between text-xs hover:border-[#0A84FF]/50 transition-colors"
      title="Click and drag horizontally to scrub value"
    >
      <span className="text-[11px] text-slate-400 font-mono">{label}</span>
      <span className="font-mono text-slate-200 font-bold tabular-nums">
        {value > 0 && unit !== '%' ? `+${value}` : value}
        {unit}
      </span>
    </div>
  );
}

export default function ColorWheelsInspector({ clip, onUpdate }) {
  const f = clip.colorFilter || {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotate: 0,
    blur: 0,
    lutPreset: 'none',
    temperature: 0,
    tint: 0,
    vignette: 0,
    shadows: { hue: 0, sat: 0, luma: 0 },
    midtones: { hue: 0, sat: 0, luma: 0 },
    highlights: { hue: 0, sat: 0, luma: 0 }
  };

  const updateF = (field, val) => {
    onUpdate({
      colorFilter: {
        ...f,
        [field]: val
      }
    });
  };

  return (
    <div className="space-y-4 p-3.5 bg-[#161619] rounded-xl border border-[#242429] text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#242429]">
        <div className="flex items-center space-x-1.5 text-slate-200 font-semibold font-mono text-[11px] uppercase">
          <Disc className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>3-Way Color Wheels &amp; Balance</span>
        </div>
        <span className="text-[10px] font-mono text-[#0A84FF]">Final Cut Color</span>
      </div>

      {/* 3 Circular Color Wheels: Shadows (Lift), Midtones (Gamma), Highlights (Gain) */}
      <div className="grid grid-cols-3 gap-2">
        <ColorWheel
          label="Shadows"
          value={f.shadows || { hue: 0, sat: 0, luma: 0 }}
          onChange={(val) => updateF('shadows', val)}
        />
        <ColorWheel
          label="Midtones"
          value={f.midtones || { hue: 0, sat: 0, luma: 0 }}
          onChange={(val) => updateF('midtones', val)}
        />
        <ColorWheel
          label="Highlights"
          value={f.highlights || { hue: 0, sat: 0, luma: 0 }}
          onChange={(val) => updateF('highlights', val)}
        />
      </div>

      {/* Scrubbable Color Temperature & Grading Controls */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <ScrubbyInput
          label="Color Temp"
          value={f.temperature || 0}
          min={-100}
          max={100}
          unit="K"
          onChange={(val) => updateF('temperature', val)}
        />
        <ScrubbyInput
          label="Color Tint"
          value={f.tint || 0}
          min={-100}
          max={100}
          onChange={(val) => updateF('tint', val)}
        />
        <ScrubbyInput
          label="Contrast"
          value={f.contrast ?? 100}
          min={50}
          max={200}
          unit="%"
          onChange={(val) => updateF('contrast', val)}
        />
        <ScrubbyInput
          label="Saturation"
          value={f.saturation ?? 100}
          min={0}
          max={250}
          unit="%"
          onChange={(val) => updateF('saturation', val)}
        />
        <ScrubbyInput
          label="Lens Vignette"
          value={f.vignette || 0}
          min={0}
          max={100}
          unit="%"
          onChange={(val) => updateF('vignette', val)}
        />
        <ScrubbyInput
          label="Lens Blur"
          value={f.blur || 0}
          min={0}
          max={25}
          unit="px"
          onChange={(val) => updateF('blur', val)}
        />
      </div>

      {/* 1-Click Hollywood LUT Cards & Intensity */}
      <div className="space-y-2 pt-2 border-t border-[#242429]">
        <div className="flex items-center justify-between">
          <label className="text-[10px] text-slate-300 font-mono uppercase font-bold flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#FF9F0A]" />
            <span>15+ Cinema LUT Profiles</span>
          </label>
          <span className="text-[10px] font-mono text-[#0A84FF]">
            {f.lutPreset !== 'none' ? LUT_PRESETS.find(p => p.id === f.lutPreset)?.name || f.lutPreset : 'Rec.709'}
          </span>
        </div>

        {/* LUT Intensity Slider */}
        {f.lutPreset && f.lutPreset !== 'none' && (
          <div className="space-y-1 p-2 rounded-lg bg-[#151518] border border-[#26262B]">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>LUT Intensity</span>
              <span className="text-white font-bold">{f.lutIntensity ?? 100}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={f.lutIntensity ?? 100}
              onChange={(e) => updateF('lutIntensity', parseInt(e.target.value, 10))}
              className="w-full accent-[#0A84FF] h-1.5 bg-[#25252A] rounded cursor-pointer"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
          {LUT_PRESETS.map((lut) => {
            const isSelected = f.lutPreset === lut.id;
            return (
              <button
                key={lut.id}
                onClick={() => updateF('lutPreset', lut.id)}
                title={lut.name}
                className={`px-1.5 py-1.5 rounded-md text-[10px] font-mono truncate transition-all text-left ${
                  isSelected
                    ? 'bg-[#0A84FF] text-white font-bold shadow-sm ring-1 ring-[#0A84FF]'
                    : 'bg-[#1C1C21] text-slate-400 hover:text-white border border-white/[0.04] hover:bg-[#25252A]'
                }`}
              >
                {lut.name.replace(/^(None \(|Hollywood |Kodak |Fujifilm |Sunset |Wes Anderson |Action )/, '').replace(/\)$/, '')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

