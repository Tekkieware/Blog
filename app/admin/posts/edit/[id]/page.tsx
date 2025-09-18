"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui-tailwind/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-tailwind/card"
import { RichTextEditor } from "@/components/ui-tailwind/rich-text-editor"
import Link from "next/link"
import { layers } from "@/components/layer-navigator"
import { posts } from "@/lib/mock-data"


export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
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
    const post = posts.find((p: any) => p.id === params.id)

    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: `# ${post.title}

This is a sample markdown content for the post. You can edit this content using the rich text editor.

## Key Features

- **Bold text** for emphasis
- *Italic text* for style
- \`Inline code\` for technical terms
- [Links](https://example.com) to external resources

## Code Example

\`\`\`javascript
function example() {
  return "Hello, World!";
}
\`\`\`

> This is a blockquote to highlight important information.

### Lists

1. First item
2. Second item
3. Third item

- Bullet point one
- Bullet point two
- Bullet point three

![Sample Image](https://via.placeholder.com/400x200)

This editor supports full markdown syntax and provides a great writing experience for technical content.`,
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

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
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

  // Simple markdown to HTML converter for preview
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
      .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
      .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/_(.*?)_/gim, "<u>$1</u>")
      .replace(/`(.*?)`/gim, "<code>$1</code>")
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^- (.*$)/gim, "<li>$1</li>")
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      .replace(/\[([^\]]+)\]$([^)]+)$/gim, '<a href="$2">$1</a>')
      .replace(/!\[([^\]]*)\]$([^)]+)$/gim, '<img alt="$1" src="$2" />')
      .replace(/\n/gim, "<br>")
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
              onClick={() => setShowPreview(!showPreview)}
              className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
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
                    Content
                  </label>
                  {showPreview ? (
                    <div className="min-h-[300px] p-4 border border-border rounded-md bg-background">
                      <div
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: markdownToHtml(formData.content) }}
                      />
                    </div>
                  ) : (
                    <RichTextEditor
                      value={formData.content}
                      onChange={handleContentChange}
                      placeholder="Edit your post content..."
                      className="min-h-[400px]"
                    />
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
