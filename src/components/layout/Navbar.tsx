'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { FaMusic, FaPalette, FaCode, FaChartLine, FaBook, FaUser, FaCube } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { name: "Música", path: "/music", icon: <FaMusic /> },
  { name: "Arte Visual", path: "/visual", icon: <FaPalette /> },
  { name: "Programación", path: "/programming", icon: <FaCode /> },
  { name: "Trading", path: "/trading", icon: <FaChartLine /> },
  { name: "EMED", path: "/emed", icon: <FaBook /> },
  { name: "Sobre Mí", path: "/about", icon: <FaUser /> },
  { name: "Galería Inmersiva", path: "/gallery", icon: <FaCube /> }, // Agregada con icono de cubo 3D
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { accentColor } = useAccentColor();

  // Detectar scroll para cambiar estilo de navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Style object for the active route indicator using current accent color
  const activeIndicatorStyle = {
    backgroundColor: accentColor
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-primary-dark/95 backdrop-blur-sm py-3 shadow-lg border-b border-primary-mid/20' 
        : 'bg-primary-dark/80 backdrop-blur-md py-5'
    }`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Typography 
            variant="h4" 
            as="span" 
            className="font-bold tracking-tight transition-colors duration-300 group-hover:text-accent"
          >
            KROKO
          </Typography>
        </Link>

        {/* Navegación de escritorio con indicador de ruta activa */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path}
                href={item.path}
                className={cn(
                  "relative px-4 py-3 rounded-md text-sm font-medium transition-colors", 
                  "hover:text-white hover:bg-primary-mid/20",
                  isActive ? "text-white" : "text-gray-300"
                )}
              >
                <span className="flex items-center">
                  <span className={cn(
                    "mr-2 transition-colors", 
                    isActive ? "text-accent" : ""
                  )}>
                    {item.icon}
                  </span>
                  {item.name}
                </span>
                {isActive && (
                  <motion.span 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 h-0.5 w-full" 
                    style={activeIndicatorStyle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Botón de menú móvil */}
        <div className="md:hidden flex items-center">
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="sm"
            aria-label="Menú"
            className="p-2"
          >
            <div className="w-6 flex flex-col items-end">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'w-6 rotate-45 translate-y-1' : 'w-6'
              }`}></span>
              <span className={`block h-0.5 bg-white my-1 transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'w-4'
              }`}></span>
              <span className={`block h-0.5 bg-white transition-all duration-300 ${
                isOpen ? 'w-6 -rotate-45 -translate-y-1' : 'w-5'
              }`}></span>
            </div>
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-primary-dark/95 backdrop-blur-md border-t border-primary-mid/30"
        >
          <div className="container-custom py-6">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "relative px-5 py-4 rounded-md text-base font-medium transition-colors flex items-center",
                      "hover:text-white hover:bg-primary-mid/20",
                      isActive ? "text-white" : "text-gray-300"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={cn(
                      "mr-3 transition-colors", 
                      isActive ? "text-accent" : ""
                    )}>
                      {item.icon}
                    </span>
                    {item.name}
                    {isActive && (
                      <span 
                        className="absolute left-0 top-0 bottom-0 w-1 rounded-full" 
                        style={activeIndicatorStyle}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}