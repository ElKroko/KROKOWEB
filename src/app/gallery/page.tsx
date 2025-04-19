"use client";

import { Suspense, useState, useEffect } from 'react';
import ImmersiveGallery from '@/components/gallery/ImmersiveGallery';
import { FaVolumeUp, FaVolumeMute, FaMusic, FaInfoCircle } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import Link from 'next/link';

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
  
  // Lista de obras de arte (ahora con extensiones PNG)
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
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Botones de control */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button 
          onClick={() => setShowInfo(!showInfo)} 
          variant="primary"
          className="rounded-full p-3"
          aria-label="Mostrar información"
        >
          <FaInfoCircle size={20} />
        </Button>
        <Button 
          onClick={() => setAudioEnabled(!audioEnabled)} 
          variant="primary"
          className="rounded-full p-3"
          aria-label={audioEnabled ? "Desactivar audio" : "Activar audio"}
        >
          {audioEnabled ? <FaVolumeUp size={20} /> : <FaVolumeMute size={20} />}
        </Button>
      </div>
      
      {/* Panel de información */}
      {showInfo && (
        <div className="absolute bottom-8 left-8 z-10 max-w-md bg-black/70 backdrop-blur-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-2 text-white">Galería Inmersiva</h2>
          <p className="text-gray-300 mb-4">
            Explora mi colección de arte visual mientras escuchas composiciones originales. 
            Navega con el mouse, zoom con la rueda.
          </p>
          
          {audioEnabled && currentTrack !== null && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-1 flex items-center">
                <FaMusic className="mr-2" />
                {audioTracks[currentTrack].title}
              </h3>
              <p className="text-gray-400">
                {audioTracks[currentTrack].artist}
              </p>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <button 
              className="text-primary-light text-sm hover:underline"
              onClick={() => setShowInfo(false)}
            >
              Ocultar esta información
            </button>
            
            <Link href="/">
              <Button variant="secondary" size="sm">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      {/* Reproductor de audio (simplificado) */}
      {audioEnabled && (
        <audio 
          src={audioTracks[currentTrack].url}
          autoPlay
          loop
          style={{ display: 'none' }}
        />
      )}
      
      {/* Galería 3D */}
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-light border-r-transparent mb-4"></div>
            <p className="text-xl">Cargando experiencia inmersiva...</p>
          </div>
        </div>
      }>
        <ImmersiveGallery 
          artworks={artworks} 
          audioEnabled={audioEnabled}
          currentTrack={currentTrack}
        />
      </Suspense>
    </div>
  );
}