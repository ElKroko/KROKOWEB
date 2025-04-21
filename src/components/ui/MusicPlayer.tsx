import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useAccentColor } from '@/providers/AccentColorProvider';
import { useDualMode } from '@/providers/DualModeProvider';

export interface MusicTrack {
  title: string;
  artist: string;
  src: string;
  cover: string;
}

interface MusicPlayerProps {
  tracks: MusicTrack[];
  initialTrackIndex?: number;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  tracks, 
  initialTrackIndex = 0 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { accentColor } = useAccentColor();
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
    
    // Si estaba reproduciendo, comenzar automáticamente la siguiente pista
    if (isPlaying && audioRef.current) {
      // Pequeño timeout para permitir que el audio se actualice
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
    
    // Si estaba reproduciendo, comenzar automáticamente la pista anterior
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

  const bgColor = mode === 'xklokon' ? 'var(--card-bg, #2A2A2A)' : 'var(--card-bg, #f5f5f5)';
  
  return (
    <>
      {/* Mini reproductor fijo en la parte inferior */}
      <div 
        className={`fixed bottom-0 left-0 right-0 transition-all duration-300 z-50 ${
          isMinimized ? 'h-16' : 'h-80 md:h-96'
        }`}
        style={{ backgroundColor: bgColor, borderTop: `1px solid ${accentColor}30` }}
      >
        {/* Barra de progreso superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300">
          <div 
            className="h-full transition-all" 
            style={{ 
              width: `${(currentTime / duration) * 100}%`,
              backgroundColor: accentColor 
            }}
          />
        </div>
        
        {/* Toggle para expandir/contraer */}
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: accentColor }}
        >
          <span className="text-white">
            {isMinimized ? '▲' : '▼'}
          </span>
        </button>
        
        {/* Contenido del mini reproductor */}
        <div className="flex items-center h-16 px-4">
          {/* Imagen de portada */}
          <div 
            className="w-12 h-12 rounded overflow-hidden mr-4 flex-shrink-0"
            style={{ backgroundImage: `url(${currentTrack.cover})`, backgroundSize: 'cover' }}
          />
          
          {/* Información de la pista */}
          <div className="flex-grow mr-4 overflow-hidden">
            <div className="truncate font-semibold">{currentTrack.title}</div>
            <div className="truncate text-sm opacity-70">{currentTrack.artist}</div>
          </div>
          
          {/* Controles principales */}
          <div className="flex items-center gap-3">
            <button onClick={playPrev} className="p-2 hover:opacity-70 transition-opacity">
              <FaStepBackward />
            </button>
            <button 
              onClick={togglePlay} 
              className="p-3 rounded-full transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              {isPlaying ? <FaPause className="text-white" /> : <FaPlay className="text-white" />}
            </button>
            <button onClick={playNext} className="p-2 hover:opacity-70 transition-opacity">
              <FaStepForward />
            </button>
          </div>
          
          {/* Control de volumen */}
          <div className="ml-6 flex items-center gap-2 md:w-32 hidden md:flex">
            <button onClick={toggleMute} className="hover:opacity-70 transition-opacity">
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full"
            />
          </div>
          
          {/* Tiempo */}
          <div className="ml-4 text-xs whitespace-nowrap hidden md:block">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        {/* Panel expandido */}
        {!isMinimized && (
          <div className="p-4 h-64 md:h-80 overflow-y-auto">
            {/* Control de progreso */}
            <div className="flex items-center mb-6 gap-2">
              <span className="text-sm">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-grow"
              />
              <span className="text-sm">{formatTime(duration)}</span>
            </div>
            
            {/* Lista de pistas */}
            <div className="space-y-2">
              <h3 className="font-semibold mb-3">Lista de reproducción</h3>
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
                    className="w-10 h-10 rounded overflow-hidden mr-3"
                    style={{ backgroundImage: `url(${track.cover})`, backgroundSize: 'cover' }}
                  />
                  <div className="flex-grow">
                    <div className="font-medium">{track.title}</div>
                    <div className="text-sm opacity-70">{track.artist}</div>
                  </div>
                  {currentTrackIndex === index && isPlaying && (
                    <div className="w-3 h-3 rounded-full animate-pulse mr-2" 
                      style={{ backgroundColor: accentColor }} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Elemento de audio oculto */}
      <audio ref={audioRef} preload="metadata" />
      
      {/* Espacio en blanco para evitar que el contenido quede detrás del reproductor */}
      <div className="h-16" />
    </>
  );
};

export default MusicPlayer;