"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useSession, signOut } from "next-auth/react"
import { FileCode2, Layers, Mail, Moon, Sun, Tag, Terminal, User, LogIn, LogOut, Crown } from "lucide-react"
import { isAdminClient } from "@/lib/auth-client"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(() => isAdminClient())
  const router = useRouter()
  const { setTheme } = useTheme()
  const { data: session, status } = useSession()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Check admin status
  useEffect(() => {
    setIsAdmin(isAdminClient())
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => {
              router.push("/")
              setOpen(false)
            }}
          >
            <Terminal className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/posts")
              setOpen(false)
            }}
          >
            <FileCode2 className="mr-2 h-4 w-4" />
            <span>All Posts</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/about")
              setOpen(false)
            }}
          >
            <User className="mr-2 h-4 w-4" />
            <span>About</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Layers">
          <CommandItem
            onSelect={() => {
              router.push("/posts?layer=frontend")
              setOpen(false)
            }}
          >
            <span className="mr-2 h-4 w-4 flex items-center justify-center text-indigo-400">[01]</span>
            <span>Frontend</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/posts?layer=backend")
              setOpen(false)
            }}
          >
            <span className="mr-2 h-4 w-4 flex items-center justify-center text-cyan-400">[02]</span>
            <span>Backend</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/posts?layer=devops")
              setOpen(false)
            }}
          >
            <span className="mr-2 h-4 w-4 flex items-center justify-center text-orange-400">[03]</span>
            <span>DevOps</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/posts?layer=architecture")
              setOpen(false)
            }}
          >
            <span className="mr-2 h-4 w-4 flex items-center justify-center text-blue-400">[04]</span>
            <span>Architecture</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/posts?layer=peopleware")
              setOpen(false)
            }}
          >
            <span className="mr-2 h-4 w-4 flex items-center justify-center text-emerald-400">[05]</span>
            <span>Peopleware</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark Mode</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tags">
          <CommandItem
            onSelect={() => {
              router.push("/tags/react")
              setOpen(false)
            }}
          >
            <Tag className="mr-2 h-4 w-4" />
            <span>React</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/tags/nextjs")
              setOpen(false)
            }}
          >
            <Tag className="mr-2 h-4 w-4" />
            <span>Next.js</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("/tags/architecture")
              setOpen(false)
            }}
          >
            <Tag className="mr-2 h-4 w-4" />
            <span>Architecture</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          {status === "loading" ? (
            <CommandItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>Loading...</span>
            </CommandItem>
          ) : (session || isAdmin) ? (
            <>
              <CommandItem disabled>
                {isAdmin ? (
                  <>
                    <Crown className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span>Signed in as Admin (reply@blog.isaiahozadhe.tech)</span>
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    <span>Signed in as {session?.user?.email}</span>
                  </>
                )}
              </CommandItem>
              {isAdmin && (
                <CommandItem
                  onSelect={() => {
                    router.push("/admin")
                    setOpen(false)
                  }}
                >
                  <Terminal className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </CommandItem>
              )}
              <CommandItem
                onSelect={async () => {
                  if (isAdmin) {
                    // For admin, clear cookie and reload
                    document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    router.push("/");
                    window.location.reload();
                  } else {
                    // For regular users, use next-auth signOut
                    await signOut({ callbackUrl: "/" });
                  }
                  setOpen(false)
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </CommandItem>
            </>
          ) : (
            <CommandItem
              onSelect={() => {
                router.push("/signin")
                setOpen(false)
              }}
            >
              <LogIn className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </CommandItem>
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => {
              router.push("/newsletter") // 👈 internal page
              setOpen(false)
            }}
          >
            <Mail className="mr-2 h-4 w-4" />
            <span>Subscribe to Newsletter</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
