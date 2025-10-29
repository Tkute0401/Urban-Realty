import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import Project from '@/models/Project';

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

    // Check if project exists
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Add project to user's favorites
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { projectFavorites: id } },
      { new: true }
    );

    console.log(`🔧 API: Added project ${id} to user ${userId} favorites`);

    return NextResponse.json({
      success: true,
      message: 'Project added to favorites'
    });
  } catch (error) {
    console.error('Error adding project to favorites:', error);
    return NextResponse.json(
      { error: 'Failed to add project to favorites' },
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

    // Remove project from user's favorites
    await User.findByIdAndUpdate(
      userId,
      { $pull: { projectFavorites: id } },
      { new: true }
    );

    console.log(`🔧 API: Removed project ${id} from user ${userId} favorites`);

    return NextResponse.json({
      success: true,
      message: 'Project removed from favorites'
    });
  } catch (error) {
    console.error('Error removing project from favorites:', error);
    return NextResponse.json(
      { error: 'Failed to remove project from favorites' },
      { status: 500 }
    );
  }
}
