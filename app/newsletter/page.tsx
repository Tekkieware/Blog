
"use client"

import { NewsletterSubscribe } from "@/components/newsletter-subscribe"
import { Card } from "@/components/ui-tailwind/card"
import { Mail, Zap, BookOpen, Users, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function NewsletterPage() {
    const [subscriberCount, setSubscriberCount] = useState<number>(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubscriberCount = async () => {
            try {
                const response = await fetch('/api/newsletter/count')
                const data = await response.json()
                if (data.success) {
                    setSubscriberCount(data.count)
                }
            } catch (error) {
                console.error('Failed to fetch subscriber count:', error)
                // Fallback to a default number if API fails
                setSubscriberCount(1000)
            } finally {
                setLoading(false)
            }
        }

        fetchSubscriberCount()
    }, [])

    const formatCount = (count: number) => {
        if (count >= 10000) {
            return `${Math.floor(count / 1000)}K+`
        } else if (count >= 1000) {
            return `${Math.floor(count / 100) * 100}+`
        } else if (count >= 100) {
            return `${Math.floor(count / 50) * 50}+`
        } else if (count > 0) {
            return `${count}+`
        } else {
            return null // Return null for 0 count to show different message
        }
    }

    const getSubscriberMessage = (count: number, loading: boolean) => {
        if (loading) {
            return (
                <>
                    Join over <span className="inline-block w-12 h-4 bg-muted animate-pulse rounded" /> engineers receiving weekly insights
                </>
            )
        }

        if (count === 0) {
            return "Join other engineers receiving weekly insights"
        }

        return (
            <>
                Join over <span className="font-semibold text-primary">{formatCount(count)}</span> engineers receiving weekly insights
            </>
        )
    }
    return (
        <div className="container py-12">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-2xl md:text-4xl font-bold font-mono">
                        <span className="text-primary">&gt;</span> Newsletter
                    </h1>
                    <p className="text-md lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Be among the early birds, get key insights on system design, architecture patterns, and engineering
                        leadership.
                    </p>
                </div>

                {/* Newsletter Subscription */}
                <NewsletterSubscribe />

                {/* What You'll Get */}
                <div className="space-y-6">
                    <h2 className=" text-xl md:text-2xl font-bold font-mono text-center">What You'll Get</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6 border-2 border-primary/20 hover:border-primary/40 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono font-bold text-lg">Regular Insights</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Deep dives into real-world engineering challenges and solutions, delivered regularly.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-2 border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-cyan-400/10 border border-cyan-400/20">
                                    <BookOpen className="h-6 w-6 text-cyan-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono font-bold text-lg">Exclusive Content</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Early access to new posts, case studies, and architectural breakdowns not available on the blog.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-2 border-emerald-400/20 hover:border-emerald-400/40 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                                    <Users className="h-6 w-6 text-emerald-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono font-bold text-lg">Community Access</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Join a community of engineers sharing knowledge and experiences.
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 border-2 border-orange-400/20 hover:border-orange-400/40 transition-colors">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-orange-400/10 border border-orange-400/20">
                                    <TrendingUp className="h-6 w-6 text-orange-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-mono font-bold text-lg">Career Growth</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tips and strategies for advancing your engineering career and leadership skills.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
                {/* Final CTA */}
                <div className="text-center space-y-4 pt-8">
                    <h2 className="text-xl md:text-2xl font-bold font-mono">Ready to Level Up?</h2>
                    <p className="text-muted-foreground">
                        {getSubscriberMessage(subscriberCount, loading)}
                    </p>
                    <div className="flex justify-center">
                        <NewsletterSubscribe variant="inline" className="max-w-md" />
                    </div>
                </div>
            </div>
        </div>
    )
}
