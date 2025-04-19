"use client"

import { createContext, useContext, useEffect } from "react"
import { themeConfig } from "@/lib/theme-config"

type ThemeContextType = {
  // Usar aserción const en lugar de anotación literal
  theme: "dark"
  themeColors: typeof themeConfig.colors
  themeFonts: typeof themeConfig.fonts
  dark: typeof themeConfig.dark
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Usar as const en lugar de anotación de tipo
  const theme = "dark" as const

  // Aplicar el modo oscuro al cargar
  useEffect(() => {
    // Siempre establecer el modo oscuro
    document.documentElement.classList.add("dark")
    
    // Actualizar el color del tema en meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", themeConfig.dark.background)
    }
  }, [])

  const value = {
    theme,
    themeColors: themeConfig.colors,
    themeFonts: themeConfig.fonts,
    dark: themeConfig.dark
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