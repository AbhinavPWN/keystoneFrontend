/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#1e40af',  // blue-900 light
          dark: '#0f172a',   // slate-900 dark
        },
      },
      fontFamily: {
        roboto: ['var(--font-roboto)', 'sans-serif'],
        playfair: ['var(--font-playfair-display)', 'serif'],
      },
      container: {
        center: true,
        padding: '1rem',  // equivalent to px-4
        screens: {
          xl: '1280px',   // or adjust as needed
        },
      },
    },
  },
  plugins: [],
};