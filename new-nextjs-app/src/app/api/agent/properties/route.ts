import { NextRequest, NextResponse } from 'next/server';

// Mock agent properties data
const mockAgentProperties = [
  {
    _id: '1',
    title: 'Luxury Apartment in Downtown',
    buildingName: 'Skyline Towers',
    price: 15000000,
    area: 1200,
    bedrooms: 3,
    bathrooms: 2,
    type: 'Apartment',
    status: 'For Sale',
    description: 'Beautiful luxury apartment with modern amenities and stunning city views.',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    images: [
      { url: '/api/placeholder/400/300', alt: 'Living room' },
      { url: '/api/placeholder/400/300', alt: 'Kitchen' },
      { url: '/api/placeholder/400/300', alt: 'Bedroom' }
    ],
    projectDetails: {
      launchDate: '2024-06-01',
      developer: 'ABC Developers'
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777
    },
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Lift'],
    highlights: ['Prime Location', 'Modern Design', 'High Floor'],
    agentId: 'agent1'
  },
  {
    _id: '2',
    title: 'Spacious Villa with Garden',
    buildingName: 'Garden Villa Complex',
    price: 25000000,
    area: 2000,
    bedrooms: 4,
    bathrooms: 3,
    type: 'Villa',
    status: 'For Sale',
    description: 'Spacious villa with private garden and modern amenities.',
    address: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001'
    },
    images: [
      { url: '/api/placeholder/400/300', alt: 'Exterior view' },
      { url: '/api/placeholder/400/300', alt: 'Garden' },
      { url: '/api/placeholder/400/300', alt: 'Living area' }
    ],
    projectDetails: {
      launchDate: '2024-08-01',
      developer: 'XYZ Builders'
    },
    location: {
      latitude: 28.6139,
      longitude: 77.2090
    },
    amenities: ['Garden', 'Parking', 'Security', 'Power Backup'],
    highlights: ['Private Garden', 'Spacious Layout', 'Premium Location'],
    agentId: 'agent1'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const agentId = searchParams.get('agentId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Filter properties by agent ID
    const agentProperties = mockAgentProperties.filter(property => 
      property.agentId === agentId
    );

    // Calculate pagination
    const total = agentProperties.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = agentProperties.slice(startIndex, endIndex);

    return NextResponse.json({
      properties: paginatedProperties,
      page,
      limit,
      total,
      totalPages,
      success: true
    });
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent properties' },
      { status: 500 }
    );
  }
}
