import * as THREE from 'three';

/**
 * Converts a hex color string to an RGB object
 * @param hex Hex color string (e.g. "#09BC8A")
 * @returns Object with r, g, b values normalized to 0-1 range for WebGL
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  
  return { r, g, b };
}

/**
 * Converts a hex color string to a THREE.Color object
 * @param hex Hex color string
 * @returns THREE.Color object
 */
export function hexToThreeColor(hex: string): THREE.Color {
  const rgb = hexToRgb(hex);
  return new THREE.Color(rgb.r, rgb.g, rgb.b);
}

/**
 * Generates a complementary color for a given hex color
 * @param hex Hex color string
 * @returns Complementary color as hex string
 */
export function getComplementaryColor(hex: string): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255);
  const g = ((bigint >> 8) & 255);
  const b = (bigint & 255);
  
  // Invert colors (complementary)
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;
  
  // Convert back to hex
  return `#${((compR << 16) | (compG << 8) | compB).toString(16).padStart(6, '0')}`;
}

/**
 * Creates a soft pastel version of the given color
 * @param hex Hex color string
 * @param lightness 0-1 value to control lightness (higher = lighter)
 * @returns Pastel version of color as hex string
 */
export function getSoftPastelColor(hex: string, lightness: number = 0.7): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255);
  const g = ((bigint >> 8) & 255);
  const b = (bigint & 255);
  
  // Mix with white to create pastel
  const pastelR = Math.floor(r + (255 - r) * lightness);
  const pastelG = Math.floor(g + (255 - g) * lightness);
  const pastelB = Math.floor(b + (255 - b) * lightness);
  
  // Convert back to hex
  return `#${((pastelR << 16) | (pastelG << 8) | pastelB).toString(16).padStart(6, '0')}`;
}

/**
 * Creates a darker shade of the given color
 * @param hex Hex color string
 * @param amount 0-1 value to control how dark (higher = darker)
 * @returns Darker version of color as hex string
 */
export function getDarkerColor(hex: string, amount: number = 0.3): string {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Parse hex values
  const bigint = parseInt(hex, 16);
  const r = ((bigint >> 16) & 255);
  const g = ((bigint >> 8) & 255);
  const b = (bigint & 255);
  
  // Reduce rgb values to create darker shade
  const darkerR = Math.floor(r * (1 - amount));
  const darkerG = Math.floor(g * (1 - amount));
  const darkerB = Math.floor(b * (1 - amount));
  
  // Convert back to hex
  return `#${((darkerR << 16) | (darkerG << 8) | darkerB).toString(16).padStart(6, '0')}`;
}

/**
 * Generates a monochromatic color palette based on a single color
 * @param baseColor Base hex color string
 * @param steps Number of colors to generate (including the base)
 * @returns Array of hex color strings in a monochromatic scale
 */
export function generateMonochromePalette(baseColor: string, steps: number = 5): string[] {
  const palette: string[] = [];
  
  // Calculate step size to distribute colors evenly
  const darkStep = 0.7 / (Math.floor(steps / 2));
  const lightStep = 0.7 / (Math.ceil(steps / 2));
  
  // Add darker shades
  for (let i = Math.floor(steps / 2) - 1; i >= 0; i--) {
    const amount = (i + 1) * darkStep;
    palette.push(getDarkerColor(baseColor, amount));
  }
  
  // Add base color
  palette.push(baseColor);
  
  // Add lighter shades
  for (let i = 0; i < Math.ceil(steps / 2) - 1; i++) {
    const amount = (i + 1) * lightStep;
    palette.push(getSoftPastelColor(baseColor, amount));
  }
  
  return palette;
}

/**
 * Function to calculate a complete set of contrast colors based on a given accent color
 * Returns background, text and complementary colors that work well together
 */
