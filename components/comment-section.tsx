"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "./ui-tailwind/card"
import { Button } from "./ui-tailwind/button"
import { Badge } from "./ui-tailwind/badge"
import { MessageSquare, Reply, MoreVertical, Flag, Edit, Trash2, Send, User, Heart, Code, Loader2, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { CommentForm } from "./comment-form"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { isAdminClient } from "@/lib/auth-client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Reply {
    _id: string
    content: string
    user: {
        email: string
        name: string
    }
    createdAt: string
    updatedAt: string
    contentUpdatedAt: string
}

interface Comment {
    _id: string
    postSlug: string
    content: string
    user: {
        email: string
        name: string
    }
    replies: Reply[]
    createdAt: string
    updatedAt: string
    contentUpdatedAt: string
}

interface CommentSectionProps {
    postSlug: string
    postAuthor?: string
    className?: string
}

// Reply Form Component
function ReplyForm({
    commentId,
    postAuthor,
    onReplyAdded,
    onCancel
}: {
    commentId: string
    postAuthor?: string
    onReplyAdded: () => void
    onCancel: () => void
}) {
    const { data: session } = useSession()
    const [content, setContent] = useState("")
    const [userName, setUserName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAdmin, setIsAdmin] = useState(() => isAdminClient()) // Initialize with current admin status
    const [isInitialized, setIsInitialized] = useState(false)

    // Check admin status and prefill if admin
    useEffect(() => {
        const checkAdmin = () => {
            const adminStatus = isAdminClient()
            setIsAdmin(adminStatus)

            // If admin, prefill with actual post author name + admin tag
            if (adminStatus && !userName) {
                const adminName = postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)"
                setUserName(adminName)
            }

            setIsInitialized(true)
        }

        checkAdmin()
    }, [])

    // Show loading state while checking admin status
    if (!isInitialized) {
        return (
            <Card className="p-4 mt-4 border-primary/20 bg-primary/5">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </Card>
        )
    }

    // Additional check - if no session and not admin, show signin prompt
    if (!session?.user?.email && !isAdmin) {
        return (
            <Card className="p-4 mt-4 border-primary/20 bg-primary/5">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3">
                        Please sign in to reply to this comment
                    </p>
                    <div className="flex gap-2 justify-center">
                        <Button asChild size="sm">
                            <a href="/signin">Sign In</a>
                        </Button>
                        <Button variant="outline" size="sm" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const submitToastId = toast.loading("Posting your comment...")

        if (!session?.user?.email && !isAdmin) {
            toast.error("Please sign in to reply", { id: submitToastId })
            return
        }

        if (!content.trim()) {
            toast.error("Please fill in your comment", { id: submitToastId })
            return
        }

        // Use userName if provided, otherwise use email (handle admin case)
        const userEmail = session?.user?.email || (isAdmin ? "reply@blog.io.tech" : "")
        const displayName = userName.trim() || userEmail?.split('@')[0] || "Anonymous"

        // For admin replies, use special handling
        const adminName = postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)"
        const isAdminReply = isAdmin && userName.trim() === adminName
        const replyUserName = isAdminReply ? adminName : displayName
        const replyEmail = isAdminReply ? "reply@blog.io.tech" : userEmail

        setIsSubmitting(true)

        try {
            const response = await fetch(`/api/comments/${commentId}/reply`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: content.trim(),
                    userName: replyUserName,
                    userEmail: replyEmail,
                    isAdmin: isAdminReply,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to post reply")
            }

            toast.success("Reply posted successfully!", { id: submitToastId })
            setContent("")
            onReplyAdded()
            onCancel()

        } catch (error) {
            console.error("Error posting reply:", error)
            toast.error(error instanceof Error ? error.message : "Failed to post reply", { id: submitToastId })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="p-3 sm:p-4 mt-4 border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <input
                            type="text"
                            placeholder={isAdmin ? "Post Author (Admin)" : "Your name (optional)"}
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={cn(
                                "px-3 py-2 border border-border rounded-md bg-background text-sm w-full",
                                isAdmin && userName === "Post Author" && "border-amber-300 bg-amber-50 dark:bg-amber-950/20"
                            )}
                            maxLength={50}
                        />
                        <p className="text-xs text-muted-foreground">
                            {isAdmin && userName.trim() === "Post Author" ? (
                                <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                    <Crown className="h-3 w-3" />
                                    As: Post Author (reply@blog.io.tech)
                                </span>
                            ) : userName.trim() ? (
                                `As: ${userName}`
                            ) : (
                                `As: ${session?.user?.email?.split('@')[0] || "Anonymous"}`
                            )}
                        </p>
                    </div>
                    <input
                        type="email"
                        value={isAdmin && userName === "Post Author" ? "reply@blog.io.tech" : session?.user?.email || ""}
                        disabled
                        className="px-3 py-2 border border-border rounded-md bg-muted text-sm"
                    />
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background resize-none text-sm"
                    required
                    maxLength={1000}
                />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="text-xs text-muted-foreground">{content.length}/1000</span>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={onCancel} className="flex-1 sm:flex-none">
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting || !content.trim()} className="flex-1 sm:flex-none">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-3 w-3" />
                                    Reply
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Card>
    )
}

