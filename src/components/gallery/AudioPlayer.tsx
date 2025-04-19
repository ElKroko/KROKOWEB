"use client";

import React, { useRef, useEffect, useState } from 'react';

interface Track {
  title: string;
  artist: string;
  src: string;  // Cambiado de 'url' a 'src' para que coincida con el uso en create/page.tsx
  cover?: string;
}

interface AudioPlayerProps {
  track: Track;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function AudioPlayer({ 
  track, 
  accentColor = '#09BC8A',
  backgroundColor = '#f0f0f0',
  textColor = '#333333'
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  useEffect(() => {
    if (audioRef.current) {
      // Configurar el audio cuando cambia la pista
      audioRef.current.src = track.src;
      
      // Manejar eventos del audio
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };
      
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };
      
      // Añadir event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      // Cleanup
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [track]);
  
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => {
          console.log("Play prevented:", e);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = position * audioRef.current.duration;
    }
  };
  
  // Formatear tiempo en minutos:segundos
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };
  
  return (
    <div 
      className="rounded-lg p-4 transition-all duration-300 hover:shadow-lg" 
      style={{ backgroundColor, color: textColor }}
    >
      {/* Cover art */}
      <div 
        className="w-full h-40 mb-4 bg-gray-300 rounded-md overflow-hidden relative"
        style={{ backgroundImage: track.cover ? `url(${track.cover})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <button 
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all duration-300"
        >
          <div 
            className={`w-16 h-16 flex items-center justify-center rounded-full`}
            style={{ backgroundColor: accentColor }}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            )}
          </div>
        </button>
      </div>
      
      {/* Track info */}
      <div className="mb-3">
        <h3 className="font-bold text-lg">{track.title}</h3>
        <p className="opacity-75">{track.artist}</p>
      </div>
      
      {/* Progress bar */}
      <div 
        className="w-full h-2 bg-gray-200 rounded-full mb-2 cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, backgroundColor: accentColor }}
        ></div>
      </div>
      
      {/* Time display */}
      <div className="flex justify-between text-sm opacity-75">
        <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      
      {/* Hidden audio element */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </div>
  );
}