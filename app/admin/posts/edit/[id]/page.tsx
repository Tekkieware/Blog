"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui-tailwind/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-tailwind/card"
import Link from "next/link"
import { layers } from "@/components/layer-navigator"
import { posts } from "@/lib/mock-data"

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    layer: "",
    tags: "",
    slug: "",
  })

  useEffect(() => {
    // Find the post with the matching ID
    const post = posts.find((p) => p.id === params.id)

    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: "# Sample content\n\nThis is where the full markdown content would be loaded.",
        layer: post.layer,
        tags: post.tags.join(", "),
        slug: post.slug,
      })
    } else {
      // Post not found, redirect to admin
      router.push("/admin")
    }
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, this would send data to an API
    setTimeout(() => {
      alert("Post updated successfully!")
      setIsSubmitting(false)
      router.push("/admin")
    }, 1000)
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      // Delete post logic would go here
      alert(`Post would be deleted`)
      router.push("/admin")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/admin" className="mr-6 flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-primary" />
              <span className="font-mono font-bold">Back to Dashboard</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30"
            >
              <Trash2 className="h-4 w-4 mr-2 text-red-500" />
              Delete
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? "Saving..." : "Update Post"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col space-y-6">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono text-xl">Edit Post</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium">
                      Title
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="slug" className="block text-sm font-medium">
                      Slug
                    </label>
                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      required
                      value={formData.slug}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="excerpt" className="block text-sm font-medium">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={2}
                    required
                    value={formData.excerpt}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="layer" className="block text-sm font-medium">
                      Layer
                    </label>
                    <select
                      id="layer"
                      name="layer"
                      required
                      value={formData.layer}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    >
                      {layers.map((layer) => (
                        <option key={layer.slug} value={layer.slug}>
                          {layer.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tags" className="block text-sm font-medium">
                      Tags (comma separated)
                    </label>
                    <input
                      id="tags"
                      name="tags"
                      type="text"
                      value={formData.tags}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="block text-sm font-medium">
                    Content (Markdown)
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={15}
                    required
                    value={formData.content}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-border rounded-md bg-background text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
