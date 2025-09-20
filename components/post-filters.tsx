"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LayoutGrid, List, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { layers } from "@/components/layer-navigator"

interface PostFiltersProps {
  activeLayer: string
  setActiveLayer: (layer: string) => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
}

export function PostFilters({
  activeLayer,
  setActiveLayer,
  viewMode,
  setViewMode,
}: PostFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()

  // Handle layer button click
  const handleLayerChange = (layerId: string) => {
    setActiveLayer(layerId)

    if (layerId === "all") {
      router.push(pathname)
    } else {
      router.push(`${pathname}?layer=${layerId}`)
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center ">

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search posts..."
            className="w-full md:w-xl pl-8 bg-background"
          />
        </div>
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
            className="rounded-none rounded-l-md"
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
            className="rounded-none rounded-r-md"
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>


      {/* Filters + View mode */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

        {/* Layer Filters */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {/* All option */}
            <motion.div
              key="all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLayerChange("all")}
                className={cn(
                  "relative overflow-hidden hover:text-primary hover:border-primary transition-all duration-300",
                  activeLayer === "all"
                    ? "text-primary border-primary"
                    : "hover:bg-muted/50"
                )}
              >
                <span className="font-mono text-xs">All layers</span>
                <Badge
                  variant="secondary"
                  className={cn(
                    "ml-2 text-[10px] h-4 px-1.5 text-white",

                    activeLayer !== "all" && "bg-white/20"
                  )}
                >
                  10
                </Badge>
              </Button>
            </motion.div>

            {/* Other layers */}
            {layers.map((layer) => (
              <motion.div
                key={layer.slug}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLayerChange(layer.slug)}
                  className={cn(
                    "relative overflow-hidden hover:text-primary hover:border-primary transition-all duration-300",
                    activeLayer === layer.slug
                      ? "text-primary border-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className="font-mono text-xs">{layer.title}</span>
                  {layer.count !== undefined && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        "ml-2 text-[10px] h-4 px-1.5 text-white",

                        activeLayer !== layer.slug && "bg-white/20"
                      )}
                    >
                      {layer.count}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>


        {/* View mode toggle */}
      </div>
    </div>
  )
}
