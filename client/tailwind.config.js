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
          black: "#0B0B0B",
          surface: "#121212",
          elevated: "#181818",
          card: "#141414",
          darkgrey: "#1C1C1C",
          border: "#242424",
          'border-light': "#2E2E2E",
          offwhite: "#F5F4F2",
          red: "#E11D2E",
          'red-dark': "#B91422",
          'red-hover': "#CC1827",
          'red-glow': "rgba(225, 29, 46, 0.28)",
          muted: "#8C8C8C",
          subtle: "#666666",
          amber: "#F59E0B",
          'amber-dark': "#D97706",
          'amber-glow': "rgba(245, 158, 11, 0.20)",
        }
      },
      fontFamily: {
        heading: ["'Oswald'", "'Bebas Neue'", "sans-serif"],
        display: ["'Bebas Neue'", "'Oswald'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"]
      },
      letterSpacing: {
        widest: '0.22em',
        ultra: '0.3em'
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at 50% 0%, rgba(225,29,46,0.22) 0%, rgba(11,11,11,0) 70%)',
        'subtle-grid': 'linear-gradient(to right, #1F1F1F 1px, transparent 1px), linear-gradient(to bottom, #1F1F1F 1px, transparent 1px)',
        'btn-primary-gradient': 'linear-gradient(135deg, #E11D2E 0%, #B91422 100%)',
        'btn-primary-hover': 'linear-gradient(135deg, #F02839 0%, #C81927 100%)',
        'surface-highlight': 'radial-gradient(ellipse at 50% 0%, rgba(225, 29, 46, 0.12) 0%, rgba(18, 18, 18, 0) 70%)'
      }
    },
  },
  plugins: [],
}
