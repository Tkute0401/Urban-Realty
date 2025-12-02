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
      return NextResponse.json({ cities: [], states: [], types: [], amenities: [] });
    }

    const searchRegex = new RegExp(query, 'i');
    const cities = new Set<string>();
    const states = new Set<string>();
    const types = new Set<string>();
    const amenities = new Set<string>();

    // Search for properties matching the query
    const properties = await Property.find({
      $or: [
        { title: searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex },
        { type: searchRegex },
        { amenities: searchRegex }
      ]
    })
      .limit(20)
      .select('title address.city address.state type amenities');

    // Categorize results
    properties.forEach(property => {
      // Add cities
      if (property.address?.city && property.address.city.toLowerCase().includes(query.toLowerCase())) {
        cities.add(property.address.city);
      }

      // Add states
      if (property.address?.state && property.address.state.toLowerCase().includes(query.toLowerCase())) {
        states.add(property.address.state);
      }

      // Add property types
      if (property.type && property.type.toLowerCase().includes(query.toLowerCase())) {
        types.add(property.type);
      }

      // Add amenities
      if (property.amenities && Array.isArray(property.amenities)) {
        property.amenities.forEach((amenity: string) => {
          if (amenity && amenity.toLowerCase().includes(query.toLowerCase())) {
            amenities.add(amenity);
          }
        });
      }
    });

    // Add popular property types if they match
    const propertyTypes = ['Houses', 'Condos/Co-ops', 'Townhomes', 'Multi-family', 'Manufactured', 'Lots/Land', 'Apartments'];
    propertyTypes.forEach(type => {
      if (type.toLowerCase().includes(query.toLowerCase())) {
        types.add(type);
      }
    });

    // Add popular locations if they match
    const popularCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad'];
    popularCities.forEach(city => {
      if (city.toLowerCase().includes(query.toLowerCase())) {
        cities.add(city);
      }
    });

    // Convert sets to arrays and limit results
    return NextResponse.json({
      cities: Array.from(cities).slice(0, limit),
      states: Array.from(states).slice(0, limit),
      types: Array.from(types).slice(0, limit),
      amenities: Array.from(amenities).slice(0, limit)
    });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json({ cities: [], states: [], types: [], amenities: [] }, { status: 500 });
  }
}

