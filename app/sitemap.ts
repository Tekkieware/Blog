import { MetadataRoute } from 'next'
import dbConnect from '@/lib/db'
import Post from '@/models/post'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'

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
        await dbConnect()
        const posts = await Post.find({}).lean()

        const postPages = posts.map((post: any) => ({
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