/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0a66c2',     // Professional 'Trust Blue' (LinkedIn style)
          primaryHover: '#004182',// Deeper blue for hover states
          bg: '#f3f2ef',          // Soft off-white dashboard background
          surface: '#ffffff',     // Crisp pure white for cards and modals
          text: '#191919',        // Deep slate for main text (easier to read than pure black)
          muted: '#666666',       // Gray for secondary text and icons
          border: '#e0dfdc'       // Soft gray for borders and dividers
        }
      },
      fontFamily: {
        // Using Inter as the primary workhorse, falling back to clean native OS fonts
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}