import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import './base-styles.css';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { AccentColorProvider } from '@/providers/AccentColorProvider';
import { DualModeProvider } from '@/providers/DualModeProvider';
import SidebarLayout from '@/components/layout/SidebarLayout';

// Main font for body text
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

// Monospace font for code and accents
const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'KROKO | Portfolio',
  description: 'Personal portfolio showcasing art, code, trade, and creative work',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <ThemeProvider>
          <AccentColorProvider>
            <DualModeProvider>
              <SidebarLayout>
                {children}
              </SidebarLayout>
            </DualModeProvider>
          </AccentColorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
