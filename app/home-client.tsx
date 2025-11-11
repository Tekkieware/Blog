"use client"

import Link from "next/link"
import { LayerNavigator } from "@/components/layer-navigator"
import { ArrowRight, Pause, Play } from "lucide-react"
import { FeaturedMarquee } from "@/components/featured-marquee"
import { Button } from "@/components/ui-tailwind/button"
import { useEffect, useState } from "react"
import { NewsletterSubscribe } from "@/components/newsletter-subscribe"
import { NoPostsEmptyState } from "@/components/empty-state"
import { IPost } from "@/models/post";
import { FeaturedMarqueeSkeleton } from "@/components/featured-marquee-skeleton";


export default function HomeClient() {
    const [isPaused, setIsPaused] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState<number>(0)
    const [subscriberLoading, setSubscriberLoading] = useState(true)
    const [posts, setPosts] = useState<IPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);

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
                setSubscriberCount(1000) // Fallback
            } finally {
                setSubscriberLoading(false)
            }
        }

        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts?limit=10');
                const data = await response.json();
                // API returns posts array directly when includeCount is not specified
                setPosts(Array.isArray(data) ? data : (data.posts || []));
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setPostsLoading(false);
            }
        };

        fetchSubscriberCount()
        fetchPosts();
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

    const toggleMarquee = () => {
        // @ts-ignore
        if (window.toggleMarqueePause) {
            // @ts-ignore
            window.toggleMarqueePause()
            setIsPaused(!isPaused)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center min-h-[90vh] w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    {/* Enhanced animated background */}
                    <div className="animated-grid dark:opacity-100 opacity-30"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background"></div>
                </div>

                <div className="container relative z-10 flex flex-col items-center text-center space-y-8">
                    <div className="space-y-6">
                        {/* Removed terminal-text class to remove the blinking cursor */}
                        <h1 className="font-mono text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                            ISAIAH OZADHE &gt;&gt; A PEEK INTO A SOFTWARE ENGINEER'S MIND...
                        </h1>

                        <p className="text-muted-foreground md:text-xl">
                            A collection of thoughts, patterns, and insights.
                        </p>
                    </div>

                    {/* Featured Articles Marquee */}
                    <div className="w-full max-w-5xl">
                        {postsLoading ? (
                            <FeaturedMarqueeSkeleton />
                        ) : posts.length > 0 ? (
                            <FeaturedMarquee posts={posts} />
                        ) : (
                            <NoPostsEmptyState />
                        )}
                    </div>
                </div>
            </section>

            {/* Layer Navigator Section */}
            <section className="py-16 bg-background">
                <div className="container">
                    <div className="flex items-center mb-8">
                        <div className="h-px flex-1 bg-border"></div>
                        <h2 className="text-3xl font-bold font-mono px-4">Layers</h2>
                        <div className="h-px flex-1 bg-border"></div>
                    </div>
                    <LayerNavigator />
                </div>
            </section>
            {/* Newletter Subscription section */}
            <section className="py-16 bg-background">
                <div className="container">
                    <div className="flex items-center mb-8">
                        <div className="h-px flex-1 bg-border"></div>
                    </div>
                    <div className="text-center space-y-4 pt-8">
                        <h2 className="text-xl md:text-2xl font-bold font-mono">Ready to Level Up?</h2>
                        <p className="text-muted-foreground">
                            {getSubscriberMessage(subscriberCount, subscriberLoading)}
                        </p>
                        <div className="flex justify-center">
                            <NewsletterSubscribe variant="inline" className="max-w-md" />
                        </div>
                    </div>
                </div>
            </section>
        </div>



    )
}