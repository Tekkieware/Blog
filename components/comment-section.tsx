"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "./ui-tailwind/card"
import { Button } from "./ui-tailwind/button"
import { Badge } from "./ui-tailwind/badge"
import { MessageSquare, Reply, MoreVertical, Flag, Edit, Trash2, Send, User, Heart, Code } from "lucide-react"
import { cn } from "@/lib/utils"

interface Comment {
    id: string
    author: string
    avatar?: string
    content: string
    timestamp: string
    likes: number
    replies?: Comment[]
    isAuthor?: boolean
    badge?: "Author" | "Moderator" | "Verified"
}

interface CommentSectionProps {
    postSlug: string
    className?: string
}

// Mock comments data
const mockComments: Comment[] = [
    {
        id: "1",
        author: "Alex Chen",
        content:
            "This is exactly what I needed! The composition pattern has really helped me structure my components better. One question though - how do you handle deeply nested composition? Do you have a rule of thumb for when to stop composing?",
        timestamp: "2 hours ago",
        likes: 24,
        badge: "Verified",
        replies: [
            {
                id: "1-1",
                author: "Senior Dev",
                content:
                    "Great question! I generally follow the 'three levels' rule - if you find yourself nesting more than 3 levels deep, it's usually a sign to extract that into a separate component. The key is to look for cohesive units of functionality that make sense together.",
                timestamp: "1 hour ago",
                likes: 15,
                isAuthor: true,
                badge: "Author",
            },
            {
                id: "1-2",
                author: "Maya Rodriguez",
                content: "Thanks for clarifying! This really helps understand when to extract vs. when to compose.",
                timestamp: "45 minutes ago",
                likes: 5,
            },
        ],
    },
    {
        id: "2",
        author: "Jordan Kim",
        content:
            "The compound components pattern is a game changer. I've been using it in our design system and it's made the API so much more intuitive for other devs. Would love to see a follow-up on handling state management with compound components!",
        timestamp: "5 hours ago",
        likes: 31,
        badge: "Verified",
    },
    {
        id: "3",
        author: "Sam Taylor",
        content:
            "Code examples are super clear. Quick tip for anyone implementing this: TypeScript generics work really well with composition patterns. Makes your component props type-safe while maintaining flexibility.",
        timestamp: "1 day ago",
        likes: 42,
        replies: [
            {
                id: "3-1",
                author: "Chris Morgan",
                content: "Could you share a quick example of how you use generics with this pattern?",
                timestamp: "20 hours ago",
                likes: 8,
            },
        ],
    },
]

