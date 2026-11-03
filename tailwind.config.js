/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#07080C',
          900: '#0C0E15',
          800: '#11131A',
          700: '#181B26',
          600: '#222634',
          500: '#32374A',
        },
        electric: {
          cyan: '#00F2FE',
          violet: '#8A2BE2',
          purple: '#7928CA',
          magenta: '#FF007A',
          emerald: '#10B981',
          amber: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        display: ['Syne', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glass-glow': '0 0 35px -5px rgba(0, 242, 254, 0.15)',
        'violet-glow': '0 0 35px -5px rgba(138, 43, 226, 0.2)',
        'subtle-glow': '0 4px 24px -2px rgba(0, 0, 0, 0.5)',
      },
      borderColor: {
        hairline: 'rgba(255, 255, 255, 0.08)',
        'hairline-bright': 'rgba(255, 255, 255, 0.16)',
      },
      backgroundImage: {
        'gradient-electric': 'linear-gradient(135deg, #00F2FE 0%, #8A2BE2 100%)',
        'gradient-cinema': 'radial-gradient(ellipse at 50% -20%, rgba(138, 43, 226, 0.15) 0%, rgba(7, 8, 12, 0) 70%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(24, 27, 38, 0.6) 0%, rgba(17, 19, 26, 0.8) 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}

