
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const postData = await request.json();
        console.log(postData);
        const post = new Post(postData);
        await post.save();
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to create post" }, { status: 500 });
    }
}
