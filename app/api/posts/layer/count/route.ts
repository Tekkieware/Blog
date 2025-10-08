
import dbConnect from "@/lib/db";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const layerCounts = await Post.aggregate([
            { $group: { _id: "$layer", count: { $sum: 1 } } },
        ]);

        const totalPosts = await Post.countDocuments();

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
