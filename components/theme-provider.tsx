"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ComponentProps } from "react"

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      // Disable transitions during initial load to prevent flicker
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
