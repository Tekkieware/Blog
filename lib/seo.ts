import { Metadata } from 'next'

interface SEOProps {
    title?: string
    description?: string
    keywords?: string[]
    image?: string
    url?: string
    type?: 'website' | 'article'
    publishedDate?: string
    modifiedDate?: string
    author?: string
    section?: string
    tags?: string[]
}

export function generateSEOMetadata({
    title,
    description,
    keywords = [],
    image = 'https://blog.isaiahozadhe.tech/logo.png',
    url,
    type = 'website',
    publishedDate,
    modifiedDate,
    author = 'Isaiah Ozadhe',
    section,
    tags = []
}: SEOProps): Metadata {
    const siteName = 'Isaiah Ozadhe'
    const baseUrl = 'https://blog.isaiahozadhe.tech'
    const fullUrl = url ? `${baseUrl}${url}` : baseUrl
    const fullTitle = title ? `${title} | ${siteName}` : `${siteName}: A Peek Into a Software Engineer's Mind`
    const defaultDescription = 'Engineering insights, practical solutions, and technical deep-dives from a software engineer.'

    return {
        metadataBase: new URL(baseUrl),
        title: fullTitle,
        description: description || defaultDescription,
        keywords: [
            'software engineering',
            'engineering solutions',
            'programming',
            'technical blog',
            'Isaiah Ozadhe',
            ...keywords
        ],
        authors: [{ name: author, url: 'https://isaiahozadhe.tech' }],
        creator: author,
        publisher: siteName,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type,
            siteName,
            title: fullTitle,
            description: description || defaultDescription,
            url: fullUrl,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title || siteName,
                },
            ],
            ...(type === 'article' && {
                ...(publishedDate && { publishedTime: publishedDate }),
                ...(modifiedDate && { modifiedTime: modifiedDate }),
                ...(author && { authors: [author] }),
                ...(section && { section }),
                ...(tags && tags.length > 0 && { tags }),
            }),
        },
        twitter: {
            card: 'summary_large_image',
            site: '@isaiahozadhe', // Add your Twitter handle
            creator: '@isaiahozadhe',
            title: fullTitle,
            description: description || defaultDescription,
            images: [image],
        },
        alternates: {
            canonical: fullUrl,
        },
        other: {
            ...(author && { 'article:author': author }),
            ...(publishedDate && { 'article:published_time': publishedDate }),
            ...(modifiedDate && { 'article:modified_time': modifiedDate }),
            ...(section && { 'article:section': section }),
            ...(tags && tags.length > 0 && { 'article:tag': tags.join(',') }),
        },
    }
}