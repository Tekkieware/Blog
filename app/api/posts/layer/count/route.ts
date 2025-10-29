
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    await dbConnect();
    const session = await auth();

    let matchQuery: any = {};
    if (!session?.user?.isAdmin) {
        matchQuery.status = 'published';
    }

    try {
        const layerCounts = await Post.aggregate([
            { $match: matchQuery },
            { $group: { _id: "$layer", count: { $sum: 1 } } },
        ]);

        const totalPosts = await Post.countDocuments(matchQuery);

        const counts = layerCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {} as { [key: string]: number });

        counts.all = totalPosts;

        return NextResponse.json(counts, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch layer counts" }, { status: 500 });
    }
}
