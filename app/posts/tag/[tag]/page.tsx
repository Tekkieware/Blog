import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo'
import { PostsClientTag } from '@/components/posts-client-tag'

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
    const resolvedParams = await params;
    const tag = decodeURIComponent(resolvedParams.tag);

    return generateSEOMetadata({
        title: `Posts tagged with "${tag}"`,
        description: `Browse all blog posts tagged with ${tag}. Software engineering insights and tutorials.`,
        url: `https://blog.isaiahozadhe.tech/posts/tag/${resolvedParams.tag}`,
    })
}

export default async function PostsByTagPage({ params }: { params: { tag: string } }) {
    const resolvedParams = await params;
    const tag = decodeURIComponent(resolvedParams.tag);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-mono mb-4">
                    Posts tagged with "{tag}"
                </h1>
                <p className="text-muted-foreground">
                    Browse all posts related to {tag}
                </p>
            </div>
            <PostsClientTag tag={tag} />
        </div>
    )
}