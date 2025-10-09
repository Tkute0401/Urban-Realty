import { NextRequest, NextResponse } from 'next/server';

// Mock data for development - replace with actual database calls
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
    highlights: ['Prime Location', 'Modern Design', 'High Floor']
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
    highlights: ['Private Garden', 'Spacious Layout', 'Premium Location']
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
    description: 'Modern office space in prime business district.',
    address: {
      street: '789 Business Street',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001'
    },
    images: [
      { url: '/api/placeholder/400/300', alt: 'Office space' },
      { url: '/api/placeholder/400/300', alt: 'Conference room' }
    ],
    projectDetails: {
      developer: 'Commercial Developers'
    },
    location: {
      latitude: 12.9716,
      longitude: 77.5946
    },
    amenities: ['Parking', 'Security', 'Lift', 'Power Backup', 'Internet'],
    highlights: ['Prime Business Location', 'Modern Infrastructure']
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const status = searchParams.get('status') || '';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000000');
    const minArea = parseInt(searchParams.get('minArea') || '0');
    const maxArea = parseInt(searchParams.get('maxArea') || '10000');
    const bedrooms = searchParams.get('bedrooms')?.split(',').map(Number) || [];
    const bathrooms = searchParams.get('bathrooms')?.split(',').map(Number) || [];
    const city = searchParams.get('city') || '';
    const amenities = searchParams.get('amenities')?.split(',') || [];

    // Filter properties based on query parameters
    let filteredProperties = mockProperties.filter(property => {
      // Search filter
      if (search && !property.title.toLowerCase().includes(search.toLowerCase()) &&
          !property.description?.toLowerCase().includes(search.toLowerCase()) &&
          !property.address?.city.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Type filter
      if (type && property.type !== type) {
        return false;
      }

      // Status filter
      if (status && property.status !== status) {
        return false;
      }

      // Price range filter
      if (property.price < minPrice || property.price > maxPrice) {
        return false;
      }

      // Area range filter
      if (property.area < minArea || property.area > maxArea) {
        return false;
      }

      // Bedrooms filter
      if (bedrooms.length > 0 && !bedrooms.includes(property.bedrooms)) {
        return false;
      }

      // Bathrooms filter
      if (bathrooms.length > 0 && !bathrooms.includes(property.bathrooms)) {
        return false;
      }

      // City filter
      if (city && property.address?.city !== city) {
        return false;
      }

      // Amenities filter
      if (amenities.length > 0) {
        const propertyAmenities = property.amenities || [];
        const hasAllAmenities = amenities.every(amenity => 
          propertyAmenities.some(propAmenity => 
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) {
          return false;
        }
      }

      return true;
    });

    // Calculate pagination
    const total = filteredProperties.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

    return NextResponse.json({
      properties: paginatedProperties,
      page,
      limit,
      total,
      totalPages,
      success: true
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract property data from form data
    const propertyData = {
      title: formData.get('title') as string,
      buildingName: formData.get('buildingName') as string,
      price: parseInt(formData.get('price') as string),
      area: parseInt(formData.get('area') as string),
      bedrooms: parseInt(formData.get('bedrooms') as string),
      bathrooms: parseInt(formData.get('bathrooms') as string),
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
      address: JSON.parse(formData.get('address') as string),
      amenities: formData.getAll('amenities') as string[],
      highlights: formData.getAll('highlights') as string[]
    };

    // Create new property with generated ID
    const newProperty = {
      _id: Date.now().toString(),
      ...propertyData,
      images: [], // Handle image uploads separately
      projectDetails: {
        developer: formData.get('developer') as string || 'Unknown'
      },
      location: {
        latitude: parseFloat(formData.get('latitude') as string) || 0,
        longitude: parseFloat(formData.get('longitude') as string) || 0
      }
    };

    // In a real application, save to database here
    // For now, just return the created property
    return NextResponse.json({
      property: newProperty,
      success: true,
      message: 'Property created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
