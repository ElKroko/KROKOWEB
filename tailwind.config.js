/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary-light': '#74B3CE',
        'primary-mid': '#508991',
        'primary-dark': '#172A3A',
        'secondary': '#004346',
        'accent': {
          DEFAULT: '#09BC8A',
          dark: '#078f69',
          light: '#4dd2aa',
        },
        'dark-bg': '#172A3A',
        'dark-surface': '#1c3140',
        'dark-text': '#F3F4F6',
        'dark-border': '#508991',
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Resto de tus extensiones...
    },
  },
  plugins: [],
}