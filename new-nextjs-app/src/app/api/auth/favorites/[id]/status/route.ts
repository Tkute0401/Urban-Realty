import { NextRequest, NextResponse } from 'next/server';

// Mock user favorites data - in a real app, this would come from a database
const userFavorites = new Set<string>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // In a real application, you would:
    // 1. Get the user from the session/token
    // 2. Check if the property is in their favorites from the database
    
    // For now, we'll use a simple mock
    const isFavorite = userFavorites.has(id);

    return NextResponse.json({
      isFavorite,
      success: true
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}
