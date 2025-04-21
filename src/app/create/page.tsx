'use client';

import React, { useEffect, useRef, useState } from 'react';
import Typography from '@/components/ui/Typography';
import WebcamAsciiEffect from '@/components/ui/WebcamAsciiEffect';
import AsciiTextGenerator from '@/components/ui/AsciiTextGenerator';
import AsciiPlayground from '@/components/AsciiPlayground';
import { base64ImageToAscii } from '@/lib/ascii-utils';
import { Canvas, useThree } from '@react-three/fiber';
import { EffectComposer, Glitch, Scanline, Bloom, DepthOfField, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Vector2 } from 'three';

// Definir tipos para los efectos
type Effect = {
  name: string;
  filter: string;
  asciiEffect?: 'none' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast' | 'hue-rotate' | 'saturate' | 'ascii';
  description?: string;
  config?: { [key: string]: number };
  type: 'css' | 'webgl' | 'ascii';
};

// Definir tipos para la configuración de los efectos
type EffectConfig = {
  segments?: number;
  density?: number;
  opacity?: number;
  threshold?: number;
  intensity?: number;
  frequency?: number;
  [key: string]: number | undefined;
};

// Definir tipos para las herramientas creativas
type CreativeTool = {
  id: string;
  name: string;
  icon?: string;
  description: string;
};

// Componente para efectos WebGL
const WebGLEffect = ({ photo, effect, config = {} as EffectConfig }: { photo: string, effect: string, config?: EffectConfig }) => {
  return (
    <div className="w-full h-full aspect-video">
      <Canvas>
        <mesh>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial>
            <Texture url={photo} />
          </meshBasicMaterial>
        </mesh>
        <EffectComposer>
          {effect === 'glitch' ? (
            <Glitch
              delay={new Vector2(1.5, 3.5)}
              duration={new Vector2(0.2, 0.4)}
              strength={new Vector2(0.2, 0.4)}
              active
              ratio={0.85}
            />
          ) : null}
          {effect === 'scanline' ? (
            <Scanline density={config.density || 1.5} opacity={config.opacity || 0.25} />
          ) : null}
          {effect === 'noise' ? (
            <Noise opacity={config.opacity || 0.25} />
          ) : null}
          {effect === 'bloom' ? (
            <Bloom luminanceThreshold={config.threshold || 0.5} intensity={config.intensity || 1.5} />
          ) : null}
          {effect === 'vaporwave' ? (
            <>
              <Bloom luminanceThreshold={0.2} intensity={2} />
              <Scanline density={2} opacity={0.1} />
              <Noise opacity={0.05} />
              <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
            </>
          ) : null}
        </EffectComposer>
      </Canvas>
    </div>
  );
};

// Componente para renderizar una textura en WebGL
const Texture = ({ url }: { url: string }) => {
  const texture = new THREE.TextureLoader().load(url);
  const { viewport } = useThree();
  
  return (
    <sprite scale={[viewport.width, viewport.height, 1]}>
      <spriteMaterial map={texture} />
    </sprite>
  );
};

// Componente para efecto Kaleidoscope
const KaleidoscopeEffect = ({ photo, config = {} as EffectConfig }: { photo: string, config?: EffectConfig }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (!canvasRef.current || !photo) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      setLoaded(true);
      
      const segments = config.segments || 8;
      const angleStep = (Math.PI * 2) / segments;
      
      canvas.width = 500;
      canvas.height = 500;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;
      
      // Dibujar el kaleidoscopio
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        
        for (let i = 0; i < segments; i++) {
          ctx.save();
          ctx.rotate(angleStep * i);
          
          // Dibujar un segmento de la imagen
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, radius, -angleStep/2, angleStep/2);
          ctx.closePath();
          ctx.clip();
          
          // Calcular posición de la imagen para este segmento
          const scale = 1.5;
          const imgWidth = img.width * scale;
          const imgHeight = img.height * scale;
          ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight);
          
          ctx.restore();
        }
        
        ctx.restore();
        
        // Animar para el siguiente frame
        requestAnimationFrame(draw);
      };
      
      draw();
    };
    
    img.src = photo;
    
    return () => {
      // Limpiar animación si es necesario
    };
  }, [photo, config]);
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className={`w-full aspect-square border-2 border-accent-strong rounded-lg ${!loaded ? 'bg-gray-900' : ''}`}
      />
      {!loaded && <div className="absolute inset-0 flex items-center justify-center">Cargando...</div>}
    </div>
  );
};

