"use client"

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react"
import { ConfigProvider, theme as antdTheme } from "antd"

type Theme = "light" | "dark"

const ThemeContext = createContext<{
  theme: Theme
  toggleTheme: () => void
}>({
  theme: "light",
  toggleTheme: () => {},
})

let listeners: Array<() => void> = []

function emitChange() {
  for (const listener of listeners) listener()
}

function subscribe(callback: () => void) {
  listeners = [...listeners, callback]
  return () => {
    listeners = listeners.filter((l) => l !== callback)
  }
}

function getSnapshot(): Theme {
  return (localStorage.getItem("theme") as Theme) ?? "light"
}

function getServerSnapshot(): Theme {
  return "light"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", next)
    emitChange()
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === "dark" ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#2563eb",
          borderRadius: 8,
        },
      }}
    >
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </ConfigProvider>
  )
}

export const useTheme = () => useContext(ThemeContext)
