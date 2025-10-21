interface StructuredDataProps {
    type: 'website' | 'article' | 'person' | 'organization' | 'blogPosting'
    data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
    let structuredData: any

    switch (type) {
        case 'website':
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: data.name || 'Isaiah Ozadhe Blog',
                url: data.url || 'https://blog.isaiahozadhe.tech',
                description: data.description || 'Software engineer sharing insights on engineering solutions, programming tutorials, and tech innovations.',
                author: {
                    '@type': 'Person',
                    name: 'Isaiah Ozadhe',
                    url: 'https://isaiahozadhe.tech',
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                        '@type': 'EntryPoint',
                        urlTemplate: 'https://blog.isaiahozadhe.tech/posts?search={search_term_string}',
                    },
                    'query-input': 'required name=search_term_string',
                },
            }
            break

        case 'article':
        case 'blogPosting':
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: data.title,
                description: data.description,
                image: data.image || 'https://blog.isaiahozadhe.tech/logo.png',
                author: {
                    '@type': 'Person',
                    name: 'Isaiah Ozadhe',
                    url: 'https://isaiahozadhe.tech',
                },
                publisher: {
                    '@type': 'Organization',
                    name: 'Isaiah Ozadhe Blog',
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://blog.isaiahozadhe.tech/logo.png',
                    },
                },
                datePublished: data.publishedAt,
                dateModified: data.updatedAt || data.publishedAt,
                mainEntityOfPage: {
                    '@type': 'WebPage',
                    '@id': data.url,
                },
                articleSection: data.tags?.join(', ') || 'Engineering',
                keywords: data.tags?.join(', ') || 'engineering solutions, programming, technology',
                wordCount: data.wordCount || undefined,
                url: data.url,
            }
            break

        case 'person':
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'Person',
                name: 'Isaiah Ozadhe',
                url: 'https://isaiahozadhe.tech',
                sameAs: [
                    'https://github.com/isaiahozadhe',
                    'https://linkedin.com/in/isaiahozadhe',
                    'https://twitter.com/isaiahozadhe',
                ],
                jobTitle: 'Software Engineer',
                worksFor: {
                    '@type': 'Organization',
                    name: 'Freelance',
                },
                knowsAbout: [
                    'Engineering Solutions',
                    'JavaScript',
                    'TypeScript',
                    'React',
                    'Next.js',
                    'Node.js',
                    'Software Engineering',
                ],
                description: 'Software engineer with expertise in engineering solutions and modern technologies.',
            }
            break

        case 'organization':
            structuredData = {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'Isaiah Ozadhe Blog',
                url: 'https://blog.isaiahozadhe.tech',
                logo: 'https://blog.isaiahozadhe.tech/logo.png',
                description: 'A blog about engineering solutions, programming tutorials, and tech innovations.',
                founder: {
                    '@type': 'Person',
                    name: 'Isaiah Ozadhe',
                },
                contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'admin@blog.isaiahozadhe.tech',
                    contactType: 'Customer Service',
                },
            }
            break

        default:
            return null
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(structuredData, null, 2),
            }}
        />
    )
}