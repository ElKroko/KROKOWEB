"use client";

import { Suspense, useState, useEffect } from 'react';
import ImmersiveGallery from '@/components/gallery/ImmersiveGallery';
import { FaVolumeUp, FaVolumeMute, FaInfoCircle } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { colors } from '@/styles/theme';

// Para el fondo de cada panel (si necesitas acceder programáticamente)
const panelBackground = `bg-primary-dark/80 backdrop-blur-md border border-primary-mid/30`;

export default function GalleryPage() {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  
  // Lista de pistas de audio
  const audioTracks = [
    { title: "BOTANIKAL", artist: "XKLOKON", url: "/audio/BOTANIKAL.mp3" },
    { title: "BREAKINGALL", artist: "XKLOKON", url: "/audio/BREAKINGALL.mp3" },
    { title: "T BUSKO", artist: "Kroko", url: "/audio/T BUSKO.mp3" },
  ];
  
  // Lista de obras de arte
  const artworks = [
    { title: "Duality", imagePath: "/images/art/placeholder_1.png", description: "Exploración de la dualidad mediante formas complementarias" },
    { title: "Digital Genesis", imagePath: "/images/art/placeholder_2.png", description: "Representación abstracta del nacimiento de la era digital" },
    { title: "Quantum Field", imagePath: "/images/art/placeholder_3.png", description: "Visualización de campos cuánticos interconectados" },
  ];

  // Ocultar el panel de información después de 10 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInfo(false);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-primary-dark">
      {/* Botones de control */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          onClick={() => setShowInfo(!showInfo)} 
          variant="secondary"
          className="rounded-full p-3"
          aria-label="Mostrar información"
        >
          <FaInfoCircle size={20} />
        </Button>
        <Button 
          onClick={() => setAudioEnabled(!audioEnabled)} 
          variant="accent"
          className="rounded-full p-3"
          aria-label={audioEnabled ? "Desactivar audio" : "Activar audio"}
        >
          {audioEnabled ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
        </Button>
      </div>
      
      {/* Panel de información */}
      {showInfo && (
        <div className={`absolute bottom-8 left-8 z-10 max-w-md ${panelBackground} p-6 rounded-lg`}>
          <h2 className="text-2xl font-bold text-primary-light mb-2">Galería Inmersiva</h2>
          <p className="mb-4">Explora estas obras en un entorno 3D interactivo. Activa el audio para una experiencia completa.</p>
          <ul className="text-sm space-y-1 text-gray-300">
            <li>• Usa el ratón para rotar la vista</li>
            <li>• Rueda para acercar/alejar</li>
            <li>• Haz clic en las obras para ver detalles</li>
          </ul>
        </div>
      )}
      
      {/* Canvas 3D con la galería */}
      <div className="w-full h-full">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center">Cargando experiencia inmersiva...</div>}>
          <ImmersiveGallery
            artworks={artworks}
            audioEnabled={audioEnabled}
            currentTrack={currentTrack}
          />
        </Suspense>
      </div>
      
      {/* Reproductor de audio oculto */}
      {audioEnabled && (
        <audio 
          src={audioTracks[currentTrack].url}
          autoPlay
          loop
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
}