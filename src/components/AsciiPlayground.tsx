import React, { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';
import { useDualMode } from '@/providers/DualModeProvider';
import { useAccentColor } from '@/providers/AccentColorProvider';

// Helper function to calculate average brightness of a block
function getBlockBrightness(imageData: ImageData, x: number, y: number, cellSize: number): number {
  let totalBrightness = 0;
  let count = 0;
  const startX = x * cellSize;
  const startY = y * cellSize;

  for (let py = 0; py < cellSize; py++) {
    for (let px = 0; px < cellSize; px++) {
      const currentX = startX + px;
      const currentY = startY + py;

      if (currentX < imageData.width && currentY < imageData.height) {
        const index = (currentY * imageData.width + currentX) * 4;
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
        // Simple brightness calculation (Luma)
        const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        totalBrightness += brightness;
        count++;
      }
    }
  }
  return count > 0 ? totalBrightness / count / 255 : 0; // Normalize to 0-1
}

// Helper function to scale an image to a maximum width and height
function scaleImage(img: HTMLImageElement, maxWidth: number, maxHeight: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;
  
  // Calculate the new dimensions while maintaining aspect ratio
  if (width > maxWidth) {
    height = Math.floor(height * (maxWidth / width));
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = Math.floor(width * (maxHeight / height));
    height = maxHeight;
  }
  
  // Ensure minimum dimensions
  width = Math.max(width, 100);
  height = Math.max(height, 100);
  
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0, width, height);
  }
  
  return canvas;
}

