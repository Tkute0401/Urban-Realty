import { NextRequest, NextResponse } from 'next/server';

// Mock developers data
const mockDevelopers = [
  {
    _id: '1',
    name: 'ABC Developers',
    logo: { url: '/api/placeholder/100/100' },
    headquarters: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    description: 'Leading real estate developer with over 20 years of experience in luxury residential and commercial projects.',
    establishedYear: 2000,
    projectsCompleted: 150,
    currentProjects: 25
  },
  {
    _id: '2',
    name: 'XYZ Builders',
    logo: { url: '/api/placeholder/100/100' },
    headquarters: {
      city: 'Delhi',
      state: 'Delhi',
      country: 'India'
    },
    description: 'Premium real estate developer specializing in luxury villas and high-end residential projects.',
    establishedYear: 1995,
    projectsCompleted: 200,
    currentProjects: 30
  },
  {
    _id: '3',
    name: 'Commercial Developers',
    logo: { url: '/api/placeholder/100/100' },
    headquarters: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India'
    },
    description: 'Focused on commercial real estate development including office spaces, retail centers, and business parks.',
    establishedYear: 2005,
    projectsCompleted: 75,
    currentProjects: 15
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filter developers based on query parameters
    let filteredDevelopers = mockDevelopers.filter(developer => {
      // Search filter
      if (search && !developer.name.toLowerCase().includes(search.toLowerCase()) &&
          !developer.description?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // City filter
      if (city && developer.headquarters?.city !== city) {
        return false;
      }

      return true;
    });

    // Calculate pagination
    const total = filteredDevelopers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDevelopers = filteredDevelopers.slice(startIndex, endIndex);

    return NextResponse.json({
      developers: paginatedDevelopers,
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
