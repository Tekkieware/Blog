import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/structured-data'
import PostDetailClient from '@/components/post-detail-client'

// For now, let's use basic metadata and let the client component handle the data fetching
export const metadata: Metadata = generateSEOMetadata({
  title: 'Blog Post',
  description: 'Read the latest insights on software engineering and web development.',
  url: 'https://blog.isaiahozadhe.tech/posts',
})

export default async function PostDetail({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  return (
    <>
      <StructuredData
        type="website"
        data={{
          name: 'Isaiah Ozadhe Blog Post',
          url: `https://blog.isaiahozadhe.tech/posts/${resolvedParams.slug}`,
          description: 'Software engineering insights and tutorials.',
        }}
      />
      <PostDetailClient slug={resolvedParams.slug} />
    </>
  );
}
