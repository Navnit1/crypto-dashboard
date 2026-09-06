/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0A0E17',
          900: '#0F1521',
          800: '#141B2B',
          700: '#1B2436',
          600: '#28324A',
          500: '#3D4A66',
          400: '#6B7A99',
          300: '#9AA7C2',
          200: '#C7CEE0',
          100: '#E8EBF2',
        },
        signal: {
          up: '#2DD9A8',
          down: '#FF6B7A',
          accent: '#7C5CFF',
          accent2: '#3FC5FF',
          amber: '#FFB454',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        grid: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}

