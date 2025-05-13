"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Mock data for overflow notes
const notes = [
  {
    id: "1",
    title: "Debugging React Suspense",
    content: "Found a weird edge case with Suspense boundaries when using with data fetching libraries...",
    color: "indigo",
    type: "text",
  },
  {
    id: "2",
    title: "Database Migration Script",
    content:
      "```sql\nALTER TABLE users ADD COLUMN last_active TIMESTAMP;\nCREATE INDEX idx_last_active ON users(last_active);\n```",
    color: "cyan",
    type: "code",
  },
  {
    id: "3",
    title: "Team Retro Ideas",
    content: "1. Start with wins\n2. Use anonymous feedback\n3. Time-box discussions\n4. Action items with owners",
    color: "emerald",
    type: "list",
  },
  {
    id: "4",
    title: "Performance Optimization",
    content:
      "Profiled the app and found that we're re-rendering the entire tree on every state change. Need to implement memo and useCallback.",
    color: "orange",
    type: "text",
  },
  {
    id: "5",
    title: "Architecture Diagram",
    content: "Need to sketch out the new microservice architecture with proper boundaries.",
    color: "blue",
    type: "image",
  },
  {
    id: "6",
    title: "Random Thought",
    content: "What if we built a CLI tool to automate our deployment process?",
    color: "pink",
    type: "text",
  },
  {
    id: "7",
    title: "Code Review Checklist",
    content:
      "- Tests included?\n- Error handling?\n- Performance considerations?\n- Security implications?\n- Documentation updated?",
    color: "indigo",
    type: "list",
  },
  {
    id: "8",
    title: "API Design Question",
    content: "Should we version our APIs in the URL or use content negotiation with Accept headers?",
    color: "cyan",
    type: "text",
  },
  {
    id: "9",
    title: "Meeting Notes",
    content: "Discussed the new feature roadmap. Priority is on improving the onboarding flow and reducing churn.",
    color: "emerald",
    type: "text",
  },
]

// Helper function to get random rotation
const getRandomRotation = () => {
  return Math.random() * 6 - 3
}

export default function OverflowPage() {
  const [selectedNote, setSelectedNote] = useState<(typeof notes)[0] | null>(null)

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold font-mono">Overflow</h1>
          <p className="text-muted-foreground">Raw brain dumps, random thoughts, and unfiltered ideas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{
                scale: 1.05,
                rotate: getRandomRotation(),
                zIndex: 10,
              }}
              transition={{ duration: 0.2 }}
              className="cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              <Card
                className={cn(
                  "p-4 h-[200px] overflow-hidden",
                  `bg-${note.color}-400/10 border-${note.color}-400/30`,
                  "transition-all duration-200",
                )}
              >
                <h3 className="font-bold mb-2 font-mono text-sm">{note.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-6">{note.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedNote} onOpenChange={(open) => !open && setSelectedNote(null)}>
        <DialogContent className={cn("sm:max-w-md", selectedNote && `border-${selectedNote.color}-400/30`)}>
          <DialogHeader>
            <DialogTitle className="font-mono">{selectedNote?.title}</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-line">{selectedNote?.content}</div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