// Reply Item Component
function ReplyItem({
    reply,
    commentId,
    onReplyUpdated,
}: {
    reply: Reply
    commentId: string
    onReplyUpdated: () => void
}) {
    const { data: session } = useSession()
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(reply.content)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isAdmin, setIsAdmin] = useState(() => isAdminClient()) // Check admin status
    const menuRef = useRef<HTMLDivElement>(null)

    const isCurrentUser = session?.user?.email === reply.user.email
    const canModify = isCurrentUser || (isAdmin && reply.user.email === "reply@blog.io.tech") // Admin can only edit their own admin comments

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [showMenu])

    // Check admin status
    useEffect(() => {
        setIsAdmin(isAdminClient())
    }, [])

    const handleEditClick = () => {
        setIsEditing(true)
        setEditContent(reply.content)
        setShowMenu(false)
    }

    const handleEditCancel = () => {
        setIsEditing(false)
        setEditContent(reply.content)
    }

    const handleEditSave = async () => {
        const saveToastId = toast.loading("Saving your reply...")
        if (!editContent.trim()) {
            toast.error("Reply cannot be empty", { id: saveToastId })
            return
        }

        if (editContent.trim() === reply.content) {
            setIsEditing(false)
            return
        }

        setIsUpdating(true)

        try {
            const response = await fetch(`/api/comments/${commentId}/reply/${reply._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: editContent.trim(),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to update reply")
            }

            toast.success("Reply updated successfully!", { id: saveToastId })
            setIsEditing(false)
            onReplyUpdated()

        } catch (error) {
            console.error("Error updating reply:", error)
            toast.error(error instanceof Error ? error.message : "Failed to update reply", { id: saveToastId })
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteClick = () => {
        setShowDeleteDialog(true)
        setShowMenu(false)
    }

    const handleConfirmDelete = async () => {
        const deleteToastId = toast.loading("Deleting your reply...")
        setIsDeleting(true)
        setShowDeleteDialog(false)

        try {
            const response = await fetch(`/api/comments/${commentId}/reply/${reply._id}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete reply")
            }

            toast.success("Reply deleted successfully!", { id: deleteToastId })
            onReplyUpdated()

        } catch (error) {
            console.error("Error deleting reply:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete reply", { id: deleteToastId })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Card className="p-3 sm:p-4 border-border">
                <div className="flex gap-2 sm:gap-3">
                    <div className="flex-shrink-0">
                        <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <User className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-medium text-foreground text-xs sm:text-sm">{reply.user.name}</span>
                            {isCurrentUser && (
                                <Badge variant="outline" className="text-xs px-1 py-0 border-primary/30 text-primary">
                                    You
                                </Badge>
                            )}
                            {reply.user.email === "reply@blog.io.tech" && (
                                <Badge
                                    variant="outline"
                                    className="text-xs px-1 py-0 border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400"
                                >
                                    <Crown className="h-3 w-3 mr-1" />
                                    Author
                                </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                            </span>
                            {reply.contentUpdatedAt && new Date(reply.contentUpdatedAt).getTime() > new Date(reply.createdAt).getTime() + 1000 && (
                                <span className="text-xs text-muted-foreground italic">(edited)</span>
                            )}

                            {/* Reply actions menu */}
                            {canModify && (
                                <div className="relative ml-auto" ref={menuRef}>
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                    >
                                        <MoreVertical className="h-3 w-3" />
                                    </button>

                                    <AnimatePresence>
                                        {showMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="absolute right-0 top-full mt-1 z-10 w-32 bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden"
                                            >
                                                <button
                                                    onClick={handleEditClick}
                                                    disabled={isUpdating || isDeleting}
                                                    className="w-full px-2 py-1.5 text-xs text-left hover:bg-muted flex items-center gap-2 transition-colors disabled:opacity-50"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={handleDeleteClick}
                                                    disabled={isUpdating || isDeleting}
                                                    className="w-full px-2 py-1.5 text-xs text-left hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors disabled:opacity-50"
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-3 w-3" />
                                                    )}
                                                    {isDeleting ? "Deleting..." : "Delete"}
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Reply content or edit form */}
                        {isEditing ? (
                            <div className="space-y-2">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full min-h-[60px] px-2 py-1.5 border border-border rounded-md bg-background resize-none text-xs sm:text-sm"
                                    maxLength={1000}
                                    placeholder="Edit your reply..."
                                />
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{editContent.length}/1000</span>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={handleEditCancel}
                                            disabled={isUpdating}
                                            className="text-xs h-7"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={handleEditSave}
                                            disabled={isUpdating || !editContent.trim()}
                                            className="text-xs h-7"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">{reply.content}</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Delete confirmation dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this reply? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Reply"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

function CommentItem({
    comment,
    postAuthor,
    onReply,
    onRefresh,
    level = 0,
}: {
    comment: Comment
    postAuthor?: string
    onReply: (commentId: string) => void
    onRefresh: () => void
    level?: number
}) {
    const { data: session } = useSession()
    const [showMenu, setShowMenu] = useState(false)
    const [isExpanded, setIsExpanded] = useState(true)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isAdmin, setIsAdmin] = useState(() => isAdminClient()) // Check admin status
    const menuRef = useRef<HTMLDivElement>(null)

    const isCurrentUser = session?.user?.email === comment.user.email
    const canModify = isCurrentUser || (isAdmin && comment.user.email === "reply@blog.io.tech") // Admin can only edit their own admin comments
    const formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false)
            }
        }

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }
    }, [showMenu])

    // Check admin status
    useEffect(() => {
        setIsAdmin(isAdminClient())
    }, [])

    const handleReplyClick = () => {
        if (!session && !isAdmin) {
            toast.error("Please sign in to reply")
            return
        }
        setShowReplyForm(true)
    }

    const handleReplyAdded = () => {
        onRefresh()
        setShowReplyForm(false)
    }

    const handleEditClick = () => {
        setIsEditing(true)
        setEditContent(comment.content)
        setShowMenu(false)
    }

    const handleEditCancel = () => {
        setIsEditing(false)
        setEditContent(comment.content)
    }

    const handleEditSave = async () => {
        const saveToastId = toast.loading("Saving your comment...")
        if (!editContent.trim()) {
            toast.error("Comment cannot be empty", { id: saveToastId })
            return
        }

        if (editContent.trim() === comment.content) {
            setIsEditing(false)
            return
        }

        setIsUpdating(true)

        try {
            const response = await fetch(`/api/comments/${comment._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: editContent.trim(),
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to update comment")
            }

            toast.success("Comment updated successfully!", { id: saveToastId })
            setIsEditing(false)
            onRefresh()

        } catch (error) {
            console.error("Error updating comment:", error)
            toast.error(error instanceof Error ? error.message : "Failed to update comment", { id: saveToastId })
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDeleteClick = () => {
        setShowDeleteDialog(true)
        setShowMenu(false)
    }

    const handleConfirmDelete = async () => {
        const deleteToastId = toast.loading("Deleting your comment...")
        setIsDeleting(true)
        setShowDeleteDialog(false)

        try {
            const response = await fetch(`/api/comments/${comment._id}`, {
                method: "DELETE",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to delete comment")
            }

            toast.success("Comment deleted successfully!", { id: deleteToastId })
            onRefresh()

        } catch (error) {
            console.error("Error deleting comment:", error)
            toast.error(error instanceof Error ? error.message : "Failed to delete comment", { id: deleteToastId })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("relative", level > 0 && "ml-4 sm:ml-8 md:ml-12")}
            >
                {/* Connection line for replies */}
                {level > 0 && (
                    <div className="absolute -left-4 sm:-left-8 md:-left-12 top-0 bottom-0 w-px bg-border">
                        <div className="absolute top-6 -left-2 w-3 sm:w-4 h-px bg-border" />
                    </div>
                )}

                <Card
                    className={cn(
                        "p-3 sm:p-4 border-border hover:border-primary/30 transition-colors",
                        isCurrentUser && "bg-primary/5 border-primary/20",
                    )}
                >
                    <div className="flex gap-2 sm:gap-3">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start gap-2 mb-2 flex-wrap">
                                <span className="font-medium text-foreground text-sm sm:text-base">{comment.user.name}</span>
                                {isCurrentUser && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs px-1.5 sm:px-2 py-0 border-primary/30 text-primary"
                                    >
                                        You
                                    </Badge>
                                )}
                                {comment.user.email === "reply@blog.io.tech" && (
                                    <Badge
                                        variant="outline"
                                        className="text-xs px-1.5 sm:px-2 py-0 border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400"
                                    >
                                        <Crown className="h-3 w-3 mr-1" />
                                        Author
                                    </Badge>
                                )}
                                <span className="text-xs sm:text-sm text-muted-foreground">{formattedDate}</span>
                                {comment.contentUpdatedAt && new Date(comment.contentUpdatedAt).getTime() > new Date(comment.createdAt).getTime() + 1000 && (
                                    <span className="text-xs text-muted-foreground italic">(edited)</span>
                                )}
                            </div>

                            {/* Comment text or edit form */}
                            {isEditing ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={editContent}
                                        onChange={(e) => setEditContent(e.target.value)}
                                        className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background resize-none text-sm"
                                        maxLength={2000}
                                        placeholder="Edit your comment..."
                                    />
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                        <span className="text-xs text-muted-foreground">{editContent.length}/2000</span>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleEditCancel}
                                                disabled={isUpdating}
                                                className="flex-1 sm:flex-none"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={handleEditSave}
                                                disabled={isUpdating || !editContent.trim()}
                                                className="flex-1 sm:flex-none"
                                            >
                                                {isUpdating ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm sm:text-base text-foreground mb-3 leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
                            )}

                            {/* Actions */}
                            {!isEditing && (
                                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                    {(session || isAdmin) ? (
                                        <button
                                            onClick={handleReplyClick}
                                            className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span>Reply</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => toast.info("Please sign in to reply to comments")}
                                            className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <Reply className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span>Sign in to Reply</span>
                                        </button>
                                    )}

                                    {comment.replies && comment.replies.length > 0 && (
                                        <button
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                                        >
                                            {isExpanded ? "Hide" : "Show"} {comment.replies.length}{" "}
                                            {comment.replies.length === 1 ? "reply" : "replies"}
                                        </button>
                                    )}

                                    <div className="relative ml-auto" ref={menuRef}>
                                        <button
                                            onClick={() => setShowMenu(!showMenu)}
                                            className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted"
                                        >
                                            <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                                        </button>

                                        <AnimatePresence>
                                            {showMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                    className="absolute right-0 top-full mt-1 z-10 w-36 sm:w-40 bg-card border-2 border-border rounded-lg shadow-lg overflow-hidden"
                                                >
                                                    <button className="w-full px-3 py-2 text-xs sm:text-sm text-left hover:bg-muted flex items-center gap-2 transition-colors">
                                                        <Flag className="h-3 w-3 sm:h-4 sm:w-4" />
                                                        Report
                                                    </button>
                                                    {canModify && (
                                                        <>
                                                            <button
                                                                onClick={handleEditClick}
                                                                disabled={isUpdating || isDeleting}
                                                                className="w-full px-3 py-2 text-xs sm:text-sm text-left hover:bg-muted flex items-center gap-2 transition-colors disabled:opacity-50"
                                                            >
                                                                <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={handleDeleteClick}
                                                                disabled={isUpdating || isDeleting}
                                                                className="w-full px-3 py-2 text-xs sm:text-sm text-left hover:bg-red-500/10 text-red-500 flex items-center gap-2 transition-colors disabled:opacity-50"
                                                            >
                                                                {isDeleting ? (
                                                                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                                )}
                                                                {isDeleting ? "Deleting..." : "Delete"}
                                                            </button>
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Reply Form */}
                {showReplyForm && (
                    <ReplyForm
                        commentId={comment._id}
                        postAuthor={postAuthor}
                        onReplyAdded={handleReplyAdded}
                        onCancel={() => setShowReplyForm(false)}
                    />
                )}

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
                                <div key={reply._id} className={cn("relative", "ml-4 sm:ml-8 md:ml-12")}>
                                    <div className="absolute -left-4 sm:-left-8 md:-left-12 top-0 bottom-0 w-px bg-border">
                                        <div className="absolute top-6 -left-2 w-3 sm:w-4 h-px bg-border" />
                                    </div>
                                    <ReplyItem
                                        reply={reply}
                                        commentId={comment._id}
                                        onReplyUpdated={onRefresh}
                                    />
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Delete confirmation dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="border-none">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action cannot be undone and will also delete all replies to this comment.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Comment"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export function CommentSection({ postSlug, postAuthor, className }: CommentSectionProps) {
    const { data: session } = useSession()
    const [comments, setComments] = useState<Comment[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ totalComments: 0, totalReplies: 0, totalInteractions: 0 })
    const [sortBy, setSortBy] = useState<"newest" | "popular">("newest")

    const fetchComments = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)

            if (!response.ok) {
                throw new Error('Failed to fetch comments')
            }

            const data = await response.json()
            setComments(data.comments || [])
            setStats(data.stats || { totalComments: 0, totalReplies: 0, totalInteractions: 0 })
        } catch (error) {
            console.error('Error fetching comments:', error)
            toast.error('Failed to load comments')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchComments()
    }, [postSlug])

    const handleCommentAdded = (newComment: Comment) => {
        setComments(prev => [newComment, ...prev])
        setStats(prev => ({
            totalComments: prev.totalComments + 1,
            totalReplies: prev.totalReplies,
            totalInteractions: prev.totalInteractions + 1
        }))
    }

    const handleReply = (commentId: string) => {
        // This is handled by the ReplyForm component
        console.log("Reply to comment:", commentId)
    }

    const sortedComments = [...comments].sort((a, b) => {
        if (sortBy === "popular") {
            // Sort by total engagement (replies count)
            const aEngagement = a.replies.length
            const bEngagement = b.replies.length
            return bEngagement - aEngagement
        }
        // Default: newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    if (loading) {
        return (
            <div className={cn("space-y-6", className)}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                            <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-mono">Comments</h2>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-4 bg-muted animate-pulse rounded" />
                                <span className="text-sm text-muted-foreground">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="p-4">
                            <div className="flex gap-3">
                                <div className="w-10 h-10 bg-muted animate-pulse rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="w-32 h-4 bg-muted animate-pulse rounded" />
                                    <div className="w-full h-16 bg-muted animate-pulse rounded" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                        <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold font-mono">Comments</h2>
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-muted-foreground">
                                {stats.totalInteractions} {stats.totalInteractions === 1 ? 'interaction' : 'interactions'} from the community
                            </p>
                            {session?.user ? (
                                <Badge variant="secondary" className="text-xs">
                                    <User className="h-3 w-3 mr-1" />
                                    Signed in
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-300">
                                    Sign in to comment
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>

                {comments.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                        <div className="flex rounded-lg border border-border overflow-hidden bg-card w-full sm:w-auto">
                            <button
                                onClick={() => setSortBy("newest")}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium transition-colors flex-1 sm:flex-none",
                                    sortBy === "newest" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                )}
                            >
                                Newest
                            </button>
                            <button
                                onClick={() => setSortBy("popular")}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium transition-colors flex-1 sm:flex-none",
                                    sortBy === "popular" ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                )}
                            >
                                Popular
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Comment Form */}
            <CommentForm
                postSlug={postSlug}
                postAuthor={postAuthor}
                onCommentAdded={handleCommentAdded}
                placeholder="Share your thoughts on this post..."
                buttonText="Post Comment"
            />

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="space-y-4">
                    <AnimatePresence>
                        {sortedComments.map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                postAuthor={postAuthor}
                                onReply={handleReply}
                                onRefresh={fetchComments}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
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
