'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useDualMode } from './DualModeProvider';
import colors from '@/styles/colorConfig';

type AccentColorContextType = {
  accentColor: string;
  setAccentColor: (color: string) => void;
  resetToDefault: () => void;
};

const AccentColorContext = createContext<AccentColorContextType>({
  accentColor: colors.black,
  setAccentColor: () => {},
  resetToDefault: () => {}
});

export const useAccentColor = () => useContext(AccentColorContext);

interface AccentColorProviderProps {
  children: ReactNode;
}

export function AccentColorProvider({ children }: AccentColorProviderProps) {
  const { mode } = useDualMode();
  const [accentColor, setAccentColorState] = useState<string>(colors.black);
  const [currentSection, setCurrentSection] = useState<string>('home');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset to the default color for the current section
  const resetToDefault = () => {
    const defaultColor = colors.accent[currentSection as keyof typeof colors.accent] || colors.black;
    setAccentColor(defaultColor);
  };

  // Set the accent color
  const setAccentColor = (color: string) => {
    // Validar formato de color hexadecimal
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(color);
    if (!isValidHex) {
      console.warn(`Color inválido: ${color}, usando color por defecto`);
      return;
    }
    
    setAccentColorState(color);
  };

  // Update section and color based on pathname
  useEffect(() => {
    const section = pathname === '/' ? 'home' : pathname.split('/')[1];
    setCurrentSection(section);
    
    // Obtener el color de acento de nuestra configuración centralizada
    const sectionColor = colors.accent[section as keyof typeof colors.accent] || colors.black;
    setAccentColorState(sectionColor);
    
    console.log(`Sección cambiada a: ${section}, color: ${sectionColor}`);
  }, [pathname]);

  // Check for URL query param override
  useEffect(() => {
    const accentParam = searchParams.get('accent');
    if (accentParam && /^#([0-9A-F]{3}){1,2}$/i.test(accentParam)) {
      setAccentColorState(accentParam);
    }
  }, [searchParams]);

  // Aplicar el color de acento al elemento HTML mediante data-accent-color
  useEffect(() => {
    document.documentElement.setAttribute('data-accent-color', accentColor.replace('#', ''));
    
    // Las variables CSS se manejan ahora en variables.css basado en data-section y data-mode
    console.log(`Sección: ${currentSection}, Modo: ${mode}, Color de acento: ${accentColor}`);
  }, [accentColor, currentSection, mode]);

  return (
    <AccentColorContext.Provider value={{ 
      accentColor, 
      setAccentColor,
      resetToDefault
    }}>
      {children}
    </AccentColorContext.Provider>
  );
}