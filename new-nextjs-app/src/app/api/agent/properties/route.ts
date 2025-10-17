import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';

export async function GET(request: NextRequest) {
  console.log('🔧 API: /api/agent/properties GET request received');
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';

    if (!agentId) {
      return NextResponse.json(
        { error: 'Agent ID is required' },
        { status: 400 }
      );
    }

    // Build filter
    const filter: any = { agent: agentId };

    if (status !== 'all') {
      filter.status = status;
    }

    if (type !== 'all') {
      filter.type = type;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count and properties from database
    const [total, properties] = await Promise.all([
      Property.countDocuments(filter),
      Property.find(filter)
        .populate('agent', 'name email phone')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
    ]);

    const totalPages = Math.ceil(total / limit);

    console.log(`🔧 API: Returning ${properties.length} agent properties from database (page ${page}/${totalPages})`);

    return NextResponse.json({
      properties,
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

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

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
      highlights: formData.getAll('highlights') as string[],
      images: [], // Handle image uploads separately
      projectDetails: {
        developer: formData.get('developer') as string || 'Unknown'
      },
      location: {
        latitude: parseFloat(formData.get('latitude') as string) || 0,
        longitude: parseFloat(formData.get('longitude') as string) || 0
      },
      agent: formData.get('agentId') as string
    };

    // Create new property in database
    const newProperty = new Property(propertyData);
    await newProperty.save();

    // Populate agent data
    await newProperty.populate('agent', 'name email phone');

    console.log(`🔧 API: Created agent property ${newProperty._id} in database`);

    return NextResponse.json({
      property: newProperty,
      success: true,
      message: 'Property created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}