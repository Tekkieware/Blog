
"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui-tailwind/card"
import { useEffect, useState } from "react"

// Define the Layer interface
interface Layer {
  id: string;
  title: string;
  description: string;
  color: string;
  slug: string;
  icon: string;
  count: number;
}

// Export layers data so it can be used in other components
export const layers: Layer[] = [
  {
    id: "01",
    title: "Frontend",
    description: "UI architecture, component design, and user experience patterns",
    color: "indigo",
    slug: "frontend",
    icon: "💻", // Clean & universal for UI work
    count: 0,
  },
  {
    id: "02",
    title: "Backend",
    description: "API design, data modeling, and server-side architecture",
    color: "cyan",
    slug: "backend",
    icon: "🧠", // Symbolic of logic, processing, intelligence
    count: 0,
  },
  {
    id: "03",
    title: "DevOps",
    description: "CI/CD, infrastructure, and deployment strategies",
    color: "orange",
    slug: "devops",
    icon: "⚡", // Energy, automation, pipelines
    count: 0,
  },
  {
    id: "04",
    title: "Architecture",
    description: "System design, scalability patterns, and technical decisions",
    color: "blue",
    slug: "architecture",
    icon: "🧱", // Structural, foundational
    count: 0,
  },
  {
    id: "05",
    title: "Peopleware",
    description: "Team dynamics, mentorship, and engineering culture",
    color: "emerald",
    slug: "peopleware",
    icon: "🤝", // Collaboration, teamwork
    count: 0,
  },
]


// Helper function to get color based on layer
export const getLayerColor = (color: string) => {
  switch (color) {
    case "indigo":
      return "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 hover:border-indigo-500/40"
    case "cyan":
      return "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40"
    case "orange":
      return "from-orange-500/20 to-orange-500/5 border-orange-500/20 hover:border-orange-500/40"
    case "blue":
      return "from-blue-500/20 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40"
    case "emerald":
      return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40"
    case "pink":
      return "from-pink-500/20 to-pink-500/5 border-pink-500/20 hover:border-pink-500/40"
    default:
      return "from-gray-500/20 to-gray-500/5 border-gray-500/20 hover:border-gray-500/40"
  }
}

export function LayerNavigator() {
  const [layerCounts, setLayerCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchLayerCounts = async () => {
      try {
        const response = await fetch('/api/posts/layer/count');
        if (response.ok) {
          const counts = await response.json();
          setLayerCounts(counts);
        }
      } catch (error) {
        console.error("Failed to fetch layer counts:", error);
      }
    };

    fetchLayerCounts();
  }, []);

  const updatedLayers = layers.map(layer => ({
    ...layer,
    count: layerCounts[layer.slug] || 0,
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {updatedLayers.map((layer) => (
        <Link href={`/posts?layer=${layer.slug}`} key={layer.id}>
          <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
            <Card
              className={cn(
                "h-full overflow-hidden transition-all duration-200 border-2 flex flex-col min-h-[200px]",
                "bg-gradient-to-br",
                getLayerColor(layer.color),
                "hover:shadow-lg dark:hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]",
              )}
            >
              <CardHeader className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{layer.icon}</span>
                    <CardTitle className="text-xl font-mono">{layer.title}</CardTitle>
                  </div>
                  <span className="font-mono text-sm px-2 py-1 rounded bg-foreground/10 text-foreground/80">
                    [{layer.id}]
                  </span>
                </div>
                <CardDescription className="mt-2 flex-1">{layer.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0 mt-auto">
                <div className="flex items-center text-sm font-medium text-primary group">
                  <span className="font-mono text-xs px-2 py-1 rounded bg-primary/10 text-primary mr-2">
                    {layer.count} {layer.count === 1 ? 'post' : 'posts'}
                  </span>
                  Explore Layer
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </Link>
      ))}
    </div>
  )
}

