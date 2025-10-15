"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Share2, Link2, Check, Facebook, Linkedin, Mail, MessageCircle, Send } from "lucide-react"
import { Button } from "./ui-tailwind/button"
import { Card } from "./ui-tailwind/card"
import { cn } from "@/lib/utils"

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    url: string
    description?: string
}

interface SocialPlatform {
    name: string
    icon: React.ReactNode
    color: string
    shareUrl: (url: string, title: string, description?: string) => string
}

export function ShareModal({ isOpen, onClose, title, url, description = "" }: ShareModalProps) {
    const [copied, setCopied] = useState(false)
    const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)

    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url

    const socialPlatforms: SocialPlatform[] = [
        {
            name: "X (Twitter)",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            ),
            color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
            shareUrl: (url, title) =>
                `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="h-5 w-5" />,
            color: "hover:bg-[#0A66C2] hover:text-white",
            shareUrl: (url, title) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        },
        {
            name: "Facebook",
            icon: <Facebook className="h-5 w-5" />,
            color: "hover:bg-[#1877F2] hover:text-white",
            shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        },
        {
            name: "Reddit",
            icon: (
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                </svg>
            ),
            color: "hover:bg-[#FF4500] hover:text-white",
            shareUrl: (url, title) =>
                `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
        },
        {
            name: "WhatsApp",
            icon: <MessageCircle className="h-5 w-5" />,
            color: "hover:bg-[#25D366] hover:text-white",
            shareUrl: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
        },
        {
            name: "Telegram",
            icon: <Send className="h-5 w-5" />,
            color: "hover:bg-[#0088cc] hover:text-white",
            shareUrl: (url, title) =>
                `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        },
        {
            name: "Email",
            icon: <Mail className="h-5 w-5" />,
            color: "hover:bg-primary hover:text-primary-foreground",
            shareUrl: (url, title, description) =>
                `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + "\n\n" + url)}`,
        },
    ]

    const handleShare = (platform: SocialPlatform) => {
        const shareUrl = platform.shareUrl(fullUrl, title, description)
        window.open(shareUrl, "_blank", "width=600,height=400")
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(fullUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: fullUrl,
                })
            } catch (err) {
                console.error("Error sharing:", err)
            }
        }
    }

    const supportsNativeShare = typeof navigator !== "undefined" && navigator.share

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg"
                        >
                            <Card className="relative border-none bg-card shadow-2xl overflow-hidden">
                                {/* Animated background */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute inset-0 bg-grid-pattern" />
                                </div>

                                {/* Header */}
                                <div className="relative border-b border-border p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                                                <Share2 className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold font-mono">Share Post</h2>
                                                <p className="text-sm text-muted-foreground">Spread the knowledge</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="relative p-6 space-y-6">
                                    {/* Post Preview */}
                                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                                        <h3 className="font-medium text-sm line-clamp-2 mb-1">{title}</h3>
                                        {description && <p className="text-xs text-muted-foreground line-clamp-1">{description}</p>}
                                    </div>

                                    {/* Social Platforms */}
                                    <div>
                                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Share to social media</h3>
                                        <div className="grid grid-cols-4 gap-3">
                                            {socialPlatforms.map((platform) => (
                                                <motion.button
                                                    key={platform.name}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => handleShare(platform)}
                                                    onMouseEnter={() => setHoveredPlatform(platform.name)}
                                                    onMouseLeave={() => setHoveredPlatform(null)}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg",
                                                        "border-2 border-border bg-card transition-all duration-200",
                                                        platform.color,
                                                        "hover:border-transparent hover:shadow-lg",
                                                    )}
                                                    title={platform.name}
                                                >
                                                    <div className="transition-transform duration-200">{platform.icon}</div>
                                                    <span className="text-xs font-medium">{platform.name.split(" ")[0]}</span>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Native Share (Mobile) */}
                                    {supportsNativeShare && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <Button
                                                onClick={handleNativeShare}
                                                variant="outline"
                                                className="w-full border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/30 bg-transparent"
                                            >
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Share via...
                                            </Button>
                                        </motion.div>
                                    )}

                                    {/* Copy Link */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <h3 className="text-sm font-medium mb-3 text-muted-foreground">Or copy link</h3>
                                        <div className="flex gap-2">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="text"
                                                    value={fullUrl}
                                                    readOnly
                                                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-border bg-muted/50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    <Link2 className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            </div>
                                            <Button
                                                onClick={handleCopyLink}
                                                className={cn(
                                                    "px-6 transition-all duration-200",
                                                    copied
                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                                                        : "bg-primary text-primary-foreground hover:bg-primary/90",
                                                )}
                                            >
                                                <AnimatePresence mode="wait">
                                                    {copied ? (
                                                        <motion.div
                                                            key="check"
                                                            initial={{ scale: 0, rotate: -180 }}
                                                            animate={{ scale: 1, rotate: 0 }}
                                                            exit={{ scale: 0, rotate: 180 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                            <span>Copied!</span>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                                            Copy
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Footer hint */}
                                <div className="relative border-t border-border px-6 py-3 bg-muted/30">
                                    <p className="text-xs text-center text-muted-foreground">
                                        💡 <span className="font-medium">Pro tip:</span> Share to help other engineers level up
                                    </p>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
