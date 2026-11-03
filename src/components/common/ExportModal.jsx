import React, { useEffect, useRef } from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, Film, CheckCircle, AlertTriangle, Loader2, Sparkles, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportModal() {
  const { isExportModalOpen, exportProgress, cancelVideoExport } = useStudio();
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    if (exportProgress && exportProgress.previewCanvas && previewCanvasRef.current) {
      const target = previewCanvasRef.current;
      const tCtx = target.getContext('2d');
      if (tCtx) {
        tCtx.drawImage(
          exportProgress.previewCanvas,
          0,
          0,
          target.width,
          target.height
        );
      }
    }

    if (exportProgress && exportProgress.percent >= 100) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [exportProgress]);

  if (!isExportModalOpen) return null;

  const isComplete = exportProgress && exportProgress.percent >= 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0C0E15] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-[#00F2FE]" />
            <h3 className="font-semibold text-sm text-white">
              {isComplete ? 'Export Complete!' : 'Rendering Video (Client-Side)'}
            </h3>
          </div>
          {!isComplete && (
            <button
              onClick={cancelVideoExport}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-center">
          {/* Live Mini Preview Canvas */}
          <div className="w-full aspect-video bg-[#07080C] rounded-lg border border-white/[0.08] overflow-hidden flex items-center justify-center relative shadow-inner">
            <canvas
              ref={previewCanvasRef}
              width={320}
              height={180}
              className="w-full h-full object-contain"
            />
            {!isComplete && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] font-mono text-[#00F2FE] border border-white/[0.1] flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>REC</span>
              </div>
            )}
          </div>

          {/* Progress Bar & Stats */}
          {!isComplete ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center space-x-1.5">
                  <Loader2 className="w-3.5 h-3.5 text-[#00F2FE] animate-spin" />
                  <span>Compositing frames...</span>
                </span>
                <span className="font-mono text-[#00F2FE] font-bold">
                  {exportProgress ? `${exportProgress.percent}%` : '0%'}
                </span>
              </div>

              {/* Bar */}
              <div className="w-full h-2 bg-[#181B26] rounded-full overflow-hidden border border-white/[0.06]">
                <div
                  className="h-full bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] transition-all duration-150 ease-out"
                  style={{ width: `${exportProgress?.percent || 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                <span>
                  Frame: {exportProgress?.frame || 0} / {exportProgress?.totalFrames || '--'}
                </span>
                <span>Est. Remaining: {exportProgress?.remainingSec ?? '--'}s</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Your Video is Ready!</h4>
              <p className="text-xs text-slate-300">
                Saved directly to your Downloads folder without any watermarks or subscriptions.
              </p>
            </div>
          )}

          {/* Guarantee Pill */}
          <div className="py-2 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center space-x-2 text-[11px] text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-electric-cyan" />
            <span>Zero Watermarks • 100% Free • High-Bitrate WebM</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#11131A] border-t border-white/[0.06] flex items-center justify-end space-x-2">
          {!isComplete ? (
            <button
              onClick={cancelVideoExport}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/[0.06]"
            >
              Cancel Render
            </button>
          ) : (
            <button
              onClick={cancelVideoExport}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 font-semibold text-xs hover:brightness-110 shadow-glass-glow"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

