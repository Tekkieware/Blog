import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { isAdmin } from '@/lib/auth-utils'
import dbConnect from '@/lib/db'
import Comment from '@/models/comment'
import { z } from 'zod'
import mongoose from 'mongoose'

// Validation schema for updating comments
const updateCommentSchema = z.object({
    content: z.string().min(1, 'Comment content is required').max(2000, 'Comment cannot exceed 2000 characters'),
    contentUpdatedAt: z.date().optional(),
})

// GET - Get a single comment by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        await dbConnect()

        const { commentId } = await params

        // Validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
        }

        const comment = await Comment.findById(commentId).lean()

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        return NextResponse.json({ comment })
    } catch (error) {
        console.error('Error fetching comment:', error)
        return NextResponse.json({ error: 'Failed to fetch comment' }, { status: 500 })
    }
}

// PUT - Update a comment
export async function PUT(request: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const session = await auth()
        const isAdminUser = isAdmin(request)

        // Either need session (for regular users) or admin cookie (for admin)
        if (!session?.user?.email && !isAdminUser) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        await dbConnect()

        const { commentId } = await params

        // Validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
        }

        const body = await request.json()
        const validatedData = updateCommentSchema.parse(body)

        // Find the comment
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        // Check if user owns the comment or is admin
        const userEmail = session?.user?.email
        const isOwner = userEmail === comment.user.email

        if (!isOwner && !isAdminUser) {
            return NextResponse.json({ error: 'You can only edit your own comments' }, { status: 403 })
        }

        // Update the comment using findOneAndUpdate
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: commentId },
            {
                content: validatedData.content,
                contentUpdatedAt: new Date()
            },
            { new: true }
        )

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

        console.error('Error updating comment:', error)
        return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 })
    }
}

// DELETE - Delete a comment
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ commentId: string }> }) {
    try {
        const session = await auth()
        const isAdminUser = isAdmin(request)

        // Either need session (for regular users) or admin cookie (for admin)
        if (!session?.user?.email && !isAdminUser) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        await dbConnect()

        const { commentId } = await params

        // Validate commentId
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
        }

        // Find the comment
        const comment = await Comment.findById(commentId)

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
        }

        // Check if user owns the comment or is admin
        const userEmail = session?.user?.email
        const isOwner = userEmail === comment.user.email

        if (!isOwner && !isAdminUser) {
            return NextResponse.json({ error: 'You can only delete your own comments' }, { status: 403 })
        }

        // Delete the comment
        await Comment.findByIdAndDelete(commentId)

        return NextResponse.json({
            success: true,
            message: 'Comment deleted successfully'
        })

    } catch (error) {
        console.error('Error deleting comment:', error)
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
    }
}