"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Edit, Trash2, ArrowLeft, LogOut, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui-tailwind/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui-tailwind/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteCookie } from "cookies-next"
import Link from "next/link"
import { getPostsAndCount, deletePost, getLayerCounts } from "@/lib/services/postService";
import { IPost } from "@/models/post";
import { toast } from "sonner";
import AdminPageSkeleton from "./loading"

import AdminNav from '@/components/admin-nav';
import { AdminCommentManager } from '@/components/admin-comment-manager';

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [layerCounts, setLayerCounts] = useState<{ [key: string]: number }>({});
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [selectedPostSlug, setSelectedPostSlug] = useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const router = useRouter()

  useEffect(() => {
    const fetchLayerCounts = async () => {
      try {
        const counts = await getLayerCounts();
        setLayerCounts(counts);
      } catch (error) {
        toast.error("Failed to fetch layer counts.");
      }
    };

    fetchLayerCounts();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Fetching posts with searchTerm:", searchTerm);
      try {
        const { posts: fetchedPosts, total } = await getPostsAndCount(currentPage, 10, 'all', searchTerm);
        setPosts(fetchedPosts);
        setTotalPages(Math.ceil(total / 10));
      } catch (error) {
        toast.error("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchTerm, currentPage]);

  const handleDelete = (id: string) => {
    setPostToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    const toastId = toast.loading("Deleting post...");
    try {
      await deletePost(postToDelete);
      setPosts(posts.filter((post) => post._id !== postToDelete));
      toast.success("Post deleted successfully!", { id: toastId });
      setShowDeleteDialog(false);
      setPostToDelete(null);
    } catch (error) {
      toast.error("Failed to delete post.", { id: toastId });
    }
  };

  const handleLogout = () => {
    deleteCookie("isLoggedIn")
    router.push("/login")
  }

  const filteredPosts = posts;

  if (loading) {
    return <AdminPageSkeleton />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <ArrowLeft className="h-5 w-5 text-primary" />
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
                                className="h-8 w-8 p-0 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30"
                                onClick={() => {
                                  setSelectedPostSlug(post.slug);
                                  setShowCommentSheet(true);
                                }}
                                title="Manage Comments"
                              >
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                <span className="sr-only">Comments</span>
                              </Button>
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

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {["frontend", "backend", "devops", "architecture"].map((layer) => {
              const count = layerCounts[layer] || 0;
              const color =
                layer === "frontend" ? "indigo" : layer === "backend" ? "cyan" : layer === "devops" ? "orange" : "blue";

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
              );
            })}
          </div>
        </div>
      </main>

      {/* Comment Management Sheet */}
      <AdminCommentManager
        isOpen={showCommentSheet}
        onClose={() => setShowCommentSheet(false)}
        postSlug={selectedPostSlug}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className=" border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone and will permanently remove the post and all its associated comments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              Delete Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}