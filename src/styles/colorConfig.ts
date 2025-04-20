// Color definitions for all sections
// These are organized for easy editing

const colors = {
  // Base colors
  black: '#000000',
  white: '#ffffff',
  
  // Accent colors for each section in light mode (kroko)
  accent: {
    home: '#f8f9fa',       // Blanco para la landing
    art: '#ff5f8d',        // Rosa
    programming: '#42C5B9', // Turquesa
    code: '#42C5B9',       // Turquesa (alias de programming)
    trading: '#6fb46d',    // Verde
    create: '#f9c74f',     // Amarillo
    me: '#9c6edb',         // Púrpura
    contact: '#4a5568',    // Gris azulado
    visual: '#ec4e20',     // Naranja
    music: '#dc2f02',      // Rojo
    gallery: '#8338ec'     // Violeta
  },
  
  // Background colors for dark mode (xklokon) by section
  // These are darker variations of the accent colors
  darkBg: {
    home: '#212529',       // Negro para la landing
    art: '#7D3151',        // Rosa oscuro
    programming: '#103A37', // Turquesa oscuro
    code: '#103A37',       // Turquesa oscuro (alias de programming)
    trading: '#2A4A28',    // Verde oscuro
    create: '#6F4D18',     // Amarillo oscuro
    me: '#3C295E',         // Púrpura oscuro
    contact: '#262D36',    // Gris azulado oscuro
    visual: '#6D2912',     // Naranja oscuro
    music: '#6B1600',      // Rojo oscuro
    gallery: '#3C1A70'     // Violeta oscuro
  },
  
  // Grayscale palette for UI elements
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  }
};

export default colors;