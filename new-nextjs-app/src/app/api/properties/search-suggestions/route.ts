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
      return NextResponse.json({ suggestions: [] });
    }
    
    const searchRegex = new RegExp(query, 'i');
    const suggestions: string[] = [];
    const seen = new Set<string>();
    
    // Search for property titles
    const properties = await Property.find({
      $or: [
        { title: searchRegex },
        { 'address.city': searchRegex },
        { 'address.state': searchRegex },
        { type: searchRegex }
      ]
    })
    .limit(20)
    .select('title address.city address.state type amenities');
    
    // Add property titles
    properties.forEach(property => {
      if (property.title && !seen.has(property.title)) {
        seen.add(property.title);
        suggestions.push(property.title);
      }
    });
    
    // Add cities with state
    properties.forEach(property => {
      if (property.address?.city) {
        const cityState = property.address.state 
          ? `${property.address.city}, ${property.address.state}`
          : property.address.city;
        if (!seen.has(cityState)) {
          seen.add(cityState);
          suggestions.push(cityState);
        }
      }
    });
    
    // Add property types
    const propertyTypes = ['Houses', 'Condos/Co-ops', 'Townhomes', 'Multi-family', 'Manufactured', 'Lots/Land', 'Apartments'];
    propertyTypes.forEach(type => {
      if (type.toLowerCase().includes(query.toLowerCase()) && !seen.has(type) && suggestions.length < limit) {
        seen.add(type);
        suggestions.push(type);
      }
    });
    
    // Add unique amenities from properties
    const allAmenities = new Set<string>();
    properties.forEach(property => {
      if (property.amenities && Array.isArray(property.amenities)) {
        property.amenities.forEach((amenity: string) => {
          if (amenity && amenity.toLowerCase().includes(query.toLowerCase())) {
            allAmenities.add(amenity);
          }
        });
      }
    });
    
    allAmenities.forEach(amenity => {
      if (!seen.has(amenity) && suggestions.length < limit) {
        seen.add(amenity);
        suggestions.push(amenity);
      }
    });
    
    // Add popular locations as fallback if we don't have enough suggestions
    const popularLocations = [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
      'Pune', 'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad'
    ];
    
    popularLocations.forEach(location => {
      if (location.toLowerCase().includes(query.toLowerCase()) && !seen.has(location) && suggestions.length < limit) {
        seen.add(location);
        suggestions.push(location);
      }
    });
    
    // Return only the requested number of suggestions
    return NextResponse.json({ suggestions: suggestions.slice(0, limit) });
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}

