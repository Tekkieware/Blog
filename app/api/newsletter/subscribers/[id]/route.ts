
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import NewsletterSubscription from '@/models/newsletterSubscription';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'Subscriber ID is required' }, { status: 400 });
    }

    const deletedSubscription = await NewsletterSubscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return NextResponse.json({ message: 'Subscriber not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Subscriber deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
