import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { speechService } from '../../../services/speechService';
import { audioEngine } from '../../../services/audioEngine';
import { PROCEDURAL_AUDIO_TRACKS, PROCEDURAL_SFX } from '../../../types/studioTypes';
import { Mic, Music, Volume2, Play, Plus, Sparkles, Radio } from 'lucide-react';

export default function TabAudioVoice() {
  const { addClip, currentTime, showToast } = useStudio();

  // TTS State
  const [ttsText, setTtsText] = useState('Welcome to AetherCut Studio. The ultra-fast video editor.');
  const [ttsRate, setTtsRate] = useState(1.0);
  const [ttsPitch, setTtsPitch] = useState(1.0);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  // Audition TTS
  const handlePreviewTts = () => {
    if (!ttsText.trim()) return;
    setIsPlayingPreview(true);
    speechService.speak(ttsText, {
      rate: ttsRate,
      pitch: ttsPitch,
      onEnd: () => setIsPlayingPreview(false)
    });
  };

  // Add TTS voiceover clip to timeline A1 track
  const handleAddVoiceoverClip = () => {
    if (!ttsText.trim()) return;
    const estDuration = speechService.estimateDuration(ttsText, ttsRate);

    const newClip = {
      id: `a1-tts-${Date.now()}`,
      trackId: 'A1',
      type: 'voiceover',
      name: `Voiceover: "${ttsText.slice(0, 15)}..."`,
      startTime: currentTime,
      duration: estDuration,
      trimStart: 0,
      trimEnd: estDuration,
      audio: {
        volume: 1.0,
        fadeIn: 0.1,
        fadeOut: 0.2,
        ttsText,
        ttsRate,
        ttsPitch
      }
    };

    addClip(newClip);
  };

  // Audition Procedural BGM
  const handleAuditionBgm = (bgmId) => {
    audioEngine.startBgm(bgmId, 0.6);
    showToast(`Auditioning ${bgmId} (play/pause timeline to stop)`);
  };

  // Add BGM Clip
  const handleAddBgmClip = (bgmObj) => {
    const newClip = {
      id: `a1-bgm-${Date.now()}`,
      trackId: 'A1',
      type: 'audio',
      name: bgmObj.name,
      startTime: currentTime,
      duration: 18.0,
      trimStart: 0,
      trimEnd: 18.0,
      audio: {
        volume: 0.65,
        fadeIn: 0.5,
        fadeOut: 1.0,
        sfxType: bgmObj.id
      }
    };
    addClip(newClip);
  };

  // SFX Audition & Add
  const handlePlaySfx = (sfxId) => {
    audioEngine.playSfx(sfxId, 0.85);
  };

  const handleAddSfxClip = (sfxObj) => {
    const newClip = {
      id: `a1-sfx-${Date.now()}`,
      trackId: 'A1',
      type: 'audio',
      name: sfxObj.name,
      startTime: currentTime,
      duration: sfxObj.duration,
      trimStart: 0,
      trimEnd: sfxObj.duration,
      audio: {
        volume: 0.85,
        fadeIn: 0.0,
        fadeOut: 0.2,
        sfxType: sfxObj.id
      }
    };
    addClip(newClip);
  };

  return (
    <div className="h-full flex flex-col p-3.5 space-y-4 select-none text-xs overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2 border-b border-white/[0.08]">
        <Mic className="w-4 h-4 text-[#10B981]" />
        <span className="font-semibold text-white">Voiceover &amp; Audio Suite</span>
      </div>

      {/* 1. Native Web Speech TTS Section */}
      <div className="p-3 bg-[#11131A] rounded-xl border border-white/[0.06] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-300 font-bold uppercase flex items-center space-x-1">
            <Radio className="w-3.5 h-3.5 text-[#10B981]" />
            <span>AI Voiceover Generator</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">Web Speech API</span>
        </div>

        <textarea
          rows={2}
          value={ttsText}
          onChange={(e) => setTtsText(e.target.value)}
          placeholder="Enter text to synthesize voiceover..."
          className="w-full bg-[#0C0E15] border border-white/[0.1] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#10B981] resize-none"
        />

        {/* Pitch and Rate Controls */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Speed</span>
              <span className="font-mono">{ttsRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={ttsRate}
              onChange={(e) => setTtsRate(parseFloat(e.target.value))}
              className="w-full accent-[#10B981]"
            />
          </div>
          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Pitch</span>
              <span className="font-mono">{ttsPitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={ttsPitch}
              onChange={(e) => setTtsPitch(parseFloat(e.target.value))}
              className="w-full accent-[#10B981]"
            />
          </div>
        </div>

        <div className="flex space-x-2 pt-1">
          <button
            onClick={handlePreviewTts}
            className="flex-1 py-1.5 rounded-lg bg-[#181B26] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] flex items-center justify-center space-x-1"
          >
            <Play className="w-3 h-3 fill-current text-[#10B981]" />
            <span>Audition</span>
          </button>
          <button
            onClick={handleAddVoiceoverClip}
            className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold flex items-center justify-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>Add to A1</span>
          </button>
        </div>
      </div>

      {/* 2. Procedural Synth BGM Tracks */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
          <Music className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Procedural Synthwave BGM</span>
        </span>

        <div className="space-y-1.5">
          {PROCEDURAL_AUDIO_TRACKS.map((bgm) => (
            <div
              key={bgm.id}
              className="p-2 rounded-xl bg-[#11131A] border border-white/[0.06] flex items-center justify-between"
            >
              <div className="max-w-[170px]">
                <span className="font-medium text-slate-200 block truncate text-xs">
                  {bgm.name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {bgm.bpm} BPM • {bgm.key}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleAuditionBgm(bgm.id)}
                  title="Audition Synth Loop"
                  className="p-1.5 rounded bg-[#181B26] hover:bg-white/[0.08] text-[#10B981]"
                >
                  <Play className="w-3 h-3 fill-current" />
                </button>
                <button
                  onClick={() => handleAddBgmClip(bgm)}
                  title="Add to Timeline"
                  className="p-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Cinematic Sound FX (SFX) */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold flex items-center space-x-1">
          <Volume2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Cinematic Sound FX</span>
        </span>

        <div className="grid grid-cols-2 gap-2">
          {PROCEDURAL_SFX.map((sfx) => (
            <div
              key={sfx.id}
              className="p-2 rounded-xl bg-[#11131A] border border-white/[0.06] space-y-1.5"
            >
              <span className="font-medium text-slate-200 block truncate text-[11px]">
                {sfx.name}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePlaySfx(sfx.id)}
                  className="flex-1 py-1 rounded bg-[#181B26] text-[10px] text-slate-300 hover:text-white flex items-center justify-center space-x-1"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Play</span>
                </button>
                <button
                  onClick={() => handleAddSfxClip(sfx)}
                  className="p-1 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500/40"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

