/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        walnut: {
          dark: '#3D1F0A',
          mid: '#6B3F1F',
        },
        amber: {
          glow: '#C87941',
        },
        ivory: {
          deep: '#F0E6D3',
          bright: '#FDF9F3',
        }
      },
      fontFamily: {
        title: ['"Gowun Dodum"', 'sans-serif'],
        body: ['"Noto Sans KR"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(61, 31, 10, 0.08)',
        'inner-soft': 'inset 0 2px 4px rgba(61, 31, 10, 0.04)',
      },
      borderRadius: {
        'xl': '14px',
      }
    },
  },
  plugins: [],
}
