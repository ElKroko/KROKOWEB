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
 * Get a list of all font files from the public/fonts directory by fetching the API route.
 */
async function getFontList(): Promise<string[]> {
    try {
      // Fetch the list of fonts from our API route
      const response = await fetch('/api/fonts'); 
      
      if (!response.ok) {
        throw new Error(`Failed to fetch font list: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
          throw new Error(`API Error: ${data.error}`);
      }
  
      return data.fonts || []; // Return the fonts array or an empty array if undefined
    } catch (error) {
      console.error("Error in getFontList:", error);
      // Fallback to an empty list or potentially a minimal default list
      return []; 
    }
  }
  
  /**
   * Get all available font names (without the .flf extension)
   */
  export async function getAvailableFontNames(): Promise<string[]> {
    // This function now implicitly uses the API fetch via getFontList
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
        const fontFiles = fs.readdirSync(fontDir).filter((file: string) => file.endsWith('.flf'));
        return fontFiles.map((file: string) => file.replace('.flf', ''));
      } catch (error) {
        console.error('Error reading font directory:', error);
        return [];
      }
    } else {
      // Client-side: This will now fetch the list via the API route
      return await getAvailableFontNames(); 
    }
  }
