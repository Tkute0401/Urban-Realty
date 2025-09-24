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
      title: "Modern Apartment",
      address: {
        city: "Mumbai",
        locality: "Bandra"
      },
      price: 5000000,
      type: "apartment"
    },
    {
      _id: "mock_prop_2",
      title: "Luxury Villa", 
      address: {
        city: "Delhi",
        locality: "Gurgaon"
      },
      price: 15000000,
      type: "villa"
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