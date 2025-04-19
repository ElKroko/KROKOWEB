import { Inter } from "next/font/google";
import "./globals.css";
import "./base-styles.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KROKO | Programación, Música, Arte y más",
  description: "Portafolio multidisciplinario de KROKO con proyectos de programación, música, arte visual, trading y más.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-dark-bg text-dark-text min-h-screen flex flex-col`}>
        <ThemeProvider>
          <Navbar />
          {/* Añadimos una clase pt-24 para dar 6rem (96px) de padding-top */}
          <main className="flex-grow pt-24">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
