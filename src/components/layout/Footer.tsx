"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Acerca de */}
          <div>
            <h3 className="text-lg font-semibold mb-4">KROKOWEB</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Un espacio para compartir mi universo creativo a través de la música, arte visual, 
              programación, trading y mi enfoque EMED.
            </p>
          </div>
          
          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Sobre Mí
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categorías */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/music" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Música
                </Link>
              </li>
              <li>
                <Link href="/visual" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Arte Visual
                </Link>
              </li>
              <li>
                <Link href="/programming" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Programación
                </Link>
              </li>
              <li>
                <Link href="/trading" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  Trading
                </Link>
              </li>
              <li>
                <Link href="/emed" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  EMED
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Conéctate */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Conéctate</h3>
            <div className="flex space-x-4 mb-4">
              {/* Íconos de redes sociales - puedes personalizar con tus propios íconos SVG */}
              {[1, 2, 3, 4].map((item) => (
                <a key={item} href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="sr-only">Red Social {item}</span>
                  <div className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                    {/* Aquí irían tus íconos de redes sociales */}
                    {item}
                  </div>
                </a>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Email: contacto@krokoweb.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} KROKOWEB. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="text-xs text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              Términos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}