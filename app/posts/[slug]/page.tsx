"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Calendar, Tag, ArrowLeft, Clock, User } from "lucide-react";
import Link from "next/link";
import { TableOfContents } from "@/components/table-of-content";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import StickyBackButton from "@/components/sticky-back-button";
import React, { useEffect, useState } from "react";
import PostDetailSkeleton from "@/components/post-detail-skeleton";
import { IPost } from "@/models/post";

const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .trim();
};

const generateToc = (markdown: string) => {
  const lines = markdown.split('\n');
  const toc: { id: string, title: string, level: number }[] = [];

  lines.forEach(line => {
    const match = line.match(/^(#+)\s+(.*)/);
    if (match) {
      const level = match[1].length;
      const title = match[2];
      const id = generateSlug(title);
      toc.push({ id, title, level });
    }
  });

  return toc;
};

export default function PostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const promiseParam = React.use(params);

  const { slug } = promiseParam;
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/slug/${slug}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const tableOfContents = generateToc(post.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <StickyBackButton link="posts" />

      <div className="container pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-8">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block sticky top-30 self-start h-fit">
            <TableOfContents items={tableOfContents} />
          </aside>

          {/* Main Content */}
          <article className="min-w-0">
            {/* Post Header */}
            <header className="mb-12 space-y-6">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge
                  variant="outline"
                  className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10"
                >
                  {post.layer}
                </Badge>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {/* {post.readTime} */}
                  read time
                </div>
                <div className="flex items-center text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  {post.author}
                </div>
              </div>

              {/* Title and Excerpt */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-mono">
                  {post.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-mono">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </header>

            {/* Table of Contents - Mobile Only */}
            <div className="lg:hidden mb-8">
              <TableOfContents items={tableOfContents} />
            </div>

            {/* Content */}
            <MarkdownRenderer content={post.content} />

            {/* Debug Notes - Mobile Only */}
            <div className="lg:hidden mt-12">
              <Card className="border-primary/20 bg-gradient-subtle shadow-soft">
                <div className="p-6">
                  <h4 className="font-mono font-bold mb-4 text-foreground flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    Debug Notes
                  </h4>
                  <ul className="space-y-3 text-sm">
                    {post.debug_notes.map((note: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary mr-3 mt-1">•</span>
                        <span className="text-muted-foreground">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            {/* Footer Actions */}
            <footer className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <Button
                  variant="outline"
                  asChild
                  className="border-primary/20 hover:bg-primary/5 hover:border-primary/30 text-primary"
                >
                  <a
                    href="https://twitter.com/intent/tweet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Share on X
                  </a>
                </Button>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-emphasis">
                  Subscribe for updates
                </Button>
              </div>
            </footer>
          </article>

          {/* Debug Notes - Desktop Only */}
          <aside className="hidden lg:block sticky top-20 self-start h-fit">
            <Card className="border-primary/20 bg-gradient-subtle shadow-soft">
              <div className="p-6">
                <h4 className="font-mono font-bold mb-4 text-foreground flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  Debug Notes
                </h4>
                <ul className="space-y-3 text-sm">
                  {post.debug_notes.map((note: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary mr-3 mt-1">•</span>
                      <span className="text-muted-foreground">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
