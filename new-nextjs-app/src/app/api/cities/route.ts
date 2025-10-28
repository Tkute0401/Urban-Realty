import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  console.log('🔧 API: /api/cities GET request received');
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50'); // Default to top 50 cities

    // Get distinct cities from properties
    const cities = await Property.aggregate([
      {
        $match: {
          'address.city': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$address.city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit
      },
      {
        $project: {
          _id: 0,
          city: '$_id',
          propertyCount: '$count'
        }
      }
    ]);

    // Get distinct localities from properties (popular ones)
    const localities = await Property.aggregate([
      {
        $match: {
          'address.locality': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$address.locality',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: limit * 2 // More localities than cities
      },
      {
        $project: {
          _id: 0,
          locality: '$_id',
          propertyCount: '$count'
        }
      }
    ]);

    console.log(`🔧 API: Found ${cities.length} cities and ${localities.length} localities`);

    return NextResponse.json({
      data: {
        cities,
        localities
      },
      success: true
    });
  } catch (error) {
    console.error('Error fetching cities and localities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities and localities' },
      { status: 500 }
    );
  }
}

