import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import Monitor from '@/models/Monitor';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Get a single monitor
export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const monitor = await Monitor.findOne({
      _id: params.id,
      userId: session.user.id
    });

    if (!monitor) {
      return NextResponse.json({ error: 'Monitor not found' }, { status: 404 });
    }

    return NextResponse.json({ monitor });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch monitor' },
      { status: 500 }
    );
  }
}

// Update a monitor
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await req.json();

    await connectDB();
    const monitor = await Monitor.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!monitor) {
      return NextResponse.json({ error: 'Monitor not found' }, { status: 404 });
    }

    return NextResponse.json({ monitor });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update monitor' },
      { status: 500 }
    );
  }
}

// Delete a monitor
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const monitor = await Monitor.findOneAndDelete({
      _id: params.id,
      userId: session.user.id
    });

    if (!monitor) {
      return NextResponse.json({ error: 'Monitor not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Monitor deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete monitor' },
      { status: 500 }
    );
  }
}
