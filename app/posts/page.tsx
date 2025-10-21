import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/structured-data'
import PostsPageClient from './posts-client'

export const metadata: Metadata = generateSEOMetadata({
  title: 'All Posts - Engineering Insights & Tutorials',
  description: 'Browse all engineering blog posts by Isaiah Ozadhe. Find articles on web development, system design, programming tutorials, and tech insights. Filter by categories and search topics.',
  url: 'https://blog.isaiahozadhe.tech/posts',
  keywords: [
    'blog posts',
    'engineering articles',
    'programming tutorials',
    'web development',
    'system design',
    'software engineering',
    'React tutorials',
    'Next.js guides',
    'TypeScript tips',
    'Python programming',
    'tech insights',
    'coding blog'
  ],
})

export default function PostsPage() {
  return (
    <>
      <StructuredData
        type="website"
        data={{
          name: 'All Posts - Isaiah Ozadhe Blog',
          url: 'https://blog.isaiahozadhe.tech/posts',
          description: 'Browse all engineering blog posts covering web development, system design, and programming tutorials.',
        }}
      />
      <PostsPageClient />
    </>
  )
}
