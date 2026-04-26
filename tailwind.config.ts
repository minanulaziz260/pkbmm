import type { Config } from 'tailwindcss';

// Konfigurasi Tailwind - palet minimalis dengan aksen biru pastel & sage green
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Aksen warna utama - biru pastel yang menenangkan
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#bbdcff',
          300: '#7ebfff',
          400: '#3b9dff',
          500: '#1a7ff2',
          600: '#0e63d1',
          700: '#0d4ea8',
          800: '#114389',
          900: '#133a6f',
        },
        // Aksen sekunder - sage green untuk progress & status positif
        sage: {
          50: '#f4f8f4',
          100: '#e6efe6',
          200: '#cbddcb',
          300: '#a3c3a3',
          400: '#78a378',
          500: '#5a885a',
          600: '#456c45',
          700: '#395639',
          800: '#2f452f',
          900: '#263826',
        },
        ink: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgb(0 0 0 / 0.06), 0 4px 16px -4px rgb(0 0 0 / 0.04)',
        lift: '0 8px 24px -8px rgb(0 0 0 / 0.10), 0 2px 8px -2px rgb(0 0 0 / 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
