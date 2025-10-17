import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import Property from '@/models/Property';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectDB();

    const { id } = params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if property exists
    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Add property to user's favorites
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: id } },
      { new: true }
    );

    console.log(`🔧 API: Added property ${id} to user ${userId} favorites`);

    return NextResponse.json({
      success: true,
      message: 'Property added to favorites'
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectDB();

    const { id } = params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Remove property from user's favorites
    await User.findByIdAndUpdate(
      userId,
      { $pull: { favorites: id } },
      { new: true }
    );

    console.log(`🔧 API: Removed property ${id} from user ${userId} favorites`);

    return NextResponse.json({
      success: true,
      message: 'Property removed from favorites'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}