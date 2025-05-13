"use client"

import { PostGrid } from "@/components/post-grid"
import { PostFilters } from "@/components/post-filters"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function PostsPage() {
  const searchParams = useSearchParams()
  const layerParam = searchParams.get("layer")
  const [activeLayer, setActiveLayer] = useState<string>(layerParam || "all")

  // Update active layer when URL parameter changes
  useEffect(() => {
    if (layerParam) {
      setActiveLayer(layerParam)
    }
  }, [layerParam])

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold font-mono">Mind Stack</h1>
          <p className="text-muted-foreground">Browse through the layers of a senior engineer&apos;s mind</p>
        </div>

        <PostFilters activeLayer={activeLayer} setActiveLayer={setActiveLayer} />

        <PostGrid activeLayer={activeLayer} />
      </div>
    </div>
  )
}
