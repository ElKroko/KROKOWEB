'use client';

import React from 'react';
import Typography from '@/components/ui/Typography';
import Section from '@/components/ui/Section';
import AudioPlayer from '@/components/gallery/AudioPlayer';
import ImmersiveGallery from '@/components/gallery/ImmersiveGallery';

export default function ArtPage() {
  // Tracks de música
  const audioTracks = [
    {
      title: 'BOTANIKAL',
      artist: 'KROKO',
      src: '/audio/BOTANIKAL.mp3',
      cover: '/images/art/placeholder_1.png'
    },
    {
      title: 'BREAKING ALL',
      artist: 'KROKO',
      src: '/audio/BREAKINGALL.mp3',
      cover: '/images/art/placeholder_2.png'
    },
    {
      title: 'T BUSKO',
      artist: 'KROKO',
      src: '/audio/T BUSKO.mp3',
      cover: '/images/art/placeholder_3.png'
    }
  ];

  // Obras visuales
  const artworks = [
    {
      id: '1',
      title: 'Digital Abstraction #1',
      description: 'Primera exploración de formas abstractas digitales',
      imageUrl: '/images/art/placeholder_1.png',
      tags: ['digital', 'abstract']
    },
    {
      id: '2',
      title: 'Dimensional Study',
      description: 'Estudio de dimensiones y profundidad',
      imageUrl: '/images/art/placeholder_2.png',
      tags: ['3d', 'depth']
    },
    {
      id: '3',
      title: 'Color Theory',
      description: 'Experimentación con teoría del color',
      imageUrl: '/images/art/placeholder_3.png',
      tags: ['color', 'theory']
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <Typography variant="h1" className="mb-16 text-accent-strong page-title-container">ART</Typography>
      
      {/* Sección de Arte Visual */}
      <Section title="Visual Art" className="mb-20">
        <Typography variant="p" className="mb-8 max-w-2xl">
          Exploraciones visuales que combinan lo digital y lo analógico, 
          experimentando con diferentes medios, técnicas y conceptos.
        </Typography>
        
        <ImmersiveGallery artworks={artworks} />
      </Section>
      
      {/* Sección de Música */}
      <Section title="Music" className="mb-20">
        <Typography variant="p" className="mb-8 max-w-2xl">
          Creaciones sonoras que exploran diversos géneros y técnicas de producción, 
          desde ambient y electrónica experimental hasta composiciones instrumentales.
        </Typography>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {audioTracks.map((track, index) => (
            <AudioPlayer 
              key={index}
              track={track}
              accentColor="var(--accent-strong)"
              textColor="var(--text-color)"
              backgroundColor="var(--accent-bg)"
            />
          ))}
        </div>
      </Section>
      
      {/* Información adicional */}
      <Section title="About My Art" className="mb-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Typography variant="h3" className="mb-4 text-accent-strong">Visual Style</Typography>
            <Typography variant="p" className="mb-4">
              Mi trabajo visual explora la fusión entre lo orgánico y lo digital, 
              creando piezas que equilibran estructura y caos, forma y abstracción.
            </Typography>
          </div>
          <div>
            <Typography variant="h3" className="mb-4 text-accent-strong">Sound Design</Typography>
            <Typography variant="p" className="mb-4">
              En mi música busco crear paisajes sonoros que mezclan elementos de 
              diferentes géneros, con un enfoque en la experimentación y la textura.
            </Typography>
          </div>
        </div>
      </Section>
    </div>
  );
}