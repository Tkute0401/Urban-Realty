import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's project favorites with populated project data
    const user = await User.findById(userId).populate({
      path: 'projectFavorites',
      select: 'name description type status startingPrice priceRange location images developer',
      populate: {
        path: 'developer',
        select: 'name logo'
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log(`🔧 API: Retrieved ${user.projectFavorites?.length || 0} project favorites for user ${userId}`);

    return NextResponse.json({
      success: true,
      data: user.projectFavorites || []
    });
  } catch (error) {
    console.error('Error getting project favorites:', error);
    return NextResponse.json(
      { error: 'Failed to get project favorites' },
      { status: 500 }
    );
  }
}
