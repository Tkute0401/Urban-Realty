import { NextRequest, NextResponse } from 'next/server';

// Import database connection and models
import { connectDB } from '@/lib/database';
import User from '@/models/User';
import Project from '@/models/Project';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build MongoDB filter
    const filter: any = { role: 'developer' };

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // City filter
    if (city) {
      filter['headquarters.city'] = city;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count and developers from database
    const [total, developers] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .populate('projects', 'title status')
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
    ]);

    const totalPages = Math.ceil(total / limit);

    // Transform developers data to include project counts
    const transformedDevelopers = developers.map(developer => ({
      _id: developer._id,
      name: developer.name,
      logo: developer.logo || null,
      headquarters: developer.headquarters || {
        city: 'Unknown',
        state: 'Unknown',
        country: 'Unknown'
      },
      description: developer.description || 'No description available',
      establishedYear: developer.establishedYear || new Date().getFullYear(),
      projectsCompleted: developer.projects?.filter((p: any) => p.status === 'completed').length || 0,
      currentProjects: developer.projects?.filter((p: any) => p.status === 'active').length || 0
    }));

    console.log(`🔧 API: Returning ${transformedDevelopers.length} developers from database (page ${page}/${totalPages})`);

    return NextResponse.json({
      developers: transformedDevelopers,
      page,
      limit,
      total,
      totalPages,
      success: true
    });
  } catch (error) {
    console.error('Error fetching developers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch developers' },
      { status: 500 }
    );
  }
}
