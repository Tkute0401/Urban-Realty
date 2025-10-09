import { NextRequest, NextResponse } from 'next/server';

// Mock properties data - in a real app, this would come from a database
const mockProperties = [
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
    description: 'Beautiful luxury apartment with modern amenities and stunning city views. This property features a spacious living area, modern kitchen with premium appliances, and three well-appointed bedrooms. The master bedroom includes an en-suite bathroom and walk-in closet. The apartment offers panoramic views of the city skyline and is located in a prestigious building with 24/7 security and concierge services.',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001'
    },
    images: [
      { url: '/api/placeholder/400/300', alt: 'Living room', caption: 'Spacious living area with city views' },
      { url: '/api/placeholder/400/300', alt: 'Kitchen', caption: 'Modern kitchen with premium appliances' },
      { url: '/api/placeholder/400/300', alt: 'Master bedroom', caption: 'Master bedroom with en-suite bathroom' },
      { url: '/api/placeholder/400/300', alt: 'Balcony', caption: 'Private balcony with city views' }
    ],
    projectDetails: {
      launchDate: '2024-06-01',
      possessionDate: '2025-12-01',
      developer: 'ABC Developers'
    },
    location: {
      latitude: 19.0760,
      longitude: 72.8777
    },
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security', 'Lift', 'Power Backup', 'Water Supply', 'Internet'],
    highlights: ['Prime Location', 'Modern Design', 'High Floor', 'City Views', 'Premium Amenities'],
    floorPlan: {
      image: '/api/placeholder/600/400',
      description: '3 BHK apartment with spacious living area, modern kitchen, and three well-appointed bedrooms.'
    },
    nearbyPlaces: [
      { name: 'Mumbai Central Station', type: 'Transport', distance: '500m' },
      { name: 'Phoenix MarketCity', type: 'Shopping', distance: '1.2km' },
      { name: 'KEM Hospital', type: 'Healthcare', distance: '800m' },
      { name: 'St. Xavier\'s College', type: 'Education', distance: '1.5km' }
    ]
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
    description: 'Spacious villa with private garden and modern amenities. This beautiful villa features four bedrooms, three bathrooms, a spacious living area, and a private garden. The property is perfect for families looking for space and privacy in the heart of the city.',
    address: {
      street: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001'
    },
    images: [
      { url: '/api/placeholder/400/300', alt: 'Exterior view', caption: 'Beautiful villa exterior' },
      { url: '/api/placeholder/400/300', alt: 'Garden', caption: 'Private garden space' },
      { url: '/api/placeholder/400/300', alt: 'Living area', caption: 'Spacious living room' },
      { url: '/api/placeholder/400/300', alt: 'Master bedroom', caption: 'Master bedroom' }
    ],
    projectDetails: {
      launchDate: '2024-08-01',
      possessionDate: '2025-06-01',
      developer: 'XYZ Builders'
    },
    location: {
      latitude: 28.6139,
      longitude: 77.2090
    },
    amenities: ['Garden', 'Parking', 'Security', 'Power Backup', 'Water Supply'],
    highlights: ['Private Garden', 'Spacious Layout', 'Premium Location', 'Family Friendly'],
    floorPlan: {
      image: '/api/placeholder/600/400',
      description: '4 BHK villa with private garden, spacious living areas, and modern amenities.'
    },
    nearbyPlaces: [
      { name: 'Connaught Place', type: 'Shopping', distance: '2km' },
      { name: 'Delhi Metro Station', type: 'Transport', distance: '1km' },
      { name: 'AIIMS Hospital', type: 'Healthcare', distance: '3km' },
      { name: 'Delhi University', type: 'Education', distance: '4km' }
    ]
  },
  {
    _id: '3',
    title: 'Modern Office Space',
    buildingName: 'Business Center',
    price: 5000000,
    area: 800,
    bedrooms: 0,
    bathrooms: 2,
    type: 'Commercial',
    status: 'For Rent',
    description: 'Modern office space in prime business district. Perfect for startups and established businesses looking for a professional workspace in the heart of the city.',
    address: {
      street: '789 Business Street',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001'
    },
    images: [
      { url: '/api/placeholder/400/300', alt: 'Office space', caption: 'Modern office space' },
      { url: '/api/placeholder/400/300', alt: 'Conference room', caption: 'Conference room' },
      { url: '/api/placeholder/400/300', alt: 'Reception', caption: 'Reception area' }
    ],
    projectDetails: {
      developer: 'Commercial Developers'
    },
    location: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    amenities: ['Parking', 'Security', 'Lift', 'Power Backup', 'Internet', 'Air Conditioning'],
    highlights: ['Prime Business Location', 'Modern Infrastructure', 'Flexible Layout'],
    nearbyPlaces: [
      { name: 'MG Road', type: 'Shopping', distance: '500m' },
      { name: 'Bangalore Metro', type: 'Transport', distance: '300m' },
      { name: 'Apollo Hospital', type: 'Healthcare', distance: '1km' },
      { name: 'IISc', type: 'Education', distance: '2km' }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find property by ID
    const property = mockProperties.find(p => p._id === id);
    
    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      property,
      success: true
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.formData();
    
    // Find property by ID
    const propertyIndex = mockProperties.findIndex(p => p._id === id);
    
    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Update property data
    const updatedProperty = {
      ...mockProperties[propertyIndex],
      title: formData.get('title') as string || mockProperties[propertyIndex].title,
      buildingName: formData.get('buildingName') as string || mockProperties[propertyIndex].buildingName,
      price: parseInt(formData.get('price') as string) || mockProperties[propertyIndex].price,
      area: parseInt(formData.get('area') as string) || mockProperties[propertyIndex].area,
      bedrooms: parseInt(formData.get('bedrooms') as string) || mockProperties[propertyIndex].bedrooms,
      bathrooms: parseInt(formData.get('bathrooms') as string) || mockProperties[propertyIndex].bathrooms,
      type: formData.get('type') as string || mockProperties[propertyIndex].type,
      status: formData.get('status') as string || mockProperties[propertyIndex].status,
      description: formData.get('description') as string || mockProperties[propertyIndex].description,
      address: formData.get('address') ? JSON.parse(formData.get('address') as string) : mockProperties[propertyIndex].address,
      amenities: formData.getAll('amenities') as string[] || mockProperties[propertyIndex].amenities,
      highlights: formData.getAll('highlights') as string[] || mockProperties[propertyIndex].highlights
    };

    // In a real application, update in database here
    mockProperties[propertyIndex] = updatedProperty;

    return NextResponse.json({
      property: updatedProperty,
      success: true,
      message: 'Property updated successfully'
    });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find property by ID
    const propertyIndex = mockProperties.findIndex(p => p._id === id);
    
    if (propertyIndex === -1) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Remove property from array
    mockProperties.splice(propertyIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
