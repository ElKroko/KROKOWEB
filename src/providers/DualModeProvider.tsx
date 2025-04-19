"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type ModeType = 'kroko' | 'xklokon';

interface DualModeContextType {
  mode: ModeType;
  toggleMode: () => void;
  setMode: (mode: ModeType) => void;
}

const DualModeContext = createContext<DualModeContextType | undefined>(undefined);

export const DualModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<ModeType>('kroko');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Initialize mode from URL on mount
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'xklokon' || modeParam === 'kroko') {
      setModeState(modeParam);
    }
  }, [searchParams]);

  // Apply mode to document using data-mode attribute
  // The CSS variables in variables.css will respond to this attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    
    // No longer setting individual CSS variables here
    // All styles now come from CSS selectors using the data-mode attribute
    
    // Log mode change for debugging
    console.log(`Mode changed to: ${mode}`);
  }, [mode]);

  const setMode = (newMode: ModeType) => {
    setModeState(newMode);
    
    // Update URL query parameter without reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', newMode);
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const toggleMode = () => {
    setMode(mode === 'kroko' ? 'xklokon' : 'kroko');
  };

  return (
    <DualModeContext.Provider value={{ mode, toggleMode, setMode }}>
      {children}
    </DualModeContext.Provider>
  );
};

export const useDualMode = () => {
  const context = useContext(DualModeContext);
  if (context === undefined) {
    throw new Error('useDualMode must be used within a DualModeProvider');
  }
  return context;
};