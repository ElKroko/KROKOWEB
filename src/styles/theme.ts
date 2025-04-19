export const colors = {
  primary: {
    light: '#74B3CE', // Azul claro - 74B3CE
    mid: '#508991',   // Verde azulado - 508991
    dark: '#172A3A',  // Azul oscuro - 172A3A
  },
  secondary: '#004346', // Verde azul oscuro - 004346
  accent: {
    DEFAULT: '#09BC8A', // Verde vibrante - 09BC8A
    dark: '#078f69',    // Versión más oscura del acento
    light: '#4dd2aa',   // Versión más clara del acento
  },
  
  // Colores de interfaz
  darkBg: '#172A3A',     // Usar el azul oscuro como fondo
  darkSurface: '#1c3140', // Una variante ligeramente más clara
  darkText: '#F3F4F6',    // Texto claro sobre fondos oscuros
  darkBorder: '#508991',  // Bordes sutiles
  
  // Niveles de transparencia comunes
  overlay: {
    light: 'rgba(23, 42, 58, 0.7)',
    medium: 'rgba(23, 42, 58, 0.8)',
    heavy: 'rgba(23, 42, 58, 0.95)',
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

export default { colors, spacing, breakpoints };