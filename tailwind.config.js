/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      fontFamily: {
        // 1. Set INTER as the default body font
        sans: ['"Inter"', 'sans-serif'],
        
        // 2. Add MONTSERRAT for headings (usage: font-montserrat)
        montserrat: ['"Montserrat"', 'sans-serif'],
        
        // 3. Keep existing custom fonts
        cursive: ['"Dancing Script"', '"Brush Script MT"', 'cursive'],
        festive: ['"Dancing Script"', 'cursive'],
        inter: ['"Inter"', 'sans-serif'], // Optional explicit utility
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'shine': 'shine 1.5s ease-in-out',
      },
      keyframes: {
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' },
        },
      },
    },
  },
  plugins: [],
}