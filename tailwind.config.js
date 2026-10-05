/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#090D16',
        surface: {
          50: '#1a2234',
          100: '#141b2d',
          200: '#0f1626',
          300: '#0c1220',
          card: 'rgba(20, 27, 45, 0.75)',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#818CF8',
          glow: 'rgba(99, 102, 241, 0.35)',
        },
        accent: {
          teal: '#14B8A6',
          cyan: '#06B6D4',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        borderHover: 'rgba(99, 102, 241, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'ps5': '0 20px 40px -15px rgba(0, 0, 0, 0.6), 0 0 25px -5px rgba(99, 102, 241, 0.25)',
        'glow-primary': '0 0 20px -2px rgba(99, 102, 241, 0.4)',
        'glow-teal': '0 0 20px -2px rgba(20, 184, 166, 0.35)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
