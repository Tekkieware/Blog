import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Post from '@/models/post'

export async function GET() {
  try {
    await dbConnect()

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.isaiahozadhe.tech'

    // Query latest 50 posts from the database
    const posts = await Post.find({}).sort({ createdAt: -1 }).limit(50).lean()

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Isaiah Ozadhe - Software Engineering Blog</title>
  <description>Software engineer sharing insights on engineering solutions, programming tutorials, and tech innovations.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <managingEditor>admin@blog.isaiahozadhe.tech (Isaiah Ozadhe)</managingEditor>
    <webMaster>admin@blog.isaiahozadhe.tech (Isaiah Ozadhe)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Isaiah Ozadhe Blog</title>
      <link>${baseUrl}</link>
    </image>
    ${posts
        .map(
          (post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt}]]></description>
      <link>${baseUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <author>admin@blog.isaiahozadhe.tech (Isaiah Ozadhe)</author>
      <category><![CDATA[${post.layer}]]></category>
      ${post.tags?.map((tag: string) => `<category><![CDATA[${tag}]]></category>`).join('') || ''}
      <content:encoded><![CDATA[
        <img src="${post.coverImage}" alt="${post.coverImageAlt || post.title}" style="width: 100%; height: auto; margin-bottom: 20px;" />
        <p>${post.excerpt}</p>
        <p><a href="${baseUrl}/posts/${post.slug}">Read the full article →</a></p>
      ]]></content:encoded>
    </item>`
        )
        .join('')}
  </channel>
</rss>`

    return new NextResponse(rssXml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('RSS generation error:', error)
    return new NextResponse('Error generating RSS feed', { status: 500 })
  }
}