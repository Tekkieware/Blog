"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash2, ArrowLeft, LogOut } from "lucide-react"
import { Button } from "@/components/ui-tailwind/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-tailwind/card"
import { Badge } from "@/components/ui-tailwind/badge"
import { deleteCookie } from "cookies-next"
import Link from "next/link"
import { getPosts, deletePost } from "@/lib/services/postService";
import { IPost } from "@/models/post";
import { toast } from "sonner";

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
            const fetchPosts = async () => {
              console.log("Fetching posts with searchTerm:", searchTerm);
              try {        const fetchedPosts = await getPosts(1, 10, searchTerm); // Pass searchTerm to getPosts
        setPosts(fetchedPosts);
      } catch (error) {
        toast.error("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm]); // Add searchTerm as a dependency

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
        const toastId = toast.loading("Deleting post...");
        try {
          await deletePost(id);
          setPosts(posts.filter((post) => post._id !== id));
          toast.success("Post deleted successfully!", { id: toastId });
        } catch (error) {
          toast.error("Failed to delete post.", { id: toastId });
        }
    }
  };

  const handleLogout = () => {
    deleteCookie("auth-token")
    router.push("/login")
  }

  const filteredPosts = posts;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-primary" />
              <span className="font-mono font-bold">stacked</span>
            </Link>
            <h1 className="text-xl font-bold font-mono">Admin Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/30"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container py-6">
        <div className="flex flex-col space-y-6">
          {/* Actions Row */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search posts..."
                className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/admin/posts/new")}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* Posts Table */}
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="font-mono">Manage Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-mono font-medium">Title</th>
                      <th className="text-left py-3 px-4 font-mono font-medium hidden md:table-cell">Layer</th>
                      <th className="text-left py-3 px-4 font-mono font-medium hidden lg:table-cell">Date</th>
                      <th className="text-right py-3 px-4 font-mono font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.length > 0 ? (
                      filteredPosts.map((post) => (
                        <tr key={post._id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{post.title}</div>
                            <div className="text-sm text-muted-foreground hidden sm:block">
                              {post.excerpt.substring(0, 60)}...
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden md:table-cell">
                            <Badge
                              variant="outline"
                              className={`border-${post.layer === "frontend" ? "indigo" : post.layer === "backend" ? "cyan" : post.layer === "devops" ? "orange" : post.layer === "architecture" ? "blue" : post.layer === "peopleware" ? "emerald" : "pink"}-400/30 text-${post.layer === "frontend" ? "indigo" : post.layer === "backend" ? "cyan" : post.layer === "devops" ? "orange" : post.layer === "architecture" ? "blue" : post.layer === "peopleware" ? "emerald" : "pink"}-400`}
                            >
                              {post.layer}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 hidden lg:table-cell text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-primary/20 hover:bg-primary/10 hover:border-primary/30"
                                onClick={() => router.push(`/admin/posts/edit/${post._id}`)}
                              >
                                <Edit className="h-4 w-4 text-primary" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/30"
                                onClick={() => handleDelete(post._id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-muted-foreground">
                          No posts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["frontend", "backend", "devops", "architecture"].map((layer) => {
              const count = posts.filter((post) => post.layer === layer).length
              const color =
                layer === "frontend" ? "indigo" : layer === "backend" ? "cyan" : layer === "devops" ? "orange" : "blue"

              return (
                <Card key={layer} className={`border-${color}-400/30 bg-${color}-400/5`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-mono capitalize">{layer}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                    <p className="text-xs text-muted-foreground">posts</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}