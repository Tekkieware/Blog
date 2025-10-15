
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import NewsletterSubscription from '@/models/newsletterSubscription';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const subscribers = await NewsletterSubscription.find({}).sort({ subscribedAt: -1 });
    return NextResponse.json(subscribers, { status: 200 });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
