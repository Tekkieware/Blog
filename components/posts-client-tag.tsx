"use client"

import { useState, useEffect } from 'react'
import { IPost } from '@/models/post'
import { PostGrid } from '@/components/post-grid'
import { Skeleton } from '@/components/ui/skeleton'

interface PostsClientTagProps {
    tag: string
}

export function PostsClientTag({ tag }: PostsClientTagProps) {
    const [posts, setPosts] = useState<IPost[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPostsByTag = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/posts/tag/${encodeURIComponent(tag)}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch posts')
                }
                const data = await response.json()
                setPosts(data.posts || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch posts')
            } finally {
                setLoading(false)
            }
        }

        fetchPostsByTag()
    }, [tag])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-4">
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground">
                    No posts are currently tagged with "{tag}".
                </p>
            </div>
        )
    }

    return <PostGrid posts={posts} />
}