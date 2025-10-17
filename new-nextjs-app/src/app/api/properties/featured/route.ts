import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  console.log('🔧 API: /api/properties/featured GET request received');
  try {
    // Connect to database
    await connectDB();

    // Get featured properties from database (properties with featured flag or high views)
    const featuredProperties = await Property.find({
      $or: [
        { featured: true },
        { views: { $gte: 100 } }, // Properties with 100+ views
        { status: 'For Sale' } // Active properties
      ]
    })
    .populate('agent', 'name email phone')
    .sort({ views: -1, createdAt: -1 })
    .limit(6); // Limit to 6 featured properties

    console.log(`🔧 API: Returning ${featuredProperties.length} featured properties from database`);

    return NextResponse.json({
      data: featuredProperties,
      success: true,
      total: featuredProperties.length,
      count: featuredProperties.length
    });
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured properties' },
      { status: 500 }
    );
  }
}