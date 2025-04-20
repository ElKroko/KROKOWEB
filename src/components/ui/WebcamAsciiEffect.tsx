import React, { useRef, useEffect, useState } from 'react';
import { DEFAULT_CHAR_PALETTE, mapBrightnessToChar } from '@/lib/ascii-utils';

interface WebcamAsciiEffectProps {
  effect?: 'none' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast' | 'hue-rotate' | 'saturate' | 'ascii';
  width?: number;
  fps?: number;
  className?: string;
  showControls?: boolean;
  asciiWidth?: number;
}

const WebcamAsciiEffect: React.FC<WebcamAsciiEffectProps> = ({
  effect = 'none',
  width = 80,
  fps = 12,
  className = '',
  showControls = false,
  asciiWidth = 80
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ascii, setAscii] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [asciiMode, setAsciiMode] = useState<boolean>(effect === 'ascii');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(err => {
              console.error('Error playing video:', err);
              setErrorMessage('Error al reproducir el video');
            });
        }
      })
      .catch(err => {
        console.error('Error accessing webcam:', err);
        setErrorMessage('No se pudo acceder a la cámara web');
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    setAsciiMode(effect === 'ascii');
  }, [effect]);

  useEffect(() => {
    if (!isPlaying) return;
    
    let timer: NodeJS.Timeout;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    const interval = 1000 / fps;

    const render = () => {
      const v = videoRef.current;
      if (v && v.readyState === v.HAVE_ENOUGH_DATA && canvasRef.current) {
        // Escala y dibuja
        const h = Math.floor(width * (v.videoHeight/v.videoWidth));
        canvasRef.current.width = width;
        canvasRef.current.height = h;

        // Aplica filtro Canvas si no está en modo ASCII
        if (!asciiMode) {
          ctx.filter = {
            grayscale: 'grayscale(1)',
            sepia: 'sepia(1)',
            invert: 'invert(1)',
            blur: 'blur(3px)',
            brightness: 'brightness(1.5)',
            contrast: 'contrast(2)',
            'hue-rotate': 'hue-rotate(90deg)',
            saturate: 'saturate(2)'
          }[effect] || 'none';
          
          ctx.drawImage(v, 0, 0, width, h);
          setAscii(''); // Desactivar ASCII
        } else {
          // Para ASCII, quita filtros y dibuja limpio
          ctx.filter = 'none';
          ctx.drawImage(v, 0, 0, width, h);
          
          const imageData = ctx.getImageData(0, 0, width, h);
          const data = imageData.data;
          
          let text = '';
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < asciiWidth; x++) {
              const origX = Math.floor(x * (width / asciiWidth));
              const i = (y * width + origX) * 4;
              const avg = (data[i] + data[i+1] + data[i+2]) / 3;
              text += mapBrightnessToChar(avg);
            }
            text += '\n';
          }
          setAscii(text);
        }
      }
      timer = setTimeout(() => requestAnimationFrame(render), interval);
    };
    
    render();
    
    return () => clearTimeout(timer);
  }, [effect, fps, width, isPlaying, asciiMode, asciiWidth]);

  const toggleAsciiMode = () => {
    setAsciiMode(!asciiMode);
  };

  if (errorMessage) {
    return <div className="text-red-500 p-4">{errorMessage}</div>;
  }

  return (
    <div className={`relative ${className}`}>
      <video ref={videoRef} style={{ display: 'none' }} muted />
      
      {showControls && (
        <div className="absolute top-2 right-2 z-10">
          <button 
            onClick={toggleAsciiMode}
            className="bg-accent-strong text-white text-xs px-2 py-1 rounded opacity-70 hover:opacity-100"
          >
            {asciiMode ? 'Modo Normal' : 'Modo ASCII'}
          </button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{
          display: asciiMode ? 'none' : 'block',
          width: '100%'
        }}
      />
      
      {asciiMode && (
        <pre style={{
          fontFamily: 'Courier, monospace',
          lineHeight: 1,
          margin: 0,
          whiteSpace: 'pre',
          fontSize: `12px`,
          background: '#000',
          color: 'var(--accent-strong)',
          overflow: 'hidden',
          width: '100%',
          height: '100%'
        }}>
          {ascii}
        </pre>
      )}
    </div>
  );
};

export default WebcamAsciiEffect;