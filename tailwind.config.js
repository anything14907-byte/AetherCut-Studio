/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Exact Apple Final Cut Pro (macOS) Calibrated Palette
        fcp: {
          chrome: '#1E1E20',       // Panels, headers, inspectors, sidebars
          timelineWell: '#161618', // Timeline container background
          storylineSpine: '#0D0D0F', // Primary Storyline recessed spine
          toolbar: '#222225',      // Middle center dashboard toolbar
          lcdBg: '#0A0A0C',        // Recessed LCD timecode display
          divider: '#000000',      // 1px black structural panel divider
          dividerHighlight: 'rgba(255, 255, 255, 0.07)', // 1px top bevel highlight
          selection: '#F5A623',    // Exact Final Cut Pro yellow/amber clip selection
          accent: '#0A84FF',       // Apple Pro Blue (active toggles, key icons)
          skimmer: '#FF453A',      // Hover skimmer red line
          playhead: '#FFFFFF',     // Parked playhead white line
          greenAudio: '#30D158',   // Audio meter green
          amberAudio: '#FF9F0A',   // Audio meter amber
          redAudio: '#FF453A',     // Audio meter red peak
          
          // Official FCP Role Colors
          roleVideo: '#2B5B9E',       // Primary & Connected Video body
          roleVideoHeader: '#1D3F70', // Video clip header bar
          roleTitle: '#6E4594',       // Titles role body
          roleTitleHeader: '#4D2E6B', // Titles header bar
          roleDialogue: '#266894',    // Dialogue audio role
          roleDialogueWave: '#4CA8E0',// Dialogue cyan waveform
          roleMusic: '#217346',       // Music audio role
          roleMusicWave: '#42B874',   // Music bright green waveform
          roleSfx: '#1B7A82',         // Effects audio role
          roleSfxWave: '#3AC5D1',     // Effects aqua waveform
          roleGap: '#2A2A2D',         // Gap clip dark slate
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Inter', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'fcp-selected': '0 0 0 2px #F5A623, 0 0 10px rgba(245, 166, 35, 0.45)',
        'fcp-lcd': 'inset 0 1px 3px rgba(0, 0, 0, 0.8), 0 1px 0 rgba(255, 255, 255, 0.08)',
        'fcp-panel': '0 4px 20px rgba(0, 0, 0, 0.65)',
      },
    },
  },
  plugins: [],
}
