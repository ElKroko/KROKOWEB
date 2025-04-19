'use client';

import Link from 'next/link';
import { FaGithub, FaSoundcloud, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const year = new Date().getFullYear();
  
  const socialLinks = [
    { name: "GitHub", icon: <FaGithub size={20} />, url: "https://github.com/ElKroko/" },
    { name: "SoundCloud", icon: <FaSoundcloud size={20} />, url: "https://soundcloud.com/xklokon" },
    { name: "Twitter", icon: <FaTwitter size={20} />, url: "https://x.com/kryptokroks" },
    { name: "Instagram", icon: <FaInstagram size={20} />, url: "https://www.instagram.com/kroko.cl/" },
    { name: "LinkedIn", icon: <FaLinkedin size={20} />, url: "https://www.linkedin.com/in/vicente-perelli-tassara-0b74991b5/" },
  ];

  const siteLinks = [
    { name: "Música", path: "/music" },
    { name: "Arte Visual", path: "/visual" },
    { name: "Programación", path: "/programming" },
    { name: "Trading", path: "/trading" },
    { name: "EMED", path: "/emed" },
    { name: "Sobre Mí", path: "/about" },
    { name: "Galería Inmersiva", path: "/gallery" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-bold text-primary-light">KROKO</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Explorando la intersección entre tecnología, arte y conocimiento. Desarrollando 
              soluciones creativas y compartiendo aprendizajes en múltiples disciplinas.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className="text-gray-400 hover:text-primary-light transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conectar */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Conectar</h3>
            <div className="flex space-x-3 mb-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center 
                  text-gray-400 hover:bg-primary-dark hover:text-white transition-all"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <p className="text-gray-400">
              ¿Quieres colaborar en un proyecto?
              <br />
              <a 
                href="mailto:contacto@kroko.cl" 
                className="text-primary-light hover:underline"
              >
                contacto@kroko.cl
              </a>
            </p>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {year} KROKO. Todos los derechos reservados.
          </p>
          <p className="text-gray-500 text-sm mt-2 sm:mt-0 flex items-center">
            Desarrollado con <FaHeart className="mx-1 text-red-500" size={14} /> en Chile
          </p>
        </div>
      </div>
    </footer>
  );
}