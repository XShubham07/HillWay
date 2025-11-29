/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Alpine Palette
        alpine: "#2E6F95",
        forest: "#1F4F3C",
        snow: "#FFFFFF",
        stone: "#D7DCE2",
        navy: "#102A43",
        gold: "#D9A441", // This defines 'bg-gold', 'text-gold', etc.
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'], // This defines 'font-heading'
        luxury: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'alpine-gradient': 'linear-gradient(135deg, #102A43 0%, #1F4F3C 100%)',
        'gold-gradient': 'linear-gradient(to right, #D9A441, #F59E0B)',
      }
    },
  },
  plugins: [],
}