"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye, ImageIcon, X, Calendar, Clock, User, Tag, Wand2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageUploadModal } from "@/components/image-upload-modal"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import Link from "next/link"
import { layers } from "@/components/layer-navigator"
import { EnhancedRichTextEditor } from "@/components/enhanced-rich-text-editor"
import { getPost, updatePost, deletePost } from "@/lib/services/postService"
import { IPost } from "@/models/post"
import { toast } from "sonner"

export default function EditPostPage({ params: promiseParams }: { params: Promise<{ id: string }> }) {
  const params = React.use(promiseParams);
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showCoverImageModal, setShowCoverImageModal] = useState(false)
  const [formData, setFormData] = useState<Partial<IPost>>({
    title: "",
    excerpt: "",
    content: "",
    layer: "frontend",
    tags: [] as string[],
    slug: "",
    author: "",
    debug_notes: [] as string[],
    coverImage: "",
    coverImageAlt: "",
  })

  const [tagInput, setTagInput] = useState("")
  const [debugNoteInput, setDebugNoteInput] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPost(params.id);
        setFormData(post);
      } catch (error) {
        toast.error("Failed to fetch post.");
        router.push("/admin");
      }
    };

    fetchPost();
  }, [params.id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")

      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleCoverImageSave = (imageUrl: string, altText: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: imageUrl,
      coverImageAlt: altText,
    }))
    setShowCoverImageModal(false)
  }

  const handleRemoveCoverImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: "",
      coverImageAlt: "",
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const addDebugNote = () => {
    if (debugNoteInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        debug_notes: [...(prev.debug_notes || []), debugNoteInput.trim()],
      }))
      setDebugNoteInput("")
    }
  }

  const removeDebugNote = (noteToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      debug_notes: prev.debug_notes?.filter((note) => note !== noteToRemove),
    }))
  }

  const handleDebugNoteKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addDebugNote()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Updating post...");
    setIsSubmitting(true);

    try {
      await updatePost(params.id, formData);
      toast.success("Post updated successfully!", { id: toastId });
      setIsSubmitting(false);
      router.push("/admin");
    } catch (error) {
      toast.error("Failed to update post", { id: toastId });
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const toastId = toast.loading("Deleting post...");
    try {
      await deletePost(params.id);
      toast.success("Post deleted successfully!", { id: toastId });
      router.push("/admin");
    } catch (error) {
      toast.error("Failed to delete post.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
              {isSubmitting ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col space-y-6">
          {showPreview ? (
            <div className="min-h-screen bg-background">
              <div className="container pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr] gap-8">
                  <article className="min-w-0">
                    <header className="mb-12 space-y-6">
                      {formData.coverImage && (
                        <div className="aspect-video overflow-hidden rounded-lg mb-8">
                          <img
                            src={formData.coverImage || "/placeholder.svg"}
                            alt={formData.coverImageAlt}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <Badge
                          variant="outline"
                          className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
                        >
                          {formData.layer}
                        </Badge>
                        {formData.createdAt && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date(formData.createdAt).toLocaleDateString()}
                          </div>
                        )}
                        {formData.author && (
                          <div className="flex items-center text-muted-foreground">
                            <User className="mr-2 h-4 w-4" />
                            {formData.author}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-mono">
                          {formData.title || "Untitled Post"}
                        </h1>
                        {formData.excerpt && (
                          <p className="text-xl text-muted-foreground leading-relaxed">{formData.excerpt}</p>
                        )}
                      </div>

                      {formData.tags && formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs font-mono">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </header>

                    <div className="prose prose-lg max-w-none">
                      {formData.content ? (
                        <MarkdownRenderer content={formData.content} />
                      ) : (
                        <p className="text-muted-foreground italic">Start writing your content to see the preview...</p>
                      )}
                    </div>

                    {formData.debug_notes && formData.debug_notes.length > 0 && (
                      <div className="mt-12">
                        <Card className="border-primary/20 bg-gradient-subtle shadow-soft">
                          <div className="p-6">
                            <h4 className="font-mono font-bold mb-4 text-foreground flex items-center">
                              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                              Debug Notes
                            </h4>
                            <ul className="space-y-3 text-sm">
                              {formData.debug_notes.map((note, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-primary mr-3 mt-1">•</span>
                                  <span className="text-muted-foreground">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Card>
                      </div>
                    )}
                  </article>
                </div>
              </div>
            </div>
          ) : (
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="font-mono text-xl">Edit Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Cover Image</label>
                    {formData.coverImage ? (
                      <Card className="overflow-hidden">
                        <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden relative">
                          <img
                            src={formData.coverImage || "/placeholder.svg"}
                            alt={formData.coverImageAlt}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleRemoveCoverImage}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-3 border-t">
                          <p className="text-sm text-muted-foreground">{formData.coverImageAlt}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowCoverImageModal(true)}
                            className="mt-2"
                          >
                            Change Image
                          </Button>
                        </div>
                      </Card>
                    ) : (
                      <Card
                        className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                        onClick={() => setShowCoverImageModal(true)}
                      >
                        <div className="aspect-video flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-lg font-medium mb-2">Add Cover Image</p>
                            <p className="text-sm text-muted-foreground">Click to upload an image</p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

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
                    <div className="space-y-2">
                      <label htmlFor="author" className="block text-sm font-medium">
                        Author
                      </label>
                      <input
                        id="author"
                        name="author"
                        type="text"
                        required
                        value={formData.author}
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
                      <label className="block text-sm font-medium">Tags</label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={handleTagKeyPress}
                            placeholder="Add a tag and press Enter"
                            className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addTag}
                            className="px-3 bg-transparent"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {formData.tags && formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs font-mono flex items-center gap-1 pr-1"
                              >
                                <Tag className="h-3 w-3" />
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="content" className="block text-sm font-medium">
                      Content
                    </label>
                    <EnhancedRichTextEditor
                      value={formData.content || ''}
                      onChange={handleContentChange}
                      placeholder="Start writing your post..."
                      className="min-h-[400px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Debug Notes</label>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={debugNoteInput}
                          onChange={(e) => setDebugNoteInput(e.target.value)}
                          onKeyPress={handleDebugNoteKeyPress}
                          placeholder="Add a debug note and press Enter"
                          className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addDebugNote}
                          className="px-3 bg-transparent"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.debug_notes && formData.debug_notes.length > 0 && (
                        <div className="space-y-2">
                          {formData.debug_notes.map((note, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-3 bg-muted/50 rounded-md border border-border/50"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span className="flex-1 text-sm text-muted-foreground">{note}</span>
                              <button
                                type="button"
                                onClick={() => removeDebugNote(note)}
                                className="hover:bg-destructive/20 rounded-full p-1 transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <ImageUploadModal
        isOpen={showCoverImageModal}
        onClose={() => setShowCoverImageModal(false)}
        onSave={handleCoverImageSave}
      />
    </div>
  )
}