
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const includeCount = url.searchParams.get("includeCount") === "true";
        const layer = url.searchParams.get("layer");

        const skip = (page - 1) * limit;

        let query = {};
        if (layer && layer !== 'all') {
            query = { layer };
        }

        const posts = await Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

        if (includeCount) {
            const total = await Post.countDocuments(query);
            return NextResponse.json({ posts, total }, { status: 200 });
        }

        return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const postData = await request.json();
        let slug = postData.slug;
        let existingPost = await Post.findOne({ slug });
        while (existingPost) {
            slug = `${postData.slug}-${Math.random().toString(36).substring(2, 7)}`;
            existingPost = await Post.findOne({ slug });
        }
        postData.slug = slug;
        const post = new Post(postData);
        await post.save();
        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to create post" }, { status: 500 });
    }
}
