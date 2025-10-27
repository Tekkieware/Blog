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
    icon?: React.ElementType
    className?: string
    size?: "sm" | "md" | "lg"
}

const emptyStateConfigs = {
    posts: {
        title: "Nothing Here Yet",
        description: "We couldn't find any posts. check back later to get the latest engineering insights!",
        icon: FileText,
        color: "indigo",
    },
    comments: {
        title: "No Comments Yet",
        description: "Be the first to share your thoughts! Your comment could spark a great discussion.",
        icon: MessageSquare,
        color: "cyan",
    },
    search: {
        title: "Nothing Found",
        description: "We couldn't find any posts matching your search. Try adjusting your filters or keywords.",
        icon: Search,
        color: "orange"
    },
    "admin-posts": {
        title: "No Posts Yet",
        description: "Create your first blog post to get started sharing your engineering insights.",
        icon: Code,
        color: "indigo"
    },
    newsletter: {
        title: "Build Your Audience",
        description: "No subscribers yet. Share your newsletter and grow your engineering community.",
        icon: Zap,
        color: "cyan"
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
            className={className}
        />
    )
}

export function NoNewsletterSubscribersEmptyState({ className }: { className?: string }) {
    return (
        <EmptyState
            variant="newsletter"
            className={className}
        />
    )
}
