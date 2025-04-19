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
          DEFAULT: 'var(--accent-color, #09BC8A)',
          dark: '#078f69',
          light: '#4dd2aa',
        },
        'dark-bg': '#172A3A',
        'dark-surface': '#1c3140',
        'dark-text': '#F3F4F6',
        'dark-border': '#508991',
        // Monochromatic scale for minimalist typography
        'gray': {
          '100': 'var(--color-gray-100)',
          '200': 'var(--color-gray-200)',
          '300': 'var(--color-gray-300)',
          '400': 'var(--color-gray-400)',
          '500': 'var(--color-gray-500)',
          '600': 'var(--color-gray-600)',
          '700': 'var(--color-gray-700)',
          '800': 'var(--color-gray-800)',
          '900': 'var(--color-gray-900)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '60ch',
            color: 'var(--color-text)',
            letterSpacing: 'var(--letter-spacing)',
            lineHeight: 'var(--line-height-normal)',
            '> *': {
              marginTop: 'var(--spacing-lg)',
              marginBottom: 'var(--spacing-lg)',
            },
            h1: {
              color: 'var(--color-text)',
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--line-height-tight)',
            },
            h2: {
              color: 'var(--color-text)',
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              lineHeight: 'var(--line-height-tight)',
            },
            p: {
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              lineHeight: 'var(--line-height-relaxed)',
            },
          },
        },
      },
      spacing: {
        '4xl': 'var(--spacing-4xl)',
        '3xl': 'var(--spacing-3xl)',
        '2xl': 'var(--spacing-2xl)',
      },
      letterSpacing: {
        tight: '-0.025em',
        normal: 'var(--letter-spacing)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
      },
    },
  },
  plugins: [],
}