export default function CreatePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<Effect | null>(null);
  const [showAsciiCamera, setShowAsciiCamera] = useState(false);
  const [photoAscii, setPhotoAscii] = useState<string>('');
  const [isGeneratingAscii, setIsGeneratingAscii] = useState(false);
  const [activeToolId, setActiveToolId] = useState<string>('photo-effects');
  const [showEffectsGrid, setShowEffectsGrid] = useState(false);
  
  // Lista de herramientas creativas
  const creativeTools: CreativeTool[] = [
    {
      id: 'photo-effects',
      name: 'Efectos de Foto',
      description: 'Captura fotos y aplica efectos visuales usando WebGL'
    },
    {
      id: 'ascii-text',
      name: 'ASCII Text',
      description: 'Genera texto ASCII con diversos estilos y fuentes'
    },
    {
      id: 'ascii-art',
      name: 'ASCII Art',
      description: 'Convierte imágenes a arte ASCII y crea animaciones'
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
    }
  ];

  // Lista de efectos CSS tradicionales para aplicar a las fotos
  const cssEffects: Effect[] = [
    { 
      name: "Normal", 
      filter: "none",
      asciiEffect: "none",
      description: "Imagen original sin ningún filtro aplicado",
      type: 'css'
    },
    { 
      name: "Grayscale", 
      filter: "grayscale(100%)",
      asciiEffect: "grayscale",
      description: "Convierte la imagen a escala de grises (blanco y negro)",
      config: { intensity: 100 },
      type: 'css'
    },
    { 
      name: "Sepia", 
      filter: "sepia(100%)",
      asciiEffect: "sepia",
      description: "Aplica un tono marrón-amarillento que da un aspecto antiguo",
      config: { intensity: 100 },
      type: 'css'
    },
    { 
      name: "Invert", 
      filter: "invert(100%)",
      asciiEffect: "invert",
      description: "Invierte todos los colores de la imagen",
      config: { intensity: 100 },
      type: 'css'
    },
    { 
      name: "Blur", 
      filter: "blur(4px)",
      asciiEffect: "blur",
      description: "Aplica un desenfoque a toda la imagen",
      config: { radius: 4 },
      type: 'css'
    }
  ];
  
  // Nuevos efectos WebGL
  const webglEffects: Effect[] = [
    {
      name: "Glitch",
      filter: "none",
      description: "Efecto de fallos digitales que distorsiona la imagen con cortes y desplazamientos",
      config: { intensity: 50, frequency: 0.5 },
      type: 'webgl'
    },
    {
      name: "Scanline",
      filter: "none",
      description: "Líneas horizontales que simulan pantallas antiguas CRT",
      config: { density: 1.5, opacity: 0.25 },
      type: 'webgl'
    },
    {
      name: "Noise",
      filter: "none",
      description: "Aplica ruido digital aleatorio a la imagen, similar a la estática de TV",
      config: { opacity: 0.25 },
      type: 'webgl'
    },
    {
      name: "Bloom",
      filter: "none",
      description: "Crea un resplandor luminoso alrededor de las áreas brillantes",
      config: { threshold: 0.5, intensity: 1.5 },
      type: 'webgl'
    },
    {
      name: "Vaporwave",
      filter: "none",
      description: "Estética retro de los 80s y 90s con colores saturados y brillantes",
      config: { intensity: 2 },
      type: 'webgl'
    },
    {
      name: "Kaleidoscopio",
      filter: "none",
      description: "Crea un patrón caleidoscópico reflectante a partir de la imagen",
      config: { segments: 8 },
      type: 'webgl'
    }
  ];

  useEffect(() => {
    // Reiniciar estado cuando cambia la herramienta activa
    if (activeToolId !== 'photo-effects') {
      setPhoto(null);
      setSelectedEffect(null);
      setPhotoAscii('');
      setShowAsciiCamera(false);
      setShowEffectsGrid(false);
    }
  }, [activeToolId]);

  useEffect(() => {
    // Para evitar problemas con la referencia al desmontar
    const video = videoRef.current;
    
    // Limpiar recursos de la cámara al desmontar
    return () => {
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
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
        setPhotoAscii(''); // Reiniciar el ASCII cuando se toma una nueva foto
        setShowAsciiCamera(false); // Volver al modo normal
        setShowEffectsGrid(true); // Mostrar grid de efectos después de tomar la foto
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    setSelectedEffect(null);
    setPhotoAscii('');
    setShowEffectsGrid(false);
    setupCamera(); // Asegurarse de que la cámara esté funcionando
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
    
    // Si se selecciona la herramienta de efectos de foto, configurar la cámara
    if (toolId === 'photo-effects' && !photo) {
      setupCamera();
    }
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

    // Para efectos de CSS, usar canvas
    if (selectedEffect.type === 'css') {
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
    } else {
      // Para efectos WebGL, capturar el canvas
      const a = document.createElement('a');
      a.download = `kroko-foto-${selectedEffect.name.toLowerCase()}.png`;
      
      // Encontrar el canvas de WebGL
      const webglCanvas = document.querySelector('.webgl-effect canvas') as HTMLCanvasElement;
      if (webglCanvas) {
        webglCanvas.toBlob((blob: Blob | null) => {
          if (blob) {
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        });
      }
    }
  };

  // Renderizar contenido de la herramienta activa
  const renderToolContent = () => {
    switch (activeToolId) {
      case 'photo-effects':
        return renderPhotoEffects();
      case 'ascii-text':
        return renderAsciiText();
      case 'ascii-art':
        return renderAsciiArt();
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
          <div className="w-full">
            {!photo && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl">
                  <Typography variant="h2" className="text-accent-strong mb-6">Captura una foto para empezar</Typography>
                  
                  {/* Cámara web principal */}
                  <div className="relative">
                    <div className="mb-2 flex justify-end">
                      <button
                        onClick={toggleAsciiCamera}
                        className="px-3 py-1 bg-accent-strong text-white rounded-lg text-sm hover:opacity-90 transition-opacity mr-2"
                      >
                        {showAsciiCamera ? 'Modo Normal' : 'Modo ASCII'}
                      </button>
                    </div>
                    
                    {showAsciiCamera ? (
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
                        className="rounded-lg border-2 border-accent-strong max-w-full aspect-video"
                      />
                    )}
                    
                    <button 
                      onClick={takePhoto}
                      className="mt-4 px-6 py-2 bg-accent-strong text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Tomar Foto
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Nuevo layout después de tomar la foto: cámara a la izquierda, efectos a la derecha */}
            {photo && showEffectsGrid && !selectedEffect && (
              <div className="w-full max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <Typography variant="h2" className="text-accent-strong">Efectos</Typography>
                  <button 
                    onClick={retakePhoto}
                    className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Nueva Foto
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Cámara minimizada a la izquierda */}
                  <div className="md:w-1/3">
                    <div className="sticky top-4">
                      <Typography variant="h3" className="mb-2">Foto original</Typography>
                      <div className="rounded-lg border-2 border-accent-strong overflow-hidden">
                        {/* En un proyecto real, deberíamos usar next/image, pero para simplificar usaremos img */}
                        <img 
                          src={photo} 
                          alt="Foto original" 
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Grid de efectos a la derecha */}
                  <div className="md:w-2/3">
                    <Typography variant="h3" className="mb-2">Selecciona un efecto</Typography>
                    
                    {/* CSS Filters */}
                    <div className="mb-6">
                      <Typography variant="h4" className="text-accent-strong mb-2">Filtros CSS</Typography>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {cssEffects.map((effect, index) => (
                          <div 
                            key={`css-${index}`} 
                            className="overflow-hidden cursor-pointer border-2 border-accent-bg hover:border-accent-strong rounded-lg transition-all"
                            onClick={() => openEffectDetails(effect)}
                          >
                            <div className="aspect-square overflow-hidden">
                              <img 
                                src={photo} 
                                alt={`Efecto ${effect.name}`} 
                                className="w-full h-full object-cover"
                                style={{ filter: effect.filter }}
                              />
                            </div>
                            <div className="p-2 bg-accent-bg">
                              <Typography variant="p" className="text-center text-sm">{effect.name}</Typography>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* WebGL Effects */}
                    <div className="mb-6">
                      <Typography variant="h4" className="text-accent-strong mb-2">Efectos Avanzados (WebGL)</Typography>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {webglEffects.map((effect, index) => (
                          <div 
                            key={`webgl-${index}`} 
                            className="overflow-hidden cursor-pointer border-2 border-accent-bg hover:border-accent-strong rounded-lg transition-all"
                            onClick={() => openEffectDetails(effect)}
                          >
                            <div className="aspect-square overflow-hidden relative bg-gray-900">
                              <div className="absolute inset-0 flex items-center justify-center text-accent-strong opacity-30">
                                <span className="text-3xl">{effect.name === "Kaleidoscopio" ? "🔮" : "✨"}</span>
                              </div>
                            </div>
                            <div className="p-2 bg-accent-bg">
                              <Typography variant="p" className="text-center text-sm">{effect.name}</Typography>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vista detallada de un efecto */}
            {photo && selectedEffect && (
              <div className="w-full max-w-6xl mx-auto">
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
                  {/* Original vs Efecto */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="overflow-hidden rounded-lg border-2 border-accent-strong">
                      <div className="p-2 bg-accent-bg">
                        <Typography variant="p" className="text-center">Original</Typography>
                      </div>
                      <img 
                        src={photo} 
                        alt="Foto original" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-hidden rounded-lg border-2 border-accent-strong">
                    <div className="p-2 bg-accent-bg">
                      <Typography variant="p" className="text-center">Efecto {selectedEffect.name}</Typography>
                    </div>
                    
                    {/* Renderizado según el tipo de efecto */}
                    {selectedEffect.type === 'css' && (
                      <img 
                        src={photo} 
                        alt={`Efecto ${selectedEffect.name}`} 
                        className="w-full h-auto"
                        style={{ filter: selectedEffect.filter }}
                      />
                    )}
                    
                    {selectedEffect.type === 'webgl' && selectedEffect.name === 'Kaleidoscopio' && (
                      <KaleidoscopeEffect 
                        photo={photo} 
                        config={selectedEffect.config}
                      />
                    )}
                    
                    {selectedEffect.type === 'webgl' && selectedEffect.name !== 'Kaleidoscopio' && (
                      <div className="webgl-effect">
                        <WebGLEffect 
                          photo={photo} 
                          effect={selectedEffect.name.toLowerCase()} 
                          config={selectedEffect.config}
                        />
                      </div>
                    )}
                    
                    {selectedEffect.type === 'ascii' && (
                      <div className="bg-black p-4 min-h-[200px] flex items-center justify-center">
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
                    )}
                  </div>
                  
                  {/* Descripción y controles del efecto */}
                  <div className="md:col-span-2 p-4 bg-accent-bg rounded-lg border-2 border-accent-strong">
                    <Typography variant="h3" className="mb-2">Descripción</Typography>
                    <Typography variant="p" className="mb-4">{selectedEffect.description}</Typography>
                    
                    {selectedEffect.config && (
                      <>
                        <Typography variant="h3" className="mb-2 mt-4">Configuración</Typography>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {selectedEffect.type !== 'ascii' && (
                      <div className="mt-6">
                        <Typography variant="h3" className="mb-2">Tecnología</Typography>
                        <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm overflow-auto">
                          {selectedEffect.type === 'css' 
                            ? `/* CSS Filter */\nfilter: ${selectedEffect.filter};` 
                            : `/* WebGL Shader */\n// Utilizando Three.js y React Three Fiber\n// con efectos avanzados de post-procesamiento`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Canvas oculto para procesar la imagen */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </>
    );
  };

  // Renderizar herramienta de generación de texto ASCII
  const renderAsciiText = () => {
    return (
      <div className="w-full">
        <div className="mb-8">
          <Typography variant="h2" className="text-accent-strong mb-2">Generador de Texto ASCII</Typography>
          <Typography variant="p" className="mb-6 max-w-3xl">
            Convierte texto en arte ASCII con diversos estilos y fuentes. Prueba diferentes fuentes para crear firmas, 
            banners o diseños únicos para tus proyectos.
          </Typography>
          
          <AsciiTextGenerator initialText="KROKO" />
        </div>
      </div>
    );
  };

  // Renderizar herramienta de generación de arte ASCII a partir de imágenes
  const renderAsciiArt = () => {
    return (
      <div className="w-full">
        <div className="mb-8">
          <Typography variant="h2" className="text-accent-strong mb-2">Playground de Arte ASCII</Typography>
          <Typography variant="p" className="mb-6 max-w-3xl">
            Convierte imágenes en arte ASCII o crea directamente con texto. Ajusta los parámetros para personalizar el resultado
            y descarga tu creación como archivo de texto, imagen o animación.
          </Typography>
          
          <AsciiPlayground />
        </div>
      </div>
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
              {activeToolId !== tool.id && (tool.id === 'ascii-art' || tool.id !== 'photo-effects') && (
                <span className="absolute top-2 right-1 text-xs bg-accent-strong text-white rounded-full px-1.5 py-0.5 text-[10px]">
                  {tool.id === 'ascii-art' ? 'Nuevo' : 'Pronto'}
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