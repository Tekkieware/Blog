"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, LayoutGrid, List } from "lucide-react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { layers } from "@/components/layer-navigator"

interface PostFiltersProps {
  activeLayer: string
  setActiveLayer: (layer: string) => void
}

export function PostFilters({ activeLayer, setActiveLayer }: PostFiltersProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const router = useRouter()
  const pathname = usePathname()

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveLayer(value)

    // Update URL with the selected layer
    if (value === "all") {
      router.push(pathname)
    } else {
      router.push(`${pathname}?layer=${value}`)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search posts..." className="w-full pl-8 bg-background" />
      </div>

      <div className="flex items-center gap-4">
        <Tabs value={activeLayer} onValueChange={handleTabChange} className="w-fit">
          <TabsList className="font-mono">
            <TabsTrigger value="all">All</TabsTrigger>
            {layers.slice(0, 5).map((layer) => (
              <TabsTrigger key={layer.slug} value={layer.slug}>
                {layer.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

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
    </div>
  )
}
