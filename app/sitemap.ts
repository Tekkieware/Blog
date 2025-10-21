import { MetadataRoute } from 'next'
import { getPostsAndCount } from '@/lib/services/postService'
import { IPost } from '@/models/post'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://blog.isaiahozadhe.tech'

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/posts`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/newsletter`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
    ]

    // Dynamic post pages
    try {
        const { posts } = await getPostsAndCount(1, 1000, 'all', '') // Get all posts
        const postPages = posts.map((post: IPost) => ({
            url: `${baseUrl}/posts/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        // Layer category pages
        const layers = ['frontend', 'backend', 'devops', 'architecture', 'career']
        const layerPages = layers.map((layer) => ({
            url: `${baseUrl}/posts?layer=${layer}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        return [...staticPages, ...postPages, ...layerPages]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return staticPages
    }
}