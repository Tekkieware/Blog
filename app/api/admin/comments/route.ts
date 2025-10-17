import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Comment from '@/models/comment'

// GET - Admin route to view comment statistics
export async function GET(request: NextRequest) {
    try {
        // Check if user is admin (you can implement proper admin auth here)
        const isLoggedIn = request.cookies.get("isLoggedIn")?.value === "true"

        if (!isLoggedIn) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
        }

        await dbConnect()

        // Get overall comment statistics
        const totalComments = await Comment.countDocuments()

        const statsResult = await Comment.aggregate([
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: 1 },
                    totalReplies: { $sum: { $size: '$replies' } }
                }
            }
        ])

        const stats = statsResult[0] || { totalComments: 0, totalReplies: 0 }

        // Get comments by post
        const commentsByPost = await Comment.aggregate([
            {
                $group: {
                    _id: '$postSlug',
                    commentCount: { $sum: 1 },
                    replyCount: { $sum: { $size: '$replies' } }
                }
            },
            {
                $sort: { commentCount: -1 }
            },
            {
                $limit: 10
            }
        ])

        // Get recent comments
        const recentComments = await Comment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('postSlug user.name user.email content createdAt')
            .lean()

        return NextResponse.json({
            success: true,
            stats: {
                totalComments: stats.totalComments,
                totalReplies: stats.totalReplies,
                totalInteractions: stats.totalComments + stats.totalReplies
            },
            commentsByPost,
            recentComments
        })

    } catch (error) {
        console.error('Error fetching admin comment stats:', error)
        return NextResponse.json({ error: 'Failed to fetch comment statistics' }, { status: 500 })
    }
}