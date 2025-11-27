
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/post";
import dbConnect from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
    await dbConnect();
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

