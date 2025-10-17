import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import dbConnect from '@/lib/db'
import Comment from '@/models/comment'
import { z } from 'zod'
import mongoose from 'mongoose'

// Validation schema for reply
const createReplySchema = z.object({
    content: z.string().min(1, 'Reply content is required').max(1000, 'Reply cannot exceed 1000 characters'),
    userName: z.string().min(1, 'Name is required').max(50, 'Name cannot exceed 50 characters'),
    userEmail: z.string().email().optional(),
    isAdmin: z.boolean().optional(),
    contentUpdatedAt: z.date().optional()
})

// POST - Add a reply to a comment
export async function POST(
    request: NextRequest,
    { params }: { params: { commentId: string } }
) {
    try {
        const session = await auth()
        const isAdminUser = isAdmin(request)

        // Either need session (for regular users) or admin cookie (for admin)
        if (!session?.user?.email && !isAdminUser) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        await dbConnect()

        const { commentId } = params

        // Validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
        }

        const body = await request.json()
        const validatedData = createReplySchema.parse(body)

        // Find the comment
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        // Determine user details
        let userEmail = session?.user?.email
        let userName = validatedData.userName

        // Handle admin replies
        if (isAdminUser && validatedData.isAdmin && validatedData.userEmail) {
            userEmail = validatedData.userEmail
            userName = validatedData.userName
        }

        if (!userEmail) {
            return NextResponse.json({ error: 'User email required' }, { status: 400 })
        }

        // Add the reply
        const replyData = {
            content: validatedData.content,
            user: {
                email: userEmail,
                name: userName
            },
            contentUpdatedAt: new Date()
        }

        await comment.addReply(replyData)

        // Get the updated comment with the new reply
        const updatedComment = await Comment.findById(commentId).lean() as any

        if (!updatedComment) {
            return NextResponse.json({ error: 'Failed to retrieve updated comment' }, { status: 500 })
        }

        const newReply = updatedComment.replies[updatedComment.replies.length - 1]

        return NextResponse.json({
            success: true,
            reply: newReply,
            comment: updatedComment
        }, { status: 201 })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.issues
            }, { status: 400 })
        }

        console.error('Error creating reply:', error)
        return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
    }
}