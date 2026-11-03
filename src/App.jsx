import React from 'react';
import { useStudio } from './context/StudioContext';
import StudioWorkspace from './components/studio/StudioWorkspace';
import KeyboardShortcutsModal from './components/common/KeyboardShortcutsModal';
import SpotlightCommandHud from './components/common/SpotlightCommandHud';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const { toastMessage } = useStudio();

  return (
    <div className="h-screen w-screen bg-[#1E1E20] text-[#ECECEE] flex flex-col font-sans selection:bg-[#0A84FF]/25 selection:text-[#0A84FF] overflow-hidden">
      {/* 1:1 Apple Final Cut Pro (macOS) Professional Workstation */}
      <StudioWorkspace />

      {/* Global Pro Modals */}
      <SpotlightCommandHud />
      <KeyboardShortcutsModal />

      {/* Subtle macOS Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-150 pointer-events-none">
          <div className="px-3.5 py-2 rounded-lg bg-[#18181A]/95 border border-[#3A3A40] text-white text-xs shadow-2xl backdrop-blur-md flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0A84FF] shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
