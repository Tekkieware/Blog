"use client"

import type React from "react"

import { motion } from "framer-motion"
import Link from "next/link"
import { FileText, MessageSquare, Search, Inbox, Archive, Zap, BookOpen, Code, Lightbulb } from "lucide-react"
import { Button } from "./ui-tailwind/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
    variant?:
    | "posts"
    | "comments"
    | "search"
    | "admin-posts"
    | "newsletter"
    title?: string
    description?: string
    icon?: React.ReactNode
    action?: {
        label: string
        href?: string
        onClick?: () => void
    }
    className?: string
    size?: "sm" | "md" | "lg"
}

const emptyStateConfigs = {
    posts: {
        title: "Nothing Here Yet",
        description: "We couldn't find any posts. check back later to get the latest engineering insights!",
        icon: FileText,
        color: "indigo",
        suggestions: ["Browse other layers for inspiration", "Check out the about page"],
    },
    comments: {
        title: "No Comments Yet",
        description: "Be the first to share your thoughts! Your comment could spark a great discussion.",
        icon: MessageSquare,
        color: "cyan",
        suggestions: ["Share your insights", "Ask a thoughtful question"],
    },
    search: {
        title: "Nothing Found",
        description: "We couldn't find any posts matching your search. Try adjusting your filters or keywords.",
        icon: Search,
        color: "orange",
        suggestions: ["Try a different search term", "Browse all posts instead"],
    },
    "admin-posts": {
        title: "No Posts Yet",
        description: "Create your first blog post to get started sharing your engineering insights.",
        icon: Code,
        color: "indigo",
        suggestions: ["Create a new post", "View documentation"],
    },
    newsletter: {
        title: "Build Your Audience",
        description: "No subscribers yet. Share your newsletter and grow your engineering community.",
        icon: Zap,
        color: "cyan",
        suggestions: ["Share the newsletter", "Write your first issue"],
    },
}

const colorConfig = {
    indigo: {
        bg: "bg-indigo-500/5",
        border: "border-indigo-500/20",
        text: "text-indigo-600 dark:text-indigo-400",
        badge: "bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
    },
    cyan: {
        bg: "bg-cyan-500/5",
        border: "border-cyan-500/20",
        text: "text-cyan-600 dark:text-cyan-400",
        badge: "bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400",
    },
    orange: {
        bg: "bg-orange-500/5",
        border: "border-orange-500/20",
        text: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400",
    },
    emerald: {
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        badge: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
    },
    pink: {
        bg: "bg-pink-500/5",
        border: "border-pink-500/20",
        text: "text-pink-600 dark:text-pink-400",
        badge: "bg-pink-500/10 border-pink-500/30 text-pink-600 dark:text-pink-400",
    },
    blue: {
        bg: "bg-blue-500/5",
        border: "border-blue-500/20",
        text: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
    },
}

const sizeConfig = {
    sm: {
        container: "py-12",
        icon: "h-12 w-12",
        title: "text-xl",
        description: "text-sm",
        badge: "text-xs",
    },
    md: {
        container: "py-16",
        icon: "h-16 w-16",
        title: "text-2xl",
        description: "text-base",
        badge: "text-sm",
    },
    lg: {
        container: "py-20 md:py-32",
        icon: "h-20 w-20",
        title: "text-3xl md:text-4xl",
        description: "text-lg",
        badge: "text-sm",
    },
}

export function EmptyState({
    variant = "posts",
    title,
    description,
    icon,
    action,
    className,
    size = "md",
}: EmptyStateProps) {
    const config = emptyStateConfigs[variant]
    const colors = colorConfig[config.color as keyof typeof colorConfig]
    const sizes = sizeConfig[size]
    const Icon = icon || config.icon

    const displayTitle = title || config.title
    const displayDescription = description || config.description

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("flex flex-col items-center justify-center text-center", sizes.container, className)}
        >
            {/* Animated background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, 10, 0],
                        opacity: [0.03, 0.05, 0.03],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    className={cn("h-32 w-32 rounded-full blur-3xl", colors.bg)}
                />
            </div>

            {/* Icon */}
            <motion.div
                animate={{
                    y: [0, -8, 0],
                }}
                transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className={cn("mb-6 rounded-full p-4 border-2", colors.bg, colors.border)}
            >
                <Icon className={cn(sizes.icon, colors.text)} strokeWidth={1.5} />
            </motion.div>

            {/* Title */}
            <h2 className={cn("font-mono font-bold mb-2", sizes.title)}>{displayTitle}</h2>

            {/* Description */}
            <p className={cn("text-muted-foreground max-w-md mb-8", sizes.description)}>{displayDescription}</p>

            {/* Action Button */}
            {action && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    {action.href ? (
                        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Link href={action.href}>{action.label}</Link>
                        </Button>
                    ) : (
                        <Button onClick={action.onClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
                            {action.label}
                        </Button>
                    )}
                </motion.div>
            )}

            {/* Suggestions */}
            {config.suggestions && config.suggestions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2 text-sm text-muted-foreground"
                >
                    <p className="font-medium text-foreground mb-3">Here's what you can do:</p>
                    <ul className="space-y-2">
                        {config.suggestions.map((suggestion, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className={cn("inline-block px-3 py-1.5 rounded-full border-2", colors.badge)}
                            >
                                {suggestion}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}

            {/* Additional Help */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 pt-8 border-t border-border text-xs text-muted-foreground"
            >
                <p>
                    Need help?{" "}
                    <Link href="/help" className="text-primary hover:underline font-medium">
                        Check our documentation
                    </Link>{" "}
                    or{" "}
                    <Link href="/contact" className="text-primary hover:underline font-medium">
                        reach out to support
                    </Link>
                    .
                </p>
            </motion.div>
        </motion.div>
    )
}

/**
 * Specific empty state components for common use cases
 */

export function NoPostsEmptyState({ className }: { className?: string }) {
    return (
        <EmptyState
            variant="posts"
            action={{
                label: "Create First Post",
                href: "/admin/posts/new",
            }}
            className={className}
        />
    )
}

export function NoCommentsEmptyState({ className }: { className?: string }) {
    return <EmptyState variant="comments" className={className} size="sm" />
}

export function SearchNotFoundEmptyState({
    query,
    className,
}: {
    query?: string
    className?: string
}) {
    return (
        <EmptyState
            variant="search"
            title={query ? `No results for "${query}"` : "Nothing Found"}
            description="We couldn't find any posts matching your search. Try adjusting your filters or keywords."
            className={className}
        />
    )
}


export function AdminNoPostsEmptyState({ className }: { className?: string }) {
    return (
        <EmptyState
            variant="admin-posts"
            action={{
                label: "Create New Post",
                href: "/admin/posts/new",
            }}
            className={className}
        />
    )
}

export function NoNewsletterSubscribersEmptyState({ className }: { className?: string }) {
    return (
        <EmptyState
            variant="newsletter"
            action={{
                label: "Share Newsletter",
                href: "/newsletter",
            }}
            className={className}
        />
    )
}