export default function AsciiPlayground() {
  const { mode } = useDualMode();
  const { accentColor } = useAccentColor();

  // 1. Estado de la imagen / texto de entrada
  const [inputImage, setInputImage] = useState<string | null>(null); // Store URL
  const [inputText, setInputText] = useState<string>('');
  const imageRef = useRef<HTMLImageElement | null>(null); // Ref for the loaded image dimensions
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState<boolean>(false);
  const [animationFrames, setAnimationFrames] = useState<string[]>([]);
  const [animationPreviewIndex, setAnimationPreviewIndex] = useState<number>(0);
  const [showAnimationPreview, setShowAnimationPreview] = useState<boolean>(false);

  // 2. Parámetros ajustables
  const [cellSize, setCellSize] = useState<number>(8);
  const [chars, setChars] = useState<string>('@#S%?*+;:,. '); // Darkest to lightest
  const [brightness, setBrightness] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(1);
  const [invert, setInvert] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(0); // 0 = off, >0 = binary threshold (0-1)
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resolutionFactor, setResolutionFactor] = useState<number>(200); // Aumentado a 150% por defecto para mostrar más caracteres
  const [addSpacing, setAddSpacing] = useState<boolean>(false); // Estado para controlar el espaciado entre caracteres

  // Preset character sets
  const charSets = [
    { name: 'Standard', value: '@#S%?*+;:,. ' },
    { name: 'Blocks', value: '█▓▒░ ' },
    { name: 'Simple', value: '@%#*+=-:. ' },
    { name: 'Detailed', value: '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^`\'. ' },
    { name: 'Binary', value: '10 ' },
    { name: 'Letters', value: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ' },
    { name: 'Minimal', value: '@. ' },
    { name: 'Symbols', value: '#$_-+=*/|\\:;,.^ ' }
  ];

  // 3. Refs para canvas y estado ASCII
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ascii, setAscii] = useState<string>('');

  // 4. handleUpload(file) → carga en un <img> o Image()
  const handleUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target?.result) {
            // Revoke previous object URL if exists
            if (inputImage && inputImage.startsWith('blob:')) {
              URL.revokeObjectURL(inputImage);
            }
            // Usar directamente el resultado del FileReader como dataURL
            const dataUrl = event.target.result as string;
            setInputImage(dataUrl);
            setInputText(''); // Clear text input when image is uploaded
          }
        };
        reader.readAsDataURL(file); // Leer como dataURL para evitar problemas de CORS
      }
    },
    [inputImage]
  ); // Include inputImage in dependency array for cleanup

  // 5. useEffect para renderizar ASCII a cada cambio
  useEffect(() => {
    // Limpiar estado al no tener una entrada
    if (!inputImage && !inputText) {
      setAscii(''); // Clear ASCII if no input
      return;
    }

    // Handle text input directly
    if (inputText) {
      setAscii(inputText); // Just display the raw text in the <pre>
      setInputImage(null); // Clear image if text is entered
      return;
    }

    // Handle image input
    if (inputImage && canvasRef.current) {
      setIsProcessing(true);
      
      // Limpiar cualquier procesamiento previo
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setIsProcessing(false);
        return;
      }
      
      // Limpiar el canvas inmediatamente
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const img = new Image();
      // Manejar errores de CORS
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        // Solo procesar si la URL de la imagen coincide con el estado actual
        // Esto evita problemas con múltiples cargas de imágenes
        if (img.src !== inputImage) {
          console.log('Skipping outdated image processing');
          setIsProcessing(false);
          return;
        }
        
        imageRef.current = img; // Store image ref for dimensions

        // Calcular dimensiones máximas basadas en el factor de resolución
        const maxWidth = Math.floor(400 * (resolutionFactor / 100));
        const maxHeight = Math.floor(300 * (resolutionFactor / 100));

        // Escalar la imagen a un tamaño manejable
        const scaledImageCanvas = scaleImage(img, maxWidth, maxHeight);
        const scaledWidth = scaledImageCanvas.width;
        const scaledHeight = scaledImageCanvas.height;

        // Usar la imagen escalada para el proceso ASCII
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        // Apply filters
        ctx.filter = `brightness(${brightness}) contrast(${contrast}) ${invert ? 'invert(1)' : ''}`;

        // Clear previous drawing and draw the new image
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
          // Dibujar la imagen escalada en lugar de la original
          ctx.drawImage(scaledImageCanvas, 0, 0);

          // Calcular dimensiones ASCII basadas en la imagen escalada
          const asciiWidth = Math.floor(scaledWidth / cellSize);
          const asciiHeight = Math.floor(scaledHeight / (cellSize)); // Ajuste vertical para compensar la proporción

          // Get image data *after* drawing and applying filters
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          let asciiArt = '';
          const effectiveChars = invert ? chars.split('').reverse().join('') : chars; // Invert character map if needed

          for (let y = 0; y < asciiHeight; y++) {
            for (let x = 0; x < asciiWidth; x++) {
              const blockBrightness = getBlockBrightness(imageData, x, y, cellSize);

              let charIndex;
              if (threshold > 0) {
                // Binary thresholding
                charIndex = blockBrightness >= threshold ? effectiveChars.length - 1 : 0;
              } else {
                // Map brightness to character index
                charIndex = Math.floor(blockBrightness * (effectiveChars.length - 1));
                // Clamp index just in case
                charIndex = Math.max(0, Math.min(effectiveChars.length - 1, charIndex));
              }

              asciiArt += effectiveChars[charIndex] + (addSpacing ? ' ' : ''); // Añadir un espacio después de cada carácter si addSpacing está activado
            }
            asciiArt += '\n'; // New line after each row
          }
          setAscii(asciiArt);
        } catch (error) {
          console.error('Error getting image data:', error);
          setAscii(
            'Error processing image. Try with a different image or resize to a smaller dimension.'
          );
        } finally {
          setIsProcessing(false);
        }
      };

      img.onerror = (error) => {
        console.error('Error loading image:', error);
        setAscii('Error loading image. Try with a local file instead.');
        setIsProcessing(false);
      };

      img.src = inputImage; // Set src *after* defining onload

      // Cleanup function to cancel the operation if the effect re-runs
      return () => {
        img.onload = null; // Remove handlers to prevent stale callbacks
        img.onerror = null;
        if (inputImage && inputImage.startsWith('blob:')) {
          URL.revokeObjectURL(inputImage);
        }
      };
    }
  }, [inputImage, inputText, cellSize, chars, brightness, contrast, invert, threshold, resolutionFactor, addSpacing]);

  // 6. Funciones de descarga
  const downloadTxt = useCallback(() => {
    if (!ascii) return;
    const blob = new Blob([ascii], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [ascii]);

  const downloadPng = useCallback(() => {
    if (!ascii || !imageRef.current) return; // Need ASCII and original image dimensions

    const lines = ascii.split('\n');
    const cols = lines[0]?.length || 1;
    const rows = lines.length;

    // Estimate character size (can be improved with measureText)
    const charWidth = cellSize * 0.6; // Approximate width based on cell size
    const charHeight = cellSize; // Height based on cell size

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = Math.max(1, Math.floor(cols * charWidth));
    offscreenCanvas.height = Math.max(1, Math.floor(rows * charHeight));
    const ctx = offscreenCanvas.getContext('2d');

    if (!ctx) return;

    // Set background and font
    ctx.fillStyle = 'white'; // Or choose a background color
    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.fillStyle = 'black'; // Font color
    ctx.font = `${charHeight}px monospace`; // Use monospace font
    ctx.textBaseline = 'top';

    // Draw each line
    lines.forEach((line, i) => {
      ctx.fillText(line, 0, i * charHeight);
    });

    // Trigger download
    const url = offscreenCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ascii-art.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [ascii, cellSize]); // Depend on ascii and cellSize

  // 7. Función para generar animación
  const generateAnimation = useCallback(async () => {
    if (!inputImage || !canvasRef.current) return;

    setIsGeneratingAnimation(true);
    setAnimationFrames([]);

    const frames: string[] = [];
    const totalFrames = 30; // Número de frames a generar

    // Definimos rango de variación para los parámetros
    const brightnessRange = { start: 0.5, end: 2.0 };
    const contrastRange = { start: 0.8, end: 1.5 };

    // Creamos una función para generar un frame individual
    const generateFrame = (frameIndex: number): Promise<string> => {
      return new Promise((resolve) => {
        const progress = frameIndex / (totalFrames - 1); // 0 a 1

        // Calcular valores interpolados de brillo y contraste
        const frameBrightness = brightnessRange.start + progress * (brightnessRange.end - brightnessRange.start);
        const frameContrast = contrastRange.start + progress * (contrastRange.end - contrastRange.start);

        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve('');
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
          // Calcular dimensiones máximas basadas en el factor de resolución
          const maxWidth = Math.floor(300 * (resolutionFactor / 100));
          const maxHeight = Math.floor(200 * (resolutionFactor / 100));

          // Escalar la imagen a un tamaño manejable
          const scaledImageCanvas = scaleImage(img, maxWidth, maxHeight);
          
          canvas.width = scaledImageCanvas.width;
          canvas.height = scaledImageCanvas.height;

          // Aplicar filtros específicos para este frame
          ctx.filter = `brightness(${frameBrightness}) contrast(${frameContrast}) ${invert ? 'invert(1)' : ''}`;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          try {
            ctx.drawImage(scaledImageCanvas, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const asciiWidth = Math.floor(scaledImageCanvas.width / cellSize);
            const asciiHeight = Math.floor(scaledImageCanvas.height / cellSize);

            let asciiArt = '';
            const effectiveChars = invert ? chars.split('').reverse().join('') : chars;

            for (let y = 0; y < asciiHeight; y++) {
              for (let x = 0; x < asciiWidth; x++) {
                const blockBrightness = getBlockBrightness(imageData, x, y, cellSize);

                let charIndex;
                if (threshold > 0) {
                  charIndex = blockBrightness >= threshold ? effectiveChars.length - 1 : 0;
                } else {
                  charIndex = Math.floor(blockBrightness * (effectiveChars.length - 1));
                  charIndex = Math.max(0, Math.min(effectiveChars.length - 1, charIndex));
                }

                asciiArt += effectiveChars[charIndex] + (addSpacing ? ' ' : '');
              }
              asciiArt += '\n';
            }

            resolve(asciiArt);
          } catch (error) {
            console.error("Error generating animation frame:", error);
            resolve('');
          }
        };

        img.onerror = () => {
          console.error("Error loading image for animation frame");
          resolve('');
        };

        img.src = inputImage;
      });
    };

    // Generar todos los frames secuencialmente
    for (let i = 0; i < totalFrames; i++) {
      const frame = await generateFrame(i);
      if (frame) {
        frames.push(frame);

        // Actualizar vista previa con el último frame generado
        setAnimationFrames([...frames]);
        setAnimationPreviewIndex(frames.length - 1);
      }
    }

    setIsGeneratingAnimation(false);
    setShowAnimationPreview(true);

    // Iniciar reproducción cíclica para previsualizar la animación
    let currentFrame = 0;
    const previewInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % frames.length;
      setAnimationPreviewIndex(currentFrame);
    }, 100); // 10 FPS

    // Limpiar el intervalo cuando se cierre la vista previa
    return () => clearInterval(previewInterval);
  }, [inputImage, cellSize, chars, brightness, contrast, invert, threshold, resolutionFactor, addSpacing]);

  // 8. Descargar como GIF
  const downloadAsGif = useCallback(() => {
    if (!animationFrames.length) return;

    // Aquí implementaríamos la conversión a GIF
    // Para una implementación completa necesitaríamos una librería como gif.js
    alert("Función en desarrollo: La generación de GIF requerirá implementar una librería externa como gif.js");

    // Código placeholder para cuando tengamos implementada la librería
    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: canvasWidth,
      height: canvasHeight
    });

    frames.forEach(frame => {
      // Convertir ASCII a imagen para cada frame
      // Añadir al GIF
      gif.addFrame(frameCanvas, {delay: 100});
    });

    gif.on('finished', blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ascii-animation.gif';
      a.click();
      URL.revokeObjectURL(url);
    });

    gif.render();
  }, [animationFrames]);

  // Definir estilos dinámicos según el modo
  const downloadButtonStyle = 'bg-accent-color text-white hover:bg-accent-color/90';
  const animateButtonStyle = 'bg-transparent hover:bg-accent-color/10 text-accent-color border border-accent-color';
  
  const inputBgStyle = mode === 'xklokon' 
    ? 'bg-transparent border border-text-color/30 text-white' 
    : 'bg-transparent border border-text-color/30 text-white';

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <aside className="controls md:col-span-1 space-y-4">
          {/* Input Section */}
          <div className="text-center mb-2">
            <label
              htmlFor="imageUpload"
              className="block text-sm font-medium text-accent-color mb-2"
            >
              Selecciona una imagen
            </label>

            {/* Vista previa de la imagen cargada */}
            {inputImage && (
              <div className="mb-3 relative rounded-lg overflow-hidden max-w-xs mx-auto">
                <img 
                  src={inputImage} 
                  alt="Preview" 
                  className="w-full h-auto object-contain max-h-[150px]"
                />
              </div>
            )}

            <div className="flex justify-center">
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-auto text-sm file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent-color/20 file:text-accent-color hover:file:bg-accent-color/30"
              />
            </div>
          </div>

          <hr className="border-accent-color/20 my-2" />

          {/* Controles organizados en un diseño compacto */}
          <div className="grid grid-cols-2 gap-3">
            {/* Primera columna */}
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="cellSize"
                  className="block text-sm font-medium text-accent-color"
                >
                  Cell Size: {cellSize}px
                </label>
                <input
                  id="cellSize"
                  type="range"
                  min="2"
                  max="16"
                  step="1"
                  value={cellSize}
                  onChange={(e) => setCellSize(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-accent-color/20 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: accentColor }}
                />
              </div>
              
              <div>
                <label
                  htmlFor="brightness"
                  className="block text-sm font-medium text-accent-color"
                >
                  Brightness: {brightness.toFixed(1)}
                </label>
                <input
                  id="brightness"
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={brightness}
                  onChange={(e) => setBrightness(parseFloat(e.target.value))}
                  className="w-full h-2 bg-accent-color/20 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: accentColor }}
                />
              </div>
              
              <div>
                <label
                  htmlFor="threshold"
                  className="block text-sm font-medium text-accent-color"
                >
                  Threshold: {threshold > 0 ? threshold.toFixed(2) : 'Off'}
                </label>
                <input
                  id="threshold"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-full h-2 bg-accent-color/20 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: accentColor }}
                />
              </div>
            </div>
            
            {/* Segunda columna */}
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="resolutionFactor"
                  className="block text-sm font-medium text-accent-color"
                >
                  Resolution: {resolutionFactor}%
                </label>
                <input
                  id="resolutionFactor"
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={resolutionFactor}
                  onChange={(e) => setResolutionFactor(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-accent-color/20 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: accentColor }}
                />
              </div>
              
              <div>
                <label
                  htmlFor="contrast"
                  className="block text-sm font-medium text-accent-color"
                >
                  Contrast: {contrast.toFixed(1)}
                </label>
                <input
                  id="contrast"
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={contrast}
                  onChange={(e) => setContrast(parseFloat(e.target.value))}
                  className="w-full h-2 bg-accent-color/20 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: accentColor }}
                />
              </div>
              
              <div className="flex items-center mt-2">
                <input
                  id="invert"
                  type="checkbox"
                  checked={invert}
                  onChange={(e) => setInvert(e.target.checked)}
                  className="h-4 w-4 focus:ring-accent-color text-accent-color border-accent-color/30 rounded"
                />
                <label htmlFor="invert" className="ml-2 block text-sm text-accent-color">
                  Invert Colors
                </label>
              </div>
            </div>
          </div>
          
          {/* Character Set Selector */}
          <div>
            <label
              htmlFor="charSetSelect"
              className="block text-sm font-medium text-accent-color mb-1"
            >
              Character Set
            </label>
            <div className="flex gap-2">
              <select
                id="charSetSelect"
                onChange={(e) => {
                  const selectedSet = charSets.find(set => set.name === e.target.value);
                  if (selectedSet) setChars(selectedSet.value);
                }}
                value={charSets.find(set => set.value === chars)?.name || ''}
                className={`shadow-sm block w-full sm:text-sm border-accent-color/30 rounded-md p-1.5 bg-transparent text-white focus:ring-accent-color focus:border-accent-color`}
              >
                <option value="" disabled>Select a preset</option>
                {charSets.map(set => (
                  <option key={set.name} value={set.name} className={mode === 'xklokon' ? 'bg-card-bg' : 'bg-accent-color/5'}>
                    {set.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-2">
              <label htmlFor="chars" className="block text-xs text-accent-color/70 mb-1">
                Custom Characters (Darkest → Lightest)
              </label>
              <input
                id="chars"
                type="text"
                value={chars}
                onChange={(e) => setChars(e.target.value)}
                className={`shadow-sm focus:ring-accent-color focus:border-accent-color block w-full sm:text-sm border-accent-color/30 rounded-md p-1 bg-transparent text-white`}
              />
            </div>
          </div>

          <hr className="border-accent-color/20 my-2" />

          {/* Botones de acción organizados */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={downloadTxt}
              disabled={!ascii || isProcessing}
              className={`inline-flex justify-center py-2 px-3 text-xs font-medium rounded-md transition-colors ${downloadButtonStyle} disabled:opacity-50`}
            >
              Download .txt
            </button>
            <button
              onClick={downloadPng}
              disabled={!ascii || isProcessing || !inputImage}
              className={`inline-flex justify-center py-2 px-3 text-xs font-medium rounded-md transition-colors ${downloadButtonStyle} disabled:opacity-50`}
            >
              Download .png
            </button>
          </div>
          
          {/* Animation Controls */}
          {inputImage && (
            <div className="space-y-2">
              <button
                onClick={generateAnimation}
                disabled={isGeneratingAnimation || !inputImage}
                className={`w-full inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md transition-colors ${animateButtonStyle} disabled:opacity-50`}
              >
                {isGeneratingAnimation ? 'Generando...' : 'Generar animación ASCII'}
              </button>

              {animationFrames.length > 0 && (
                <>
                  <div className="flex">
                    <button
                      onClick={downloadAsGif}
                      disabled={isGeneratingAnimation}
                      className={`flex-1 inline-flex justify-center py-1 px-2 text-xs font-medium rounded-md transition-colors ${downloadButtonStyle} disabled:opacity-50`}
                    >
                      Descargar animación
                    </button>
                    <span className="text-xs px-2 py-1 flex items-center text-accent-color/70">
                      {animationFrames.length} frames
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
          
          {isProcessing && (
            <p className="text-sm text-center text-accent-color/70">Procesando...</p>
          )}

          {/* Espaciado entre caracteres */}
          <div className="flex items-center mt-2">
            <input
              id="addSpacing"
              type="checkbox"
              checked={addSpacing}
              onChange={(e) => setAddSpacing(e.target.checked)}
              className="h-4 w-4 focus:ring-accent-color text-accent-color border-accent-color/30 rounded"
            />
            <label htmlFor="addSpacing" className="ml-2 block text-sm text-accent-color">
              Add Spacing Between Characters
            </label>
          </div>

          {/* Botón para reiniciar el ASCII */}
          <button
            onClick={() => setAscii('')}
            className={`w-full inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md transition-colors bg-red-500 text-white hover:bg-red-600`}
          >
            Reset ASCII
          </button>
        </aside>

        <main className={`preview md:col-span-2 ${
          mode === 'xklokon' ? 'bg-card-bg' : 'bg-accent-color/5'
        } p-4 rounded-md overflow-auto relative border border-accent-color/20`} 
        style={{ height: 'calc(100vh - 150px)', maxHeight: 'calc(100vh - 150px)' }}>
          {/* Canvas is used offscreen for processing, result shown in <pre> */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Animation Preview */}
          {showAnimationPreview && animationFrames.length > 0 ? (
            <div className="animation-preview h-full">
              <div className="mb-2 flex justify-between items-center">
                <span className="text-sm font-medium text-accent-color">Vista previa de animación</span>
                <button 
                  onClick={() => setShowAnimationPreview(false)}
                  className="text-xs px-2 py-1 bg-accent-color/10 text-accent-color rounded hover:bg-accent-color/20"
                >
                  Volver al ASCII
                </button>
              </div>
              <pre
                className="ascii-output text-xs leading-none font-mono whitespace-pre text-text overflow-auto"
                style={{ lineHeight: '0.8em', height: 'calc(100% - 30px)' }}
              >
                {animationFrames[animationPreviewIndex] || 'Generando...'}
              </pre>
            </div>
          ) : (
            <pre
              className="ascii-output text-xs leading-none font-mono whitespace-pre text-text overflow-auto h-full"
              style={{ lineHeight: '0.8em' }}
            >
              {ascii || 'Sube una imagen para convertirla en arte ASCII...'}
            </pre>
          )}
        </main>
      </div>
    </div>
  );
}