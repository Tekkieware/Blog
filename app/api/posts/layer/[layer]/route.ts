import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { layer: string } }) {
    await dbConnect();
    try {
        const posts = await Post.find({ layer: params.layer }).sort({ createdAt: -1 });
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}