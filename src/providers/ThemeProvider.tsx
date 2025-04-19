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

  // Establecer metadatos y clases, pero no variables CSS para evitar conflictos
  useEffect(() => {
    // Actualizar el color del tema en meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme.colors.dark.background)
    }
    
    // Ya no establecemos variables CSS aquí para evitar conflictos con DualModeProvider
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