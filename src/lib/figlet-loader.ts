import figlet from 'figlet';
// import fs from 'fs';
import path from 'path';

/**
 * Loads custom Figlet fonts from the public/fonts directory
 */
export async function loadFigletFonts() {
  try {
    // In a Next.js environment, we need to use different approaches for server and client
    if (typeof window === 'undefined') {
        // Server-side: conditionally require fs and path
        const fs = require('fs');
      const path = require('path');
      // Server-side: We can use fs to read the fonts directory
      


      const fontDir = path.join(process.cwd(), 'public', 'fonts');
      const fontFiles = fs.readdirSync(fontDir).filter(file => file.endsWith('.flf'));
      
      // Load each font into figlet
      for (const fontFile of fontFiles) {
        const fontName = fontFile.replace('.flf', '');
        const fontPath = path.join(fontDir, fontFile);
        const fontData = fs.readFileSync(fontPath, 'utf8');
        
        // Register the font with figlet
        figlet.parseFont(fontName, fontData);
      }
      
      console.log(`Loaded ${fontFiles.length} Figlet fonts from server`);
    } else {
      // Client-side: We need to fetch the fonts from the public directory
      // Get a list of available fonts first
      const fontFiles = await getFontList();
      
      // Load each font by fetching it
      for (const fontFile of fontFiles) {
        const fontName = fontFile.replace('.flf', '');
        const fontUrl = `/fonts/${fontFile}`;
        
        try {
          const response = await fetch(fontUrl);
          const fontData = await response.text();
          
          // Register the font with figlet
          figlet.parseFont(fontName, fontData);
        } catch (error) {
          console.error(`Error loading font ${fontFile}:`, error);
        }
      }
      
      console.log(`Loaded ${fontFiles.length} Figlet fonts from client`);
    }
    
    return true;
  } catch (error) {
    console.error('Error loading Figlet fonts:', error);
    return false;
  }
}

/**
 * Get a list of all font files in the public/fonts directory
 */
async function getFontList(): Promise<string[]> {
  // In production, we'll use a predefined list of fonts we know exist
  // In development, we could potentially fetch a directory listing
  
  // This is a simplified approach - in a real application, you might want to
  // generate this list at build time or fetch it from an API route
  
  // Sample of fonts we know exist in the directory
  return [
    '3-D.flf',
    '3D Diagonal.flf',
    '3D-ASCII.flf',
    '3x5.flf',
    '4Max.flf',
    '5 Line Oblique.flf',
    'Acrobatic.flf',
    'Alligator.flf',
    'Alligator2.flf',
    'Alpha.flf',
    'Alphabet.flf',
    'Banner.flf',
    'Banner3-D.flf',
    'Banner3.flf',
    'Banner4.flf',
    'Barbwire.flf',
    'Basic.flf',
    'Big.flf',
    'Bigfig.flf',
    'Binary.flf',
    'Block.flf',
    'Bubble.flf',
    'Bulbhead.flf',
    'Chunky.flf',
    'Colossal.flf',
    'Computer.flf',
    'Digital.flf',
    'Doh.flf',
    'Doom.flf',
    'Epic.flf',
    'Ghost.flf',
    'Graffiti.flf',
    'Isometric1.flf',
    'Isometric2.flf',
    'Isometric3.flf',
    'Isometric4.flf',
    'Lean.flf',
    'Mini.flf',
    'Shadow.flf',
    'Slant.flf',
    'Small.flf',
    'Standard.flf',
    'Star Wars.flf',
  ];
}

/**
 * Get all available font names (without the .flf extension)
 */
export async function getAvailableFontNames(): Promise<string[]> {
  const fontFiles = await getFontList();
  return fontFiles.map(file => file.replace('.flf', ''));
}

// Export a function to get a complete list of all fonts in the directory
export async function getAllFontsFromDirectory(): Promise<string[]> {
  if (typeof window === 'undefined') {
    // Server-side: conditionally require fs and path
    const fs = require('fs');
    const path = require('path');
    // Server-side: We can use fs to read the directory
    try {
      const fontDir = path.join(process.cwd(), 'public', 'fonts');
      const fontFiles = fs.readdirSync(fontDir).filter(file => file.endsWith('.flf'));
      return fontFiles.map(file => file.replace('.flf', ''));
    } catch (error) {
      console.error('Error reading font directory:', error);
      return [];
    }
  } else {
    // Client-side: Return the predefined list
    return await getAvailableFontNames();
  }
}