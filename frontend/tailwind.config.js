/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#060b19', // Deepest background
          900: '#0b1121', // Secondary background
          850: '#10182b', // Panel background
          800: '#1e293b',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4', // Accent color
          glow: '#00f2fe',
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(0, 242, 254, 0.3)',
        'glow-strong': '0 0 20px rgba(0, 242, 254, 0.6)',
      },
      backgroundImage: {
        'panel-gradient': 'linear-gradient(145deg, rgba(16, 24, 43, 0.8) 0%, rgba(11, 17, 33, 0.9) 100%)',
      }
    },
  },
  plugins: [],
}
