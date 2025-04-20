import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import "./base-styles.css"
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
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

// Definir los metadatos directamente aquí en lugar de importarlos
export const metadata = {
  title: 'KROKO | Portfolio',
  description: 'Personal portfolio showcasing art, code, trade, and creative work',
};

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
