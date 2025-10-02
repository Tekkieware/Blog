import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const post = await Post.findById(params.id);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch post" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const postData = await request.json();
        if (postData.slug) {
            let slug = postData.slug;
            let existingPost = await Post.findOne({ slug, _id: { $ne: params.id } });
            while (existingPost) {
                slug = `${postData.slug}-${Math.random().toString(36).substring(2, 7)}`;
                existingPost = await Post.findOne({ slug, _id: { $ne: params.id } });
            }
            postData.slug = slug;
        }
        const updatedPost = await Post.findByIdAndUpdate(params.id, postData, { new: true });
        if (!updatedPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(updatedPost, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to update post" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const deletedPost = await Post.findByIdAndDelete(params.id);
        if (!deletedPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete post" }, { status: 500 });
    }
}