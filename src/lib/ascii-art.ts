import figlet from 'figlet';
import { promisify } from 'util';

// Convertir figlet.text a una versión basada en promesas
const figletPromise = promisify(figlet.text);

// Tipos para las opciones de figlet
export type FigletOptions = {
  font?: string;
  horizontalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing';
  verticalLayout?: 'default' | 'full' | 'fitted' | 'controlled smushing' | 'universal smushing';
  width?: number;
  whitespaceBreak?: boolean;
};

// Estilos predefinidos para el texto ASCII
export type AsciiTextStyle = {
  id: string;
  name: string;
  figletFont?: string;
  description: string;
  customRenderer?: (text: string) => Promise<string>;
  preview: string;
  category: 'figlet' | 'custom' | 'animated';
  options?: FigletOptions;
};

/**
 * Genera arte ASCII a partir de texto usando figlet
 */
export async function generateFigletText(text: string, options: FigletOptions = {}): Promise<string> {
  try {
    // Valor predeterminado para texto vacío
    if (!text.trim()) {
      text = 'KROKO';
    }
    
    return await figletPromise(text, options);
  } catch (error) {
    console.error('Error generando texto ASCII con figlet:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Genera arte ASCII con un marco
 */
export async function generateFramedText(text: string): Promise<string> {
  try {
    // Si el texto está vacío, usar un valor predeterminado
    if (!text.trim()) {
      text = 'KROKO';
    }
    
    // Generar texto ASCII base con figlet usando una fuente simple
    const asciiText = await figletPromise(text, { font: 'straight' });
    
    // Dividir en líneas y encontrar la línea más larga
    const lines = asciiText.split('\n');
    const maxLength = Math.max(...lines.map(line => line.length));
    
    // Crear el marco superior
    const topBorder = '╔' + '═'.repeat(maxLength + 2) + '╗\n';
    
    // Colocar cada línea dentro del marco
    const framedContent = lines.map(line => {
      // Rellenar con espacios para alinear el borde derecho
      const padding = ' '.repeat(maxLength - line.length);
      return '║ ' + line + padding + ' ║';
    }).join('\n');
    
    // Crear el marco inferior
    const bottomBorder = '\n╚' + '═'.repeat(maxLength + 2) + '╝';
    
    // Combinar todo
    return topBorder + framedContent + bottomBorder;
  } catch (error) {
    console.error('Error generando texto ASCII enmarcado:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Genera texto ASCII en zigzag
 */
export async function generateZigzagText(text: string): Promise<string> {
  try {
    if (!text.trim()) {
      text = 'KROKO';
    }
    
    let result = '';
    const chars = text.split('');
    
    // Crear un efecto zigzag con los caracteres
    chars.forEach((char, i) => {
      const spaces = ' '.repeat(i % 8);
      result += spaces + char + '\n';
    });
    
    return result;
  } catch (error) {
    console.error('Error generando texto ASCII zigzag:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Genera texto ASCII con sombra
 */
export async function generateShadowText(text: string): Promise<string> {
  try {
    if (!text.trim()) {
      text = 'KROKO';
    }
    
    // Generar texto ASCII base
    const asciiText = await figletPromise(text, { font: 'standard' });
    const lines = asciiText.split('\n');
    
    // Crear una copia con desplazamiento para la sombra
    const shadowLines = lines.map(line => {
      return line.replace(/[^ ]/g, '░');
    });
    
    // Desplazar la sombra
    const shadowText = shadowLines.map((line, i) => {
      if (i < lines.length - 1) {
        return ' ' + line.substring(0, line.length - 1);
      }
      return ' ' + line;
    });
    
    // Combinar el texto original con la sombra
    const result = lines.map((line, i) => {
      return line + '\n' + (shadowText[i] || '');
    }).join('\n');
    
    return result;
  } catch (error) {
    console.error('Error generando texto ASCII con sombra:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Convierte texto a matriz binaria (1s y 0s)
 */
export async function generateBinaryText(text: string): Promise<string> {
  try {
    if (!text.trim()) {
      text = 'KROKO';
    }
    
    // Generar texto ASCII base con una fuente simple
    const asciiText = await figletPromise(text, { font: 'standard' });
    
    // Reemplazar caracteres con 1s y 0s
    const binaryText = asciiText.replace(/[^ ]/g, (match, offset) => {
      return (offset % 2 === 0) ? '1' : '0';
    });
    
    return binaryText;
  } catch (error) {
    console.error('Error generando texto ASCII binario:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * Genera un texto en forma de onda
 */
export async function generateWaveText(text: string): Promise<string> {
  try {
    if (!text.trim()) {
      text = 'KROKO';
    }
    
    const chars = text.toUpperCase().split('');
    const lines: string[] = Array(7).fill('');
    
    // Crear un patrón de onda para cada carácter
    chars.forEach(char => {
      const wave = [
        `  ${char}  `,
        ` ${char}${char}${char} `,
        `${char}   ${char}`,
        `${char}   ${char}`,
        `${char}   ${char}`,
        ` ${char}${char}${char} `,
        `  ${char}  `
      ];
      
      // Añadir cada línea de la onda a la línea correspondiente
      wave.forEach((line, i) => {
        lines[i] += line;
      });
    });
    
    return lines.join('\n');
  } catch (error) {
    console.error('Error generando texto ASCII en onda:', error);
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}

// Lista de fuentes disponibles en figlet (un subconjunto para no saturar la interfaz)
export const figletFonts = [
  'Standard',
  '3-D',
  '3x5',
  'Avatar',
  'Banner',
  'Basic',
  'Big',
  'Bigfig',
  'Binary',
  'Block',
  'Bubble',
  'Bulbhead',
  'Chunky',
  'Colossal',
  'Computer',
  'Digital',
  'Doh',
  'Doom',
  'Epic',
  'Fender',
  'Fire Font-s',
  'Ghost',
  'Graffiti',
  'Impossible',
  'Isometric1',
  'Isometric2',
  'Isometric3',
  'Isometric4',
  'Lean',
  'Letters',
  'Linux',
  'Merlin1',
  'Merlin2',
  'Mini',
  'Mnemonic',
  'Morse',
  'Moscow',
  'Ogre',
  'Poison',
  'Rectangles',
  'Reverse',
  'Roman',
  'Rounded',
  'Rozzo',
  'Runic',
  'Script',
  'Shadow',
  'Slant',
  'Small',
  'Soft',
  'Standard',
  'Star Wars',
  'Sub-Zero',
  'Swampland',
  'Sweet',
  'Train',
  'Univers',
  'Varsity'
];

// Colección de estilos predefinidos
export const asciiTextStyles: AsciiTextStyle[] = [
  {
    id: 'standard',
    name: 'Estándar',
    figletFont: 'Standard',
    description: 'El clásico estilo ASCII de FIGlet',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Standard' }
  },
  {
    id: 'shadow',
    name: 'Sombra',
    figletFont: 'Shadow',
    description: 'Texto con efecto de sombra',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Shadow' }
  },
  {
    id: 'slant',
    name: 'Inclinado',
    figletFont: 'Slant',
    description: 'Texto con estilo inclinado',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Slant' }
  },
  {
    id: 'block',
    name: 'Bloque',
    figletFont: 'Block',
    description: 'Letras formadas por bloques',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Block' }
  },
  {
    id: 'banner',
    name: 'Banner',
    figletFont: 'Banner',
    description: 'Estilo de banner o pancarta',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Banner' }
  },
  {
    id: 'doom',
    name: 'Doom',
    figletFont: 'Doom',
    description: 'Inspirado en el clásico videojuego',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Doom' }
  },
  {
    id: 'big',
    name: 'Grande',
    figletFont: 'Big',
    description: 'Letras de gran tamaño',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Big' }
  },
  {
    id: 'mini',
    name: 'Mini',
    figletFont: 'Mini',
    description: 'Versión pequeña y compacta',
    preview: 'KROKO',
    category: 'figlet',
    options: { font: 'Mini' }
  },
  {
    id: 'framed',
    name: 'Enmarcado',
    description: 'Texto con un marco decorativo alrededor',
    customRenderer: generateFramedText,
    preview: 'KROKO',
    category: 'custom'
  },
  {
    id: 'zigzag',
    name: 'Zigzag',
    description: 'Texto formando un patrón en zigzag',
    customRenderer: generateZigzagText,
    preview: 'KROKO',
    category: 'custom'
  },
  {
    id: 'shadow-custom',
    name: 'Sombra Personalizada',
    description: 'Texto con efecto de sombra más pronunciado',
    customRenderer: generateShadowText,
    preview: 'KROKO',
    category: 'custom'
  },
  {
    id: 'binary',
    name: 'Binario',
    description: 'Texto formado por unos y ceros',
    customRenderer: generateBinaryText,
    preview: 'KROKO',
    category: 'custom'
  },
  {
    id: 'wave',
    name: 'Onda',
    description: 'Texto con patrón de onda',
    customRenderer: generateWaveText,
    preview: 'KROKO',
    category: 'custom'
  }
];

/**
 * Genera texto ASCII según el estilo seleccionado
 */
export async function generateAsciiArt(text: string, style: AsciiTextStyle): Promise<string> {
  try {
    if (!text || !text.trim()) {
      text = 'KROKO';
    }
    
    // Si el estilo tiene un renderizador personalizado, usarlo
    if (style.customRenderer) {
      return await style.customRenderer(text);
    }
    
    // De lo contrario, usar figlet con las opciones del estilo
    return await generateFigletText(text, style.options);
  } catch (error) {
    console.error(`Error generando arte ASCII con estilo ${style.name}:`, error);
    return `Error generando arte ASCII: ${error instanceof Error ? error.message : String(error)}`;
  }
}