
"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui-tailwind/badge"
import { Button } from "@/components/ui-tailwind/button"
import { ArrowRight, ArrowUpRight, Calendar, Pause, Play, Tag } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui-tailwind/card"
import { getPosts } from "@/lib/services/postService"
import { IPost } from "@/models/post"

import { FeaturedMarqueeSkeleton } from "./featured-marquee-skeleton"

// Helper function to get color based on layer
const getLayerColor = (layer: string) => {
  switch (layer) {
    case "frontend":
      return "indigo"
    case "backend":
      return "cyan"
    case "devops":
      return "orange"
    case "architecture":
      return "blue"
    case "peopleware":
      return "emerald"
    case "overflow":
      return "pink"
    default:
      return "gray"
  }
}

export function FeaturedMarquee() {
  const [isPaused, setIsPaused] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [posts, setPosts] = useState<IPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      const fetchedPosts = await getPosts()
      setPosts(fetchedPosts)
      setLoading(false)
    }

    fetchPosts()
  }, [])

  // Duplicate the posts for continuous scrolling
  const allPosts = posts.length > 0 ? [...posts, ...posts] : []

  // Add this function after the allPosts declaration
  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Make the function available on the window object for external access
  useEffect(() => {
    // @ts-ignore
    window.toggleMarqueePause = togglePause
    return () => {
      // @ts-ignore
      delete window.toggleMarqueePause
    }
  }, [])

  if (loading) {
    return <FeaturedMarqueeSkeleton />
  }

  return (
    <div className="w-full space-y-16">
      <div className="relative w-full overflow-hidden">
        {/* Blinking cursor with reduced width to 1px */}
        <div
          className={cn("absolute top-0 right-0 h-[200px] w-1 bg-primary z-10", isPaused ? "" : "animate-cursor-blink")}
        ></div>

        <div ref={marqueeRef} className={cn("flex gap-4 marquee-animation", isPaused && "marquee-paused")}>
          {allPosts.map((post, index) => (
            <Link href={`/posts/${post.slug}`} key={`${post._id}-${index}`} className="shrink-0">
              <Card
                className={cn(
                  "w-[320px] h-[200px] overflow-hidden transition-all duration-200 group border-2",
                  `border-${getLayerColor(post.layer)}-400/30 hover:border-${getLayerColor(post.layer)}-400/50`,
                  "hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]",
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs border",
                        `border-${getLayerColor(post.layer)}-400/30 text-${getLayerColor(post.layer)}-400`,
                      )}
                    >
                      {post.layer}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="font-mono text-lg group-hover:text-primary transition-colors line-clamp-1 text-left">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-2 text-left">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 absolute bottom-2 right-2">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Media-style play/pause button with "Enter the Stack" styling */}
      <div className="flex flex-col justify-center sm:flex-row gap-4 mt-8">
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
          onClick={togglePause}
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
  )
}
