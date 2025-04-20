'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Typography from '@/components/ui/Typography';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';

export default function MePage() {
  const { accentColor } = useAccentColor();
  const { mode } = useDualMode();
  const [activeImage, setActiveImage] = useState<{ src: string, position: { top: string, left: string }, size: string, opacity: number } | null>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const [activeTimelinePoint, setActiveTimelinePoint] = useState<number | null>(null);

  const timelinePoints = [
    {
      id: 1,
      year: 2023,
      title: 'Lanzamiento de KROKOWEB',
      description: 'Mi plataforma personal que refleja mi enfoque minimalista'
    },
    {
      id: 2,
      year: 2021,
      title: 'Trading Algorítmico',
      description: 'Desarrollo de sistemas de trading con programación'
    },
    {
      id: 3,
      year: 2019,
      title: 'Producciones Musicales',
      description: 'Lanzamiento de mis primeras creaciones sonoras'
    },
    {
      id: 4,
      year: 2017,
      title: 'Desarrollo Web',
      description: 'Comienzo como desarrollador front-end'
    }
  ];

  useEffect(() => {
    document.documentElement.setAttribute('data-page', 'me');
  }, []);

  useEffect(() => {
    const skillsElement = skillsRef.current;
    if (!skillsElement) return;

    const content = skillsElement.innerHTML;
    skillsElement.innerHTML = content + content;

    const scroll = () => {
      if (!skillsElement) return;
      skillsElement.scrollLeft += 1;

      if (skillsElement.scrollLeft >= skillsElement.scrollWidth / 2) {
        skillsElement.scrollLeft = 0;
      }
    };

    const intervalId = setInterval(scroll, 50);
    return () => clearInterval(intervalId);
  }, []);

  const getRandomPosition = () => {
    return {
      top: `${10 + Math.floor(Math.random() * 60)}vh`,
      left: `${10 + Math.floor(Math.random() * 60)}vw`,
    };
  };

  const getRandomSize = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const sizes = isMobile 
      ? ['15vw', '20vw', '25vw'] 
      : ['15vw', '20vw', '25vw', '30vw', '35vw'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  const getRandomOpacity = () => {
    return 0.1 + Math.random() * 0.45;
  };

  const showRandomImage = (src: string) => {
    setActiveImage({
      src,
      position: getRandomPosition(),
      size: getRandomSize(),
      opacity: getRandomOpacity()
    });
  };

  const hideImage = () => {
    setActiveImage(null);
  };

  const images = [
    '/images/art/placeholder_1.png',
    '/images/art/placeholder_2.png',
    '/images/art/placeholder_3.png',
    '/images/art/placeholder_3.jpeg'
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden w-full">
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
          <Image 
            src={activeImage.src}
            alt="Hover image" 
            className="w-full h-full object-cover"
            layout="fill"
            objectFit="cover"
          />
        </div>
      )}

      <div className="h-full flex flex-col">
        <div className="flex-grow flex flex-col p-0 pl-8 w-full overflow-x-hidden pr-8" style={{ maxWidth: "100%" }}>
          <Typography variant="h1" className="mb-6 text-accent-strong text-left mt-8">
            <span className={mode === 'xklokon' ? 'font-mono tracking-tight' : 'tracking-widest'}>
              ¿krokoxklokon?
            </span>
          </Typography>
          
          <div className="overflow-hidden flex flex-col max-w-[calc(100vw-300px)]">
            <Typography variant="lead" className="mb-6 text-justify text-lg md:text-xl leading-relaxed w-full">
              Desde siempre, dos mundos han convivido en mí: la {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[0])}
                onMouseLeave={hideImage}
              >
                música
              </span>
              {' '} y la {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[1])}
                onMouseLeave={hideImage}
              >
                tecnología
              </span>
              . Con 11 años agarré la guitarra por primera vez, fascinado por el metal, y formé varias bandas de covers en el colegio. Al mismo tiempo, era ese niño "computín" que vivía conectado a {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[2])}
                onMouseLeave={hideImage}
              >
                LoL
              </span>
              {' '} y RuneScape; allí nació mi alter ego {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[3])}
                onMouseLeave={hideImage}
              >
                Kroko
              </span>
              , junto a un pequeño canal de YouTube que se convirtió en mi primer laboratorio creativo.
            </Typography>

            <Typography variant="lead" className="mb-6 text-justify text-base md:text-lg leading-relaxed z-10 w-full">
              En {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[0])}
                onMouseLeave={hideImage}
              >
                2023
              </span>
              {' '} lancé mi primer álbum como Kroko, explorando principalmente reggaetón, sonidos urbanos y electrónica. Con el tiempo, el rompecabezas empezó a cobrar forma y surgió {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[2])}
                onMouseLeave={hideImage}
              >
                XKLOKON
              </span>
              , un segundo alter ego dedicado a dar vida a esos sonidos que aún no existen. Bajo esta identidad experimento con lo visual y lo sonoro: mezclo géneros musicales con texturas y ruidos en {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[1])}
                onMouseLeave={hideImage}
              >
                TouchDesigner
              </span>
              , y exploro entornos 3D y WebGL para crear experiencias inmersivas.
            </Typography>

            <Typography variant="lead" className="mb-6 text-justify text-lg md:text-xl leading-relaxed z-10 w-full">
              En {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[3])}
                onMouseLeave={hideImage}
              >
                EMED
              </span>
              {' '} diseño la Estrategia Digital y lidero las áreas de TI, Marketing e I+D, apoyando a una institución que realiza el trabajo inspirador de brindar herramientas para aprender a manejar conflictos familiares, escolares y laborales.
            </Typography>

            <Typography variant="lead" className="mb-6 text-justify text-lg md:text-xl leading-relaxed z-10 w-full">
              Creo que mi propósito es {' '}
              <span 
                className="border-b-2 border-accent-strong cursor-pointer" 
                onMouseEnter={() => showRandomImage(images[1])}
                onMouseLeave={hideImage}
              >
                crear
              </span>
              , y estoy decidido a hacerlo. Este solo es el punto de partida.
            </Typography>

            <div className="text-right mb-8 font-serif italic text-xl w-full z-10 relative">
              <Typography variant="p">
                - Vicente Perelli Tassara
              </Typography>
            </div>
          </div>
          
          <div className="mb-10 relative max-w-[calc(100vw-300px)]">
            {/* Línea horizontal de tiempo */}
            <div className="absolute left-0 right-0 h-0.5 bg-accent-strong/50 top-[14px]"></div>
            
            {/* Línea que conecta los puntos cuando hay hover */}
            {activeTimelinePoint && (
              <div 
                className="absolute h-0.5 bg-accent-strong transition-all duration-300 top-[14px]"
                style={{ 
                  left: "0%", 
                  width: `${(activeTimelinePoint / timelinePoints.length) * 100}%`,
                  opacity: 0.8
                }}
              ></div>
            )}
            
            <div className="flex justify-between w-full py-8">
              {timelinePoints.map((point) => (
                <div 
                  key={point.id} 
                  className="flex flex-col items-center"
                  onMouseEnter={() => setActiveTimelinePoint(point.id)}
                  onMouseLeave={() => setActiveTimelinePoint(null)}
                >
                  <div 
                    className={`w-4 h-4 rounded-full mb-4 relative z-10 transition-all duration-300 cursor-pointer ${
                      activeTimelinePoint === point.id ? 'transform scale-150 bg-accent-strong' : 
                      activeTimelinePoint && activeTimelinePoint > point.id ? 'bg-accent-strong' : 'bg-accent-strong/50'
                    }`}
                  ></div>
                  
                  <Typography 
                    variant="h3" 
                    className={`text-accent-strong mb-2 text-lg transition-all duration-300 ${
                      activeTimelinePoint === point.id ? 'font-semibold' : ''
                    }`}
                  >
                    {point.year}
                  </Typography>
                  
                  <Typography 
                    variant="p" 
                    className="mb-1 text-sm transition-all duration-300 text-center"
                  >
                    {point.title}
                  </Typography>
                  
                  <div 
                    className={`max-w-[150px] text-center transition-all duration-300 overflow-hidden px-2 ${
                      activeTimelinePoint === point.id ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <Typography variant="small" className="text-xs">
                      {point.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-[calc(100vw-250px)] overflow-hidden py-2 bg-background/40 backdrop-blur-sm border-t border-current/20 fixed bottom-0 left-[250px] right-0">
          <div 
            ref={skillsRef}
            className="whitespace-nowrap overflow-hidden flex items-center"
          >
            <div className="text-sm md:text-base leading-relaxed">
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
        </div>
      </div>
    </div>
  );
}