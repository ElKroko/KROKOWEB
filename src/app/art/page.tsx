'use client';

import React, { useEffect } from 'react';
import Typography from '@/components/ui/Typography';
import Section from '@/components/ui/Section';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';
import { useMusic } from '@/providers/MusicProvider';
import Image from 'next/image';
import { FaPlay } from 'react-icons/fa';
import YouTubeShortsCarousel from '@/components/ui/YouTubeShortsCarousel';

export default function ArtPage() {
  const { accentColor } = useAccentColor();
  const { mode } = useDualMode();
  const { tracks, setCurrentTrackIndex } = useMusic();
  
  // Asegurar que el elemento raíz tenga el atributo data-section="art"
  useEffect(() => {
    document.documentElement.setAttribute('data-section', 'art');
    return () => {
      // Limpiar al desmontar
      document.documentElement.removeAttribute('data-section');
    };
  }, []);

  // IDs de YouTube Shorts
  const youtubeShortIds = [
    'dQw4w9WgXcQ',
    'jNQXAC9IVRw',
    'C0DPdy98e4c'
  ];

  // Función para reproducir una pista específica usando el reproductor global
  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
  };

  // Estilo para las tarjetas de música
  const cardStyle = mode === 'xklokon' 
    ? "bg-card-bg/90 backdrop-blur-sm border border-accent-color/30 rounded-lg overflow-hidden"
    : "bg-card-bg rounded-lg overflow-hidden border border-accent-color/10";

  return (
    <div className="min-h-screen p-8">
      <Typography variant="h1" className="mb-16 text-accent-color page-title-container">ART</Typography>
      
      {/* Sección de Música - AHORA PRIMERO */}
      <Section title="Music" className="mb-20">
        <Typography variant="p" className="mb-8 max-w-2xl">
          Creaciones sonoras que exploran diversos géneros y técnicas de producción, 
          desde ambient y electrónica experimental hasta composiciones instrumentales.
        </Typography>
        
        <div className="grid gap-6">
          {tracks.map((track, index) => (
            <div 
              key={index}
              className={`${cardStyle} cursor-pointer hover:shadow-md transition-all`}
              onClick={() => playTrack(index)}
            >
              <div className="flex items-center p-4">
                {/* Imagen de portada */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden relative mr-4 flex-shrink-0">
                  <Image
                    src={track.cover}
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-2xl">
                      <FaPlay />
                    </span>
                  </div>
                </div>
                
                {/* Información de la pista */}
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{track.title}</h3>
                  <p className="text-sm opacity-70">{track.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
      
      {/* Sección de Videos - Con carrusel de YouTube Shorts */}
      <Section title="Videos" className="mb-20">
        <Typography variant="p" className="mb-8 max-w-2xl">
          Una colección de trabajos audiovisuales que complementan mi obra musical y visual,
          explorando diferentes técnicas y narrativas.
        </Typography>
        
        <YouTubeShortsCarousel shortIds={youtubeShortIds} />
      </Section>
      
      {/* Información adicional */}
      <Section title="About My Art" className="mb-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Typography variant="h3" className="mb-4 text-accent-color">Sound Design</Typography>
            <Typography variant="p" className="mb-4">
              En mi música busco crear paisajes sonoros que mezclan elementos de 
              diferentes géneros, con un enfoque en la experimentación y la textura.
            </Typography>
          </div>
          <div>
            <Typography variant="h3" className="mb-4 text-accent-color">Visual Style</Typography>
            <Typography variant="p" className="mb-4">
              Mi trabajo visual explora la fusión entre lo orgánico y lo digital, 
              creando piezas que equilibran estructura y caos, forma y abstracción.
            </Typography>
          </div>
        </div>
      </Section>
    </div>
  );
}