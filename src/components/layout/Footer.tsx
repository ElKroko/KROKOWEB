'use client';

import Link from 'next/link';
import { FaGithub, FaSoundcloud, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import Typography from '@/components/ui/Typography';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { cn } from '@/lib/utils';

export default function Footer() {
  const year = new Date().getFullYear();
  const { accentColor } = useAccentColor();
  
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

  // Style for social icons using the current accent color
  const socialIconStyle = (isHovered) => ({
    borderColor: isHovered ? accentColor : 'rgba(80, 137, 145, 0.5)',
    backgroundColor: isHovered ? accentColor : 'rgba(23, 42, 58, 0.8)',
    color: isHovered ? '#172A3A' : '#9CA3AF'
  });

  return (
    <footer className="bg-primary-dark text-gray-300 border-t border-primary-mid/30">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <Typography 
                variant="h3" 
                className="font-bold text-primary-light transition-colors duration-300 hover:text-accent"
              >
                KROKO
              </Typography>
            </Link>
            <Typography 
              variant="p" 
              className="mt-4 text-gray-400 max-w-md"
            >
              Explorando la intersección entre tecnología, arte y conocimiento. Desarrollando 
              soluciones creativas y compartiendo aprendizajes en múltiples disciplinas.
            </Typography>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <Typography 
              variant="h4" 
              className="text-white mb-4"
            >
              Enlaces rápidos
            </Typography>
            <ul className="space-y-2">
              {siteLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    href={link.path}
                    className="text-gray-400 hover:text-accent transition-colors highlight-hover"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Conectar */}
          <div>
            <Typography 
              variant="h4" 
              className="text-white mb-4"
            >
              Conectar
            </Typography>
            <div className="flex space-x-3 mb-4">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  aria-label={link.name}
                  style={socialIconStyle(false)}
                  onMouseOver={(e) => {
                    Object.assign(e.currentTarget.style, socialIconStyle(true));
                  }}
                  onMouseOut={(e) => {
                    Object.assign(e.currentTarget.style, socialIconStyle(false));
                  }}
                >
                  {link.icon}
                </a>
              ))}
            </div>
            <Typography 
              variant="small" 
              className="text-gray-400"
            >
              ¿Quieres colaborar en un proyecto?
              <br />
              <a 
                href="mailto:contacto@kroko.cl" 
                className="text-accent hover:underline"
              >
                contacto@kroko.cl
              </a>
            </Typography>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-primary-mid/30 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <Typography 
            variant="caption" 
            className="text-gray-500"
          >
            &copy; {year} KROKO. Todos los derechos reservados.
          </Typography>
          <Typography 
            variant="caption" 
            className="text-gray-500 mt-2 sm:mt-0 flex items-center"
          >
            Desarrollado con <FaHeart className="mx-1" style={{ color: accentColor }} size={14} /> en Chile
          </Typography>
        </div>
      </div>
    </footer>
  );
}