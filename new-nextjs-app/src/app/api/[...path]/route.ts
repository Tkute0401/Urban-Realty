import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  
  console.log('API route called with path:', path);
  
  // Mock properties data
  const mockProperties = [
    {
      _id: "mock_prop_1",
      title: "Modern Apartment in Bandra",
      address: {
        street: "123 Sea View Road",
        city: "Mumbai",
        state: "Maharashtra",
        locality: "Bandra"
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
      _id: "mock_prop_2",
      title: "Luxury Villa in Gurgaon",
      address: {
        street: "456 Golf Course Road",
        city: "Delhi",
        state: "Haryana",
        locality: "Gurgaon"
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
  
  return NextResponse.json({ 
    success: false,
    error: 'API route not found',
    message: 'Endpoint not available',
    path: path
  }, { status: 404 });
}