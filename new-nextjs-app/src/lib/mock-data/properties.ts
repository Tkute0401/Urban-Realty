// Mock Property Data - Based on audit requirements
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  pricePerSqft: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    neighborhood: string;
  };
  images: string[];
  features: {
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    lotSize?: number;
    yearBuilt: number;
    type: 'apartment' | 'house' | 'condo' | 'townhouse' | 'commercial';
    status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  };
  amenities: string[];
  agent: string;
  developer?: string;
  isFeatured: boolean;
  isNew: boolean;
  virtualTour?: string;
  floorPlan?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  favorites: number;
}

export const mockProperties: Property[] = [
  {
    id: 'prop1',
    title: 'Modern Apartment in Downtown',
    description: 'Beautiful modern apartment in the heart of downtown with stunning city views and premium amenities.',
    price: 500000,
    pricePerSqft: 416,
    location: {
      address: '123 Main St, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      neighborhood: 'Downtown',
    },
    images: [
      '/properties/prop1-1.jpg',
      '/properties/prop1-2.jpg',
      '/properties/prop1-3.jpg',
      '/properties/prop1-4.jpg',
    ],
    features: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      yearBuilt: 2020,
      type: 'apartment',
      status: 'for-sale',
    },
    amenities: ['gym', 'pool', 'parking', 'concierge', 'rooftop'],
    agent: 'agent1',
    isFeatured: true,
    isNew: false,
    virtualTour: '/tours/prop1-tour.html',
    floorPlan: '/plans/prop1-plan.pdf',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    views: 245,
    favorites: 12,
  },
  {
    id: 'prop2',
    title: 'Luxury House with Garden',
    description: 'Spacious family home with beautiful garden, perfect for families looking for comfort and space.',
    price: 750000,
    pricePerSqft: 300,
    location: {
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      neighborhood: 'Beverly Hills',
    },
    images: [
      '/properties/prop2-1.jpg',
      '/properties/prop2-2.jpg',
      '/properties/prop2-3.jpg',
    ],
    features: {
      bedrooms: 4,
      bathrooms: 3,
      sqft: 2500,
      lotSize: 0.5,
      yearBuilt: 2018,
      type: 'house',
      status: 'for-sale',
    },
    amenities: ['garden', 'garage', 'fireplace', 'hardwood floors'],
    agent: 'agent1',
    isFeatured: true,
    isNew: true,
    virtualTour: '/tours/prop2-tour.html',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    views: 189,
    favorites: 8,
  },
  {
    id: 'prop3',
    title: 'Contemporary Condo with City Views',
    description: 'High-rise condo with panoramic city views, modern finishes, and premium building amenities.',
    price: 650000,
    pricePerSqft: 520,
    location: {
      address: '789 Skyline Blvd, Unit 15A',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      coordinates: { lat: 41.8781, lng: -87.6298 },
      neighborhood: 'Loop',
    },
    images: [
      '/properties/prop3-1.jpg',
      '/properties/prop3-2.jpg',
      '/properties/prop3-3.jpg',
      '/properties/prop3-4.jpg',
      '/properties/prop3-5.jpg',
    ],
    features: {
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1250,
      yearBuilt: 2022,
      type: 'condo',
      status: 'for-sale',
    },
    amenities: ['gym', 'pool', 'parking', 'concierge', 'rooftop', 'business center'],
    agent: 'agent2',
    isFeatured: false,
    isNew: true,
    virtualTour: '/tours/prop3-tour.html',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-15T08:45:00Z',
    views: 156,
    favorites: 5,
  },
  {
    id: 'prop4',
    title: 'Charming Townhouse in Historic District',
    description: 'Beautifully restored townhouse in historic district with original character and modern updates.',
    price: 425000,
    pricePerSqft: 283,
    location: {
      address: '321 Heritage Lane',
      city: 'Boston',
      state: 'MA',
      zipCode: '02108',
      coordinates: { lat: 42.3601, lng: -71.0589 },
      neighborhood: 'Beacon Hill',
    },
    images: [
      '/properties/prop4-1.jpg',
      '/properties/prop4-2.jpg',
      '/properties/prop4-3.jpg',
    ],
    features: {
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1500,
      yearBuilt: 1920,
      type: 'townhouse',
      status: 'for-sale',
    },
    amenities: ['hardwood floors', 'fireplace', 'garden', 'parking'],
    agent: 'agent2',
    isFeatured: false,
    isNew: false,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-15T07:20:00Z',
    views: 98,
    favorites: 3,
  },
  {
    id: 'prop5',
    title: 'Modern Commercial Space',
    description: 'Prime commercial space in business district, perfect for offices or retail.',
    price: 1200000,
    pricePerSqft: 200,
    location: {
      address: '555 Business Plaza, Suite 200',
      city: 'Miami',
      state: 'FL',
      zipCode: '33101',
      coordinates: { lat: 25.7617, lng: -80.1918 },
      neighborhood: 'Downtown',
    },
    images: [
      '/properties/prop5-1.jpg',
      '/properties/prop5-2.jpg',
      '/properties/prop5-3.jpg',
    ],
    features: {
      bedrooms: 0,
      bathrooms: 2,
      sqft: 6000,
      yearBuilt: 2019,
      type: 'commercial',
      status: 'for-sale',
    },
    amenities: ['parking', 'elevator', 'security', 'conference rooms'],
    agent: 'agent1',
    isFeatured: true,
    isNew: false,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-15T06:10:00Z',
    views: 67,
    favorites: 2,
  },
];

