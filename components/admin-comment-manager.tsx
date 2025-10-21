"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui-tailwind/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui-tailwind/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { MessageSquare, Trash2, Reply, Send, User, Crown, Loader2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Comment {
    _id: string
    content: string
    createdAt: string
    contentUpdatedAt?: string
    user: {
        name: string
        email: string
    }
    replies: Reply[]
}

interface Reply {
    _id: string
    content: string
    createdAt: string
    contentUpdatedAt?: string
    user: {
        name: string
        email: string
    }
}

interface AdminCommentManagerProps {
    isOpen: boolean
    onClose: () => void
    postSlug: string
}

export function AdminCommentManager({ isOpen, onClose, postSlug }: AdminCommentManagerProps) {
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(false)
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState("")
    const [replyName, setReplyName] = useState("Post Author")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingComment, setDeletingComment] = useState<string | null>(null)
    const [deletingReply, setDeletingReply] = useState<string | null>(null)

    useEffect(() => {
        if (isOpen && postSlug) {
            fetchComments()
        }
    }, [isOpen, postSlug])

    const fetchComments = async () => {
        if (!postSlug) return

        setLoading(true)
        try {
            const response = await fetch(`/api/admin/comments?postSlug=${encodeURIComponent(postSlug)}`)
            const data = await response.json()

            if (response.ok) {
                setComments(data.comments || [])
            } else {
                toast.error(data.error || "Failed to fetch comments")
            }
        } catch (error) {
            console.error("Error fetching comments:", error)
            toast.error("Failed to fetch comments")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteComment = async (commentId: string) => {
        setDeletingComment(commentId)
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                toast.success("Comment deleted successfully")
                fetchComments() // Refresh the comments
            } else {
                const data = await response.json()
                toast.error(data.error || "Failed to delete comment")
            }
        } catch (error) {
            console.error("Error deleting comment:", error)
            toast.error("Failed to delete comment")
        } finally {
            setDeletingComment(null)
        }
    }

    const handleDeleteReply = async (commentId: string, replyId: string) => {
        setDeletingReply(replyId)
        try {
            const response = await fetch(`/api/comments/${commentId}/reply/${replyId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                toast.success("Reply deleted successfully")
                fetchComments() // Refresh the comments
            } else {
                const data = await response.json()
                toast.error(data.error || "Failed to delete reply")
            }
        } catch (error) {
            console.error("Error deleting reply:", error)
            toast.error("Failed to delete reply")
        } finally {
            setDeletingReply(null)
        }
    }

    const handleReplySubmit = async (commentId: string) => {
        if (!replyContent.trim()) {
            toast.error("Please enter a reply")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/comments/${commentId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: replyContent.trim(),
                    userName: replyName.trim() || "Post Author",
                    userEmail: "reply@blog.isaiahozadhe.tech",
                    isAdmin: true
                })
            })

            if (response.ok) {
                toast.success("Reply posted successfully")
                setReplyContent("")
                setReplyingTo(null)
                fetchComments() // Refresh the comments
            } else {
                const data = await response.json()
                toast.error(data.error || "Failed to post reply")
            }
        } catch (error) {
            console.error("Error posting reply:", error)
            toast.error("Failed to post reply")
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatDate = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true })
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-full sm:max-w-2xl border-none">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Comment Management
                    </SheetTitle>
                    <SheetDescription>
                        Manage comments for this post. Delete inappropriate comments or reply as the post author.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    {loading ? (
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <div className="space-y-4">
                                {/* Comment Skeleton Loader */}
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <Card key={index} className="border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Skeleton className="h-8 w-8 rounded-full" />
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="h-4 w-20" />
                                                            <Skeleton className="h-4 w-12 rounded-full" />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="h-3 w-3 rounded-full" />
                                                            <Skeleton className="h-3 w-24" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Skeleton className="h-7 w-16" />
                                                    <Skeleton className="h-7 w-7" />
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="space-y-2 mb-3">
                                                <Skeleton className="h-4 w-full" />
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>

                                            {/* Reply Skeleton (for some comments) */}
                                            {index < 2 && (
                                                <div className="mt-4 space-y-3">
                                                    <Separator />
                                                    <Skeleton className="h-3 w-16" />
                                                    <Card className="ml-4 bg-muted/20">
                                                        <CardContent className="p-3">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Skeleton className="h-6 w-6 rounded-full" />
                                                                    <div className="space-y-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <Skeleton className="h-3 w-16" />
                                                                            <Skeleton className="h-3 w-10 rounded-full" />
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Skeleton className="h-3 w-3 rounded-full" />
                                                                            <Skeleton className="h-3 w-20" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Skeleton className="h-6 w-6" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Skeleton className="h-3 w-full" />
                                                                <Skeleton className="h-3 w-2/3" />
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No comments found for this post.</p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <Card key={comment._id} className="border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                        {comment.user.email === "reply@blog.isaiahozadhe.tech" ? (
                                                            <Crown className="h-4 w-4 text-amber-600" />
                                                        ) : (
                                                            <User className="h-4 w-4 text-primary" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium text-sm">{comment.user.name}</span>
                                                            {comment.user.email === "reply@blog.isaiahozadhe.tech" && (
                                                                <Badge variant="outline" className="text-xs border-amber-300 text-amber-600">
                                                                    <Crown className="h-3 w-3 mr-1" />
                                                                    Author
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            {formatDate(comment.createdAt)}
                                                            {comment.contentUpdatedAt && new Date(comment.contentUpdatedAt).getTime() > new Date(comment.createdAt).getTime() + 1000 && (
                                                                <span className="italic">(edited)</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs"
                                                        onClick={() => setReplyingTo(comment._id)}
                                                    >
                                                        <Reply className="h-3 w-3 mr-1" />
                                                        Reply
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-7 px-2 text-xs border-red-500/20 hover:bg-red-500/10"
                                                                disabled={deletingComment === comment._id}
                                                            >
                                                                {deletingComment === comment._id ? (
                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                                )}
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this comment? This action cannot be undone and will also delete all replies.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeleteComment(comment._id)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words mb-3">
                                                {comment.content}
                                            </p>

                                            {/* Reply Form */}
                                            {replyingTo === comment._id && (
                                                <Card className="bg-muted/30 border-primary/20">
                                                    <CardContent className="p-4 space-y-3">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <Label htmlFor="replyName" className="text-xs">Name</Label>
                                                                <Input
                                                                    id="replyName"
                                                                    value={replyName}
                                                                    onChange={(e) => setReplyName(e.target.value)}
                                                                    className="h-8 text-sm"
                                                                    placeholder="Post Author"
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs">Email</Label>
                                                                <Input
                                                                    value="reply@blog.isaiahozadhe.tech"
                                                                    disabled
                                                                    className="h-8 text-sm bg-muted"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="replyContent" className="text-xs">Reply</Label>
                                                            <Textarea
                                                                id="replyContent"
                                                                value={replyContent}
                                                                onChange={(e) => setReplyContent(e.target.value)}
                                                                placeholder="Write your reply..."
                                                                className="min-h-[80px] text-sm resize-none"
                                                            />
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setReplyingTo(null)
                                                                    setReplyContent("")
                                                                }}
                                                                disabled={isSubmitting}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleReplySubmit(comment._id)}
                                                                disabled={isSubmitting || !replyContent.trim()}
                                                            >
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                                        Posting...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Send className="h-3 w-3 mr-1" />
                                                                        Post Reply
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Replies */}
                                            {comment.replies && comment.replies.length > 0 && (
                                                <div className="mt-4 space-y-3">
                                                    <Separator />
                                                    <div className="text-xs font-medium text-muted-foreground">
                                                        {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                                                    </div>
                                                    {comment.replies.map((reply) => (
                                                        <Card key={reply._id} className="ml-4 bg-muted/20">
                                                            <CardContent className="p-3">
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-6 w-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                                                            {reply.user.email === "reply@blog.isaiahozadhe.tech" ? (
                                                                                <Crown className="h-3 w-3 text-amber-600" />
                                                                            ) : (
                                                                                <User className="h-3 w-3 text-primary" />
                                                                            )}
                                                                        </div>
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium text-xs">{reply.user.name}</span>
                                                                                {reply.user.email === "reply@blog.isaiahozadhe.tech" && (
                                                                                    <Badge variant="outline" className="text-xs border-amber-300 text-amber-600">
                                                                                        <Crown className="h-3 w-3 mr-1" />
                                                                                        Author
                                                                                    </Badge>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                                                <Clock className="h-3 w-3" />
                                                                                {formatDate(reply.createdAt)}
                                                                                {reply.contentUpdatedAt && new Date(reply.contentUpdatedAt).getTime() > new Date(reply.createdAt).getTime() + 1000 && (
                                                                                    <span className="italic">(edited)</span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-6 px-2 text-xs border-red-500/20 hover:bg-red-500/10"
                                                                                disabled={deletingReply === reply._id}
                                                                            >
                                                                                {deletingReply === reply._id ? (
                                                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                                                ) : (
                                                                                    <Trash2 className="h-3 w-3 text-red-500" />
                                                                                )}
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Are you sure you want to delete this reply? This action cannot be undone.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => handleDeleteReply(comment._id, reply._id)}
                                                                                    className="bg-red-600 hover:bg-red-700"
                                                                                >
                                                                                    Delete
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                </div>
                                                                <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                                                                    {reply.content}
                                                                </p>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}