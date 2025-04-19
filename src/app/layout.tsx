import { Inter } from "next/font/google";
import "./globals.css";
import "./base-styles.css";
import Navbar from "@/components/layout/Navbar";
import { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KROKOWEB - Creador Multidisciplinario",
  description: "Música, arte visual, programación, trading y desarrollo personal. Construyendo puentes entre la tecnología y la creatividad.",
};

export const viewport: Viewport = {
  themeColor: "#121212",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-dark-bg text-dark-text min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
