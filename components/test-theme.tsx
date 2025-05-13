"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function TestTheme() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 bg-card p-4 rounded-md shadow-lg z-50 border">
      <p>Current theme: {theme}</p>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setTheme("light")} className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
          Light
        </button>
        <button onClick={() => setTheme("dark")} className="px-3 py-1 bg-primary text-primary-foreground rounded-md">
          Dark
        </button>
      </div>
    </div>
  )
}
