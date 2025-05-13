"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { CommandIcon, Terminal } from "lucide-react"
import { Button } from "@/components/ui-tailwind/button"
import Logo from "./logo"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        "backdrop-blur-md",
        scrolled ? "bg-background/80 shadow-md border-b border-border" : "bg-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center text-xl font-bold tracking-wider">
          <Logo />
        </Link>

        <div className="flex items-center gap-1 md:gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              asChild
              className={cn(
                "text-muted-foreground hover:text-foreground",
                pathname === "/posts" && "text-foreground font-medium",
              )}
            >
              <Link href="/posts" className=" text-sm">Blog</Link>
            </Button>
          </nav>

          <Button
            variant="outline"
            size="icon"
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
          >
            <CommandIcon className="h-4 w-4 text-primary" />
          </Button>
          <ModeToggle />
          <Button variant="default" className="rounded-md bg-primary text-sm text-primary-foreground hover:bg-primary/90">
            Subscribe
          </Button>
        </div>
      </div>
    </header>
  )
}
