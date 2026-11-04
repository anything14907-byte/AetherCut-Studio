import React from 'react';
import { useStudio } from '../../context/StudioContext';
import FcpTopBar from './header/FcpTopBar';
import EventMediaBrowser from './browser/EventMediaBrowser';
import FcpViewer from './viewport/FcpViewer';
import FcpInspector from './inspector/FcpInspector';
import CenterDashboardToolbar from './toolbar/CenterDashboardToolbar';
import FcpTimeline from './timeline/FcpTimeline';
import FcpShareModal from './modals/FcpShareModal';
import FcpKeywordsModal from './modals/FcpKeywordsModal';
import ImportMediaModal from './modals/ImportMediaModal';

export default function StudioWorkspace() {
  const {
    showBrowser,
    showTimeline,
    showInspector
  } = useStudio();

  return (
    <div className="flex-1 flex flex-col h-screen w-screen overflow-hidden bg-[#1E1E20] select-none text-[#ECECEE]">
      {/* ZONE 1: TOP WINDOW BAR (macOS FCP Header) */}
      <FcpTopBar />

      {/* UPPER 3 ZONES: Zone 2 (Browser) + Zone 3 (Viewer) + Zone 4 (Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Zone 2: Upper-Left Event & Media Browser */}
        {showBrowser && <EventMediaBrowser />}

        {/* Zone 3: Upper-Center Viewer (GPU Hardware-Accelerated) */}
        <FcpViewer />

        {/* Zone 4: Upper-Right Inspector (Video, Color Board, Audio, Info) */}
        {showInspector && <FcpInspector />}
      </div>

      {/* ZONE 5: SIGNATURE FCP MIDDLE TOOLBAR ("CENTER DASHBOARD") */}
      <CenterDashboardToolbar />

      {/* ZONE 6: BOTTOM TRACKLESS MAGNETIC TIMELINE & EFFECTS DOCK */}
      {showTimeline && (
        <div className="h-64 flex flex-col shrink-0">
          <FcpTimeline />
        </div>
      )}

      {/* MODALS */}
      <FcpShareModal />
      <FcpKeywordsModal />
      <ImportMediaModal />
    </div>
  );
}
