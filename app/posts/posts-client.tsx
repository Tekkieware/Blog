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
import { PaginationLoader } from "@/components/ui/pagination-loader"
import { NoPostsEmptyState, SearchNotFoundEmptyState } from "@/components/empty-state";

export default function PostsPageClient() {
    const searchParams = useSearchParams()
    const layerParam = searchParams.get("layer")
    const pageParam = searchParams.get("page")
    const [activeLayer, setActiveLayer] = useState<string>(layerParam || "all")
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState<IPost[]>([])
    const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const POSTS_PER_PAGE = 10;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms debounce

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (layerParam) {
            setActiveLayer(layerParam)
        }

        async function fetchPosts() {
            setLoading(true)
            const { posts: fetchedPosts, total } = await getPostsAndCount(page, POSTS_PER_PAGE, activeLayer, debouncedSearchTerm)
            setPosts(fetchedPosts || [])
            setTotalPages(Math.ceil(total / POSTS_PER_PAGE))
            setLoading(false)
        }

        fetchPosts()
    }, [page, layerParam, debouncedSearchTerm])

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        // Update URL to reflect the new page
        window.history.pushState(null, '', `?page=${newPage}${layerParam ? `&layer=${layerParam}` : ''}`)
    }

    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        setPage(1); // Reset to first page on new search
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
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                />

                {loading ? (
                    viewMode === "grid" ? (
                        <PostGrid loading={true} activeLayer={activeLayer} posts={[]} />
                    ) : (
                        <PostList loading={true} activeLayer={activeLayer} posts={[]} />
                    )
                ) : posts.length > 0 ? (
                    viewMode === "grid" ? (
                        <PostGrid loading={false} activeLayer={activeLayer} posts={posts} />
                    ) : (
                        <PostList loading={false} activeLayer={activeLayer} posts={posts} />
                    )
                ) : debouncedSearchTerm ? (
                    <SearchNotFoundEmptyState query={debouncedSearchTerm} />
                ) : (
                    <NoPostsEmptyState />
                )}

                {loading ? (
                    <PaginationLoader />
                ) : totalPages > 1 && (
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
                )}
            </div>
        </div>
    )
}