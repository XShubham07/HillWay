import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hillway-dark': '#022c22',
        'hillway-gold': '#D9A441',
        'hillway-green': '#1F4F3C',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      // Customize prose styles for dark mode
      typography: {
        DEFAULT: {
          css: {
            color: '#D1D5DB', // gray-300
            a: {
              color: '#22d3ee', // cyan-400
              '&:hover': {
                color: '#67e8f9', // cyan-300
              },
            },
            h1: { color: '#FFFFFF' },
            h2: { color: '#FFFFFF', marginTop: '2em' },
            h3: { color: '#FFFFFF', marginTop: '1.5em' },
            strong: { color: '#FFFFFF' },
            code: { color: '#22d3ee' },
            blockquote: { borderLeftColor: '#D9A441', color: '#9CA3AF' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // ✅ Added this plugin
  ],
}
export default config
