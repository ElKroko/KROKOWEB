'use client';

import React, { useEffect, useState } from 'react';
import SectionLayout from '@/components/ui/SectionLayout';
import Typography from '@/components/ui/Typography';
import Section from '@/components/ui/Section';
import Highlight from '@/components/ui/Highlight';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';

export default function MePage() {
  const { accentColor } = useAccentColor();
  const { mode } = useDualMode();
  const [activeImage, setActiveImage] = useState<{ src: string, position: { top: string, left: string }, size: string, opacity: number } | null>(null);

  // Efecto para aplicar color personalizado a esta página
  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'me');
  }, []);

  // Función para generar una posición aleatoria que siempre sea visible en la pantalla
  const getRandomPosition = () => {
    // Usamos porcentajes más conservadores para asegurar que la imagen permanezca visible
    // Limitamos el área a 10%-70% para dejar márgenes de seguridad
    return {
      top: `${10 + Math.floor(Math.random() * 60)}vh`,
      left: `${10 + Math.floor(Math.random() * 60)}vw`,
    };
  };

  // Función para generar un tamaño aleatorio adaptado al viewport
  const getRandomSize = () => {
    // Tamaños más pequeños en móviles, más grandes en desktop
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const sizes = isMobile 
      ? ['15vw', '20vw', '25vw'] 
      : ['15vw', '20vw', '25vw', '30vw', '35vw'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  // Función para generar una opacidad aleatoria
  const getRandomOpacity = () => {
    // Rango de opacidad entre 0.1 (muy sutil) y 0.5 (más visible)
    return 0.1 + Math.random() * 0.45;
  };

  // Función para mostrar una imagen en posición aleatoria
  const showRandomImage = (src: string) => {
    setActiveImage({
      src,
      position: getRandomPosition(),
      size: getRandomSize(),
      opacity: getRandomOpacity // Añadimos opacidad aleatoria
    });
  };

  // Función para ocultar la imagen
  const hideImage = () => {
    setActiveImage(null);
  };

  // Lista de imágenes disponibles
  const images = [
    '/images/art/placeholder_1.png',
    '/images/art/placeholder_2.png',
    '/images/art/placeholder_3.png',
    '/images/art/placeholder_3.jpeg'
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 color-transition w-full relative overflow-hidden">
      {/* Imagen flotante que aparece con hover */}
      {activeImage && (
        <div 
          className="absolute pointer-events-none z-0 transition-all duration-500"
          style={{
            top: activeImage.position.top,
            left: activeImage.position.left,
            width: activeImage.size,
            height: activeImage.size,
            opacity: activeImage.opacity
          }}
        >
          <img 
            src={activeImage.src}
            alt="Hover image" 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <SectionLayout fullWidth>
        <div className="w-full z-10 relative">
          <Typography variant="h1" className="mb-12 text-accent-strong text-left pl-0">
            <span className={mode === 'xklokon' ? 'font-mono tracking-tight' : 'tracking-widest'}>
              Kroko/XKLOKON?
            </span>
          </Typography>
          
          <div className="grid-content mb-24 w-full">
            <Typography variant="lead" className="mb-16 w-full text-justify text-xl md:text-2xl leading-relaxed">
              Soy{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[0])}
                onMouseLeave={hideImage}
              >
                Vicente Perelli
              </span>
              , una mezcla rara y random que fusiona la{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[1])}
                onMouseLeave={hideImage}
              >
                programación
              </span>
              , la pasión por la{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[2])}
                onMouseLeave={hideImage}
              >
                música
              </span>
              , el amor por los datos y las{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[3])}
                onMouseLeave={hideImage}
              >
                webs bonitas
              </span>
              , el{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[0])}
                onMouseLeave={hideImage}
              >
                trading
              </span>{' '}
              y las{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[1])}
                onMouseLeave={hideImage}
              >
                criptomonedas
              </span>
              , con una sensibilidad particular.
            </Typography>

            <Typography variant="p" className="mb-16 w-full text-justify text-lg md:text-xl leading-relaxed z-10 relative">
              Como{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[2])}
                onMouseLeave={hideImage}
              >
                Ingeniero Civil Informático
              </span>{' '}
              de la UTFSM y director del Departamento de Marketing en EMED, lidero la planificación y ejecución de campañas, desarrollo estrategias de crecimiento y optimizo procesos basados en métricas. Además, compongo y creo canciones como{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[3])}
                onMouseLeave={hideImage}
              >
                Kroko
              </span>{' '}
              en Spotify y experimento como{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[0])}
                onMouseLeave={hideImage}
              >
                XKLOKON
              </span>{' '}
              en producciones digitales.
            </Typography>

            <Typography variant="lead" className="mb-16 w-full text-justify text-xl md:text-2xl leading-relaxed z-10 relative">
              Creo que mi propósito en este mundo es{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[1])}
                onMouseLeave={hideImage}
              >
                crear
              </span>{' '}
              y estoy decidido en hacerlo. Esta página web es un primer intento para mostrar un pedacito de mi{' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[2])}
                onMouseLeave={hideImage}
              >
                mundo
              </span>{' '}
              en internet.
            </Typography>

            <div className="text-right mt-16 mb-24 font-serif italic text-xl w-full z-10 relative">
              <Typography variant="p">
                - Vicente Perelli Tassara
              </Typography>
            </div>
          </div>
        </div>
      </SectionLayout>
      
      {/* Sección Skills sin título, solo texto simple */}
      <div className="my-16 w-full px-4 md:px-8">
        <div className="text-lg md:text-xl leading-relaxed text-justify mb-16">
          {[
            "React", "Next.js", "TypeScript", "Three.js", "Node.js", 
            "Diseño Gráfico", "Producción Musical", "Arte Digital", "Tipografía",
            "Análisis Técnico", "Mercados Cripto", "Estrategias Algorítmicas", 
            "Trading Cuantitativo", "WebGL", "UX/UI", "Data Science", "Composición Musical",
            "Marketing Digital", "Visualización de Datos", "Desarrollo Frontend", 
            "Diseño de Experiencias", "HTML5", "CSS3", "Tailwind", "JavaScript",
            "Python", "Ableton Live", "TouchDesigner", "Fotografía", "Animación"
          ].join(' • ')}
        </div>
      </div>
      
      {/* Sección Timeline */}
      <SectionLayout title="Journey" accentColor={accentColor} titleAlignment="left" fullWidth>
        <div className="relative border-l-2 border-accent-strong/50 pl-8 py-4 ml-4 color-transition my-12">
          {/* Eventos cronológicos */}
          <div className="mb-16 relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-4 text-2xl">2023</Typography>
            <Typography variant="p" className="mb-2 text-xl">Lanzamiento de KROKOWEB</Typography>
            <Typography variant="small" className="opacity-70 text-lg">
              Mi plataforma personal que refleja mi enfoque minimalista y tipográfico
            </Typography>
          </div>
          
          <div className="mb-16 relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-4 text-2xl">2021</Typography>
            <Typography variant="p" className="mb-2 text-xl">Exploración en Trading Algorítmico</Typography>
            <Typography variant="small" className="opacity-70 text-lg">
              Desarrollo de sistemas de trading utilizando programación y análisis técnico
            </Typography>
          </div>
          
          <div className="mb-16 relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-4 text-2xl">2019</Typography>
            <Typography variant="p" className="mb-2 text-xl">Primeras Producciones Musicales</Typography>
            <Typography variant="small" className="opacity-70 text-lg">
              Lanzamiento de mis primeras creaciones sonoras experimentales
            </Typography>
          </div>
          
          <div className="relative">
            <div className="absolute -left-12 w-6 h-6 rounded-full bg-accent-strong color-transition"></div>
            <Typography variant="h3" className="text-accent-strong mb-4 text-2xl">2017</Typography>
            <Typography variant="p" className="mb-2 text-xl">Inmersión en Desarrollo Web</Typography>
            <Typography variant="small" className="opacity-70 text-lg">
              Comienzo de mi trayectoria como desarrollador front-end y diseñador web
            </Typography>
          </div>
        </div>
      </SectionLayout>
    </div>
  );
}