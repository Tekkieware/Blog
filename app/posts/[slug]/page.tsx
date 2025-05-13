"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Calendar, Tag, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data for a single post
const post = {
  title: "The Art of Component Composition",
  date: "2023-05-15",
  author: "Senior Dev",
  layer: "frontend",
  tags: ["react", "architecture", "patterns"],
  content: `
# Introduction

When building React applications, one of the most powerful patterns is **component composition**. This approach allows you to build complex UIs from simple, reusable pieces.

## Why Composition Matters

Composition gives you:

1. **Reusability** - Components can be used in multiple places
2. **Maintainability** - Smaller, focused components are easier to understand
3. **Flexibility** - Composed components can be reconfigured easily

\`\`\`jsx
// Instead of this:
function ProfileCard({ user, onEdit, onDelete, showStats }) {
  return (
    <div>
      <UserInfo user={user} />
      {showStats && <UserStats user={user} />}
      <div>
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onDelete}>Delete</Button>
      </div>
    </div>
  )
}

// Do this:
function ProfileCard({ user, actions, children }) {
  return (
    <div>
      <UserInfo user={user} />
      {children}
      <div>{actions}</div>
    </div>
  )
}

// Usage:
<ProfileCard 
  user={user}
  actions={
    <>
      <Button onClick={handleEdit}>Edit</Button>
      <Button onClick={handleDelete}>Delete</Button>
    </>
  }
>
  <UserStats user={user} />
</ProfileCard>
\`\`\`

## Advanced Patterns

Let's explore some advanced composition patterns that can take your component design to the next level.

> 🛠️ Remember: The goal isn't to make the most flexible component possible, but to create the right level of abstraction for your specific use case.

### Compound Components

Compound components are a pattern where multiple components work together to form a cohesive unit of functionality.
  `,
  tableOfContents: [
    { id: "introduction", title: "Introduction", level: 1 },
    { id: "why-composition-matters", title: "Why Composition Matters", level: 2 },
    { id: "advanced-patterns", title: "Advanced Patterns", level: 2 },
    { id: "compound-components", title: "Compound Components", level: 3 },
  ],
}

export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link href="/posts" className="inline-flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all posts
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_250px] gap-8">
        {/* Table of Contents - Desktop Only */}
        <aside className="hidden lg:block sticky top-20 self-start h-fit">
          <div className="space-y-4 p-4 border border-border rounded-lg bg-card/50">
            <h4 className="font-mono font-bold text-primary">Table of Contents</h4>
            <ul className="space-y-2 text-sm">
              {post.tableOfContents.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                  >
                    <span className="mr-2 text-xs opacity-50">{"#".repeat(item.level)}</span>
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <article className="prose prose-gray dark:prose-invert max-w-none">
          <div className="space-y-4 not-prose mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="text-cyan-400 border-cyan-400/30 px-3 py-1">
                frontend
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                {post.date}
              </div>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight font-mono text-foreground">{post.title}</h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="mt-12 not-prose">
            <Separator className="my-8" />

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button
                variant="outline"
                asChild
                className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
              >
                <Link href="https://twitter.com/intent/tweet" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Comment on X
                </Link>
              </Button>

              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Subscribe for next drop
              </Button>
            </div>
          </div>
        </article>

        {/* Debug Notes - Desktop Only */}
        <aside className="hidden lg:block sticky top-20 self-start h-fit">
          <Card className="p-4 border-primary/20 bg-primary/5">
            <h4 className="font-mono font-bold mb-2 text-primary">Debug Notes</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Consider using React Context for deeply nested components
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Avoid prop drilling more than 2 levels deep
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Remember to memoize expensive calculations
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Use TypeScript for better component interfaces
              </li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  )
}
