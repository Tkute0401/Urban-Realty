import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '5');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }
    
    // Search in titles, descriptions, and locations
    const properties = await Property.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { 'address.city': { $regex: query, $options: 'i' } },
        { 'address.state': { $regex: query, $options: 'i' } }
      ]
    })
    .limit(limit)
    .select('title address.city address.state');
    
    // Extract unique suggestions
    const suggestions: string[] = [];
    const seen = new Set<string>();
    
    properties.forEach(property => {
      if (property.address?.city && !seen.has(property.address.city)) {
        seen.add(property.address.city);
        suggestions.push(`${property.address.city}, ${property.address.state || ''}`);
      }
    });
    
    // Also add popular locations as fallback
    const popularLocations = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
      'Pune', 'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad'
    ];
    
    popularLocations.forEach(location => {
      if (location.toLowerCase().includes(query.toLowerCase()) && suggestions.length < limit) {
        if (!seen.has(location)) {
          seen.add(location);
          suggestions.push(location);
        }
      }
    });
    
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json({ suggestions: [] });
  }
}

