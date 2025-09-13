// Mock Developer Data - Based on audit requirements
export interface Developer {
  id: string;
  name: string;
  description: string;
  logo: string;
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  establishedYear: number;
  totalProjects: number;
  totalUnits: number;
  specialties: string[];
  certifications: string[];
  rating: number;
  isVerified: boolean;
  properties: string[];
  createdAt: string;
  updatedAt: string;
}

export const mockDevelopers: Developer[] = [
  {
    id: 'dev1',
    name: 'Urban Development Group',
    description: 'Leading developer specializing in luxury residential and commercial properties with over 20 years of experience.',
    logo: '/developers/urban-dev-logo.png',
    website: 'https://urbandev.com',
    email: 'info@urbandev.com',
    phone: '+1-555-0201',
    address: {
      street: '1000 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    establishedYear: 2000,
    totalProjects: 45,
    totalUnits: 2500,
    specialties: ['luxury residential', 'commercial', 'mixed-use'],
    certifications: ['LEED Certified', 'Green Building Council'],
    rating: 4.8,
    isVerified: true,
    properties: ['prop1', 'prop2'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'dev2',
    name: 'Metro Builders',
    description: 'Innovative developer focused on sustainable and modern residential communities.',
    logo: '/developers/metro-builders-logo.png',
    website: 'https://metrobuilders.com',
    email: 'contact@metrobuilders.com',
    phone: '+1-555-0202',
    address: {
      street: '2500 Construction Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    establishedYear: 2010,
    totalProjects: 28,
    totalUnits: 1800,
    specialties: ['residential', 'sustainable building', 'smart homes'],
    certifications: ['Energy Star', 'Solar Ready'],
    rating: 4.6,
    isVerified: true,
    properties: ['prop3', 'prop4'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
  },
  {
    id: 'dev3',
    name: 'Skyline Properties',
    description: 'Premium developer known for high-rise residential and commercial developments.',
    logo: '/developers/skyline-properties-logo.png',
    website: 'https://skylineproperties.com',
    email: 'info@skylineproperties.com',
    phone: '+1-555-0203',
    address: {
      street: '5000 Tower Plaza',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
    },
    establishedYear: 1995,
    totalProjects: 62,
    totalUnits: 4200,
    specialties: ['high-rise', 'commercial', 'luxury condos'],
    certifications: ['LEED Platinum', 'Green Building Council'],
    rating: 4.9,
    isVerified: true,
    properties: ['prop5'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
  },
];

// Mock developer API responses
export const mockDeveloperAPI = {
  list: (filters?: {
    city?: string;
    specialty?: string;
    minRating?: number;
    isVerified?: boolean;
  }) => {
    let filteredDevelopers = [...mockDevelopers];
    
    if (filters) {
      if (filters.city) {
        filteredDevelopers = filteredDevelopers.filter(d => 
          d.address.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.specialty) {
        filteredDevelopers = filteredDevelopers.filter(d => 
          d.specialties.some(s => s.toLowerCase().includes(filters.specialty!.toLowerCase()))
        );
      }
      if (filters.minRating) {
        filteredDevelopers = filteredDevelopers.filter(d => d.rating >= filters.minRating!);
      }
      if (filters.isVerified !== undefined) {
        filteredDevelopers = filteredDevelopers.filter(d => d.isVerified === filters.isVerified);
      }
    }
    
    return {
      success: true,
      developers: filteredDevelopers,
      total: filteredDevelopers.length,
    };
  },
  
  get: (id: string) => {
    const developer = mockDevelopers.find(d => d.id === id);
    if (developer) {
      return {
        success: true,
        developer,
      };
    }
    return {
      success: false,
      error: 'Developer not found',
    };
  },
  
  create: (developerData: Partial<Developer>) => {
    const newDeveloper: Developer = {
      id: `dev-${Date.now()}`,
      name: developerData.name || 'New Developer',
      description: developerData.description || '',
      logo: developerData.logo || '/developers/default-logo.png',
      email: developerData.email || 'info@newdeveloper.com',
      phone: developerData.phone || '+1-555-0000',
      address: developerData.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
      establishedYear: developerData.establishedYear || new Date().getFullYear(),
      totalProjects: 0,
      totalUnits: 0,
      specialties: developerData.specialties || [],
      certifications: developerData.certifications || [],
      rating: 0,
      isVerified: false,
      properties: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...developerData,
    };
    
    return {
      success: true,
      developer: newDeveloper,
    };
  },
  
  update: (id: string, updates: Partial<Developer>) => {
    const developerIndex = mockDevelopers.findIndex(d => d.id === id);
    if (developerIndex !== -1) {
      const updatedDeveloper = {
        ...mockDevelopers[developerIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      mockDevelopers[developerIndex] = updatedDeveloper;
      return {
        success: true,
        developer: updatedDeveloper,
      };
    }
    return {
      success: false,
      error: 'Developer not found',
    };
  },
  
  delete: (id: string) => {
    const developerIndex = mockDevelopers.findIndex(d => d.id === id);
    if (developerIndex !== -1) {
      mockDevelopers.splice(developerIndex, 1);
      return {
        success: true,
        message: 'Developer deleted successfully',
      };
    }
    return {
      success: false,
      error: 'Developer not found',
    };
  },
};

export default mockDevelopers;