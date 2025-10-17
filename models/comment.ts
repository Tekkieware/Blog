import mongoose, { Schema, Document } from 'mongoose'

// Reply interface (embedded in comments)
export interface IReply {
    _id?: mongoose.Types.ObjectId
    content: string
    user: {
        email: string
        name: string
    }
    createdAt: Date
    updatedAt: Date
    contentUpdatedAt: Date
}

// Comment interface
export interface IComment extends Document {
    postSlug: string
    content: string
    user: {
        email: string
        name: string
    }
    replies: IReply[]
    createdAt: Date
    updatedAt: Date
    contentUpdatedAt: Date
}

// Reply schema (embedded)
const ReplySchema = new Schema<IReply>({
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [1000, 'Reply cannot exceed 1000 characters']
    },
    user: {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters']
        }
    },
    contentUpdatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
})

// Comment schema
const CommentSchema = new Schema<IComment>({
    postSlug: {
        type: String,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },
    user: {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters']
        }
    },
    replies: [ReplySchema],
    contentUpdatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    timestamps: true
})

// Create indexes for better performance
CommentSchema.index({ postSlug: 1, createdAt: -1 })
CommentSchema.index({ 'user.email': 1 })

// Pre-save middleware to sanitize content
CommentSchema.pre('save', function (next) {
    // Basic content sanitization
    this.content = this.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    this.user.name = this.user.name.replace(/[<>]/g, '')

    // Sanitize replies
    this.replies.forEach(reply => {
        reply.content = reply.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        reply.user.name = reply.user.name.replace(/[<>]/g, '')
    })

    next()
})

// Instance methods
CommentSchema.methods.addReply = function (replyData: Omit<IReply, '_id' | 'createdAt' | 'updatedAt'>) {
    this.replies.push(replyData)
    return this.save()
}

CommentSchema.methods.getReplyCount = function () {
    return this.replies.length
}

// Export the model
export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)