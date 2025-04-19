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