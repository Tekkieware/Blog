"use client"

import { PostGrid } from "@/components/post-grid"
import { PostFilters } from "@/components/post-filters"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { PostList } from "@/components/post-list"
import { IPost } from "@/models/post"
import { getPostsAndCount } from "@/lib/services/postService"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PostsPage() {
  const searchParams = useSearchParams()
  const layerParam = searchParams.get("layer")
  const pageParam = searchParams.get("page")
  const [activeLayer, setActiveLayer] = useState<string>(layerParam || "all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<IPost[]>([])
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (layerParam) {
      setActiveLayer(layerParam)
    }

    async function fetchPosts() {
      setLoading(true)
      const { posts: fetchedPosts, total } = await getPostsAndCount(page, 1, activeLayer)
      setPosts(fetchedPosts)
      setTotalPages(Math.ceil(total / 1))
      setLoading(false)
    }

    fetchPosts()
  }, [page, layerParam])

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Update URL to reflect the new page
    window.history.pushState(null, '', `?page=${newPage}${layerParam ? `&layer=${layerParam}` : ''}`)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-mono font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Software Engineering Insights
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Documenting the craft of building systems that last, one layer at a time.
          </p>
        </div>
        <PostFilters
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "grid" ? (
          <PostGrid loading={loading} activeLayer={activeLayer} posts={posts} />
        ) : (
          <PostList loading={loading} activeLayer={activeLayer} posts={posts} />
        )}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.max(1, page - 1))
                }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageChange(i + 1)
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(Math.min(totalPages, page + 1))
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
