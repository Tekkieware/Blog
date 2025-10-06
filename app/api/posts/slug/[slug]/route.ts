import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextResponse } from "next/server";

type RouteContext = {
    params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
    await dbConnect();
    try {
        const { slug } = await context.params;

        const post = await Post.findOne({ slug: slug });
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        return NextResponse.json(post, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch post" }, { status: 500 });
    }
}
