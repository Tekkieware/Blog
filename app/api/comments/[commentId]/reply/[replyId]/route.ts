import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import dbConnect from '@/lib/db'
import Comment from '@/models/comment'
import { z } from 'zod'
import mongoose from 'mongoose'

// Validation schema for updating replies
const updateReplySchema = z.object({
    content: z.string().min(1, 'Reply content is required').max(1000, 'Reply cannot exceed 1000 characters'),
    contentUpdatedAt: z.date().optional(),
})

// PUT - Update a reply
export async function PUT(
    request: NextRequest,
    { params }: { params: { commentId: string, replyId: string } }
) {
    try {
        const session = await auth()
        const isAdminUser = isAdmin(request)

        // Either need session (for regular users) or admin cookie (for admin)
        if (!session?.user?.email && !isAdminUser) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        await dbConnect()

        const { commentId, replyId } = params

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(replyId)) {
            return NextResponse.json({ error: 'Invalid comment or reply ID' }, { status: 400 })
        }

        const body = await request.json()
        const validatedData = updateReplySchema.parse(body)

        // Find the comment
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        // Find the reply
        const reply = comment.replies.id(replyId)

        if (!reply) {
            return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
        }

        // Check if user owns the reply or is admin
        const userEmail = session?.user?.email
        const isOwner = userEmail === reply.user.email

        if (!isOwner && !isAdminUser) {
            return NextResponse.json({ error: 'You can only edit your own replies' }, { status: 403 })
        }

        // Update the reply using findOneAndUpdate with positional operator
        await Comment.findOneAndUpdate(
            { _id: commentId, 'replies._id': replyId },
            {
                $set: {
                    'replies.$.content': validatedData.content,
                    'replies.$.contentUpdatedAt': new Date()
                }
            },
            { new: true }
        )

        const updatedComment = await Comment.findById(commentId).lean()

        return NextResponse.json({
            success: true,
            comment: updatedComment
        })

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: 'Validation failed',
                details: error.issues
            }, { status: 400 })
        }

        console.error('Error updating reply:', error)
        return NextResponse.json({ error: 'Failed to update reply' }, { status: 500 })
    }
}

// DELETE - Delete a reply
export async function DELETE(
    request: NextRequest,
    { params }: { params: { commentId: string, replyId: string } }
) {
    try {
        const session = await auth()
        const isAdminUser = isAdmin(request)

        // Either need session (for regular users) or admin cookie (for admin)
        if (!session?.user?.email && !isAdminUser) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        await dbConnect()

        const { commentId, replyId } = params

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(replyId)) {
            return NextResponse.json({ error: 'Invalid comment or reply ID' }, { status: 400 })
        }

        // Find the comment
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        // Find the reply
        const reply = comment.replies.id(replyId)

        if (!reply) {
            return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
        }

        // Check if user owns the reply or is admin
        const userEmail = session?.user?.email
        const isOwner = userEmail === reply.user.email

        if (!isOwner && !isAdminUser) {
            return NextResponse.json({ error: 'You can only delete your own replies' }, { status: 403 })
        }

        // Remove the reply
        comment.replies.pull(replyId)
        await comment.save()

        const updatedComment = await Comment.findById(commentId).lean()

        return NextResponse.json({
            success: true,
            comment: updatedComment
        })

    } catch (error) {
        console.error('Error deleting reply:', error)
        return NextResponse.json({ error: 'Failed to delete reply' }, { status: 500 })
    }
}