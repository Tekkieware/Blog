import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans, Fira_Mono as FontMono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeScript } from "@/components/theme-script"
import { AuthProvider } from "@/components/auth-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import CommandPalette from "@/components/command-palette"
import { StructuredData } from "@/components/structured-data"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"

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
  title: {
    template: '%s | Isaiah Ozadhe Blog',
    default: 'Isaiah Ozadhe: A Peek Into a Software Engineer\'s Mind',
  },
  description: 'Software engineer sharing insights on engineering solutions, programming tutorials, and tech innovations. Build solutions. Share thoughts.',
  keywords: [
    'engineering solutions',
    'programming',
    'software engineering',
    'JavaScript',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'tech blog',
    'Isaiah Ozadhe'
  ],
  authors: [{ name: 'Isaiah Ozadhe', url: 'https://isaiahozadhe.tech' }],
  creator: 'Isaiah Ozadhe',
  publisher: 'Isaiah Ozadhe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://blog.isaiahozadhe.tech'),
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://blog.isaiahozadhe.tech',
    siteName: 'Isaiah Ozadhe Blog',
    title: 'Isaiah Ozadhe: A Peek Into a Software Engineer\'s Mind',
    description: 'Full-stack developer sharing insights on modern web development, programming tutorials, and tech innovations.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Isaiah Ozadhe Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isaiah Ozadhe: A Peek Into a Software Engineer\'s Mind',
    description: 'Full-stack developer sharing insights on modern web development, programming tutorials, and tech innovations.',
    images: ['/api/og'],
    creator: '@isaiahozadhe',
    site: '@isaiahozadhe',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.ico',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  manifest: '/site.webmanifest',
  generator: 'Next.js',
  applicationName: 'Isaiah Ozadhe Blog',
  referrer: 'origin-when-cross-origin',
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <StructuredData
          type="website"
          data={{
            name: 'Isaiah Ozadhe Blog',
            url: 'https://blog.isaiahozadhe.tech',
            description: 'Software engineer sharing insights on engineering solutions, programming tutorials, and tech innovations.',
          }}
        />
        <StructuredData
          type="person"
          data={{}}
        />
        <StructuredData
          type="organization"
          data={{}}
        />
      </head>
      <body className={cn("min-h-screen font-sans antialiased", fontSans.variable, fontMono.variable)}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="stacked-theme"
          >
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <CommandPalette />
              <main className="flex-1">{children}</main>
              <Toaster />
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
