import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    await dbConnect();
    try {
        const post = await Post.findOne({ slug: params.slug });
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch post" }, { status: 500 });
    }
}
