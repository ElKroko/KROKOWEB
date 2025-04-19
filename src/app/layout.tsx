import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import './base-styles.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AccentColorProvider } from '@/providers/AccentColorProvider';
import { DualModeProvider } from '@/providers/DualModeProvider';
import SidebarLayout from '@/components/layout/SidebarLayout';
import SectionTracker from '@/components/SectionTracker';
// Import metadata from separate file
import './metadata';

// Main font for body text
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

// Monospace font for code and accents
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider>
          <DualModeProvider>
            <AccentColorProvider>
              <SectionTracker />
              <SidebarLayout>
                {children}
              </SidebarLayout>
            </AccentColorProvider>
          </DualModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
