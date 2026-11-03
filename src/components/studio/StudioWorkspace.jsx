import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('ai');

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] overflow-hidden bg-[#07080C] select-none">
      {/* Upper 3 Zones: Zone A (Left Dock) + Zone B (Center Canvas) + Zone C (Right Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Zone A: Left Dock & Collapsible Asset Drawer */}
        <div className="flex shrink-0">
          <DockNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="w-72 bg-[#0C0E15] border-r border-white/[0.08] flex flex-col overflow-hidden">
            {activeTab === 'ai' && <TabAiDirector />}
            {activeTab === 'media' && <TabMediaLibrary />}
            {activeTab === 'text' && <TabTextCaptions />}
            {activeTab === 'audio' && <TabAudioVoice />}
            {activeTab === 'fx' && <TabTransitionsFx />}
          </div>
        </div>

        {/* Zone B: Center Real-Time Canvas Viewport */}
        <CanvasViewport />

        {/* Zone C: Right Context-Aware Inspector */}
        <InspectorPanel />
      </div>

      {/* Zone D: Bottom Multi-Track Timeline Engine */}
      <TimelineEngine />
    </div>
  );
}

