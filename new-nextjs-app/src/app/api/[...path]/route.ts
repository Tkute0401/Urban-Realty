import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'http://localhost:3001/api/v1';

// Mock data for fallback when backend is unavailable
const mockData = {
  users: [
    {
      _id: "mock_user_1",
      name: "John Doe",
      email: "john@example.com",
      role: "buyer",
      mobile: "1234567890",
      occupation: "Engineer",
      isVerified: true
    },
    {
      _id: "mock_user_2", 
      name: "Jane Smith",
      email: "jane@example.com",
      role: "agent",
      mobile: "0987654321",
      occupation: "Real Estate Agent",
      isVerified: false
    }
  ],
  properties: [
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
    },
    {
      _id: "mock_prop_3",
      title: "Cozy Apartment for Rent",
      address: {
        street: "789 Park Lane",
        city: "Bangalore",
        state: "Karnataka",
        locality: "Koramangala"
      },
      price: 35000,
      propertyType: "apartment",
      listingType: "rent",
      bedrooms: 2,
      bathrooms: 1,
      area: 900,
      sqft: 900,
      images: ["/placeholder-property.jpg"],
      amenities: ["Furnished", "Parking", "Balcony"],
      developer: {
        name: "Brigade Group",
        contact: "contact@brigade.com"
      },
      highlights: ["Fully Furnished", "Tech Hub Location"],
      nearby: [
        { name: "Tech Park", distance: "500 m", type: "work" },
        { name: "Cafe", distance: "200 m", type: "dining" }
      ]
    },
    {
      _id: "mock_prop_4",
      title: "Spacious House in Chennai",
      address: {
        street: "321 Beach Road",
        city: "Chennai",
        state: "Tamil Nadu",
        locality: "ECR"
      },
      price: 8500000,
      propertyType: "house",
      listingType: "sale",
      bedrooms: 5,
      bathrooms: 4,
      area: 3000,
      sqft: 3000,
      images: ["/placeholder-property.jpg"],
      amenities: ["Pool", "Garden", "Parking", "Security", "Elevator"],
      developer: {
        name: "Phoenix Mills",
        contact: "contact@phoenix.com"
      },
      highlights: ["Beach View", "Large Garden", "Family Home"],
      nearby: [
        { name: "Beach", distance: "100 m", type: "recreation" },
        { name: "School", distance: "1 km", type: "education" }
      ]
    },
    {
      _id: "mock_prop_5",
      title: "Studio Apartment for Rent",
      address: {
        street: "555 IT Corridor",
        city: "Pune",
        state: "Maharashtra",
        locality: "Hinjewadi"
      },
      price: 18000,
      propertyType: "apartment",
      listingType: "rent",
      bedrooms: 1,
      bathrooms: 1,
      area: 450,
      sqft: 450,
      images: ["/placeholder-property.jpg"],
      amenities: ["Furnished", "Gym", "Security"],
      highlights: ["Compact", "IT Hub Location"],
      nearby: [
        { name: "IT Park", distance: "300 m", type: "work" },
        { name: "Food Court", distance: "500 m", type: "dining" }
      ]
    },
    {
      _id: "mock_prop_6",
      title: "Penthouse with City View",
      address: {
        street: "888 Skyline Tower",
        city: "Mumbai",
        state: "Maharashtra",
        locality: "Lower Parel"
      },
      price: 25000000,
      propertyType: "apartment",
      listingType: "sale",
      bedrooms: 4,
      bathrooms: 3,
      area: 2200,
      sqft: 2200,
      images: ["/placeholder-property.jpg"],
      amenities: ["Pool", "Gym", "Parking", "Security", "Elevator", "Balcony"],
      developer: {
        name: "Lodha Group",
        contact: "contact@lodha.com"
      },
      highlights: ["City View", "Premium Location", "Luxury Amenities"],
      nearby: [
        { name: "Business District", distance: "500 m", type: "work" },
        { name: "Fine Dining", distance: "200 m", type: "dining" }
      ]
    },
    {
      _id: "mock_prop_7",
      title: "Basic Property with Missing Data",
      address: {
        street: "999 Simple Street",
        city: "Jaipur",
        state: "Rajasthan",
        locality: "Malviya Nagar"
      },
      price: 3500000,
      propertyType: "house",
      listingType: "sale",
      bedrooms: 2,
      bathrooms: 1,
      area: 800,
      sqft: 800,
      images: ["/placeholder-property.jpg"],
      amenities: ["Parking"],
      // No developer info
      // No highlights
      // No nearby data
    }
  ]
};

// Mock auth functions
function generateMockToken() {
  return 'mock_jwt_token_' + Math.random().toString(36);
}

function getMockUser(email?: string) {
  return {
    _id: "mock_user_" + Math.random().toString(36).substring(7),
    name: email?.split('@')[0] || "Mock User",
    email: email || "mock@example.com",
    role: "buyer"
  };
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend unavailable, using mock data for:', path);
    
    // Handle specific endpoints with mock data
    if (path === 'auth/me') {
      return NextResponse.json({
        success: true,
        data: { user: getMockUser() }
      });
    }
    
    if (path === 'admin/users') {
      return NextResponse.json({
        success: true,
        data: mockData.users,
        total: mockData.users.length
      });
    }
    
    if (path === 'properties') {
      return NextResponse.json({
        success: true,
        data: mockData.properties,
        total: mockData.properties.length
      });
    }
    
    if (path === 'admin/stats') {
      return NextResponse.json({
        success: true,
        data: {
          totalUsers: 150,
          totalProperties: 75,
          totalAgents: 25,
          recent: {
            users: mockData.users.slice(0, 5),
            properties: mockData.properties.slice(0, 5)
          }
        }
      });
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Backend connection failed',
      message: 'Service temporarily unavailable' 
    }, { status: 503 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const body = await request.json();
  const url = `${BACKEND_URL}/${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend unavailable, using mock response for POST:', path);
    
    // Handle auth endpoints with mock responses
    if (path === 'auth/login') {
      const { email, password } = body;
      if (email && password) {
        return NextResponse.json({
          success: true,
          data: {
            token: generateMockToken(),
            user: getMockUser(email)
          }
        });
      }
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
    if (path === 'auth/register') {
      const { name, email, password } = body;
      if (name && email && password) {
        const user = getMockUser(email);
        user.name = name;
        return NextResponse.json({
          success: true,
          data: { user }
        });
      }
      return NextResponse.json({
        success: false,
        error: 'Invalid registration data'
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false,
      error: 'Backend connection failed',
      message: 'Service temporarily unavailable' 
    }, { status: 503 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const body = await request.json();
  const url = `${BACKEND_URL}/${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Backend connection failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/');
  const url = `${BACKEND_URL}/${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Backend connection failed' }, { status: 500 });
  }
}