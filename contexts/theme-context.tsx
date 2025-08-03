"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "cosmic" | "forest" | "ocean" | "cyberpunk" | "minimal"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: Record<
    Theme,
    {
      name: string
      gradient: string
      accent: string
      particle: string
    }
  >
}

const themes = {
  cosmic: {
    name: "Cosmic",
    gradient: "from-purple-900 via-blue-900 to-indigo-900",
    accent: "from-purple-600 to-pink-600",
    particle: "#8B5CF6",
  },
  forest: {
    name: "Forest",
    gradient: "from-green-900 via-emerald-900 to-teal-900",
    accent: "from-green-600 to-emerald-600",
    particle: "#10B981",
  },
  ocean: {
    name: "Ocean",
    gradient: "from-blue-900 via-cyan-900 to-teal-900",
    accent: "from-blue-600 to-cyan-600",
    particle: "#06B6D4",
  },
  cyberpunk: {
    name: "Cyberpunk",
    gradient: "from-pink-900 via-purple-900 to-indigo-900",
    accent: "from-pink-600 to-purple-600",
    particle: "#EC4899",
  },
  minimal: {
    name: "Minimal",
    gradient: "from-gray-900 via-slate-900 to-zinc-900",
    accent: "from-gray-600 to-slate-600",
    particle: "#64748B",
  },
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("cosmic")

  useEffect(() => {
    const savedTheme = localStorage.getItem("ultra-todo-theme") as Theme
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ultra-todo-theme", theme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, setTheme, themes }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
