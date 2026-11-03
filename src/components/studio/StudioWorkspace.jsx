import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import DockNavigation from './dock/DockNavigation';
import TabAiDirector from './dock/TabAiDirector';
import TabMediaLibrary from './dock/TabMediaLibrary';
import TabTextCaptions from './dock/TabTextCaptions';
import TabAudioVoice from './dock/TabAudioVoice';
import TabTransitionsFx from './dock/TabTransitionsFx';
import CanvasViewport from './viewport/CanvasViewport';
import InspectorPanel from './inspector/InspectorPanel';
import TimelineEngine from './timeline/TimelineEngine';

export default function StudioWorkspace() {
  const {
    showBrowser,
    showInspector,
    leftDockWidth,
    setLeftDockWidth,
    workspaceMode
  } = useStudio();

  // If workspaceMode is 'ai', switch activeTab to 'ai'
  const [activeTab, setActiveTab] = useState(() => (workspaceMode === 'ai' ? 'ai' : 'ai'));

  // Right drag-resize handle for Left Asset Dock
  const handleDockResizeDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = leftDockWidth;

    const onMove = (me) => {
      const deltaX = me.clientX - startX;
      const newW = Math.max(220, Math.min(480, startW + deltaX));
      setLeftDockWidth(newW);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3rem)] overflow-hidden bg-[#0B0B0D] select-none">
      {/* Upper 3 Zones: Zone A (Left Dock) + Zone B (Center Viewport) + Zone C (Right Inspector) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Zone A: Left Dock & Collapsible Asset Drawer */}
        {showBrowser && (
          <div className="flex shrink-0 relative">
            <DockNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <div
              style={{ width: `${leftDockWidth}px` }}
              className="bg-[#161619] border-r border-[#242429] flex flex-col overflow-hidden relative"
            >
              {activeTab === 'ai' && <TabAiDirector />}
              {activeTab === 'media' && <TabMediaLibrary />}
              {activeTab === 'text' && <TabTextCaptions />}
              {activeTab === 'audio' && <TabAudioVoice />}
              {activeTab === 'fx' && <TabTransitionsFx />}

              {/* Right Drag Resize Handle for Left Dock */}
              <div
                onPointerDown={handleDockResizeDown}
                title="Drag to resize dock width"
                className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize hover:bg-[#0A84FF] transition-colors z-30 flex items-center justify-center -mr-[3px]"
              >
                <div className="w-[1px] h-8 bg-white/20" />
              </div>
            </div>
          </div>
        )}

        {/* Zone B: Center Real-Time Canvas Viewport */}
        <CanvasViewport />

        {/* Zone C: Right Context-Aware Inspector */}
        {showInspector && <InspectorPanel />}
      </div>

      {/* Zone D: Bottom Multi-Track Timeline Engine */}
      <TimelineEngine />
    </div>
  );
}
