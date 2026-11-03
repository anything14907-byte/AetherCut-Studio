import React from 'react';
import { useStudio } from './context/StudioContext';
import Navbar from './components/common/Navbar';
import LandingView from './components/landing/LandingView';
import StudioWorkspace from './components/studio/StudioWorkspace';
import ExportModal from './components/common/ExportModal';
import KeyboardShortcutsModal from './components/common/KeyboardShortcutsModal';
import ApiKeyModal from './components/common/ApiKeyModal';
import SpotlightCommandHud from './components/common/SpotlightCommandHud';
import { Sparkles } from 'lucide-react';

export default function App() {
  const { activeView, toastMessage } = useStudio();

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-slate-100 flex flex-col font-sans selection:bg-[#0A84FF]/25 selection:text-[#0A84FF] overflow-hidden">
      {/* Top Universal Navbar */}
      <Navbar />

      {/* View Switcher: Showcase Landing vs Studio Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'landing' ? <LandingView /> : <StudioWorkspace />}
      </div>

      {/* Global Modals & Spotlight Command HUD */}
      <SpotlightCommandHud />
      <ExportModal />
      <KeyboardShortcutsModal />
      <ApiKeyModal />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-[#161619]/95 border border-[#0A84FF]/40 text-slate-100 text-xs shadow-2xl backdrop-blur-md flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#0A84FF] shrink-0" />
            <span className="font-medium font-sans">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
