import figlet from 'figlet';

/**
 * Generates ASCII art text using figlet
 * 
 * @param text - The text to convert to ASCII art
 * @param font - Optional figlet font (defaults to 'Standard')
 * @returns Promise<string> - The generated ASCII art
 */
export const generateAsciiArt = (text: string, font: figlet.Fonts = 'Standard'): Promise<string> => {
  return new Promise((resolve, reject) => {
    figlet.text(text, {
      font,
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data || '');
    });
  });
};

/**
 * Predefined ASCII art patterns that can be used as backgrounds or separators
 */
export const asciiPatterns = {
  dots: `
· · · · · · · · · · · · · · · · · · · · · · 
 · · · · · · · · · · · · · · · · · · · · · 
· · · · · · · · · · · · · · · · · · · · · · 
 · · · · · · · · · · · · · · · · · · · · ·
`,
  lines: `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`,
  blocks: `
█▓▒░ █▓▒░ █▓▒░ █▓▒░ █▓▒░ █▓▒░ █▓▒░ █▓▒░ 
░▒▓█ ░▒▓█ ░▒▓█ ░▒▓█ ░▒▓█ ░▒▓█ ░▒▓█ ░▒▓█ 
`,
  simple: `
╭────────────────────────────────────────╮
│                                        │
╰────────────────────────────────────────╯
`
};

/**
 * List of ASCII art fonts available in figlet that work well
 * with the minimalist aesthetic
 */
export const asciiArtFonts = [
  'Standard',
  'Slant',
  'Small',
  'Thin',
  'Calvin S',
  'Cybermedium',
  'Digital'
] as figlet.Fonts[];

/**
 * Type definition for ASCII options
 */
export type AsciiOptions = {
  width?: number;
  charPalette?: string[];
  colored?: boolean;
};

// Paleta de caracteres para el efecto ASCII (del más oscuro al más claro)
export const DEFAULT_CHAR_PALETTE = ['@','#','S','%','?','*','+',';',':',',','.',' '];

/**
 * Mapea un valor de brillo a un carácter ASCII
 */
export function mapBrightnessToChar(brightness: number, palette: string[] = DEFAULT_CHAR_PALETTE): string {
  return palette[Math.floor((brightness/255) * (palette.length - 1))];
}

/**
 * Convierte una imagen a arte ASCII
 * @param imageData - Los datos de la imagen
 * @param options - Opciones de configuración
 * @returns El arte ASCII como string
 */
export function imageToAscii(
  imageData: ImageData, 
  options: AsciiOptions = {}
): string {
  const { width = 80, charPalette = DEFAULT_CHAR_PALETTE, colored = false } = options;
  
  const originalWidth = imageData.width;
  const originalHeight = imageData.height;
  const aspectRatio = originalHeight / originalWidth;
  const height = Math.floor(width * aspectRatio * 0.5); // Ajuste para ratio de aspecto de fuentes monoespaciadas
  
  const data = imageData.data;
  let asciiArt = '';
  
  // Recorrer la imagen a intervalos regulares según el tamaño deseado
  const stepX = originalWidth / width;
  const stepY = originalHeight / height;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Calcular posición en la imagen original
      const origX = Math.floor(x * stepX);
      const origY = Math.floor(y * stepY);
      const index = (origY * originalWidth + origX) * 4;
      
      // Obtener valores RGB
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      
      // Calcular brillo (promedio simple de RGB)
      const brightness = (r + g + b) / 3;
      
      // Mapear brillo a carácter
      asciiArt += mapBrightnessToChar(brightness, charPalette);
    }
    asciiArt += '\n';
  }
  
  return asciiArt;
}

/**
 * Convierte una imagen base64 a ASCII
 * @param base64Image - Imagen en formato base64
 * @param options - Opciones de configuración
 * @returns Promesa con el resultado ASCII
 */
export function base64ImageToAscii(
  base64Image: string, 
  options: AsciiOptions = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto 2D del canvas'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const asciiArt = imageToAscii(imageData, options);
      resolve(asciiArt);
    };
    
    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };
    
    img.src = base64Image;
  });
}