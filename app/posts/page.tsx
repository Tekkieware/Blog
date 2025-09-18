"use client"

import { PostGrid } from "@/components/post-grid"
import { PostFilters } from "@/components/post-filters"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PostList } from "@/components/post-list"

export default function PostsPage() {
  const searchParams = useSearchParams()
  const layerParam = searchParams.get("layer")
  const [activeLayer, setActiveLayer] = useState<string>(layerParam || "all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Update active layer when URL parameter changes
  useEffect(() => {
    if (layerParam) {
      setActiveLayer(layerParam)
    }
  }, [layerParam])

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <PostFilters
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "grid" ? (
          <PostGrid activeLayer={activeLayer} />
        ) : (
          <PostList activeLayer={activeLayer} />
        )}
      </div>
    </div>
  )
}
