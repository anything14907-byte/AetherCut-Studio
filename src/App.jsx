import React from 'react';
import { useStudio } from './context/StudioContext';
import Navbar from './components/common/Navbar';
import LandingView from './components/landing/LandingView';
import StudioWorkspace from './components/studio/StudioWorkspace';
import ExportModal from './components/common/ExportModal';
import KeyboardShortcutsModal from './components/common/KeyboardShortcutsModal';
import ApiKeyModal from './components/common/ApiKeyModal';
import { Sparkles, Info } from 'lucide-react';

export default function App() {
  const { activeView, toastMessage } = useStudio();

  return (
    <div className="min-h-screen bg-[#07080C] text-slate-100 flex flex-col font-sans selection:bg-[#00F2FE]/20 selection:text-[#00F2FE] overflow-hidden">
      {/* Top Universal Navbar */}
      <Navbar />

      {/* View Switcher: Showcase Landing vs Studio Workspace */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeView === 'landing' ? <LandingView /> : <StudioWorkspace />}
      </div>

      {/* Global Modals */}
      <ExportModal />
      <KeyboardShortcutsModal />
      <ApiKeyModal />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-[#0C0E15]/95 border border-[#00F2FE]/40 text-slate-100 text-xs shadow-2xl backdrop-blur-md flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-[#00F2FE] shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}

