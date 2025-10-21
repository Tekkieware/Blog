
import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/structured-data'
import NewsletterPageClient from './newsletter-client'

export const metadata: Metadata = generateSEOMetadata({
    title: 'Newsletter - Weekly Engineering Insights',
    description: 'Subscribe to Isaiah Ozadhe\'s weekly newsletter for insights on system design, architecture patterns, engineering leadership, and career growth. Join a community of engineers.',
    url: 'https://blog.isaiahozadhe.tech/newsletter',
    keywords: [
        'newsletter',
        'engineering insights',
        'system design',
        'architecture patterns',
        'engineering leadership',
        'career growth',
        'software engineering',
        'weekly newsletter',
        'tech community',
        'programming tips'
    ],
})

export default function NewsletterPage() {
    return (
        <>
            <StructuredData
                type="website"
                data={{
                    name: 'Newsletter - Isaiah Ozadhe Blog',
                    url: 'https://blog.isaiahozadhe.tech/newsletter',
                    description: 'Subscribe to weekly engineering insights on system design, architecture patterns, and engineering leadership.',
                }}
            />
            <NewsletterPageClient />
        </>
    )
}
