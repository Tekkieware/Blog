"use client"

import Link from "next/link"
import { LayerNavigator } from "@/components/layer-navigator"
import { ArrowRight, Pause, Play } from "lucide-react"
import { FeaturedMarquee } from "@/components/featured-marquee"
import { Button } from "@/components/ui-tailwind/button"
import { useState } from "react"

export default function Home() {
  const [isPaused, setIsPaused] = useState(false)

  const toggleMarquee = () => {
    // @ts-ignore
    if (window.toggleMarqueePause) {
      // @ts-ignore
      window.toggleMarqueePause()
      setIsPaused(!isPaused)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Enhanced animated background */}
          <div className="animated-grid dark:opacity-100 opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background"></div>
        </div>

        <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-6">
            {/* Removed terminal-text class to remove the blinking cursor */}
            <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              SYSTEM BOOT &gt;&gt; LOADING SENIOR ENGINEER MINDSTACK...
            </h1>

            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              A collection of thoughts, patterns, and insights from the mind of a senior engineer.
            </p>
          </div>

          {/* Featured Articles Marquee */}
          <div className="w-full max-w-5xl">
            <FeaturedMarquee />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              asChild
              size="lg"
              className="bg-primary/10 backdrop-blur-sm border border-primary/20 hover:bg-primary/20 text-primary group"
            >
              <Link href="/posts" className="flex items-center">
                All Posts
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="backdrop-blur-sm border-primary/20 hover:bg-primary/10 flex items-center"
              onClick={toggleMarquee}
            >
              {isPaused ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Resume the Flow
                </>
              ) : (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause to Catch Something Cool
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Layer Navigator Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center mb-8">
            <div className="h-px flex-1 bg-border"></div>
            <h2 className="text-3xl font-bold font-mono px-4">Mind Layers</h2>
            <div className="h-px flex-1 bg-border"></div>
          </div>
          <LayerNavigator />
        </div>
      </section>
    </div>
  )
}
