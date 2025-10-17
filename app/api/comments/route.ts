import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import dbConnect from '@/lib/db'
import Comment from '@/models/comment'
import { z } from 'zod'

// Validation schema
const createCommentSchema = z.object({
    postSlug: z.string().min(1, 'Post slug is required'),
    content: z.string().min(1, 'Comment content is required').max(2000, 'Comment cannot exceed 2000 characters'),
    userName: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
    userEmail: z.string().email().optional(),
    isAdmin: z.boolean().optional(),
    contentUpdatedAt: z.date().optional()
})

// GET - Fetch comments for a post
export async function GET(request: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(request.url)
        const postSlug = searchParams.get('postSlug')

        if (!postSlug) {
            return NextResponse.json({ error: 'Post slug is required' }, { status: 400 })
        }

        const comments = await Comment.find({ postSlug }).sort({ createdAt: -1 }).lean()

        // Get comment stats
        const statsResult = await Comment.aggregate([
            { $match: { postSlug } },
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: 1 },
                    totalReplies: { $sum: { $size: '$replies' } }
                }
            }
        ])
        const stats = statsResult[0] || { totalComments: 0, totalReplies: 0 }

        return NextResponse.json({
            comments,
            stats: {
                totalComments: stats.totalComments,
                totalReplies: stats.totalReplies,
                totalInteractions: stats.totalComments + stats.totalReplies
            }
        })
    } catch (error) {
        console.error('Error fetching comments:', error)
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
    }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
    try {
        const session = await auth()
        const isAdminUser = isAdmin(request)

        // Either need session (for regular users) or admin cookie (for admin)
        if (!session?.user?.email && !isAdminUser) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        await dbConnect()

        const body = await request.json()
        const validatedData = createCommentSchema.parse(body)

        // Determine user details
        let userEmail = session?.user?.email
        let userName = validatedData.userName

        // Handle admin comments
        if (isAdminUser && validatedData.isAdmin && validatedData.userEmail) {
            userEmail = validatedData.userEmail
            userName = validatedData.userName
        }

        if (!userEmail) {
            return NextResponse.json({ error: 'User email required' }, { status: 400 })
        }

        const comment = new Comment({
            postSlug: validatedData.postSlug,
            content: validatedData.content,
            user: {
                email: userEmail,
                name: userName
            },
            replies: [],
            contentUpdatedAt: new Date()
        })

        await comment.save()

        // Return the created comment
        const populatedComment = await Comment.findById(comment._id).lean()

        return NextResponse.json({
            success: true,
            comment: populatedComment
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.issues
            }, { status: 400 })
        } console.error('Error creating comment:', error)
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
    }
}