// Sistema centralizado de temas para KROKOWEB

// Paleta de colores principal
export const colors = {
  primary: {
    light: '#74B3CE', // Azul claro
    mid: '#508991',   // Verde azulado
    dark: '#172A3A',  // Azul oscuro
  },
  secondary: '#004346', // Verde azul oscuro
  accent: {
    DEFAULT: '#09BC8A', // Verde vibrante (acento principal)
    dark: '#078f69',    // Versión más oscura del acento
    light: '#4dd2aa',   // Versión más clara del acento
  },
  
  // Definición de la interfaz en modo oscuro
  dark: {
    background: '#172A3A',     // Fondo principal - mismo que primary.dark
    surface: '#1c3140',        // Superficies y componentes
    text: {
      primary: '#F3F4F6',      // Texto principal
      secondary: '#D1D5DB',    // Texto secundario
      muted: '#9CA3AF',        // Texto desenfocado
    },
    border: '#508991',         // Bordes - mismo que primary.mid
  },
  
  // Colores específicos por ruta
  routes: {
    '/visual': '#74B3CE',      // ART - primary.light
    '/programming': '#508991', // CODE - primary.mid
    '/trading': '#172A3A',     // TRADE - primary.dark
    '/gallery': '#09BC8A',     // CREATE - accent.DEFAULT
    '/music': '#EC4899',       // Pink
    '/about': '#F59E0B',       // Amber
    '/contact': '#6366F1',     // Indigo
    '/emed': '#F97316',        // Orange
  },
  
  // Niveles de transparencia comunes
  overlay: {
    light: 'rgba(23, 42, 58, 0.7)',
    medium: 'rgba(23, 42, 58, 0.8)',
    heavy: 'rgba(23, 42, 58, 0.95)',
  }
};

// Configuración de fuentes
export const fonts = {
  sans: 'Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: 'JetBrains Mono, monospace',
  letterSpacing: '0.025em',
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  }
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '4rem',
  '3xl': '6rem',
  '4xl': '8rem',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Exportar todo como un objeto unificado
export default { colors, fonts, spacing, breakpoints };