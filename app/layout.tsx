import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans, Fira_Mono as FontMono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CommandPalette from "@/components/command-palette"
import { cn } from "@/lib/utils"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"]
})

export const metadata: Metadata = {
  title: "Isaiah Ozadhe: A Peak Into the Mind of a Software Engineer",
  description: "Build solutions. Share thoughts.",
  generator: 'my blog'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable, fontMono.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="stacked-theme"
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <CommandPalette />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
