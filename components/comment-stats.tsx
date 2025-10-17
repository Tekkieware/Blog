"use client"

import { useEffect, useState } from "react"
import { MessageSquare } from "lucide-react"

interface CommentStatsProps {
    postSlug: string
    className?: string
}

interface CommentStats {
    totalComments: number
    totalReplies: number
    totalInteractions: number
}

export function CommentStats({ postSlug, className }: CommentStatsProps) {
    const [stats, setStats] = useState<CommentStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
                if (response.ok) {
                    const data = await response.json()
                    setStats(data.stats)
                }
            } catch (error) {
                console.error('Error fetching comment stats:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [postSlug])

    if (loading) {
        return (
            <div className="flex items-center text-muted-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="text-sm">Loading...</span>
            </div>
        )
    }

    if (!stats || stats.totalInteractions === 0) {
        return (
            <div className="flex items-center text-muted-foreground">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="text-sm">No comments yet</span>
            </div>
        )
    }

    return (
        <div className={`flex items-center text-muted-foreground ${className}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span className="text-sm">
                {stats.totalInteractions} {stats.totalInteractions === 1 ? 'comment' : 'comments'}
            </span>
        </div>
    )
}