// Mock property API responses
export const mockPropertyAPI = {
  list: (filters?: {
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    type?: string;
    city?: string;
    status?: string;
  }) => {
    let filteredProperties = [...mockProperties];
    
    if (filters) {
      if (filters.minPrice) {
        filteredProperties = filteredProperties.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        filteredProperties = filteredProperties.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.bedrooms) {
        filteredProperties = filteredProperties.filter(p => p.features.bedrooms >= filters.bedrooms!);
      }
      if (filters.bathrooms) {
        filteredProperties = filteredProperties.filter(p => p.features.bathrooms >= filters.bathrooms!);
      }
      if (filters.type) {
        filteredProperties = filteredProperties.filter(p => p.features.type === filters.type);
      }
      if (filters.city) {
        filteredProperties = filteredProperties.filter(p => 
          p.location.city.toLowerCase().includes(filters.city!.toLowerCase())
        );
      }
      if (filters.status) {
        filteredProperties = filteredProperties.filter(p => p.features.status === filters.status);
      }
    }
    
    return {
      success: true,
      properties: filteredProperties,
      total: filteredProperties.length,
      page: 1,
      limit: 10,
    };
  },
  
  get: (id: string) => {
    const property = mockProperties.find(p => p.id === id);
    if (property) {
      return {
        success: true,
        property,
      };
    }
    return {
      success: false,
      error: 'Property not found',
    };
  },
  
  featured: () => {
    const featuredProperties = mockProperties.filter(p => p.isFeatured);
    return {
      success: true,
      properties: featuredProperties,
      total: featuredProperties.length,
    };
  },
  
  create: (propertyData: Partial<Property>) => {
    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title: propertyData.title || 'New Property',
      description: propertyData.description || '',
      price: propertyData.price || 0,
      pricePerSqft: propertyData.pricePerSqft || 0,
      location: propertyData.location || {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        coordinates: { lat: 0, lng: 0 },
        neighborhood: '',
      },
      images: propertyData.images || [],
      features: propertyData.features || {
        bedrooms: 0,
        bathrooms: 0,
        sqft: 0,
        yearBuilt: 2024,
        type: 'apartment',
        status: 'for-sale',
      },
      amenities: propertyData.amenities || [],
      agent: propertyData.agent || 'agent1',
      isFeatured: false,
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      favorites: 0,
      ...propertyData,
    };
    
    return {
      success: true,
      property: newProperty,
    };
  },
  
  update: (id: string, updates: Partial<Property>) => {
    const propertyIndex = mockProperties.findIndex(p => p.id === id);
    if (propertyIndex !== -1) {
      const updatedProperty = {
        ...mockProperties[propertyIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      mockProperties[propertyIndex] = updatedProperty;
      return {
        success: true,
        property: updatedProperty,
      };
    }
    return {
      success: false,
      error: 'Property not found',
    };
  },
  
  delete: (id: string) => {
    const propertyIndex = mockProperties.findIndex(p => p.id === id);
    if (propertyIndex !== -1) {
      mockProperties.splice(propertyIndex, 1);
      return {
        success: true,
        message: 'Property deleted successfully',
      };
    }
    return {
      success: false,
      error: 'Property not found',
    };
  },
};

export default mockProperties;