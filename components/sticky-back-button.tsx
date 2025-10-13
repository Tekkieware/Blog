import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'

const StickyBackButton = () => {
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const router = useRouter()

    function backHandler() {
        router.back()
    }

    return (
        <>
            <div
                className={cn(
                    "sticky top-15 z-50 backdrop-blur-md lg:hidden",
                    scrolled
                        ? "bg-background/80 shadow-md border-b border-border"
                        : "bg-transparent"
                )}
            >
                <div className="container py-6">
                    <Button
                        variant="link"
                        onClick={() => backHandler()}
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Button>
                </div>
            </div>


            <div className="sticky top-15 z-50 hidden lg:block bg-transparent">
                <div className="container py-6">
                    <Button
                        variant="link"
                        onClick={() => backHandler()}
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back
                    </Button>
                </div>
            </div>

        </>

    )
}

export default StickyBackButton
