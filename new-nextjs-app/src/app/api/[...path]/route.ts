import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  
  console.log('API route called with path:', path);
  
  // Mock properties data
  const mockProperties = [
    {
      _id: "68566b6b9b0fdb60e5cbcea4",
      title: "Modern Apartment in Bandra",
      address: {
        street: "123 Sea View Road",
        city: "Mumbai",
        state: "Maharashtra",
        locality: "Bandra"
      },
      location: {
        coordinates: [72.8261, 19.0596] // [lng, lat] for Bandra, Mumbai
      },
      price: 5000000,
      propertyType: "apartment",
      listingType: "sale",
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      sqft: 1200,
      images: ["/placeholder-property.jpg"],
      amenities: ["Pool", "Gym", "Parking", "Security"],
      developer: {
        name: "Prestige Group",
        contact: "contact@prestige.com"
      },
      highlights: ["Sea View", "Prime Location", "Modern Amenities"],
      nearby: [
        { name: "Airport", distance: "5 km", type: "transport" },
        { name: "Shopping Mall", distance: "2 km", type: "shopping" }
      ]
    },
    {
      _id: "680cb6370b06b388af8e6ce4",
      title: "Luxury Villa in Gurgaon",
      address: {
        street: "456 Golf Course Road",
        city: "Delhi",
        state: "Haryana",
        locality: "Gurgaon"
      },
      location: {
        coordinates: [77.1025, 28.4595] // [lng, lat] for Gurgaon
      },
      price: 15000000,
      propertyType: "villa",
      listingType: "sale",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      sqft: 2500,
      images: ["/placeholder-property.jpg"],
      amenities: ["Garden", "Parking", "Security", "Fireplace"],
      developer: {
        name: "DLF Limited",
        contact: "contact@dlf.com"
      },
      highlights: ["Golf Course View", "Spacious", "Luxury Finishes"],
      nearby: [
        { name: "Metro Station", distance: "3 km", type: "transport" },
        { name: "Hospital", distance: "1 km", type: "healthcare" }
      ]
    },
    {
      _id: "680ac17c3e3b9100aaa10559",
      title: "Cozy Apartment in Bangalore",
      address: {
        street: "789 Tech Park Road",
        city: "Bangalore",
        state: "Karnataka",
        locality: "Koramangala"
      },
      location: {
        coordinates: [77.5946, 12.9352] // [lng, lat] for Bangalore
      },
      price: 35000,
      propertyType: "apartment",
      listingType: "rent",
      bedrooms: 2,
      bathrooms: 2,
      area: 900,
      sqft: 900,
      images: ["/placeholder-property.jpg"],
      amenities: ["Gym", "Parking", "Security", "Balcony"],
      developer: {
        name: "Sobha Limited",
        contact: "contact@sobha.com"
      },
      highlights: ["Tech Hub Location", "Modern Design", "Great Connectivity"],
      nearby: [
        { name: "IT Park", distance: "1 km", type: "work" },
        { name: "Metro Station", distance: "2 km", type: "transport" }
      ]
    }
  ];
  
  // Handle specific endpoints
  if (path === 'v1/properties' || path === 'v1/properties/featured') {
    return NextResponse.json({
      success: true,
      data: mockProperties,
      total: mockProperties.length,
      count: mockProperties.length,
      pagination: {
        currentPage: 1,
        limit: 25,
        totalPages: 1,
        total: mockProperties.length
      }
    });
  }
  
  // Handle individual property requests
  if (path.startsWith('v1/properties/') && path !== 'v1/properties/featured') {
    const propertyId = path.replace('v1/properties/', '');
    console.log('🔍 API route - Looking for property ID:', propertyId);
    
    const property = mockProperties.find(p => p._id === propertyId);
    
    if (property) {
      console.log('🔍 API route - Found property:', property.title);
      return NextResponse.json({
        success: true,
        data: property
      });
    } else {
      console.log('🔍 API route - Property not found for ID:', propertyId);
      return NextResponse.json({
        success: false,
        error: 'Property not found',
        message: 'The requested property could not be found',
        data: null
      }, { status: 404 });
    }
  }
  
  return NextResponse.json({ 
    success: false,
    error: 'API route not found',
    message: 'Endpoint not available',
    path: path
  }, { status: 404 });
}