
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/post";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    await dbConnect();
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const layer = searchParams.get("layer");
    const searchTerm = searchParams.get("searchTerm");
    const includeCount = searchParams.get("includeCount") === "true";

    const skip = (page - 1) * limit;

    let query: any = {};
    if (layer && layer !== "all") {
        query.layer = layer;
    }

    if (searchTerm) {
        query.$or = [
            { title: { $regex: searchTerm, $options: "i" } },
            { content: { $regex: searchTerm, $options: "i" } },
            { excerpt: { $regex: searchTerm, $options: "i" } },
        ];
    }

    // Only filter by 'published' status if the user is not an admin
    if (!session?.user?.isAdmin) {
        query.status = 'published';
    }

    try {
        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .exec();

        if (includeCount) {
            const total = await Post.countDocuments(query);
            return NextResponse.json({ posts, total });
        }

        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json({ message: "Error fetching posts" }, { status: 500 });
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
