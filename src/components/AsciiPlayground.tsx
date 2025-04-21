import React, { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';

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

export default function AsciiPlayground() {
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
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Important for performance
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      // Manejar errores de CORS
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        imageRef.current = img; // Store image ref for dimensions

        // Calculate dimensions for ASCII output based on cell size
        const asciiWidth = Math.floor(img.width / cellSize);
        const asciiHeight = Math.floor(img.height / cellSize);

        // Resize canvas to match image dimensions (for drawing)
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply filters
        ctx.filter = `brightness(${brightness}) contrast(${contrast}) ${invert ? 'invert(1)' : ''}`;

        // Clear previous drawing and draw the new image
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        try {
          ctx.drawImage(img, 0, 0);

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

              asciiArt += effectiveChars[charIndex] || ' '; // Add character or space
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

      // Cleanup function for the object URL
      return () => {
        if (inputImage && inputImage.startsWith('blob:')) {
          URL.revokeObjectURL(inputImage);
        }
      };
    }
  }, [inputImage, inputText, cellSize, chars, brightness, contrast, invert, threshold]); // Dependencies

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
          canvas.width = img.width;
          canvas.height = img.height;

          // Aplicar filtros específicos para este frame
          ctx.filter = `brightness(${frameBrightness}) contrast(${frameContrast}) ${invert ? 'invert(1)' : ''}`;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          try {
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const asciiWidth = Math.floor(img.width / cellSize);
            const asciiHeight = Math.floor(img.height / cellSize);

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

                asciiArt += effectiveChars[charIndex] || ' ';
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
  }, [inputImage, cellSize, chars, brightness, contrast, invert, threshold]);

  // 8. Descargar como GIF
  const downloadAsGif = useCallback(() => {
    if (!animationFrames.length) return;

    // Aquí implementaríamos la conversión a GIF
    // Para una implementación completa necesitaríamos una librería como gif.js
    alert("Función en desarrollo: La generación de GIF requerirá implementar una librería externa como gif.js");

    // Código placeholder para cuando tengamos implementada la librería
    // const gif = new GIF({
    //   workers: 2,
    //   quality: 10,
    //   width: canvasWidth,
    //   height: canvasHeight
    // });

    // frames.forEach(frame => {
    //   // Convertir ASCII a imagen para cada frame
    //   // Añadir al GIF
    //   gif.addFrame(frameCanvas, {delay: 100});
    // });

    // gif.on('finished', blob => {
    //   const url = URL.createObjectURL(blob);
    //   const a = document.createElement('a');
    //   a.href = url;
    //   a.download = 'ascii-animation.gif';
    //   a.click();
    //   URL.revokeObjectURL(url);
    // });

    // gif.render();
  }, [animationFrames]);

  return (
    <div className="ascii-playground grid grid-cols-3 gap-4 p-4">
      <aside className="controls col-span-1 space-y-4">
        {/* Input Section */}
        <div>
          <label
            htmlFor="imageUpload"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Image
          </label>

          {/* Vista previa de la imagen cargada */}
          {inputImage && (
            <div className="mb-2 relative border-2 border-violet-200 rounded-lg overflow-hidden">
              <img 
                src={inputImage} 
                alt="Preview" 
                className="w-full h-auto object-contain max-h-[150px]"
              />
            </div>
          )}

          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>
        <div className="text-center my-2 text-gray-500">OR</div>
        <div>
          <label
            htmlFor="textInput"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Enter Text
          </label>
          <textarea
            id="textInput"
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type text here..."
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
          />
        </div>

        <hr className="my-4" />

        {/* Parameter Sliders */}
        <div>
          <label
            htmlFor="cellSize"
            className="block text-sm font-medium text-gray-700"
          >
            Cell Size: {cellSize}px
          </label>
          <input
            id="cellSize"
            type="range"
            min="2"
            max="32"
            step="1"
            value={cellSize}
            onChange={(e) => setCellSize(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        <div>
          <label
            htmlFor="chars"
            className="block text-sm font-medium text-gray-700"
          >
            Character Set
          </label>
          <input
            id="chars"
            type="text"
            value={chars}
            onChange={(e) => setChars(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Darkest → Lightest. Common: `@#S%?*+;:,. ` or `█▓▒░ `
          </p>
        </div>
        <div>
          <label
            htmlFor="brightness"
            className="block text-sm font-medium text-gray-700"
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        <div>
          <label
            htmlFor="contrast"
            className="block text-sm font-medium text-gray-700"
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        <div>
          <label
            htmlFor="threshold"
            className="block text-sm font-medium text-gray-700"
          >
            Binary Threshold: {threshold > 0 ? threshold.toFixed(2) : 'Off'}
          </label>
          <input
            id="threshold"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={threshold}
            onChange={(e) => setThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <p className="text-xs text-gray-500 mt-1">
            Set > 0 to enable. Uses only first/last chars.
          </p>
        </div>
        <div className="flex items-center">
          <input
            id="invert"
            type="checkbox"
            checked={invert}
            onChange={(e) => setInvert(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            htmlFor="invert"
            className="ml-2 block text-sm text-gray-900"
          >
            Invert Colors / Chars
          </label>
        </div>

        <hr className="my-4" />

        {/* Animation Controls */}
        {inputImage && (
          <div className="space-y-2">
            <button
              onClick={generateAnimation}
              disabled={isGeneratingAnimation || !inputImage}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isGeneratingAnimation ? 'Generando animación...' : 'Generar animación ASCII'}
            </button>

            {animationFrames.length > 0 && (
              <>
                <button
                  onClick={downloadAsGif}
                  disabled={isGeneratingAnimation}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
                >
                  Descargar como GIF
                </button>

                <div className="mt-2 text-xs text-gray-500 text-center">
                  {animationFrames.length} frames generados
                </div>
              </>
            )}
          </div>
        )}

        <hr className="my-4" />

        {/* Download Buttons */}
        <div className="space-y-2">
          <button
            onClick={downloadTxt}
            disabled={!ascii || isProcessing}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            Download .txt
          </button>
          <button
            onClick={downloadPng}
            disabled={!ascii || isProcessing || !inputImage}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Download .png
          </button>
          {isProcessing && (
            <p className="text-sm text-center text-gray-500">Processing...</p>
          )}
        </div>
      </aside>

      <main className="preview col-span-2 bg-gray-100 p-2 rounded overflow-auto relative">
        {/* Canvas is used offscreen for processing, result shown in <pre> */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Animation Preview */}
        {showAnimationPreview && animationFrames.length > 0 ? (
          <div className="animation-preview">
            <div className="mb-2 flex justify-between items-center">
              <span className="text-sm font-medium">Previsualización de animación</span>
              <button 
                onClick={() => setShowAnimationPreview(false)}
                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Volver al ASCII normal
              </button>
            </div>
            <pre
              className="ascii-output text-xs leading-none font-mono whitespace-pre break-all"
              style={{ lineHeight: '0.7em' }}
            >
              {animationFrames[animationPreviewIndex] || 'Generando...'}
            </pre>
          </div>
        ) : (
          <pre
            className="ascii-output text-xs leading-none font-mono whitespace-pre break-all"
            style={{ lineHeight: '0.7em' }}
          >
            {ascii || 'Upload an image or type text to start...'}
          </pre>
        )}
      </main>
    </div>
  );
}