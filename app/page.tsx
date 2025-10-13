"use client"

import Link from "next/link"
import { LayerNavigator } from "@/components/layer-navigator"
import { ArrowRight, Pause, Play } from "lucide-react"
import { FeaturedMarquee } from "@/components/featured-marquee"
import { Button } from "@/components/ui-tailwind/button"
import { useState } from "react"
import { NewsletterSubscribe } from "@/components/newsletter-subscribe"

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
              ISAIAH OZADHE &gt;&gt; A PEEK INTO A SOFTWARE ENGINEER'S MIND...
            </h1>

            <p className="text-muted-foreground md:text-xl">
              A collection of thoughts, patterns, and insights.
            </p>
          </div>

          {/* Featured Articles Marquee */}
          <div className="w-full max-w-5xl">
            <FeaturedMarquee />
          </div>
        </div>
      </section>

      {/* Layer Navigator Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center mb-8">
            <div className="h-px flex-1 bg-border"></div>
            <h2 className="text-3xl font-bold font-mono px-4">Layers</h2>
            <div className="h-px flex-1 bg-border"></div>
          </div>
          <LayerNavigator />
        </div>
      </section>
      {/* Newletter Subscription section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center mb-8">
            <div className="h-px flex-1 bg-border"></div>
          </div>
          <div className="text-center space-y-4 pt-8">
            <h2 className="text-xl md:text-2xl font-bold font-mono">Ready to Level Up?</h2>
            <p className="text-muted-foreground">Join over 10,000 engineers receiving weekly insights</p>
            <div className="flex justify-center">
              <NewsletterSubscribe variant="inline" className="max-w-md" />
            </div>
          </div>
        </div>
      </section>
    </div>



  )
}
