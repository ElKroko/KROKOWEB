'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { FaMusic, FaPalette, FaCode, FaChartLine, FaBook, FaUser, FaCube } from 'react-icons/fa';
import { motion } from 'framer-motion';

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

  // Detectar scroll para cambiar estilo de navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-bg/95 backdrop-blur-sm py-3 shadow-lg' : 'bg-dark-bg/80 backdrop-blur-md py-5'
    }`}>
      <div className="container-custom flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold text-primary-light">KROKO</span>
        </Link>

        {/* Navegación de escritorio - aumentar el padding vertical */}
        <nav className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path}
              className={`px-4 py-3 rounded-md text-sm font-medium transition-colors 
                ${pathname === item.path 
                  ? 'text-white bg-primary-dark/30' 
                  : 'text-gray-300 hover:text-white hover:bg-primary-dark/20'}`}
            >
              <span className="flex items-center">
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </span>
            </Link>
          ))}
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

      {/* Menú móvil - añadir más padding */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-dark-bg/95 backdrop-blur-md"
        >
          <div className="container-custom py-6">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link 
                  key={item.path}
                  href={item.path}
                  className={`px-5 py-4 rounded-md text-base font-medium transition-colors flex items-center
                    ${pathname === item.path 
                      ? 'text-white bg-primary-dark/30' 
                      : 'text-gray-300 hover:text-white hover:bg-primary-dark/20'}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
}