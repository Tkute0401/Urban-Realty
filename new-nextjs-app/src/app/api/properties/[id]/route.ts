import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('🔧 API: /api/properties/[id] GET request received for ID:', params.id);
  try {
    // Connect to database
    await connectDB();

    const property = await Property.findById(params.id)
      .populate('agent', 'name email phone avatar')
      .populate('developer', 'name logo headquarters');

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Increment view count
    property.views = (property.views || 0) + 1;
    await property.save();

    console.log(`🔧 API: Returning property ${params.id} from database`);

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
    // Connect to database
    await connectDB();

    const body = await request.json();
    
    const property = await Property.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    ).populate('agent', 'name email phone');

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    console.log(`🔧 API: Updated property ${params.id} in database`);

    return NextResponse.json({
      property,
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
    // Connect to database
    await connectDB();

    const property = await Property.findByIdAndDelete(params.id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    console.log(`🔧 API: Deleted property ${params.id} from database`);

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