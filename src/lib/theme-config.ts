// Configuración del tema para KROKOWEB
export const themeConfig = {
  // Colores principales
  colors: {
    primary: {
      light: '#74B3CE',  // Azul claro
      mid: '#508991',    // Verde azulado
      dark: '#172A3A',   // Azul oscuro
    },
    secondary: '#004346', // Verde azul oscuro
    accent: '#09BC8A',    // Verde vibrante
  },
  
  // Configuración de fuentes
  fonts: {
    sans: 'Geist, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  
  // Configuración del modo oscuro
  dark: {
    background: '#172A3A',     // Azul oscuro
    surface: '#1c3140',        // Una variante ligeramente más clara del azul oscuro
    border: '#508991',         // Verde azulado
    text: {
      primary: '#F3F4F6',      // Texto principal
      secondary: '#D1D5DB',    // Texto secundario
      muted: '#9CA3AF',        // Texto desenfocado
    }
  }
};