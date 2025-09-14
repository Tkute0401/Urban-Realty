// Mock User Data - Based on audit requirements
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'user';
  avatar?: string;
  phone?: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Agent extends User {
  role: 'agent';
  properties: string[];
  leads: string[];
  commission: number;
  rating: number;
  totalSales: number;
  bio?: string;
  specialties: string[];
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
  lastLogin: string;
}

export const mockUsers: Record<string, User | Agent | Admin> = {
  admin: {
    id: '1',
    name: 'Admin User',
    email: 'admin@urbanrealty.com',
    role: 'admin' as const,
    avatar: '/avatars/admin.jpg',
    phone: '+1-555-0101',
    preferences: {
      theme: 'light' as const,
      notifications: true,
      language: 'en',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    isActive: true,
  },
  agent1: {
    id: '2',
    name: 'John Agent',
    email: 'john@urbanrealty.com',
    role: 'agent' as const,
    avatar: '/avatars/agent1.jpg',
    phone: '+1-555-0102',
    preferences: {
      theme: 'light' as const,
      notifications: true,
      language: 'en',
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    isActive: true,
    properties: ['prop1', 'prop2', 'prop3'],
    leads: ['lead1', 'lead2'],
    commission: 0.03,
    rating: 4.8,
    totalSales: 2500000,
    bio: 'Experienced real estate agent with 10+ years in the market.',
    specialties: ['luxury homes', 'commercial properties', 'first-time buyers'],
  },
  agent2: {
    id: '3',
    name: 'Sarah Smith',
    email: 'sarah@urbanrealty.com',
    role: 'agent' as const,
    avatar: '/avatars/agent2.jpg',
    phone: '+1-555-0103',
    preferences: {
      theme: 'dark' as const,
      notifications: true,
      language: 'en',
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    isActive: true,
    properties: ['prop4', 'prop5'],
    leads: ['lead3', 'lead4', 'lead5'],
    commission: 0.025,
    rating: 4.9,
    totalSales: 1800000,
    bio: 'Specializing in residential properties and investment opportunities.',
    specialties: ['residential', 'investment properties', 'condos'],
  },
  user1: {
    id: '4',
    name: 'Jane User',
    email: 'jane@example.com',
    role: 'user' as const,
    avatar: '/avatars/user1.jpg',
    phone: '+1-555-0104',
    preferences: {
      theme: 'light' as const,
      notifications: false,
      language: 'en',
    },
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-15T07:20:00Z',
    isActive: true,
  },
  user2: {
    id: '5',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    role: 'user',
    avatar: '/avatars/user2.jpg',
    phone: '+1-555-0105',
    preferences: {
      theme: 'dark',
      notifications: true,
      language: 'en',
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T06:10:00Z',
    isActive: true,
  },
};

// Mock authentication responses
export const mockAuthResponses = {
  login: (email: string, password: string) => {
    const user = Object.values(mockUsers).find(u => u.email === email);
    if (user && password === 'password123') {
      return {
        success: true,
        user,
        token: `mock-token-${user.id}-${Date.now()}`,
        expiresIn: 3600,
      };
    }
    return {
      success: false,
      error: 'Invalid credentials',
    };
  },
  
  register: (userData: Partial<User>) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name || 'New User',
      email: userData.email || 'newuser@example.com',
      role: 'user',
      preferences: {
        theme: 'light',
        notifications: true,
        language: 'en',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      ...userData,
    };
    
    return {
      success: true,
      user: newUser,
      token: `mock-token-${newUser.id}-${Date.now()}`,
      expiresIn: 3600,
    };
  },
  
  me: (token: string) => {
    const userId = token.split('-')[2];
    const user = Object.values(mockUsers).find(u => u.id === userId);
    if (user) {
      return {
        success: true,
        user,
      };
    }
    return {
      success: false,
      error: 'Invalid token',
    };
  },
  
  updateUser: (userData: Partial<User>) => {
    // In a real scenario, this would update the user in the database
    // For mock purposes, we'll just return the updated user data
    return {
      success: true,
      user: {
        ...userData,
        updatedAt: new Date().toISOString(),
      },
    };
  },
};

export default mockUsers;