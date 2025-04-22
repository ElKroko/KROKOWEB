import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useDualMode } from '@/providers/DualModeProvider';
import Image from 'next/image';

export interface MusicTrack {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

interface TopMusicPlayerProps {
  tracks: MusicTrack[];
  initialTrackIndex?: number;
}

const TopMusicPlayer: React.FC<TopMusicPlayerProps> = ({ 
  tracks, 
  initialTrackIndex = 0 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { mode } = useDualMode();
  
  const currentTrack = tracks[currentTrackIndex];

  // Gestionar reproducción/pausa
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.error("Error al reproducir:", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Cambiar a la siguiente pista
  const playNext = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(newIndex);
    setCurrentTime(0);
    
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(e => {
          console.error("Error al reproducir siguiente:", e);
        });
      }, 100);
    }
  };

  // Cambiar a la pista anterior
  const playPrev = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(newIndex);
    setCurrentTime(0);
    
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(e => {
          console.error("Error al reproducir anterior:", e);
        });
      }, 100);
    }
  };

  // Cambiar el volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  // Alternar silencio
  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  // Actualizar progreso de la pista
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Manejar el cambio de posición en la barra de progreso
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Cambiar a una pista específica
  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    
    if (audioRef.current) {
      setTimeout(() => {
        audioRef.current?.play().catch(e => {
          console.error("Error al reproducir pista seleccionada:", e);
          setIsPlaying(false);
        });
      }, 100);
    }
  };

  // Formatear tiempo en formato mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Actualizar src del audio cuando cambia la pista
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
    }
  }, [currentTrackIndex, currentTrack.src]);

  // Configurar event listeners para el elemento de audio
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        playNext();
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [currentTrackIndex]);

  // Usar el fondo de la página actual y un color de texto/borde que contraste
  const bgColor = 'var(--bg, #ffffff)';
  const textColor = 'var(--text, #000000)';
  
  // Estilo para botones cuadrados - usamos el color de acento para que destaquen
  const buttonStyle = {
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    color: 'var(--accent-color)'
  };

  // Estilo para el botón de play/pause
  const playButtonStyle = {
    ...buttonStyle,
    width: '28px',
    height: '28px',
    border: '1px solid var(--accent-color)',
    color: 'var(--accent-color)'
  };
  
  return (
    <div className="relative z-50">
      {/* Reproductor fijo en la parte superior */}
      <div 
        className="fixed top-0 left-56 right-0 h-12 flex items-center transition-all duration-300"
        style={{ 
          backgroundColor: bgColor, 
          borderBottom: '1px solid var(--accent-color)' 
        }}
      >
        
        {/* Contenido principal del reproductor */}
        <div className="flex items-center w-full h-full px-4">
          {/* Controles de reproducción */}
          <div className="flex items-center gap-3 mr-3">
            <button 
              onClick={playPrev} 
              style={buttonStyle}
              className="hover:opacity-70 transition-opacity"
            >
              <FaStepBackward />
            </button>
            <button 
              onClick={togglePlay} 
              style={playButtonStyle}
              className="hover:opacity-80 transition-opacity"
            >
              {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
            </button>
            <button 
              onClick={playNext} 
              style={buttonStyle}
              className="hover:opacity-70 transition-opacity"
            >
              <FaStepForward />
            </button>
          </div>
          
          {/* Información de la pista actual */}
          <div className="flex-grow-0 flex items-center overflow-hidden mr-4">
            <div 
              className="w-8 h-8 rounded overflow-hidden flex-shrink-0 mr-2 relative"
            >
              <Image 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="truncate max-w-[120px] md:max-w-[200px]">
              <div className="text-xs font-semibold truncate" style={{ color: textColor }}>{currentTrack.title}</div>
              <div className="text-xs opacity-70 truncate" style={{ color: textColor }}>{currentTrack.artist}</div>
            </div>
          </div>
          
          {/* Tiempo y progreso - ahora ocupa más espacio disponible */}
          <div className="flex-grow flex items-center gap-2 mr-4 max-w-none">
            <span className="text-xs" style={{ color: textColor }}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full"
              style={{ 
                accentColor: 'var(--accent-color)',
                background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${(currentTime / (duration || 1)) * 100}%, #ccc ${(currentTime / (duration || 1)) * 100}%, #ccc 100%)` 
              }}
            />
            <span className="text-xs" style={{ color: textColor }}>{formatTime(duration)}</span>
          </div>
          
          {/* Control de volumen */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0 mr-2">
            <button 
              onClick={toggleMute} 
              style={{ ...buttonStyle, color: textColor }}
              className="hover:opacity-70 transition-opacity"
            >
              {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16"
              style={{ accentColor: 'var(--accent-color)' }}
            />
          </div>
          
          {/* Botón para desplegar la lista */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ ...buttonStyle, color: 'var(--accent-color)' }}
            className="hover:opacity-70 transition-opacity flex-shrink-0"
          >
            {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </button>
        </div>
      </div>
      
      {/* Lista de reproducción desplegable */}
      {isExpanded && (
        <div 
          className="fixed top-12 left-48 right-0 max-h-64 overflow-y-auto transition-all z-40 shadow-md"
          style={{ backgroundColor: bgColor, borderBottom: '1px solid var(--accent-color)' }}
        >
          <div className="p-2">
            <h3 className="text-xs font-semibold p-2" style={{ color: textColor }}>Lista de reproducción</h3>
            {tracks.map((track, index) => (
              <div 
                key={index}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                  currentTrackIndex === index 
                    ? 'bg-accent-color/20' 
                    : 'hover:bg-accent-color/10'
                }`}
                onClick={() => playTrack(index)}
              >
                <div 
                  className="w-8 h-8 rounded overflow-hidden mr-2 relative"
                >
                  <Image 
                    src={track.cover} 
                    alt={track.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <div className="text-xs font-medium" style={{ color: textColor }}>{track.title}</div>
                  <div className="text-xs opacity-70" style={{ color: textColor }}>{track.artist}</div>
                </div>
                {currentTrackIndex === index && isPlaying && (
                  <div className="w-2 h-2 rounded-full animate-pulse mr-2" 
                    style={{ backgroundColor: 'var(--accent-color)' }} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Elemento de audio oculto */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Espacio reservado para empujar el contenido debajo del reproductor */}
      <div className="h-12" />
    </div>
  );
};

export default TopMusicPlayer;