import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import User from '@/models/User';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if project is in user's favorites
    const user = await User.findById(userId).select('projectFavorites');
    const isFavorite = user?.projectFavorites?.includes(id) || false;

    console.log(`🔧 API: Checked favorite status for project ${id} and user ${userId}: ${isFavorite}`);

    return NextResponse.json({
      isFavorite,
      success: true
    });
  } catch (error) {
    console.error('Error checking project favorite status:', error);
    return NextResponse.json(
      { error: 'Failed to check project favorite status' },
      { status: 500 }
    );
  }
}
