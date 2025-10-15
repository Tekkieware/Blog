"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui-tailwind/button"
import { Card } from "./ui-tailwind/card"
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface NewsletterSubscribeProps {
    variant?: "default" | "compact" | "inline"
    className?: string
}

export function NewsletterSubscribe({ variant = "default", className }: NewsletterSubscribeProps) {
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMessage, setErrorMessage] = useState("")

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setStatus("error");
        setErrorMessage("Please enter a valid email address");
        return;
    }

    try {
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            setStatus("success");
            setEmail("");
            setTimeout(() => setStatus("idle"), 3000);
        } else {
            const data = await response.json();
            setErrorMessage(data.message || "Something went wrong");
            setStatus("error");
        }
    } catch (error) {
        setErrorMessage("Failed to subscribe. Please try again later.");
        setStatus("error");
    }
};

    if (variant === "compact") {
        return (
            <Card className={cn("p-6 border-2 border-primary/20 bg-gradient-to-br from-card to-card/80", className)}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-full bg-primary/10 border border-primary/20">
                        <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-mono font-bold text-lg">Stay in the Loop</h3>
                        <p className="text-sm text-muted-foreground">Get engineering insights delivered</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        disabled={status === "loading" || status === "success"}
                        className={cn(
                            "w-full px-4 py-2 rounded-md border bg-background text-foreground text-sm",
                            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            status === "error" && "border-red-500/50 focus:ring-red-500/50",
                        )}
                    />

                    <AnimatePresence mode="wait">
                        {status === "success" ? (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-2 text-emerald-500 text-sm"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Thanks for subscribing!</span>
                            </motion.div>
                        ) : status === "error" ? (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-2 text-red-500 text-sm"
                            >
                                <AlertCircle className="h-4 w-4" />
                                <span>{errorMessage}</span>
                            </motion.div>
                        ) : (
                            <Button
                                type="submit"
                                disabled={status === "loading"}
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {status === "loading" ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                        Subscribing...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Subscribe
                                    </>
                                )}
                            </Button>
                        )}
                    </AnimatePresence>
                </form>
            </Card>
        )
    }

    if (variant === "inline") {
        return (
            <div className={cn("relative", className)}>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            disabled={status === "loading" || status === "success"}
                            className={cn(
                                "w-full pl-10 pr-4 py-2 rounded-md border bg-background text-foreground",
                                "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                                "disabled:opacity-50 disabled:cursor-not-allowed",
                                status === "error" && "border-red-500/50 focus:ring-red-500/50",
                            )}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {status === "loading" ? (
                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : status === "success" ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>

                <AnimatePresence>
                    {status === "error" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full mt-2 text-red-500 text-sm flex items-center gap-1"
                        >
                            <AlertCircle className="h-3 w-3" />
                            <span>{errorMessage}</span>
                        </motion.div>
                    )}
                    {status === "success" && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full mt-2 text-emerald-500 text-sm flex items-center gap-1"
                        >
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Successfully subscribed!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Default variant
    return (
        <Card
            className={cn(
                "relative overflow-hidden border-2 border-primary/20",
                "bg-gradient-to-br from-primary/5 via-card to-secondary/5",
                className,
            )}
        >
            {/* Animated background effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-grid-pattern" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            <div className="relative p-8 md:p-12">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex p-4 rounded-full bg-primary/10 border-2 border-primary/20"
                    >
                        <Mail className="h-8 w-8 text-primary" />
                    </motion.div>

                    {/* Heading */}
                    <div className="space-y-2">
                        <h2 className="font-mono text-2xl md:text-3xl font-bold">
                            <span className="text-primary">&gt;</span> Join Us
                        </h2>
                        <p className="text-md md:text-lg text-muted-foreground max-w-xl mx-auto">
                            Get regular engineering insights, architectural patterns, and senior-level perspectives delivered straight
                            to your inbox.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your.email@company.com"
                                disabled={status === "loading" || status === "success"}
                                className={cn(
                                    "w-full px-6 py-4 rounded-lg border-2 bg-background text-foreground",
                                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    "font-mono text-sm",
                                    status === "error" && "border-red-500/50 focus:ring-red-500/50",
                                )}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {status === "success" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center justify-center gap-2 py-4 text-emerald-500"
                                >
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-medium">You're on the list! Check your inbox.</span>
                                </motion.div>
                            ) : status === "error" ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="flex items-center justify-center gap-2 py-4 text-red-500"
                                >
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="font-medium">{errorMessage}</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <Button
                                        type="submit"
                                        disabled={status === "loading"}
                                        size="lg"
                                        className="w-full bg-primary text-wrap text-primary-foreground hover:bg-primary/90 font-mono text-base"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" />
                                                Subscribe to Newsletter
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-border/50">
                        {[
                            { icon: "📰", text: "Regular insights" },
                            { icon: "🛡️", text: "No spam, ever" },
                            { icon: "💨", text: "Unsubscribe anytime" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center justify-center gap-1 text-sm text-muted-foreground"
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    )
}
