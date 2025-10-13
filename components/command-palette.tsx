"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { FileCode2, Layers, Mail, Moon, Sun, Tag, Terminal, User } from "lucide-react"
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
  const router = useRouter()
  const { setTheme } = useTheme()

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
