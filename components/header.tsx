"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { ModeToggle } from "@/components/mode-toggle"
import { CommandIcon, Pen, Terminal, User, LogOut, LogIn } from "lucide-react"
import { Button } from "@/components/ui-tailwind/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "./logo"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
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
          <Pen className=" -mb-2 text-primary" />
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

          <Button onClick={() => router.push("/newsletter")} variant="default" className="rounded-md hidden sm:block bg-primary text-sm text-primary-foreground hover:bg-primary/90">
            Subscribe
          </Button>

          {/* Authentication Section */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="border-primary/20 hover:bg-primary/10 hover:border-primary/30">
                  <User className="h-4 w-4 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" side="right" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/signin")}
              className="border border-primary/20 hover:bg-primary/10 hover:border-primary/30"
            >
              <LogIn className="h-4 w-4 text-primary" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
