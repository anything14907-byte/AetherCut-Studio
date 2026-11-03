import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { aiDirectorEngine } from '../../services/aiDirectorEngine';
import { X, Key, ShieldCheck, Cpu, ExternalLink } from 'lucide-react';

export default function ApiKeyModal() {
  const { isApiKeyModalOpen, setIsApiKeyModalOpen, showToast } = useStudio();
  const [geminiKey, setGeminiKey] = useState(aiDirectorEngine.getKey('gemini'));
  const [openaiKey, setOpenaiKey] = useState(aiDirectorEngine.getKey('openai'));
  const [pexelsKey, setPexelsKey] = useState(aiDirectorEngine.getKey('pexels'));

  if (!isApiKeyModalOpen) return null;

  const handleSave = () => {
    aiDirectorEngine.saveKey('gemini', geminiKey.trim());
    aiDirectorEngine.saveKey('openai', openaiKey.trim());
    aiDirectorEngine.saveKey('pexels', pexelsKey.trim());
    showToast('API keys saved locally to your browser');
    setIsApiKeyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0C0E15] border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-[#00F2FE]" />
            <h3 className="font-semibold text-sm text-white">AI Director Settings & BYO API Keys</h3>
          </div>
          <button
            onClick={() => setIsApiKeyModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.08]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Privacy Note */}
          <div className="p-3 bg-gradient-to-r from-[#00F2FE]/10 to-[#8A2BE2]/10 border border-[#00F2FE]/20 rounded-lg flex items-start space-x-2.5">
            <Cpu className="w-4 h-4 text-[#00F2FE] shrink-0 mt-0.5" />
            <div className="text-slate-300 leading-relaxed">
              <span className="font-semibold text-white">100% Offline Procedural Engine Active:</span> You do <span className="underline">not</span> need any API key to direct videos, generate multi-track scripts, synthesize voiceovers, or export. Adding keys enables cloud LLM prompt embellishment. Keys stay stored exclusively in your browser's <code className="text-[#00F2FE]">localStorage</code>.
            </div>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Google Gemini API Key (Optional)</label>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#00F2FE] hover:underline flex items-center space-x-1"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-[#11131A] border border-white/[0.1] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-[#00F2FE] font-mono"
            />
          </div>

          {/* OpenAI Key */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">OpenAI API Key (Optional)</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-[#11131A] border border-white/[0.1] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-[#00F2FE] font-mono"
            />
          </div>

          {/* Pexels Key */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Pexels Stock Media API Key (Optional)</label>
            <input
              type="password"
              value={pexelsKey}
              onChange={(e) => setPexelsKey(e.target.value)}
              placeholder="Pexels authorization token..."
              className="w-full bg-[#11131A] border border-white/[0.1] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-[#00F2FE] font-mono"
            />
          </div>
        </div>

        <div className="px-5 py-3 bg-[#11131A] border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-1 text-[11px] text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Server Analytics</span>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#8A2BE2] text-obsidian-950 font-semibold text-xs hover:brightness-110 shadow-glass-glow"
          >
            Save Keys Locally
          </button>
        </div>
      </div>
    </div>
  );
}

