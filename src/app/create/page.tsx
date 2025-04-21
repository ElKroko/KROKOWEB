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
import { useDualMode } from '@/providers/DualModeProvider';

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
  // Estado para rastrear la herramienta activa
  const [activeToolId, setActiveToolId] = useState<string>('photo-effects');
  const { mode } = useDualMode();

  // Cambiar herramienta activa
  const switchTool = (toolId: string) => {
    setActiveToolId(toolId);
  };

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
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [selectedEffect, setSelectedEffect] = useState<string>('none');
    
    // Lista de efectos disponibles
    const effects: Effect[] = [
      { name: 'Normal', filter: 'none', type: 'css', description: 'Sin efectos' },
      { name: 'ASCII', filter: 'none', type: 'ascii', asciiEffect: 'ascii', description: 'Convierte la imagen en caracteres ASCII' },
      { name: 'Glitch', filter: 'none', type: 'webgl', description: 'Efecto de glitch digital' },
      { name: 'Scanline', filter: 'none', type: 'webgl', description: 'Efecto de líneas de escaneo', config: { density: 1.5, opacity: 0.3 } },
      { name: 'Vaporwave', filter: 'none', type: 'webgl', description: 'Estética retrowave' },
      { name: 'Kaleidoscopio', filter: 'none', type: 'webgl', description: 'Efecto de espejo caleidoscópico', config: { segments: 8 } },
      { name: 'Sepia', filter: 'sepia(100%)', type: 'css', asciiEffect: 'sepia', description: 'Tono sepia vintage' },
      { name: 'Negativo', filter: 'invert(100%)', type: 'css', asciiEffect: 'invert', description: 'Colores invertidos' },
      { name: 'Pixel', filter: 'none', type: 'ascii', asciiEffect: 'ascii', description: 'Efecto pixelado', config: { asciiWidth: 40 } },
    ];
    
    // Capturar foto desde la webcam
    const capturePhoto = () => {
      const video = document.querySelector('video');
      if (!video) return;
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        setCapturedPhoto(canvas.toDataURL('image/png'));
      }
    };
    
    // Borrar foto capturada
    const resetPhoto = () => {
      setCapturedPhoto(null);
    };

    const renderSelectedEffect = () => {
      if (!capturedPhoto) return null;
      
      const effect = effects.find(e => e.name === selectedEffect);
      if (!effect) return null;
      
      switch (effect.type) {
        case 'css':
          return (
            <div className="w-full aspect-video flex items-center justify-center">
              <img 
                src={capturedPhoto} 
                alt="Foto con efecto" 
                style={{ filter: effect.filter }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          );
        case 'webgl':
          if (selectedEffect === 'Kaleidoscopio') {
            return <KaleidoscopeEffect photo={capturedPhoto} config={effect.config} />;
          }
          return <WebGLEffect photo={capturedPhoto} effect={selectedEffect.toLowerCase()} config={effect.config} />;
        case 'ascii':
          return (
            <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <img 
                src={capturedPhoto} 
                alt="Foto ASCII" 
                style={{ display: 'none' }}
                onLoad={(e) => {
                  const img = e.currentTarget;
                  // Convertir a ASCII usando la utilidad de la librería
                  const asciiText = base64ImageToAscii(img, effect.config?.asciiWidth || 80);
                  const preElement = document.getElementById('ascii-output');
                  if (preElement) {
                    preElement.textContent = asciiText;
                  }
                }}
              />
              <pre 
                id="ascii-output"
                className="h-full w-full font-mono text-xs leading-none whitespace-pre text-accent-strong p-4"
                style={{ fontSize: '8px', lineHeight: '0.8em' }}
              >
                Convirtiendo a ASCII...
              </pre>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="w-full">
        <Typography variant="h2" className="text-accent-strong mb-2">Efectos de Foto</Typography>
        <Typography variant="p" className="mb-6 max-w-3xl">
          Captura fotos con tu webcam y aplica efectos visuales usando WebGL y procesamiento de imágenes.
        </Typography>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Columna izquierda: Webcam o foto capturada */}
          <div className="bg-card-bg rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              {!capturedPhoto ? (
                <WebcamAsciiEffect 
                  effect="none"
                  width={400}
                  className="w-full h-full"
                  showControls={true}
                />
              ) : (
                renderSelectedEffect()
              )}
            </div>
            
            <div className="p-4 flex justify-between items-center">
              {!capturedPhoto ? (
                <button 
                  onClick={capturePhoto}
                  className="bg-accent-color hover:bg-accent-color/80 text-white py-2 px-4 rounded-md font-medium"
                >
                  Capturar Foto
                </button>
              ) : (
                <button 
                  onClick={resetPhoto}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md font-medium"
                >
                  Nueva Foto
                </button>
              )}
              
              {capturedPhoto && (
                <a 
                  href={capturedPhoto}
                  download="kroko-photo-effect.png"
                  className="bg-accent-color/80 hover:bg-accent-color text-white py-2 px-4 rounded-md font-medium"
                >
                  Descargar
                </a>
              )}
            </div>
          </div>
          
          {/* Columna derecha: Efectos disponibles */}
          <div>
            <Typography variant="h3" className="mb-4 font-medium">
              Efectos Disponibles
            </Typography>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {effects.map(effect => (
                <button
                  key={effect.name}
                  onClick={() => setSelectedEffect(effect.name)}
                  className={`p-3 rounded-md text-left transition-colors ${
                    selectedEffect === effect.name 
                      ? `bg-accent-color/30 border-2 border-accent-color` 
                      : `bg-card-bg hover:bg-accent-color/10 border-2 border-transparent`
                  }`}
                >
                  <div className="font-medium mb-1">{effect.name}</div>
                  <div className="text-xs opacity-70">{effect.description}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-md bg-card-bg">
              <Typography variant="h4" className="text-sm mb-2 uppercase tracking-wider">
                Instrucciones
              </Typography>
              <ol className="text-sm space-y-2 list-decimal pl-5">
                <li>Asegúrate de permitir el acceso a tu webcam</li>
                <li>Captura una foto usando el botón</li>
                <li>Selecciona un efecto de la lista</li>
                <li>Descarga tu creación con el efecto aplicado</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar herramienta de generación de texto ASCII
  const renderAsciiText = () => {
    return (
      <div className="w-full">
        <Typography variant="h2" className="text-accent-strong mb-2">Generador de Texto ASCII</Typography>
        <Typography variant="p" className="mb-6 max-w-3xl">
          Convierte texto en arte ASCII con diversos estilos y fuentes. Prueba diferentes fuentes para crear firmas, 
          banners o diseños únicos para tus proyectos.
        </Typography>
        <AsciiTextGenerator initialText="KROKO" />
      </div>
    );
  };

  // Renderizar herramienta de generación de arte ASCII a partir de imágenes
  const renderAsciiArt = () => {
    return (
      <div className="w-full">
        <Typography variant="h2" className="text-accent-strong mb-2">Playground de Arte ASCII</Typography>
        <Typography variant="p" className="mb-6 max-w-3xl">
          Convierte imágenes en arte ASCII o crea directamente con texto. Ajusta los parámetros para personalizar el resultado
          y descarga tu creación como archivo de texto, imagen o animación.
        </Typography>
        <AsciiPlayground />
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar para herramientas creativas - estilo similar a la sidebar principal */}
      <aside className={`md:w-64 flex-shrink-0 md:min-h-screen border-r ${
        mode === 'xklokon' ? 'bg-card-bg border-accent-color/20' : 'bg-accent-color/5 border-accent-color/10'
      } p-6 flex flex-col`}>
        {/* Título y descripción */}
        <div className="mb-8">
          <Typography variant="h1" className="text-accent-strong text-3xl mb-2">CREATE</Typography>
          <Typography variant="p" className="text-sm opacity-80">
            Explora herramientas creativas para generar arte y contenido interactivo.
          </Typography>
        </div>
        
        <Typography variant="h3" className="text-accent-color mb-4 font-medium text-sm uppercase tracking-wider">HERRAMIENTAS</Typography>
        <nav className="flex flex-col space-y-1">
          {creativeTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => switchTool(tool.id)}
              className={`py-2 px-3 text-left rounded-md transition-colors ${
                activeToolId === tool.id
                  ? `${mode === 'xklokon' ? 'bg-accent-color/30' : 'bg-accent-color/20'} text-accent-color font-medium`
                  : 'text-gray-600 dark:text-gray-400 hover:text-accent-color dark:hover:text-accent-color hover:bg-accent-color/10'
              }`}
            >
              {tool.name}
            </button>
          ))}
        </nav>
        
        {/* Espacio flexible para mantener todo en la parte superior */}
        <div className="flex-grow"></div>
        
        {/* Información adicional en la parte inferior */}
        <div className="mt-4 pt-4 border-t border-accent-color/10 text-xs opacity-60">
          <p>Las herramientas creativas están en constante desarrollo.</p>
        </div>
      </aside>
      
      {/* Contenido de la herramienta activa */}
      <main className="flex-grow p-8 overflow-auto w-full">
        {renderToolContent()}
      </main>
    </div>
  );
}