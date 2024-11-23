import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Monitor from '@/models/Monitor';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get all monitors for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const monitors = await Monitor.find({ userId: session.user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ monitors });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    );
  }
}

// Create a new monitor
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, url, interval, notifications } = await req.json();

    await connectDB();
    const monitor = await Monitor.create({
      userId: session.user.id,
      name,
      url,
      interval,
      notifications
    });

    return NextResponse.json({ monitor }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create monitor' },
      { status: 500 }
    );
  }
}
