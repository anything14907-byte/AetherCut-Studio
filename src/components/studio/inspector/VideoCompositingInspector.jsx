import React from 'react';
import { BLEND_MODES } from '../../../types/studioTypes';
import { Move, RotateCw, ZoomIn, Eye, Crop, Sparkles, Wand2 } from 'lucide-react';

export default function VideoCompositingInspector({ clip, onUpdate }) {
  const t = clip.transform || { x: 0, y: 0, scale: 1.0, rotation: 0, opacity: 1.0, blendMode: 'normal' };
  const crop = clip.crop || { top: 0, bottom: 0, left: 0, right: 0 };
  const chroma = clip.chromaKey || { enabled: false, color: '#00FF00', tolerance: 0.35, softness: 0.1 };
  const colorFilter = clip.colorFilter || {};

  const updateT = (field, val) => {
    onUpdate({
      transform: {
        ...t,
        [field]: val
      }
    });
  };

  const updateCrop = (field, val) => {
    onUpdate({
      crop: {
        ...crop,
        [field]: val
      }
    });
  };

  const updateChroma = (field, val) => {
    onUpdate({
      chromaKey: {
        ...chroma,
        [field]: val
      }
    });
  };

  return (
    <div className="space-y-4 p-3.5 bg-[#161619] rounded-xl border border-[#242429] text-xs">
      {/* Transform & Spatial Framing */}
      <div className="space-y-2.5">
        <div className="flex items-center space-x-1.5 text-slate-200 font-semibold font-mono text-[11px] uppercase pb-1 border-b border-[#242429]">
          <Move className="w-3.5 h-3.5 text-[#0A84FF]" />
          <span>Transform &amp; Framing</span>
        </div>

        {/* Position X / Y */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 font-mono">X Offset (px)</label>
            <input
              type="number"
              value={t.x || 0}
              onChange={(e) => updateT('x', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#0A84FF]"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-mono">Y Offset (px)</label>
            <input
              type="number"
              value={t.y || 0}
              onChange={(e) => updateT('y', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none focus:border-[#0A84FF]"
            />
          </div>
        </div>

        {/* Scale */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span className="flex items-center space-x-1">
              <ZoomIn className="w-3 h-3 text-[#0A84FF]" />
              <span>Scale</span>
            </span>
            <span className="font-mono text-[#0A84FF] font-bold tabular-nums">
              {Math.round((t.scale || 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="3.0"
            step="0.05"
            value={t.scale ?? 1.0}
            onChange={(e) => updateT('scale', parseFloat(e.target.value))}
            className="w-full accent-[#0A84FF]"
          />
        </div>

        {/* Rotation */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span className="flex items-center space-x-1">
              <RotateCw className="w-3 h-3 text-[#0A84FF]" />
              <span>Rotation</span>
            </span>
            <span className="font-mono text-slate-300 tabular-nums">{t.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min="-180"
            max="180"
            step="1"
            value={t.rotation || 0}
            onChange={(e) => updateT('rotation', parseInt(e.target.value, 10))}
            className="w-full accent-[#0A84FF]"
          />
        </div>

        {/* Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-slate-300">
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3 text-[#0A84FF]" />
              <span>Opacity</span>
            </span>
            <span className="font-mono text-slate-300 tabular-nums">
              {Math.round((t.opacity ?? 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={t.opacity ?? 1.0}
            onChange={(e) => updateT('opacity', parseFloat(e.target.value))}
            className="w-full accent-[#0A84FF]"
          />
        </div>

        {/* Compositing Blend Mode */}
        <div className="space-y-1 pt-1">
          <label className="text-[10px] text-slate-400 font-mono uppercase font-bold">
            Blend Mode
          </label>
          <select
            value={t.blendMode || 'normal'}
            onChange={(e) => updateT('blendMode', e.target.value)}
            className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#0A84FF]"
          >
            {BLEND_MODES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Crop & Trim */}
      <div className="space-y-2 pt-2 border-t border-[#242429]">
        <div className="flex items-center space-x-1.5 text-slate-200 font-semibold font-mono text-[11px] uppercase">
          <Crop className="w-3.5 h-3.5 text-[#30D158]" />
          <span>Crop &amp; Trim (px)</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[9px] text-slate-400 font-mono">Top</label>
            <input
              type="number"
              min="0"
              max="500"
              value={crop.top || 0}
              onChange={(e) => updateCrop('top', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-400 font-mono">Bottom</label>
            <input
              type="number"
              min="0"
              max="500"
              value={crop.bottom || 0}
              onChange={(e) => updateCrop('bottom', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-400 font-mono">Left</label>
            <input
              type="number"
              min="0"
              max="500"
              value={crop.left || 0}
              onChange={(e) => updateCrop('left', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[9px] text-slate-400 font-mono">Right</label>
            <input
              type="number"
              min="0"
              max="500"
              value={crop.right || 0}
              onChange={(e) => updateCrop('right', parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#111114] border border-[#242429] rounded-lg px-2 py-1 text-slate-200 font-mono text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 1-Click Chroma Keyer */}
      <div className="space-y-2 pt-2 border-t border-[#242429]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-slate-200 font-semibold font-mono text-[11px] uppercase">
            <Wand2 className="w-3.5 h-3.5 text-[#30D158]" />
            <span>Chroma Keyer</span>
          </div>
          <input
            type="checkbox"
            checked={!!chroma.enabled}
            onChange={(e) => updateChroma('enabled', e.target.checked)}
            className="accent-[#30D158] w-4 h-4 cursor-pointer"
          />
        </div>

        {chroma.enabled && (
          <div className="space-y-2 p-2 rounded-lg bg-[#111114] border border-[#242429]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono">Key Color:</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => updateChroma('color', '#00FF00')}
                  className={`w-5 h-5 rounded-md border ${chroma.color === '#00FF00' ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: '#00FF00' }}
                  title="Green Screen"
                />
                <button
                  onClick={() => updateChroma('color', '#0000FF')}
                  className={`w-5 h-5 rounded-md border ${chroma.color === '#0000FF' ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: '#0000FF' }}
                  title="Blue Screen"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Tolerance</span>
                <span>{Math.round((chroma.tolerance || 0.35) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.02"
                value={chroma.tolerance || 0.35}
                onChange={(e) => updateChroma('tolerance', parseFloat(e.target.value))}
                className="w-full accent-[#30D158]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
