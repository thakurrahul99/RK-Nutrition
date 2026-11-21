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
          black: "#111111",
          offwhite: "#F5F4F2",
          red: "#C8202B",
          'red-hover': "#AC1721",
          'red-glow': "rgba(200, 32, 43, 0.35)",
          darkgrey: "#1A1A1A",
          surface: "#161616",
          elevated: "#202020",
          border: "#282828",
          'border-light': "#333333",
          muted: "#8C8C8C",
          subtle: "#5A5A5A"
        }
      },
      fontFamily: {
        heading: ["'Oswald'", "'Bebas Neue'", "sans-serif"],
        display: ["'Bebas Neue'", "'Oswald'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"]
      },
      letterSpacing: {
        widest: '0.22em',
        ultra: '0.3em'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at 50% 0%, rgba(200,32,43,0.22) 0%, rgba(17,17,17,0) 70%)',
        'subtle-grid': 'linear-gradient(to right, #1F1F1F 1px, transparent 1px), linear-gradient(to bottom, #1F1F1F 1px, transparent 1px)'
      }
    },
  },
  plugins: [],
}
