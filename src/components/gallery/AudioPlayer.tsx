"use client";

import { useRef, useEffect } from 'react';

interface AudioPlayerProps {
  tracks: {
    title: string;
    artist: string;
    url: string;
  }[];
  currentTrack: number;
  onTrackChange: (index: number) => void;
}

export default function AudioPlayer({ tracks, currentTrack, onTrackChange }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = tracks[currentTrack].url;
      audioRef.current.play().catch(e => {
        console.log("Autoplay prevented:", e);
      });
    }
  }, [currentTrack, tracks]);
  
  const handleTrackEnd = () => {
    // Pasar a la siguiente pista cuando termine la actual
    const nextTrack = (currentTrack + 1) % tracks.length;
    onTrackChange(nextTrack);
  };
  
  return (
    <audio 
      ref={audioRef}
      onEnded={handleTrackEnd}
      loop={false}
      style={{ display: 'none' }}
    />
  );
}