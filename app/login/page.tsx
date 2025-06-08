"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Terminal, Lock } from "lucide-react"
import { Button } from "@/components/ui-tailwind/button"
import { setCookie } from "cookies-next"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/admin"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simple hardcoded password check
    if (password === "admin") {
      // Set auth cookie that expires in 5 minutes
      setCookie("auth-token", "authenticated", {
        maxAge: 300, // 5 minutes in seconds
        path: "/",
      })

      // Redirect to admin or the requested page
      router.push(redirect)
    } else {
      setError("Invalid password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-primary/10 p-3 rounded-full border border-primary/20 mb-4">
            <Terminal className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-mono">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Enter your password to continue</p>
        </div>

        <div className="mt-8 bg-card border-2 border-primary/20 rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  placeholder="Enter password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-3 rounded-md text-sm">{error}</div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>Default password: "admin"</p>
          <p className="mt-1">Session expires after 5 minutes</p>
        </div>
      </div>
    </div>
  )
}
