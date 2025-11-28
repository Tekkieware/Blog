
import { Metadata } from 'next';
import { generateSEOMetadata } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
import PostDetailClient from '@/components/post-detail-client';
import { getPostBySlug } from '@/lib/services/postService';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return generateSEOMetadata({
      title: 'Blog Post',
      description: 'Read the latest insights on software engineering and web development.',
      url: `https://blog.isaiahozadhe.tech/posts/${params.slug}`,
    });
  }
  return generateSEOMetadata({
    title: post.title,
    description: post.excerpt,
    image: post.coverImage,
    url: `/posts/${post.slug}`,
    type: 'article',
    publishedDate: post.createdAt,
    modifiedDate: post.updatedAt,
    author: post.author,
    tags: post.tags,
    section: post.layer,
  });
}

export default async function PostDetail({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  return (
    <>
      <StructuredData
        type="article"
        data={{
          headline: post?.title,
          description: post?.excerpt,
          author: post?.author,
          datePublished: post?.createdAt,
          dateModified: post?.updatedAt,
          image: post?.coverImage,
          url: `https://blog.isaiahozadhe.tech/posts/${post?.slug}`,
          keywords: post?.tags,
          articleSection: post?.layer,
        }}
      />
      <PostDetailClient slug={params.slug} />
    </>
  );
}
