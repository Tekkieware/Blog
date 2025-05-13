"use client"

import type React from "react"

import { createContext } from "react"

const CommandContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {},
})

export function CommandDialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-background p-4 shadow-lg">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
        <CommandContext.Provider value={{ open, setOpen: onOpenChange }}>
          <div className="flex flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">{children}</div>
        </CommandContext.Provider>
      </div>
    </div>
  )
}

export function CommandInput({
  placeholder,
}: {
  placeholder?: string
}) {
  return (
    <div className="flex items-center border-b px-3">
      <input
        className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        placeholder={placeholder}
      />
    </div>
  )
}

export function CommandList({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">{children}</div>
}

export function CommandEmpty() {
  return <div className="py-6 text-center text-sm">No results found.</div>
}

export function CommandGroup({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden p-1 text-foreground">
      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{heading}</div>
      {children}
    </div>
  )
}

export function CommandSeparator() {
  return <div className="mx-1 my-1 h-px bg-border" />
}

export function CommandItem({
  onSelect,
  children,
}: {
  onSelect?: () => void
  children: React.ReactNode
}) {
  return (
    <div
      onClick={onSelect}
      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </div>
  )
}
