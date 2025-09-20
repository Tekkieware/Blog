"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowUpRight, Calendar } from "lucide-react"

const posts = [
  {
    id: "1",
    title: "The Art of Component Composition",
    excerpt: "How to build maintainable UI components that scale with your application",
    date: "2023-05-15",
    layer: "frontend",
    tags: ["react", "architecture", "patterns"],
    slug: "component-composition",
  },
  {
    id: "2",
    title: "API Design Principles for Backend Engineers",
    excerpt: "Creating intuitive, consistent, and evolvable APIs that developers love",
    date: "2023-06-22",
    layer: "backend",
    tags: ["api", "rest", "graphql"],
    slug: "api-design-principles",
  },
  {
    id: "3",
    title: "Infrastructure as Code: Beyond the Basics",
    excerpt: "Advanced patterns for managing cloud infrastructure with code",
    date: "2023-07-10",
    layer: "devops",
    tags: ["terraform", "aws", "iac"],
    slug: "infrastructure-as-code",
  },
  {
    id: "4",
    title: "System Design: Scaling to Your First Million Users",
    excerpt: "Architectural patterns and considerations for high-scale applications",
    date: "2023-08-05",
    layer: "architecture",
    tags: ["scaling", "distributed-systems", "performance"],
    slug: "scaling-to-million-users",
  },
  {
    id: "5",
    title: "Building Engineering Teams That Last",
    excerpt: "Strategies for creating a culture of growth, trust, and technical excellence",
    date: "2023-09-18",
    layer: "peopleware",
    tags: ["leadership", "culture", "mentorship"],
    slug: "building-engineering-teams",
  },
  {
    id: "6",
    title: "Late Night Debugging: Tales from Production",
    excerpt: "War stories and lessons learned from critical production incidents",
    date: "2023-10-30",
    layer: "overflow",
    tags: ["debugging", "incidents", "lessons"],
    slug: "late-night-debugging",
  },
]

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

interface PostGridProps {
  activeLayer: string
}

export function PostGrid({ activeLayer }: PostGridProps) {
  const filteredPosts = activeLayer === "all" ? posts : posts.filter((post) => post.layer === activeLayer)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <Link href={`/posts/${post.slug}`} key={post.id} className="h-full">
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
              <Card
                className={cn(
                  "h-full flex flex-col overflow-hidden transition-all duration-200 group border-2",
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
                      {post.date}
                    </div>
                  </div>
                  <CardTitle className="font-mono text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 mt-auto">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-primary hover:bg-primary/10 -ml-2 group"
                  >
                    <span>Read more</span>
                    <ArrowUpRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </Link>
        ))
      ) : (
        <motion.div variants={itemVariants} className="col-span-full text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="text-6xl">🔍</div>
            <h3 className="text-xl font-mono font-semibold">No posts found</h3>
            <p className="text-muted-foreground">
              No posts found in the <span className="font-mono font-semibold">{activeLayer}</span> layer.
              Try selecting a different layer to explore more content.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
