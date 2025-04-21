'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MusicTrack } from '@/components/layout/TopMusicPlayer';

type MusicContextType = {
  tracks: MusicTrack[];
  currentTrackIndex: number;
  setCurrentTrackIndex: (index: number) => void;
  addTracks: (newTracks: MusicTrack[]) => void;
};

const defaultTracks: MusicTrack[] = [
  {
    title: 'BOTANIKAL',
    artist: 'KROKO',
    src: '/audio/BOTANIKAL.mp3',
    cover: '/images/art/placeholder_1.png'
  },
  {
    title: 'BREAKING ALL',
    artist: 'KROKO',
    src: '/audio/BREAKINGALL.mp3',
    cover: '/images/art/placeholder_2.png'
  },
  {
    title: 'T BUSKO',
    artist: 'KROKO',
    src: '/audio/T BUSKO.mp3',
    cover: '/images/art/placeholder_3.png'
  }
];

const MusicContext = createContext<MusicContextType>({
  tracks: defaultTracks,
  currentTrackIndex: 0,
  setCurrentTrackIndex: () => {},
  addTracks: () => {}
});

export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: ReactNode;
}

export function MusicProvider({ children }: MusicProviderProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>(defaultTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Función para añadir nuevas pistas a la lista
  const addTracks = (newTracks: MusicTrack[]) => {
    // Evitar duplicados basados en la URL de la pista
    const existingUrls = new Set(tracks.map(track => track.src));
    const uniqueNewTracks = newTracks.filter(track => !existingUrls.has(track.src));
    
    if (uniqueNewTracks.length > 0) {
      setTracks(prev => [...prev, ...uniqueNewTracks]);
    }
  };

  return (
    <MusicContext.Provider 
      value={{ 
        tracks, 
        currentTrackIndex, 
        setCurrentTrackIndex,
        addTracks
      }}
    >
      {children}
    </MusicContext.Provider>
  );
}