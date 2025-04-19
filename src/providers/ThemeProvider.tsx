'use client'

import { createContext, useContext, useEffect } from "react"
import theme from "@/styles/theme"

type ThemeContextType = {
  theme: "dark" // Actualmente solo soportamos modo oscuro
  colors: typeof theme.colors
  fonts: typeof theme.fonts
  spacing: typeof theme.spacing
  breakpoints: typeof theme.breakpoints
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Usar as const en lugar de anotación de tipo
  const themeMode = "dark" as const

  // Aplicar el modo oscuro al cargar y establecer variables CSS
  useEffect(() => {
    // Siempre establecer el modo oscuro
    document.documentElement.classList.add("dark")
    
    // Actualizar el color del tema en meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme.colors.dark.background)
    }
    
    // Establecer variables CSS desde el tema centralizado
    document.documentElement.style.setProperty('--color-primary-light', theme.colors.primary.light)
    document.documentElement.style.setProperty('--color-primary-mid', theme.colors.primary.mid)
    document.documentElement.style.setProperty('--color-primary-dark', theme.colors.primary.dark)
    document.documentElement.style.setProperty('--color-secondary', theme.colors.secondary)
    document.documentElement.style.setProperty('--color-accent', theme.colors.accent.DEFAULT)
    
    // Colores de interfaz para el modo oscuro
    document.documentElement.style.setProperty('--color-bg', theme.colors.dark.background)
    document.documentElement.style.setProperty('--color-surface', theme.colors.dark.surface)
    document.documentElement.style.setProperty('--color-text', theme.colors.dark.text.primary)
    document.documentElement.style.setProperty('--color-border', theme.colors.dark.border)
    
    // Establecer tipografía
    document.documentElement.style.setProperty('--font-sans', theme.fonts.sans)
    document.documentElement.style.setProperty('--font-mono', theme.fonts.mono)
    document.documentElement.style.setProperty('--letter-spacing', theme.fonts.letterSpacing)
    document.documentElement.style.setProperty('--line-height-tight', String(theme.fonts.lineHeight.tight))
    document.documentElement.style.setProperty('--line-height-normal', String(theme.fonts.lineHeight.normal))
    document.documentElement.style.setProperty('--line-height-relaxed', String(theme.fonts.lineHeight.relaxed))
  }, [])

  const value = {
    theme: themeMode,
    colors: theme.colors,
    fonts: theme.fonts,
    spacing: theme.spacing,
    breakpoints: theme.breakpoints
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook personalizado para usar el tema
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}