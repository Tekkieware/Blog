
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import NewsletterSubscription from '@/models/newsletterSubscription';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const existingSubscription = await NewsletterSubscription.findOne({ email });

    if (existingSubscription) {
      return NextResponse.json({ message: 'Email already subscribed' }, { status: 409 });
    }

    const newSubscription = new NewsletterSubscription({ email });
    await newSubscription.save();

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
