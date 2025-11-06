import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        solo: {
          50: '#f2f7ff',
          100: '#dbe7ff',
          200: '#b3cdff',
          300: '#8aaeff',
          400: '#5f87ff',
          500: '#3f64f5',
          600: '#2f4bd1',
          700: '#2337a3',
          800: '#192274',
          900: '#0f1447',
          night: '#040714',
          dusk: '#071021',
          void: '#03050e',
          glow: '#61f9f5',
          ember: '#b77bff',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
        accent: ['var(--font-accent)', 'Orbitron', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'solo-haze':
          'radial-gradient(120% 120% at 15% 25%, rgba(64, 124, 255, 0.25) 0%, transparent 60%), radial-gradient(120% 120% at 85% 15%, rgba(97, 249, 245, 0.22) 0%, transparent 55%), linear-gradient(180deg, rgba(3, 6, 18, 0.96) 0%, rgba(6, 10, 28, 0.9) 55%, rgba(6, 9, 23, 0.98) 100%)',
        'solo-panel':
          'linear-gradient(135deg, rgba(18, 26, 49, 0.92) 0%, rgba(20, 28, 59, 0.85) 35%, rgba(21, 30, 65, 0.65) 100%)',
        'solo-mesh':
          'linear-gradient(rgba(63, 100, 245, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(63, 100, 245, 0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        portal:
          '0 0 20px rgba(63, 100, 245, 0.25), 0 0 45px rgba(97, 249, 245, 0.25), inset 0 0 25px rgba(33, 85, 204, 0.35)',
      },
      dropShadow: {
        glow: '0 0 10px rgba(97, 249, 245, 0.5)',
      },
      keyframes: {
        'portal-pulse': {
          '0%, 100%': {
            opacity: '0.75',
            transform: 'translateY(0px)',
          },
          '50%': {
            opacity: '1',
            transform: 'translateY(-6px)',
          },
        },
        'drift-sparks': {
          '0%': {
            transform: 'translate3d(0, 0, 0)',
          },
          '50%': {
            transform: 'translate3d(10px, -18px, 0)',
          },
          '100%': {
            transform: 'translate3d(0, 0, 0)',
          },
        },
      },
      animation: {
        'portal-pulse': 'portal-pulse 12s ease-in-out infinite',
        'drift-sparks': 'drift-sparks 16s ease-in-out infinite',
      },
    },
  },
  plugins: [
    plugin(({ addBase, addUtilities }) => {
      addBase({
        ':root': {
          '--nav-height': '4.25rem',
        },
      });

      addUtilities({
        '.text-glow': {
          textShadow: '0 0 14px rgba(97, 249, 245, 0.55), 0 0 32px rgba(95, 135, 255, 0.35)',
        },
        '.bg-glass': {
          background:
            'linear-gradient(130deg, rgba(12, 18, 36, 0.72) 0%, rgba(14, 21, 42, 0.65) 55%, rgba(18, 26, 49, 0.55) 100%)',
          border: '1px solid rgba(122, 162, 255, 0.15)',
          backdropFilter: 'blur(14px)',
        },
        '.bg-solo-mesh': {
          backgroundSize: '140px 140px, 140px 140px',
        },
        '.scroll-snap-parent': {
          scrollSnapType: 'y proximity',
        },
        '.scroll-snap-section': {
          scrollSnapAlign: 'start',
          scrollSnapStop: 'always',
        },
      });
    }),
  ],
};

export default config;
