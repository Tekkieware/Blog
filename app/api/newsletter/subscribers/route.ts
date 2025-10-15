
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import NewsletterSubscription from '@/models/newsletterSubscription';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const subscribers = await NewsletterSubscription.find({}).sort({ subscribedAt: -1 }).skip(skip).limit(limit);
    const total = await NewsletterSubscription.countDocuments();

    return NextResponse.json({ subscribers, total }, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
