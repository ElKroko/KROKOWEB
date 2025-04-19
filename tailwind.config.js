/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#3B82F6', // blue-500
            DEFAULT: '#2563EB', // blue-600
            dark: '#1D4ED8', // blue-700
          },
          secondary: {
            light: '#10B981', // emerald-500
            DEFAULT: '#059669', // emerald-600
            dark: '#047857', // emerald-700
          },
          accent: {
            light: '#8B5CF6', // violet-500
            DEFAULT: '#7C3AED', // violet-600
            dark: '#6D28D9', // violet-700
          },
          'dark-bg': '#121212',
          'dark-text': '#F3F4F6',
          'dark-card': '#1F2937',
          'dark-border': '#374151',
          'dark-muted': '#374151',
        },
        fontFamily: {
          sans: ['var(--font-geist-sans)'],
          mono: ['var(--font-geist-mono)'],
        },
      },
    },
    plugins: [],
    darkMode: 'class',
  }