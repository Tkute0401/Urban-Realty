import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ 
        cities: [], 
        states: [], 
        types: [], 
        amenities: [],
        neighborhoods: [],
        popular: [],
        trending: []
      });
    }

    const searchRegex = new RegExp(query, 'i');
    const suggestionLimit = limit;

    // Use MongoDB aggregations for better performance and counts
    const [citiesResult, statesResult, typesResult, amenitiesResult, neighborhoodsResult] = await Promise.all([
      // Cities with property counts
      Property.aggregate([
        {
          $match: {
            'address.city': searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$address.city',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // States with property counts
      Property.aggregate([
        {
          $match: {
            'address.state': searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$address.state',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // Property types with counts
      Property.aggregate([
        {
          $match: {
            type: searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // Amenities with counts
      Property.aggregate([
        {
          $match: {
            amenities: searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $unwind: '$amenities'
        },
        {
          $match: {
            amenities: searchRegex
          }
        },
        {
          $group: {
            _id: '$amenities',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            _id: 0
          }
        }
      ]),

      // Neighborhoods/Localities with counts
      Property.aggregate([
        {
          $match: {
            'address.locality': searchRegex,
            status: { $in: ['For Sale', 'For Rent'] }
          }
        },
        {
          $group: {
            _id: '$address.locality',
            count: { $sum: 1 },
            city: { $first: '$address.city' }
          }
        },
        {
          $sort: { count: -1, _id: 1 }
        },
        {
          $limit: suggestionLimit
        },
        {
          $project: {
            name: '$_id',
            count: 1,
            city: 1,
            _id: 0
          }
        }
      ])
    ]);

    return NextResponse.json({
      cities: citiesResult,
      states: statesResult,
      types: typesResult,
      amenities: amenitiesResult,
      neighborhoods: neighborhoodsResult,
      popular: [],
      trending: []
    });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json({ 
      cities: [], 
      states: [], 
      types: [], 
      amenities: [],
      neighborhoods: [],
      popular: [],
      trending: []
    }, { status: 500 });
  }
}

