import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import NewsletterSubscription from '@/models/newsletterSubscription';

export async function GET() {
    try {
        await dbConnect();

        const count = await NewsletterSubscription.countDocuments();

        return NextResponse.json({
            success: true,
            count
        }, { status: 200 });
    } catch (error) {
        console.error('Error fetching newsletter subscriber count:', error);
        return NextResponse.json({
            success: false,
            message: 'Failed to fetch subscriber count',
            count: 0
        }, { status: 500 });
    }
}