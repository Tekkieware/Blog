
import mongoose, { Document, Model, model, models, Schema } from "mongoose";

export interface IPost extends Document {
    title: string;
    content: string;
    author: string;
    tags: string[];
    coverImage: string;
    coverImageAlt?: string;
    debug_notes: string[];
    excerpt: string;
    slug: string;
    layer: string;
}

const PostSchema = new Schema<IPost>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: { type: String, required: true },
        tags: { type: [String], default: [] },
        coverImage: { type: String, required: true },
        coverImageAlt: { type: String, required: true },
        excerpt: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        layer: { type: String, required: true },
        debug_notes: { type: [String], default: [] },

    },
    { timestamps: true }
);

const Post: Model<IPost> = models.Post || model<IPost>("Post", PostSchema);

export default Post;