export function generateContrastColors(accentColor: string) {
  // Asegurarse de que el color comienza con #
  const safeColor = accentColor.startsWith('#') ? accentColor : `#${accentColor}`;
  
  try {
    // Convert hex to RGB to manipulate values
    const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
      // Handle shorthand hex
      const normHex = hex.startsWith('#') ? hex.slice(1) : hex;
      const fullHex = normHex.length === 3 
        ? normHex.split('').map(c => c + c).join('') 
        : normHex;
      
      const r = parseInt(fullHex.substring(0, 2), 16);
      const g = parseInt(fullHex.substring(2, 4), 16);
      const b = parseInt(fullHex.substring(4, 6), 16);
      
      // Manejar casos donde el parsing falla
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        console.error('Invalid color format:', hex, 'Using fallback');
        return { r: 0, g: 0, b: 0 };
      }
      
      return { r, g, b };
    };
    
    // Get brightness (0-255) - higher values are brighter
    const getBrightness = ({ r, g, b }: { r: number, g: number, b: number }): number => {
      return (r * 299 + g * 587 + b * 114) / 1000;
    };
    
    // Calculate lighter/darker variations
    const getLighterColor = (hex: string, amount: number = 0.8): string => {
      const rgb = hexToRgb(hex);
      const lighterRgb = {
        r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount)),
        g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount)),
        b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount))
      };
      
      return `#${lighterRgb.r.toString(16).padStart(2, '0')}${lighterRgb.g.toString(16).padStart(2, '0')}${lighterRgb.b.toString(16).padStart(2, '0')}`;
    };
    
    const getDarkerColor = (hex: string, amount: number = 0.2): string => {
      const rgb = hexToRgb(hex);
      const darkerRgb = {
        r: Math.round(rgb.r * amount),
        g: Math.round(rgb.g * amount),
        b: Math.round(rgb.b * amount)
      };
      
      return `#${darkerRgb.r.toString(16).padStart(2, '0')}${darkerRgb.g.toString(16).padStart(2, '0')}${darkerRgb.b.toString(16).padStart(2, '0')}`;
    };
    
    // Calculate complementary color
    const getComplementaryColor = (hex: string, saturationAdjust: number = 0.8): string => {
      const rgb = hexToRgb(hex);
      
      // Obtener complementario simple (invertir)
      const compR = 255 - rgb.r;
      const compG = 255 - rgb.g;
      const compB = 255 - rgb.b;
      
      // Ajustar saturación para hacer el color más atractivo
      const brightness = getBrightness({r: compR, g: compG, b: compB});
      const mid = 127.5;
      
      // Ajustar basado en el brillo para evitar colores demasiado apagados
      const adjustedRgb = {
        r: Math.round(compR * saturationAdjust + (brightness < mid ? (255 - compR) * (1 - saturationAdjust) : 0)),
        g: Math.round(compG * saturationAdjust + (brightness < mid ? (255 - compG) * (1 - saturationAdjust) : 0)),
        b: Math.round(compB * saturationAdjust + (brightness < mid ? (255 - compB) * (1 - saturationAdjust) : 0))
      };
      
      return `#${adjustedRgb.r.toString(16).padStart(2, '0')}${adjustedRgb.g.toString(16).padStart(2, '0')}${adjustedRgb.b.toString(16).padStart(2, '0')}`;
    };
    
    // Calcular el esquema de triple color
    const rgb = hexToRgb(safeColor);
    const brightness = getBrightness(rgb);
    
    // Color fuerte (el acento original)
    const strongColor = safeColor;
    
    // Color de fondo (muy claro o muy oscuro basado en el acento)
    const bgColor = brightness > 127 ? getLighterColor(safeColor, 0.95) : getDarkerColor(safeColor, 0.15);
    
    // Color complementario (para botones y elementos destacados)
    const compColor = getComplementaryColor(safeColor);
    
    // Color de texto basado en el fondo
    const bgRgb = hexToRgb(bgColor);
    const bgBrightness = getBrightness(bgRgb);
    const textColor = bgBrightness > 127 ? '#000000' : '#ffffff';
    
    return { 
      strongColor,    // Color principal/acento
      bgColor,        // Color de fondo
      compColor,      // Color complementario
      textColor       // Color de texto para constrastar con el fondo
    };
  } catch (error) {
    console.error('Error generating contrast colors:', error);
    // Valores por defecto en caso de error
    return { 
      strongColor: '#09BC8A',
      bgColor: '#172A3A',
      compColor: '#F16F6E',
      textColor: '#FFFFFF'
    };
  }
}