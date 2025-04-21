'use client';

import React, { useState, useRef, useEffect } from 'react';
import Typography from '@/components/ui/Typography';

// Definir los efectos disponibles
const effects = [
  {
    id: 'normal',
    name: 'Normal',
    description: 'Visualización sin efectos',
    icon: '🎥',
    filter: ''
  },
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Tono cálido vintage',
    icon: '🌅',
    filter: 'sepia(100%)'
  },
  {
    id: 'grayscale',
    name: 'Blanco y Negro',
    description: 'Efecto clásico en escala de grises',
    icon: '⬜',
    filter: 'grayscale(100%)'
  },
  {
    id: 'invert',
    name: 'Invertido',
    description: 'Colores invertidos',
    icon: '🔄',
    filter: 'invert(100%)'
  },
  {
    id: 'pixelate',
    name: 'Pixelado',
    description: 'Efecto retro pixelado',
    icon: '🎮',
    filter: ''
  },
  {
    id: 'ascii',
    name: 'ASCII Art',
    description: 'Conversión a caracteres ASCII',
    icon: '📝',
    filter: ''
  }
];

// Componente principal de efectos de foto
export default function PhotoEffects() {
  const [selectedEffect, setSelectedEffect] = useState('normal');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const asciiCanvasRef = useRef(null);
  const [permission, setPermission] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  
  // Referencia para el frame de animación de ASCII art
  const asciiFrameRef = useRef(null);

  // Configurar el acceso a la cámara web
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setPermission(true);
          setCameraError(null);
        }
      } catch (err) {
        console.error("Error accediendo a la cámara: ", err);
        setCameraError(`Error al acceder a la cámara: ${err.message}`);
      }
    }

    setupCamera();

    // Limpiar al desmontar
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      
      // Cancelar cualquier frame de animación pendiente
      if (asciiFrameRef.current) {
        cancelAnimationFrame(asciiFrameRef.current);
      }
    };
  }, []);
  
  // Efecto para manejar la generación de ASCII art
  useEffect(() => {
    if (selectedEffect === 'ascii' && videoRef.current && asciiCanvasRef.current && permission) {
      const video = videoRef.current;
      const canvas = asciiCanvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Establecer un tamaño razonable para el canvas ASCII (más pequeño para rendimiento)
      canvas.width = 120;  // Ancho bajo para rendimiento de ASCII art
      canvas.height = 60;  // Altura proporcional
      
      // Función para convertir la imagen a ASCII
      const processAsciiFrame = () => {
        if (!video.paused && !video.ended && video.readyState >= 2) {
          // Limpiar el canvas
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Dibujar video en el canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Obtener datos de la imagen
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          // Limpiar canvas para redibujar con ASCII
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Configuraciones para ASCII
          const charSet = '@%#*+=-:. ';
          const charWidth = canvas.width / canvas.width;
          const charHeight = 8;
          
          // Dibujar caracteres ASCII
          ctx.fillStyle = 'white';
          ctx.font = `${charHeight}px monospace`;
          
          for (let y = 0; y < canvas.height; y += charHeight) {
            for (let x = 0; x < canvas.width; x += charWidth) {
              // Obtener el valor de brillo
              const pos = (y * canvas.width + x) * 4;
              const brightness = (data[pos] + data[pos + 1] + data[pos + 2]) / 3;
              
              // Mapear brillo a índice de carácter
              const charIndex = Math.floor(brightness / 256 * charSet.length);
              const char = charSet[charSet.length - 1 - charIndex] || ' ';
              
              // Dibujar el carácter
              ctx.fillText(char, x, y + charHeight);
            }
          }
        }
        
        // Continuar animación
        asciiFrameRef.current = requestAnimationFrame(processAsciiFrame);
      };
      
      // Iniciar procesamiento de ASCII
      processAsciiFrame();
      
      // Limpiar cuando el efecto cambie
      return () => {
        if (asciiFrameRef.current) {
          cancelAnimationFrame(asciiFrameRef.current);
        }
      };
    }
  }, [selectedEffect, permission]);

  // Función para aplicar efectos especiales al tomar una foto
  const applySpecialEffects = (canvas, ctx, effect) => {
    const width = canvas.width;
    const height = canvas.height;
    
    switch(effect) {
      case 'pixelate':
        const pixelSize = 10;
        const imageData = ctx.getImageData(0, 0, width, height);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Dibujar la imagen original en el canvas temporal
        tempCtx.putImageData(imageData, 0, 0);
        
        // Limpiar el canvas original
        ctx.clearRect(0, 0, width, height);
        
        // Pixelar la imagen
        for (let y = 0; y < height; y += pixelSize) {
          for (let x = 0; x < width; x += pixelSize) {
            // Obtener el color del primer píxel del bloque
            const pixelData = tempCtx.getImageData(x, y, 1, 1).data;
            // Llenar todo el bloque con ese color
            ctx.fillStyle = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
        break;
        
      case 'ascii':
        // Para ASCII, capturamos el canvas de ASCII directamente
        if (asciiCanvasRef.current) {
          // Limpiar el canvas original
          ctx.clearRect(0, 0, width, height);
          
          // Dibujar el canvas ASCII en el canvas de captura, escalado al tamaño completo
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(asciiCanvasRef.current, 0, 0, width, height);
        }
        break;
    }
  };

  // Función para tomar una foto
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Configurar el tamaño del canvas para que coincida con el video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Obtener contexto del canvas
    const ctx = canvas.getContext('2d');
    
    // Dibujar el video en el canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Obtener el efecto seleccionado
    const effect = selectedEffect;
    
    // Aplicar filtro CSS manualmente para efectos basados en filtro
    const selectedFilterEffect = effects.find(e => e.id === effect);
    if (selectedFilterEffect && selectedFilterEffect.filter) {
      // Crear un canvas temporal para aplicar el filtro
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      // Dibujar la imagen original
      tempCtx.drawImage(canvas, 0, 0);
      
      // Aplicar filtro usando CSS Filter API
      const imageData = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Aplicar filtros manualmente (versión simplificada)
      if (effect === 'sepia') {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
      } else if (effect === 'grayscale') {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
      } else if (effect === 'invert') {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
      }
      
      // Poner datos de imagen de vuelta
      ctx.putImageData(imageData, 0, 0);
    } else {
      // Aplicar efectos especiales (pixelado, ascii, etc.)
      applySpecialEffects(canvas, ctx, effect);
    }
    
    // Guardar la imagen en estado para mostrar vista previa
    const dataUrl = canvas.toDataURL('image/png');
    setPhoto(dataUrl);
    setShowPreview(true);
  };
  
  // Descargar la foto
  const downloadPhoto = () => {
    if (!photo) return;
    
    // Crear un enlace temporal para descargar la imagen
    const link = document.createElement('a');
    link.href = photo;
    link.download = `foto-efecto-${selectedEffect}-${new Date().toISOString().slice(0, 10)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full">
      <Typography variant="h2" className="text-accent-strong mb-2">Efectos de Foto</Typography>
      <Typography variant="p" className="mb-6 max-w-3xl">
        Captura imágenes con diferentes efectos visuales en tiempo real. Aplica filtros, efectos o transforma tu imagen en tiempo real antes de descargarla.
      </Typography>
      
      <div className="flex flex-col md:flex-row gap-6 w-full overflow-hidden">
        {/* Visualización de la webcam (a la izquierda) */}
        <div className="flex-1 relative">
          <div className="w-full h-[500px] bg-black rounded-lg overflow-hidden shadow-lg flex items-center justify-center">
            {cameraError ? (
              <div className="text-white p-4 text-center">
                <div className="text-2xl mb-2">❌</div>
                <p>{cameraError}</p>
                <p className="text-sm mt-4">Intenta permitir el acceso a la cámara en la configuración de tu navegador.</p>
              </div>
            ) : showPreview && photo ? (
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <img 
                  src={photo} 
                  alt="Foto capturada" 
                  className="max-w-full max-h-full object-contain" 
                />
                <div className="absolute top-2 right-2 space-x-2">
                  <button 
                    onClick={() => setShowPreview(false)}
                    className="bg-primary-dark/80 text-white p-2 rounded-full hover:bg-primary-dark"
                    title="Volver a la cámara"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Video normal (visible solo cuando no es ASCII) */}
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted
                  style={{ 
                    filter: effects.find(e => e.id === selectedEffect)?.filter || '',
                    display: selectedEffect === 'ascii' ? 'none' : 'block',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain'
                  }}
                  className="w-full h-full"
                />
                
                {/* Canvas para ASCII Art (solo visible cuando se selecciona ASCII) */}
                <canvas 
                  ref={asciiCanvasRef}
                  style={{
                    display: selectedEffect === 'ascii' ? 'block' : 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  className="bg-black"
                />
                
                {!permission && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white">
                    <div className="text-center p-4">
                      <div className="animate-spin text-2xl mb-2">⚙️</div>
                      <p>Esperando permiso para acceder a la cámara...</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Indicador de efecto activo */}
          {permission && !showPreview && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              Efecto: {effects.find(e => e.id === selectedEffect)?.name || 'Normal'}
            </div>
          )}
          
          {/* Canvas oculto para procesar la imagen */}
          <canvas 
            ref={canvasRef} 
            style={{ display: 'none' }}
          />
        </div>
        
        {/* Panel de controles (a la derecha) */}
        <div className="md:w-96 flex flex-col gap-4">
          {/* Grid de efectos */}
          <div className="bg-card-bg rounded-lg p-4 border border-accent-color/20">
            <Typography variant="h3" className="text-accent-color mb-3 text-lg">Efectos disponibles</Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {effects.map(effect => (
                <button
                  key={effect.id}
                  onClick={() => setSelectedEffect(effect.id)}
                  className={`p-3 rounded-md transition-colors text-center flex flex-col items-center ${
                    selectedEffect === effect.id 
                      ? 'bg-accent-color/20 text-accent-color border border-accent-color/30' 
                      : 'hover:bg-accent-color/10 border border-transparent'
                  }`}
                >
                  <div className="text-2xl mb-1">{effect.icon}</div>
                  <div className="font-medium text-sm">{effect.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex flex-col gap-2">
            {showPreview && photo ? (
              <button 
                onClick={downloadPhoto}
                className="bg-accent-color text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-accent-color/90 transition-colors"
              >
                <span>⬇️</span> Descargar Foto
              </button>
            ) : (
              <button 
                onClick={takePhoto}
                disabled={!permission || showPreview}
                className={`py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors
                  ${!permission 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-accent-color text-white hover:bg-accent-color/90'}`}
              >
                <span>📷</span> Tomar Foto
              </button>
            )}
          </div>
          
          {/* Instrucciones adicionales */}
          <div className="bg-primary-dark/10 rounded-lg p-4 text-sm">
            <p className="mb-2"><strong>Cómo usar:</strong></p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Selecciona un efecto visual del grid</li>
              <li>Verifica cómo se ve en tiempo real</li>
              <li>Haz clic en "Tomar Foto" cuando estés satisfecho</li>
              <li>Si te gusta el resultado, descarga la imagen</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}