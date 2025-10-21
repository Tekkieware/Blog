import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://blog.isaiahozadhe.tech'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/private/',
                    '/_next/',
                    '/.*\\.json$',
                ],
            },
            {
                userAgent: 'GPTBot',
                disallow: ['/'],
            },
            {
                userAgent: 'ChatGPT-User',
                disallow: ['/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    }
}