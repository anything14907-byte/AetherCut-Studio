import React, { useState } from 'react';
import { useStudio } from '../../../context/StudioContext';
import { FCP_ROLES } from '../../../types/studioTypes';
import { X, Film, Download, Check, HardDrive, Monitor, Share2 } from 'lucide-react';

export default function FcpShareModal() {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    project,
    startVideoExport,
    exportProgress
  } = useStudio();

  const [activeTab, setActiveTab] = useState('settings'); // 'info' | 'settings'
  const [format, setFormat] = useState('videoAudio'); // 'videoAudio' | 'appleDevices' | 'master'
  const [codec, setCodec] = useState('h264'); // 'h264' | 'prores' | 'webm'
  const [resolution, setResolution] = useState('1920x1080');

  if (!isShareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl bg-[#1E1E20] border border-[#000000] rounded-xl shadow-2xl overflow-hidden flex flex-col text-xs text-[#ECECEE] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] animate-in fade-in zoom-in-95 duration-150">
        {/* macOS Window Header */}
        <div className="h-9 bg-[#18181A] border-b border-[#000000] px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-white">Share — Master File</span>
            <span className="text-[10px] text-[#8E8E93] font-mono">(Cmd+E)</span>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="text-[#8E8E93] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Preview Thumbnail + Right Settings */}
        <div className="flex p-5 space-x-5">
          {/* Left Thumbnail & File Estimate */}
          <div className="w-56 flex flex-col space-y-3 shrink-0">
            <div className="aspect-video bg-[#000000] rounded-[4px] border border-[#323238] overflow-hidden relative flex items-center justify-center shadow-md">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1B3B6F] to-[#0A192F] opacity-90" />
              <Film className="w-8 h-8 text-white/40" />
              <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-[#F5A623] font-bold">
                1080p60
              </div>
            </div>

            <div className="bg-[#151517] p-2.5 rounded-[4px] border border-[#2D2D31] font-mono text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">SIZE:</span>
                <span className="text-white font-bold">~14.2 MB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">CODEC:</span>
                <span className="text-white uppercase">{codec}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">RESOLUTION:</span>
                <span className="text-white">{resolution}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E93]">DURATION:</span>
                <span className="text-white">{project.duration.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Right: Info / Settings Tabs */}
          <div className="flex-1 flex flex-col space-y-3">
            {/* Tabs Switcher */}
            <div className="flex bg-[#151517] p-0.5 rounded-[4px] border border-[#2D2D31] text-[11px] font-medium">
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-1 rounded-[3px] transition-colors ${
                  activeTab === 'settings' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                Settings
              </button>
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-1 rounded-[3px] transition-colors ${
                  activeTab === 'info' ? 'bg-[#3A3A40] text-white shadow-sm' : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                Info &amp; Roles
              </button>
            </div>

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-2.5">
                <div>
                  <label className="text-[10px] text-[#8E8E93] font-mono block pb-1">FORMAT</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full bg-[#151517] border border-[#2D2D31] text-[11px] text-white rounded p-1.5 focus:outline-none"
                  >
                    <option value="videoAudio">Video and Audio (Master File)</option>
                    <option value="appleDevices">Apple Devices (QuickTime H.264)</option>
                    <option value="master">Computer (Client-Side MP4/WebM)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#8E8E93] font-mono block pb-1">VIDEO CODEC</label>
                  <select
                    value={codec}
                    onChange={(e) => setCodec(e.target.value)}
                    className="w-full bg-[#151517] border border-[#2D2D31] text-[11px] text-white rounded p-1.5 focus:outline-none"
                  >
                    <option value="h264">H.264 High Profile</option>
                    <option value="prores">Apple ProRes 422 HQ</option>
                    <option value="webm">WebM VP9 High Efficiency</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-[#8E8E93] font-mono block pb-1">RESOLUTION</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full bg-[#151517] border border-[#2D2D31] text-[11px] text-white rounded p-1.5 focus:outline-none"
                  >
                    <option value="1920x1080">1920 x 1080 HD (16:9)</option>
                    <option value="1080x1920">1080 x 1920 Vertical (9:16)</option>
                    <option value="3840x2160">3840 x 2160 4K UHD</option>
                  </select>
                </div>
              </div>
            )}

            {/* Info & Roles Tab */}
            {activeTab === 'info' && (
              <div className="space-y-2">
                <span className="text-[10px] text-[#8E8E93] font-mono block">ROLES TO EXPORT:</span>
                <div className="space-y-1.5">
                  {FCP_ROLES.map((r) => (
                    <label key={r.id} className="flex items-center space-x-2 text-[11px] cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#0A84FF] rounded" />
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                      <span className="text-white">{r.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Progress Bar (if active) */}
        {exportProgress && (
          <div className="px-5 py-2 bg-[#151517] border-t border-[#000000] space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#8E8E93]">
              <span>RENDERING CLIENT-SIDE...</span>
              <span className="text-[#0A84FF] font-bold">{exportProgress.percent}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#2A2A2E] rounded-full overflow-hidden">
              <div
                style={{ width: `${exportProgress.percent}%` }}
                className="h-full bg-[#0A84FF] transition-all duration-100"
              />
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="h-11 bg-[#18181A] border-t border-[#000000] px-4 flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#8E8E93]">Zero Watermarks · 100% Free</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsShareModalOpen(false)}
              className="px-3 py-1 rounded-[4px] bg-[#2A2A2E] hover:bg-[#34343A] text-[#ECECEE] text-[11px] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={startVideoExport}
              className="px-4 py-1 rounded-[4px] bg-[#0A84FF] hover:bg-blue-500 text-white font-semibold text-[11px] shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save / Render Video</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

