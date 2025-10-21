"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui-tailwind/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Loader2, Send, Crown } from "lucide-react"
import { toast } from "sonner"
import { isAdminClient } from "@/lib/auth-client"

interface CommentFormProps {
    postSlug: string
    postAuthor?: string
    onCommentAdded?: (comment: any) => void
    placeholder?: string
    buttonText?: string
}

export function CommentForm({
    postSlug,
    postAuthor,
    onCommentAdded,
    placeholder = "Share your thoughts on this post...",
    buttonText = "Post Comment"
}: CommentFormProps) {
    const { data: session, status } = useSession()
    const [content, setContent] = useState("")
    const [userName, setUserName] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isAdmin, setIsAdmin] = useState(() => isAdminClient()) // Initialize with current admin status
    const [isInitialized, setIsInitialized] = useState(false)

    // Check admin status on mount and when session changes
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
    }, [session])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session?.user?.email && !isAdmin) {
            toast.error("Please sign in to comment")
            return
        }

        if (!content.trim()) {
            toast.error("Please enter a comment")
            return
        }

        // Use userName if provided, otherwise use email (handle admin case)
        const userEmail = session?.user?.email || (isAdmin ? "admin@blog.isaiahozadhe.tech" : "")
        const displayName = userName.trim() || userEmail?.split('@')[0] || "Anonymous"

        // For admin comments, use special handling
        const adminName = postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)"
        const isAdminComment = isAdmin && userName.trim() === adminName
        const commentUserName = isAdminComment ? adminName : displayName
        const commentEmail = isAdminComment ? "admin@blog.isaiahozadhe.tech" : userEmail

        setIsSubmitting(true)

        try {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postSlug,
                    content: content.trim(),
                    userName: commentUserName,
                    userEmail: commentEmail,
                    isAdmin: isAdminComment,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to post comment")
            }

            toast.success("Comment posted successfully!")
            setContent("")
            // Keep the name for future comments in the same session

            if (onCommentAdded) {
                onCommentAdded(data.comment)
            }

        } catch (error) {
            console.error("Error posting comment:", error)
            toast.error(error instanceof Error ? error.message : "Failed to post comment")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (status === "loading" || !isInitialized) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!session && !isAdmin) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {buttonText}
                        {isAdmin && (
                            <span className="ml-auto flex items-center gap-1 text-sm font-normal text-amber-600 dark:text-amber-400">
                                <Crown className="h-4 w-4" />
                                Admin Mode
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-4">
                        Sign in to share your thoughts and engage with the community.
                    </p>
                    <Button asChild variant="default">
                        <a href="/signin">Sign In to Comment</a>
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {buttonText}
                    {isAdmin && (
                        <span className="ml-auto flex items-center gap-1 text-sm font-normal text-amber-600 dark:text-amber-400">
                            <Crown className="h-4 w-4" />
                            Admin Mode
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="userName">Your Name (Optional)</Label>
                            <Input
                                id="userName"
                                type="text"
                                placeholder={isAdmin ? (postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)") : "Enter your name or leave blank to use email"}
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                maxLength={50}
                                disabled={isSubmitting}
                                className={isAdmin && userName === (postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)") ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20" : ""}
                            />
                            <p className="text-xs text-muted-foreground">
                                {isAdmin && userName.trim() === (postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)") ? (
                                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                        <Crown className="h-3 w-3" />
                                        Will post as: {postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)"} (admin@blog.isaiahozadhe.tech)
                                    </span>
                                ) : userName.trim() ? (
                                    `Will display as: ${userName}`
                                ) : (
                                    `Will display as: ${session?.user?.email?.split('@')[0] || (isAdmin ? "Post Author" : "Anonymous")}`
                                )}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={isAdmin && userName === (postAuthor ? `${postAuthor} (Admin)` : "Post Author (Admin)") ? "admin@blog.isaiahozadhe.tech" : (session?.user?.email || "")}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Comment</Label>
                        <Textarea
                            id="content"
                            placeholder={placeholder}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            maxLength={2000}
                            rows={4}
                            disabled={isSubmitting}
                            className="resize-none"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Max 2000 characters</span>
                            <span>{content.length}/2000</span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting || !content.trim()}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    {buttonText}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}