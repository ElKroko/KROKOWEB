'use client';

import React, { useEffect, useRef, useState } from 'react';
import Typography from '@/components/ui/Typography';

// Definir tipos para los efectos
type Effect = {
  name: string;
  filter: string;
};

export default function CreatePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraMinimized, setCameraMinimized] = useState(false);

  // Lista de efectos para aplicar a las fotos
  const effects: Effect[] = [
    { name: "Normal", filter: "none" },
    { name: "Grayscale", filter: "grayscale(100%)" },
    { name: "Sepia", filter: "sepia(100%)" },
    { name: "Invert", filter: "invert(100%)" },
    { name: "Blur", filter: "blur(4px)" },
    { name: "Brightness", filter: "brightness(150%)" },
    { name: "Contrast", filter: "contrast(200%)" },
    { name: "Hue Rotate", filter: "hue-rotate(90deg)" },
    { name: "Saturate", filter: "saturate(200%)" }
  ];

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing webcam:', err);
        setError('No se pudo acceder a la cámara web. Por favor, asegúrate de que tienes una cámara conectada y has dado permisos al navegador.');
      }
    }

    setupCamera();

    // Limpieza: detener la cámara cuando el componente se desmonte
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Establecer dimensiones del canvas igual que el video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Dibujar el frame actual del video en el canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convertir el canvas a una URL de datos (formato base64)
        const dataUrl = canvas.toDataURL('image/png');
        setPhoto(dataUrl);
        setCameraMinimized(true);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setCameraMinimized(false);
  };

  return (
    <div className="min-h-screen p-8">
      <Typography variant="h1" className="mb-8 text-accent-strong">Foto Creativa</Typography>
      
      <div className="flex flex-col items-center">
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            <div className={`relative ${cameraMinimized ? 'fixed top-4 right-4 z-10 w-1/4 md:w-1/5 lg:w-1/6' : 'w-full max-w-2xl'}`}>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`rounded-lg border-2 border-accent-strong max-w-full ${cameraMinimized ? 'shadow-lg' : ''}`}
                style={{ maxHeight: cameraMinimized ? '20vh' : '70vh' }}
              />
              {!cameraMinimized && (
                <button 
                  onClick={takePhoto}
                  className="mt-4 px-6 py-2 bg-accent-strong text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tomar Foto
                </button>
              )}
            </div>

            {photo && (
              <div className="mt-8 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h2" className="text-accent-strong">Efectos</Typography>
                  <button 
                    onClick={retakePhoto}
                    className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Nueva Foto
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {effects.map((effect, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border-2 border-accent-strong">
                      <div className="p-2 bg-accent-bg">
                        <Typography variant="p" className="text-center">{effect.name}</Typography>
                      </div>
                      <img 
                        src={photo} 
                        alt={`Efecto ${effect.name}`} 
                        className="w-full h-auto"
                        style={{ filter: effect.filter }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Canvas oculto para procesar la imagen */}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>
    </div>
  );
}