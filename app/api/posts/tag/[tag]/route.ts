import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Post from '@/models/post'

export async function GET(
    request: NextRequest,
    { params }: { params: { tag: string } }
) {
    try {
        await dbConnect()
        const resolvedParams = await params
        const tag = decodeURIComponent(resolvedParams.tag)

        // Find posts that contain the tag (case insensitive)
        const posts = await Post.find({
            tags: { $regex: new RegExp(tag, 'i') }
        })
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({
            posts,
            total: posts.length
        })
    } catch (error) {
        console.error('Error fetching posts by tag:', error)
        return NextResponse.json(
            { error: 'Failed to fetch posts by tag' },
            { status: 500 }
        )
    }
}