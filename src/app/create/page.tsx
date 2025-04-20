'use client';

import React, { useEffect, useRef, useState } from 'react';
import Typography from '@/components/ui/Typography';
import WebcamAsciiEffect from '@/components/ui/WebcamAsciiEffect';
import { base64ImageToAscii } from '@/lib/ascii-utils';

// Definir tipos para los efectos
type Effect = {
  name: string;
  filter: string;
  asciiEffect?: 'none' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast' | 'hue-rotate' | 'saturate' | 'ascii';
  description?: string;
  config?: { [key: string]: number };
};

// Definir tipos para las herramientas creativas
type CreativeTool = {
  id: string;
  name: string;
  icon?: string;
  description: string;
};

export default function CreatePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [cameraMinimized, setCameraMinimized] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [showAsciiCamera, setShowAsciiCamera] = useState(false);
  const [photoAscii, setPhotoAscii] = useState<string>('');
  const [isGeneratingAscii, setIsGeneratingAscii] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string>('photo-effects');
  
  // Lista de herramientas creativas
  const creativeTools: CreativeTool[] = [
    {
      id: 'photo-effects',
      name: 'Efectos de Foto',
      description: 'Captura fotos y aplica efectos visuales, incluyendo ASCII art'
    },
    {
      id: 'audio-visualizer',
      name: 'Visualizador de Audio',
      description: 'Crea visualizaciones interactivas basadas en audio'
    },
    {
      id: 'generative-art',
      name: 'Arte Generativo',
      description: 'Genera patrones y obras de arte algorítmicas'
    },
    {
      id: 'text-to-image',
      name: 'Texto a Imagen',
      description: 'Convierte texto en imágenes artísticas'
    }
  ];

  // Lista de efectos para aplicar a las fotos
  const effects: Effect[] = [
    { 
      name: "Normal", 
      filter: "none",
      asciiEffect: "none",
      description: "Imagen original sin ningún filtro aplicado" 
    },
    { 
      name: "Grayscale", 
      filter: "grayscale(100%)",
      asciiEffect: "grayscale",
      description: "Convierte la imagen a escala de grises (blanco y negro)",
      config: { intensity: 100 }
    },
    { 
      name: "Sepia", 
      filter: "sepia(100%)",
      asciiEffect: "sepia",
      description: "Aplica un tono marrón-amarillento que da un aspecto antiguo",
      config: { intensity: 100 }
    },
    { 
      name: "Invert", 
      filter: "invert(100%)",
      asciiEffect: "invert",
      description: "Invierte todos los colores de la imagen",
      config: { intensity: 100 }
    },
    { 
      name: "Blur", 
      filter: "blur(4px)",
      asciiEffect: "blur",
      description: "Aplica un desenfoque a toda la imagen",
      config: { radius: 4 }
    },
    { 
      name: "Brightness", 
      filter: "brightness(150%)",
      asciiEffect: "brightness",
      description: "Aumenta el brillo de la imagen",
      config: { intensity: 150 }
    },
    { 
      name: "Contrast", 
      filter: "contrast(200%)",
      asciiEffect: "contrast",
      description: "Aumenta el contraste entre colores claros y oscuros",
      config: { intensity: 200 }
    },
    { 
      name: "Hue Rotate", 
      filter: "hue-rotate(90deg)",
      asciiEffect: "hue-rotate",
      description: "Rota los colores de la imagen en el círculo cromático",
      config: { degrees: 90 }
    },
    { 
      name: "Saturate", 
      filter: "saturate(200%)",
      asciiEffect: "saturate",
      description: "Aumenta la saturación de los colores",
      config: { intensity: 200 }
    },
    { 
      name: "ASCII", 
      filter: "none",
      asciiEffect: "ascii",
      description: "Convierte la imagen en caracteres ASCII, dando un efecto retro de terminal",
      config: { resolution: 80 }
    }
  ];

  useEffect(() => {
    // Reiniciar estado cuando cambia la herramienta activa
    if (activeToolId !== 'photo-effects') {
      setPhoto(null);
      setCameraMinimized(false);
      setSelectedEffect(null);
      setPhotoAscii('');
      setShowAsciiCamera(false);
    } else {
      // Solo configurar la cámara para la herramienta de efectos de foto
      setupCamera();
    }
  }, [activeToolId]);

  useEffect(() => {
    // Limpiar recursos de la cámara al desmontar
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Cuando se seleccione el efecto ASCII, generar el ASCII de la foto
  useEffect(() => {
    if (selectedEffect?.name === 'ASCII' && photo && !photoAscii) {
      setIsGeneratingAscii(true);
      base64ImageToAscii(photo, { width: 120 })
        .then(ascii => {
          setPhotoAscii(ascii);
          setIsGeneratingAscii(false);
        })
        .catch(err => {
          console.error('Error generando ASCII:', err);
          setIsGeneratingAscii(false);
        });
    }
  }, [selectedEffect, photo, photoAscii]);

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
        setPhotoAscii(''); // Reiniciar el ASCII cuando se toma una nueva foto
        setShowAsciiCamera(false); // Volver al modo normal
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setCameraMinimized(false);
    setSelectedEffect(null);
    setPhotoAscii('');
  };

  const openEffectDetails = (effect: Effect) => {
    setSelectedEffect(effect);
  };

  const closeEffectDetails = () => {
    setSelectedEffect(null);
  };

  const toggleAsciiCamera = () => {
    setShowAsciiCamera(!showAsciiCamera);
  };

  const switchTool = (toolId: string) => {
    setActiveToolId(toolId);
  };

  // Función para descargar la imagen con el efecto seleccionado
  const downloadImage = () => {
    if (!photo || !selectedEffect) return;

    if (selectedEffect.name === 'ASCII') {
      // Crear un enlace para descargar el texto ASCII
      const element = document.createElement('a');
      const file = new Blob([photoAscii], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `kroko-ascii-art.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      return;
    }

    // Para efectos normales, usar canvas
    const tempCanvas = document.createElement('canvas');
    const img = new Image();
    
    img.onload = () => {
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      const ctx = tempCanvas.getContext('2d');
      
      if (ctx) {
        // Dibujar la imagen en el canvas
        ctx.filter = selectedEffect.filter;
        ctx.drawImage(img, 0, 0);
        
        // Crear un enlace para descargar
        const a = document.createElement('a');
        a.href = tempCanvas.toDataURL('image/png');
        a.download = `kroko-foto-${selectedEffect.name.toLowerCase()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    
    img.src = photo;
  };

  // Renderizar contenido de la herramienta activa
  const renderToolContent = () => {
    switch (activeToolId) {
      case 'photo-effects':
        return renderPhotoEffects();
      default:
        return renderPlaceholder();
    }
  };

  // Renderizar herramienta de efectos de foto
  const renderPhotoEffects = () => {
    return (
      <>
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <>
            {photo && !selectedEffect && (
              <div className="w-full max-w-4xl mb-8">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h2" className="text-accent-strong">Efectos</Typography>
                  <button 
                    onClick={retakePhoto}
                    className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Nueva Foto
                  </button>
                </div>
                
                {/* Grid compacto de todas las fotos juntas */}
                <div className="relative border-4 border-accent-strong rounded-lg overflow-hidden">
                  <div className="grid grid-cols-5 gap-px bg-accent-strong">
                    {effects.map((effect, index) => (
                      <div 
                        key={index} 
                        className="aspect-square overflow-hidden cursor-pointer relative group"
                        onClick={() => openEffectDetails(effect)}
                      >
                        {effect.name === "ASCII" ? (
                          <div className="w-full h-full bg-black flex items-center justify-center text-[8px] text-accent-strong font-mono">
                            @#%*+;:,.
                          </div>
                        ) : (
                          <img 
                            src={photo} 
                            alt={`Efecto ${effect.name}`} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            style={{ filter: effect.filter }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-shadow-md transition-opacity">
                            {effect.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-accent-bg bg-opacity-70 p-2 text-center">
                    <Typography variant="p" className="text-sm">Haz clic en un efecto para verlo en detalle</Typography>
                  </div>
                </div>
              </div>
            )}

            {/* Cámara web (ahora debajo de la tooltip o grid) */}
            <div className={`relative ${cameraMinimized ? 'fixed top-4 right-4 z-10 w-1/4 md:w-1/5 lg:w-1/6' : 'w-full max-w-2xl'}`}>
              {!cameraMinimized && (
                <div className="mb-2 flex justify-end">
                  <button
                    onClick={toggleAsciiCamera}
                    className="px-3 py-1 bg-accent-strong text-white rounded-lg text-sm hover:opacity-90 transition-opacity mr-2"
                  >
                    {showAsciiCamera ? 'Modo Normal' : 'Modo ASCII'}
                  </button>
                </div>
              )}
              
              {showAsciiCamera && !cameraMinimized ? (
                <div className="aspect-video bg-black rounded-lg border-2 border-accent-strong overflow-hidden">
                  <WebcamAsciiEffect 
                    effect="ascii"
                    width={160}
                    fps={12}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`rounded-lg border-2 border-accent-strong max-w-full ${cameraMinimized ? 'shadow-lg' : ''}`}
                  style={{ maxHeight: cameraMinimized ? '20vh' : '60vh' }}
                />
              )}
              
              {!cameraMinimized && (
                <button 
                  onClick={takePhoto}
                  className="mt-4 px-6 py-2 bg-accent-strong text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tomar Foto
                </button>
              )}
            </div>

            {/* Efectos ASCII en vivo */}
            {!photo && !cameraMinimized && !showAsciiCamera && (
              <div className="mt-8 w-full max-w-4xl">
                <Typography variant="h2" className="text-accent-strong mb-4">Efectos en Vivo</Typography>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {effects.map((effect, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border-2 border-accent-strong">
                      <div className="p-2 bg-accent-bg">
                        <Typography variant="p" className="text-center text-sm">{effect.name}</Typography>
                      </div>
                      <div className="aspect-square">
                        <WebcamAsciiEffect 
                          effect={effect.asciiEffect} 
                          width={80}
                          fps={8}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detalle del efecto seleccionado */}
            {photo && selectedEffect && (
              <div className="mt-8 w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h2" className="text-accent-strong">{selectedEffect.name}</Typography>
                  <div className="flex gap-2">
                    <button 
                      onClick={downloadImage}
                      className="px-4 py-1 bg-accent-strong text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {selectedEffect.name === 'ASCII' ? 'Descargar TXT' : 'Descargar PNG'}
                    </button>
                    <button 
                      onClick={closeEffectDetails}
                      className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Volver
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Imagen con efecto aplicado o efecto ASCII */}
                  <div className="overflow-hidden rounded-lg border-2 border-accent-strong">
                    {selectedEffect.name === "ASCII" ? (
                      <div className="bg-black p-2 min-h-[200px] flex items-center justify-center">
                        {isGeneratingAscii ? (
                          <div className="text-accent-strong">Generando ASCII...</div>
                        ) : (
                          <pre 
                            className="text-accent-strong font-mono text-[5px] md:text-[6px] lg:text-[7px] leading-[0.8] overflow-auto max-h-[500px] whitespace-pre"
                          >
                            {photoAscii}
                          </pre>
                        )}
                      </div>
                    ) : (
                      <img 
                        src={photo} 
                        alt={`Efecto ${selectedEffect.name}`} 
                        className="w-full h-auto"
                        style={{ filter: selectedEffect.filter }}
                      />
                    )}
                  </div>
                  
                  {/* Información y configuraciones */}
                  <div className="p-4 bg-accent-bg rounded-lg border-2 border-accent-strong">
                    <Typography variant="h3" className="mb-2">Descripción</Typography>
                    <Typography variant="p" className="mb-4">{selectedEffect.description}</Typography>
                    
                    {selectedEffect.config && (
                      <>
                        <Typography variant="h3" className="mb-2 mt-4">Configuración</Typography>
                        <div className="space-y-4">
                          {Object.entries(selectedEffect.config).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between">
                                <Typography variant="p">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                                <Typography variant="p">{value}</Typography>
                              </div>
                              <div className="bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-1">
                                <div 
                                  className="bg-accent-strong h-2 rounded-full" 
                                  style={{ 
                                    width: `${key === 'degrees' ? (value / 360) * 100 : (value / 300) * 100}%` 
                                  }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="mt-6">
                      <Typography variant="h3" className="mb-2">Código CSS</Typography>
                      <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                        {selectedEffect.name === "ASCII" 
                          ? "// Arte ASCII generado mediante algoritmo de mapeo de brillo\n// a caracteres: @#S%?*+;:,. " 
                          : `filter: ${selectedEffect.filter};`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Canvas oculto para procesar la imagen */}
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </>
    );
  };

  // Renderizar placeholder para herramientas futuras
  const renderPlaceholder = () => {
    const tool = creativeTools.find(t => t.id === activeToolId);
    
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 border-2 border-accent-strong rounded-lg">
        <div className="text-6xl mb-4 opacity-30">🚧</div>
        <Typography variant="h2" className="mb-2">Próximamente</Typography>
        <Typography variant="p" className="text-center max-w-md mb-4 opacity-70">
          {tool?.description || 'Esta herramienta creativa estará disponible pronto.'}
        </Typography>
        <div className="p-3 border border-accent-bg rounded-md bg-accent-bg/30 font-mono text-sm">
          {`// ${tool?.name || 'Nueva herramienta'}: En desarrollo`}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8">
      <Typography variant="h1" className="mb-8 text-accent-strong page-title-container">CREATE</Typography>
      
      {/* Barra de navegación para herramientas creativas */}
      <div className="mb-8">
        <div className="border-b border-accent-bg flex flex-wrap">
          {creativeTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => switchTool(tool.id)}
              className={`py-3 px-5 font-medium transition-colors relative ${
                activeToolId === tool.id
                  ? 'text-accent-strong border-b-2 border-accent-strong -mb-[1px]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-accent-strong dark:hover:text-accent-strong'
              }`}
            >
              {tool.name}
              {activeToolId !== tool.id && tool.id !== 'photo-effects' && (
                <span className="absolute top-2 right-1 text-xs bg-accent-strong text-white rounded-full px-1.5 py-0.5 text-[10px]">
                  Nuevo
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Contenido de la herramienta activa */}
      <div className="flex flex-col items-center">
        {renderToolContent()}
      </div>
    </div>
  );
}