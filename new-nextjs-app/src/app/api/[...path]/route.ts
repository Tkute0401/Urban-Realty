import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import Property from '@/models/Property';
import User from '@/models/User';

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  
  console.log('API route called with path:', path);
  
  try {
    // Connect to database
    await connectDB();

    // Handle different API paths
    switch (path) {
      case 'properties':
        const properties = await Property.find({ status: 'For Sale' })
          .populate('agent', 'name email phone')
          .limit(10)
          .sort('-createdAt');
        
        return NextResponse.json({
          success: true,
          data: properties,
          count: properties.length
        });

      case 'developers':
        const developers = await User.find({ role: 'developer' })
          .select('name logo headquarters description establishedYear')
          .limit(10)
          .sort('-createdAt');
        
        return NextResponse.json({
          success: true,
          data: developers,
          count: developers.length
        });

      case 'agents':
        const agents = await User.find({ role: 'agent' })
          .select('name email phone avatar')
          .limit(10)
          .sort('-createdAt');
        
        return NextResponse.json({
          success: true,
          data: agents,
          count: agents.length
        });

      default:
        return NextResponse.json(
          { error: 'API endpoint not found' },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('Error in catch-all API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}