'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { generateContrastColors } from '@/lib/color-utils';
import theme from '@/styles/theme';

type AccentColorContextType = {
  accentColor: string;
  setAccentColor: (color: string) => void;
  strongColor: string;
  bgColor: string;
  compColor: string;
  textColor: string;
  resetToDefault: () => void;
  setColorsByRoute: (route: string) => void;
};

// Obtenemos el color de acento predeterminado del tema centralizado
const defaultAccentColor = theme.colors.accent.DEFAULT;
const defaultBackgroundColor = theme.colors.dark.background;
const defaultTextColor = theme.colors.dark.text.primary;
const defaultCompColor = theme.colors.accent.complementary;

const AccentColorContext = createContext<AccentColorContextType>({
  accentColor: defaultAccentColor,
  setAccentColor: () => {},
  strongColor: defaultAccentColor,
  bgColor: defaultBackgroundColor,
  compColor: defaultCompColor,
  textColor: defaultTextColor,
  resetToDefault: () => {},
  setColorsByRoute: () => {},
});

export const useAccentColor = () => useContext(AccentColorContext);

interface AccentColorProviderProps {
  children: ReactNode;
}

export function AccentColorProvider({ children }: AccentColorProviderProps) {
  const [accentColor, setAccentColorState] = useState<string>(defaultAccentColor);
  const [strongColor, setStrongColor] = useState<string>(defaultAccentColor);
  const [bgColor, setBgColor] = useState<string>(defaultBackgroundColor);
  const [compColor, setCompColor] = useState<string>(defaultCompColor);
  const [textColor, setTextColor] = useState<string>(defaultTextColor);
  const [defaultRouteColor, setDefaultRouteColor] = useState<string>(defaultAccentColor);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Usar colores de ruta desde el tema centralizado
  const routeColors = theme.colors.routes;

  // Reset to the default color for the current route
  const resetToDefault = () => {
    setAccentColor(defaultRouteColor);
  };

  // Seleccionar colores por ruta específica
  const setColorsByRoute = (route: string) => {
    if (routeColors[route as keyof typeof routeColors]) {
      setAccentColor(routeColors[route as keyof typeof routeColors]);
    }
  };

  // Set the accent color and calculate matching color set
  const setAccentColor = (color: string) => {
    // Log para depuración
    console.log(`AccentColorProvider: Cambiando color a ${color}`);
    
    // Validar formato de color hexadecimal
    const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(color);
    const colorToUse = isValidHex ? color : defaultAccentColor;
    
    if (!isValidHex) {
      console.warn(`Color inválido: ${color}, usando color por defecto`);
    }
    
    setAccentColorState(colorToUse);
    
    try {
      // Generate complete color set
      const { strongColor: strong, bgColor: bg, compColor: comp, textColor: text } = generateContrastColors(colorToUse);
      setStrongColor(strong);
      setBgColor(bg);
      setCompColor(comp);
      setTextColor(text);
    } catch (error) {
      console.error("Error al generar colores de contraste:", error);
      // Usar valores por defecto en caso de error
      setStrongColor(defaultAccentColor);
      setBgColor(defaultBackgroundColor);
      setCompColor(defaultCompColor);
      setTextColor(defaultTextColor);
    }
  };

  // Update default route color when the pathname changes
  useEffect(() => {
    // Find the default color for the current route
    let routeColor = defaultAccentColor;
    
    for (const route in routeColors) {
      if (pathname === route || pathname.startsWith(`${route}/`)) {
        routeColor = routeColors[route as keyof typeof routeColors];
        break;
      }
    }
    
    console.log(`AccentColorProvider: Ruta ${pathname}, color de ruta: ${routeColor}`);
    setDefaultRouteColor(routeColor);
    
    // Only set the accent color if we're just arriving at this route
    // This allows hover effects to work without resetting the color each time
    if (accentColor === defaultAccentColor || 
        (pathname === '/' && accentColor !== defaultAccentColor)) {
      setAccentColor(routeColor);
    }
  }, [pathname]);

  // Check for URL query param override
  useEffect(() => {
    // First check for query param
    const accentParam = searchParams.get('accent');

    if (accentParam) {
      // Validate that it's a valid hex color or CSS color name
      const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(accentParam) || 
                           /^(rgb|hsl)a?\(.*\)$/i.test(accentParam);

      if (isValidColor) {
        setAccentColor(accentParam);
      }
    }
  }, [searchParams]);

  // Apply accent color to CSS variables
  useEffect(() => {
    console.log(`AccentColorProvider: Aplicando variables CSS - accentColor: ${accentColor}`);
    
    // Establecer las variables CSS para el esquema de triple color
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-strong', strongColor);
    document.documentElement.style.setProperty('--accent-bg', bgColor);
    document.documentElement.style.setProperty('--accent-comp', compColor);
    document.documentElement.style.setProperty('--text-color', textColor);
    
    // Variables de compatibilidad para código existente
    document.documentElement.style.setProperty('--bg-color', bgColor);
    
    // Actualizar colores de elementos de UI basados en el acento para mantener consistencia
    document.documentElement.style.setProperty('--color-accent', accentColor);
    
    // Intentar forzar un reflow para que los cambios se apliquen inmediatamente
    document.body.classList.remove('color-transition');
    void document.body.offsetWidth; // Trigger reflow
    document.body.classList.add('color-transition');
    
    // Agregar un atributo data-accent-color al elemento html para permitir selectores CSS
    document.documentElement.setAttribute('data-accent-color', accentColor.replace('#', ''));
  }, [accentColor, strongColor, bgColor, compColor, textColor]);

  return (
    <AccentColorContext.Provider value={{ 
      accentColor, 
      setAccentColor, 
      strongColor,
      bgColor, 
      compColor,
      textColor,
      resetToDefault,
      setColorsByRoute
    }}>
      {children}
    </AccentColorContext.Provider>
  );
}