import { Metadata } from 'next'
import { generateSEOMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/structured-data'
import HomeClient from './home-client'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Isaiah Ozadhe: A Peek Into a Software Engineer\'s Mind',
  description: 'Software engineer sharing insights on engineering solutions, programming tutorials, and tech innovations. Build solutions. Share thoughts.',
  url: 'https://blog.isaiahozadhe.tech',
  keywords: [
    'software engineering',
    'engineering solutions',
    'programming',
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'system design',
    'engineering blog',
    'tech insights',
    'Isaiah Ozadhe'
  ],
})

export default function Home() {
  return (
    <>
      <StructuredData
        type="website"
        data={{
          name: 'Isaiah Ozadhe Blog',
          url: 'https://blog.isaiahozadhe.tech',
          description: 'Software engineer sharing insights on engineering solutions, programming tutorials, and tech innovations.',
        }}
      />
      <HomeClient />
    </>
  )
}