function CommentItem({
    comment,
    onReply,
    onLike,
    level = 0,
}: {
    comment: Comment
    onReply: (commentId: string) => void
    onLike: (commentId: string) => void
    level?: number
}) {
    const [isLiked, setIsLiked] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [isExpanded, setIsExpanded] = useState(true)

    const handleLike = () => {
        setIsLiked(!isLiked)
        onLike(comment.id)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("relative", level > 0 && "ml-8 md:ml-12")}
        >
            {/* Connection line for replies */}
            {level > 0 && (
                <div className="absolute -left-8 md:-left-12 top-0 bottom-0 w-px bg-border">
                    <div className="absolute top-6 -left-2 w-4 h-px bg-border" />
                </div>
            )}

            <Card
                className={cn(
                    "p-4 border-border hover:border-primary/30 transition-colors",
                    comment.isAuthor && "bg-primary/5 border-primary/20",
                )}
            >
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                            {comment.avatar ? (
                                <img src={comment.avatar || "/placeholder.svg"} alt={comment.author} className="rounded-full" />
                            ) : (
                                <User className="h-5 w-5 text-primary" />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-medium text-foreground">{comment.author}</span>
                            {comment.badge && (
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "text-xs px-2 py-0",
                                        comment.badge === "Author" && "border-primary/30 text-primary",
                                        comment.badge === "Moderator" && "border-emerald-400/30 text-emerald-400",
                                        comment.badge === "Verified" && "border-cyan-400/30 text-cyan-400",
                                    )}
                                >
                                    {comment.badge}
                                </Badge>
                            )}
                            <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                        </div>

                        {/* Comment text */}
                        <p className="text-foreground mb-3 leading-relaxed">{comment.content}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLike}
                                className={cn(
                                    "flex items-center gap-1.5 text-sm transition-colors group",
                                    isLiked ? "text-red-500" : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                <Heart
                                    className={cn("h-4 w-4 transition-all", isLiked && "fill-current scale-110")}
                                    strokeWidth={isLiked ? 0 : 2}
                                />
                                <span className="font-medium">{comment.likes + (isLiked ? 1 : 0)}</span>
                            </button>

                            <button
                                onClick={() => onReply(comment.id)}
                                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Reply className="h-4 w-4" />
                                <span>Reply</span>
                            </button>

                            {comment.replies && comment.replies.length > 0 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    {isExpanded ? "Hide" : "Show"} {comment.replies.length}{" "}
                                    {comment.replies.length === 1 ? "reply" : "replies"}
                                </button>
                            )}

                            <div className="relative ml-auto">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </button>

                                <AnimatePresence>
                                    {showMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                            className="absolute right-0 top-full mt-1 z-10 w-40 bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden"
                                        >
                                            <button className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 transition-colors">
                                                <Flag className="h-4 w-4" />
                                                Report
                                            </button>
                                            {comment.isAuthor && (
                                                <>
                                                    <button className="w-full px-3 py-2 text-sm text-left hover:bg-muted flex items-center gap-2 transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                        Edit
                                                    </button>
                                                    <button className="w-full px-3 py-2 text-sm text-left hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Nested replies */}
            <AnimatePresence>
                {isExpanded && comment.replies && comment.replies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-4"
                    >
                        {comment.replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} onReply={onReply} onLike={onLike} level={level + 1} />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function CommentSection({ postSlug, className }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>(mockComments)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<"newest" | "popular">("popular")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            const comment: Comment = {
                id: Date.now().toString(),
                author: "You",
                content: newComment,
                timestamp: "Just now",
                likes: 0,
                replies: [],
            }

            setComments([comment, ...comments])
            setNewComment("")
            setIsSubmitting(false)
        }, 500)
    }

    const handleReply = (commentId: string) => {
        setReplyingTo(commentId)
        // Focus on comment input
        document.getElementById("comment-input")?.focus()
    }

    const handleLike = (commentId: string) => {
        // Handle like logic
        console.log("Liked comment:", commentId)
    }

    const sortedComments = [...comments].sort((a, b) => {
        if (sortBy === "popular") {
            return b.likes - a.likes
        }
        return 0 // newest is default order
    })

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-mono">Comments</h2>
                        <p className="text-sm text-muted-foreground">{comments.length} thoughts from the community</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                    <div className="flex rounded-lg border border-border overflow-hidden bg-card">
                        <button
                            onClick={() => setSortBy("popular")}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium transition-colors",
                                sortBy === "popular" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                            )}
                        >
                            Popular
                        </button>
                        <button
                            onClick={() => setSortBy("newest")}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium transition-colors",
                                sortBy === "newest" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                            )}
                        >
                            Newest
                        </button>
                    </div>
                </div>
            </div>

            {/* Comment Input */}
            <Card className="p-4 border-2 border-primary/20 bg-gradient-to-br from-card to-card/80">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <textarea
                                id="comment-input"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts on this post..."
                                className="w-full min-h-[100px] px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {replyingTo && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg"
                        >
                            <Reply className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                                Replying to <span className="text-primary font-medium">comment</span>
                            </span>
                            <button
                                onClick={() => setReplyingTo(null)}
                                className="ml-auto text-muted-foreground hover:text-foreground"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Code className="h-3 w-3" />
                            <span>Markdown supported</span>
                        </div>
                        <Button
                            type="submit"
                            disabled={!newComment.trim() || isSubmitting}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Post Comment
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Comments List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {sortedComments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} onReply={handleReply} onLike={handleLike} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Load More */}
            {comments.length > 0 && (
                <div className="text-center pt-4">
                    <Button
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/10 hover:border-primary/30 bg-transparent"
                    >
                        Load More Comments
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {comments.length === 0 && (
                <Card className="p-12 text-center border-dashed border-2 border-border">
                    <div className="inline-flex p-4 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <MessageSquare className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold font-mono mb-2">No comments yet</h3>
                    <p className="text-muted-foreground">Be the first to share your thoughts on this post!</p>
                </Card>
            )}
        </div>
    )
}
