// Configuración del tema para KROKOWEB
export const themeConfig = {
  // Colores principales
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
  },
  
  // Configuración de fuentes
  fonts: {
    sans: '"Geist", sans-serif',
    mono: '"Geist Mono", monospace',
  },
  
  // Configuración del modo oscuro
  dark: {
    background: '#121212',
    text: '#F3F4F6',
    card: '#1F2937',
    border: '#374151',
    muted: '#374151',
  }
};