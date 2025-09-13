// Mock Location Services Data - For Phase 4 Maps & Location Services

export interface NearbyAmenity {
  id: string;
  name: string;
  type: 'restaurant' | 'school' | 'hospital' | 'shopping' | 'park' | 'transit' | 'gym' | 'bank' | 'gas_station' | 'pharmacy';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: number; // in meters
  rating?: number;
  phone?: string;
  website?: string;
  hours?: string;
  description?: string;
}

export interface LocationInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  nearbyAmenities: NearbyAmenity[];
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
}

// Mock nearby amenities for each property location
export const mockNearbyAmenities: Record<string, NearbyAmenity[]> = {
  // New York, NY (prop1)
  '40.7128,-74.0060': [
    {
      id: 'amenity1',
      name: 'Central Park',
      type: 'park',
      address: 'Central Park, New York, NY',
      coordinates: { lat: 40.7829, lng: -73.9654 },
      distance: 1200,
      rating: 4.8,
      description: 'Iconic urban park with walking trails, lakes, and recreational facilities'
    },
    {
      id: 'amenity2',
      name: 'Times Square',
      type: 'shopping',
      address: 'Times Square, New York, NY',
      coordinates: { lat: 40.7580, lng: -73.9855 },
      distance: 800,
      rating: 4.2,
      description: 'World-famous commercial intersection and entertainment hub'
    },
    {
      id: 'amenity3',
      name: 'Grand Central Terminal',
      type: 'transit',
      address: '89 E 42nd St, New York, NY',
      coordinates: { lat: 40.7527, lng: -73.9772 },
      distance: 600,
      rating: 4.6,
      description: 'Historic train station and transportation hub'
    },
    {
      id: 'amenity4',
      name: 'NYU Langone Health',
      type: 'hospital',
      address: '550 1st Ave, New York, NY',
      coordinates: { lat: 40.7431, lng: -73.9738 },
      distance: 1500,
      rating: 4.4,
      phone: '(212) 263-5555',
      description: 'Major medical center and hospital'
    },
    {
      id: 'amenity5',
      name: 'Whole Foods Market',
      type: 'shopping',
      address: '250 7th Ave, New York, NY',
      coordinates: { lat: 40.7505, lng: -73.9934 },
      distance: 400,
      rating: 4.1,
      phone: '(212) 924-5969',
      hours: '7:00 AM - 10:00 PM',
      description: 'Organic grocery store'
    }
  ],
  
  // Los Angeles, CA (prop2)
  '34.0522,-118.2437': [
    {
      id: 'amenity6',
      name: 'Rodeo Drive',
      type: 'shopping',
      address: 'Rodeo Drive, Beverly Hills, CA',
      coordinates: { lat: 34.0696, lng: -118.4002 },
      distance: 500,
      rating: 4.5,
      description: 'Luxury shopping destination'
    },
    {
      id: 'amenity7',
      name: 'Beverly Hills High School',
      type: 'school',
      address: '241 Moreno Dr, Beverly Hills, CA',
      coordinates: { lat: 34.0736, lng: -118.4004 },
      distance: 800,
      rating: 4.3,
      phone: '(310) 551-5100',
      description: 'Public high school'
    },
    {
      id: 'amenity8',
      name: 'Cedars-Sinai Medical Center',
      type: 'hospital',
      address: '8700 Beverly Blvd, West Hollywood, CA',
      coordinates: { lat: 34.0756, lng: -118.3844 },
      distance: 1200,
      rating: 4.7,
      phone: '(310) 423-3277',
      description: 'Major medical center'
    },
    {
      id: 'amenity9',
      name: 'Griffith Observatory',
      type: 'park',
      address: '2800 E Observatory Rd, Los Angeles, CA',
      coordinates: { lat: 34.1184, lng: -118.3004 },
      distance: 2000,
      rating: 4.8,
      description: 'Public observatory and planetarium'
    },
    {
      id: 'amenity10',
      name: 'Equinox Beverly Hills',
      type: 'gym',
      address: '8500 Beverly Blvd, Los Angeles, CA',
      coordinates: { lat: 34.0756, lng: -118.3844 },
      distance: 1000,
      rating: 4.4,
      phone: '(310) 360-8000',
      hours: '5:00 AM - 11:00 PM',
      description: 'Premium fitness club'
    }
  ],
  
  // Chicago, IL (prop3)
  '41.8781,-87.6298': [
    {
      id: 'amenity11',
      name: 'Millennium Park',
      type: 'park',
      address: '201 E Randolph St, Chicago, IL',
      coordinates: { lat: 41.8826, lng: -87.6226 },
      distance: 300,
      rating: 4.7,
      description: 'Famous public park with Cloud Gate sculpture'
    },
    {
      id: 'amenity12',
      name: 'Chicago Theatre',
      type: 'shopping',
      address: '175 N State St, Chicago, IL',
      coordinates: { lat: 41.8849, lng: -87.6276 },
      distance: 200,
      rating: 4.6,
      phone: '(312) 462-6300',
      description: 'Historic theater and entertainment venue'
    },
    {
      id: 'amenity13',
      name: 'Chicago Union Station',
      type: 'transit',
      address: '225 S Canal St, Chicago, IL',
      coordinates: { lat: 41.8789, lng: -87.6404 },
      distance: 800,
      rating: 4.3,
      description: 'Major train station'
    },
    {
      id: 'amenity14',
      name: 'Northwestern Memorial Hospital',
      type: 'hospital',
      address: '251 E Huron St, Chicago, IL',
      coordinates: { lat: 41.8947, lng: -87.6206 },
      distance: 1000,
      rating: 4.5,
      phone: '(312) 926-2000',
      description: 'Major medical center'
    },
    {
      id: 'amenity15',
      name: 'Mariano\'s Fresh Market',
      type: 'shopping',
      address: '333 E Benton Pl, Chicago, IL',
      coordinates: { lat: 41.8849, lng: -87.6206 },
      distance: 600,
      rating: 4.2,
      phone: '(312) 644-6000',
      hours: '6:00 AM - 11:00 PM',
      description: 'Grocery store'
    }
  ],
  
  // Boston, MA (prop4)
  '42.3601,-71.0589': [
    {
      id: 'amenity16',
      name: 'Boston Common',
      type: 'park',
      address: '139 Tremont St, Boston, MA',
      coordinates: { lat: 42.3551, lng: -71.0656 },
      distance: 400,
      rating: 4.6,
      description: 'Historic public park'
    },
    {
      id: 'amenity17',
      name: 'Massachusetts General Hospital',
      type: 'hospital',
      address: '55 Fruit St, Boston, MA',
      coordinates: { lat: 42.3601, lng: -71.0681 },
      distance: 300,
      rating: 4.7,
      phone: '(617) 726-2000',
      description: 'Major teaching hospital'
    },
    {
      id: 'amenity18',
      name: 'Boston Public Library',
      type: 'shopping',
      address: '700 Boylston St, Boston, MA',
      coordinates: { lat: 42.3496, lng: -71.0772 },
      distance: 800,
      rating: 4.8,
      phone: '(617) 536-5400',
      hours: '9:00 AM - 9:00 PM',
      description: 'Historic public library'
    },
    {
      id: 'amenity19',
      name: 'Park Street Station',
      type: 'transit',
      address: '1 Park St, Boston, MA',
      coordinates: { lat: 42.3564, lng: -71.0624 },
      distance: 200,
      rating: 4.2,
      description: 'MBTA subway station'
    },
    {
      id: 'amenity20',
      name: 'Whole Foods Market',
      type: 'shopping',
      address: '15 Westland Ave, Boston, MA',
      coordinates: { lat: 42.3408, lng: -71.0803 },
      distance: 1000,
      rating: 4.0,
      phone: '(617) 375-1010',
      hours: '7:00 AM - 10:00 PM',
      description: 'Organic grocery store'
    }
  ],
  
  // Miami, FL (prop5)
  '25.7617,-80.1918': [
    {
      id: 'amenity21',
      name: 'Bayfront Park',
      type: 'park',
      address: '301 Biscayne Blvd, Miami, FL',
      coordinates: { lat: 25.7743, lng: -80.1903 },
      distance: 500,
      rating: 4.4,
      description: 'Waterfront park with bay views'
    },
    {
      id: 'amenity22',
      name: 'Bayside Marketplace',
      type: 'shopping',
      address: '401 Biscayne Blvd, Miami, FL',
      coordinates: { lat: 25.7743, lng: -80.1903 },
      distance: 400,
      rating: 4.1,
      phone: '(305) 577-3344',
      hours: '10:00 AM - 10:00 PM',
      description: 'Shopping and entertainment complex'
    },
    {
      id: 'amenity23',
      name: 'Government Center Station',
      type: 'transit',
      address: '101 NW 1st St, Miami, FL',
      coordinates: { lat: 25.7743, lng: -80.1903 },
      distance: 300,
      rating: 4.0,
      description: 'Metrorail and Metromover station'
    },
    {
      id: 'amenity24',
      name: 'Jackson Memorial Hospital',
      type: 'hospital',
      address: '1611 NW 12th Ave, Miami, FL',
      coordinates: { lat: 25.7907, lng: -80.2100 },
      distance: 1500,
      rating: 4.3,
      phone: '(305) 585-1111',
      description: 'Major medical center'
    },
    {
      id: 'amenity25',
      name: 'Publix Super Market',
      type: 'shopping',
      address: '100 Biscayne Blvd, Miami, FL',
      coordinates: { lat: 25.7743, lng: -80.1903 },
      distance: 200,
      rating: 4.2,
      phone: '(305) 358-8888',
      hours: '7:00 AM - 11:00 PM',
      description: 'Grocery store'
    }
  ]
};

// Mock location services API
export const mockLocationServicesAPI = {
  // Get nearby amenities for a property
  getNearbyAmenities: (coordinates: { lat: number; lng: number }, radius: number = 2000) => {
    const key = `${coordinates.lat},${coordinates.lng}`;
    const amenities = mockNearbyAmenities[key] || [];
    
    // Filter by radius (in meters)
    const filteredAmenities = amenities.filter(amenity => amenity.distance <= radius);
    
    return {
      success: true,
      amenities: filteredAmenities,
      total: filteredAmenities.length,
      coordinates,
      radius
    };
  },
  
  // Get location information with walkability scores
  getLocationInfo: (coordinates: { lat: number; lng: number }) => {
    const key = `${coordinates.lat},${coordinates.lng}`;
    const amenities = mockNearbyAmenities[key] || [];
    
    // Mock walkability scores based on location
    const getWalkScore = (lat: number, lng: number) => {
      // New York and Boston have high walk scores
      if ((lat > 40.7 && lat < 40.8 && lng > -74.1 && lng < -73.9) || 
          (lat > 42.3 && lat < 42.4 && lng > -71.1 && lng < -71.0)) {
        return Math.floor(Math.random() * 20) + 80; // 80-100
      }
      // Chicago has medium-high walk score
      if (lat > 41.8 && lat < 42.0 && lng > -87.7 && lng < -87.6) {
        return Math.floor(Math.random() * 30) + 70; // 70-100
      }
      // Los Angeles and Miami have lower walk scores
      return Math.floor(Math.random() * 40) + 40; // 40-80
    };
    
    const getTransitScore = (lat: number, lng: number) => {
      // New York and Chicago have high transit scores
      if ((lat > 40.7 && lat < 40.8 && lng > -74.1 && lng < -73.9) || 
          (lat > 41.8 && lat < 42.0 && lng > -87.7 && lng < -87.6)) {
        return Math.floor(Math.random() * 20) + 80; // 80-100
      }
      // Boston has medium-high transit score
      if (lat > 42.3 && lat < 42.4 && lng > -71.1 && lng < -71.0) {
        return Math.floor(Math.random() * 30) + 70; // 70-100
      }
      // Los Angeles and Miami have lower transit scores
      return Math.floor(Math.random() * 40) + 40; // 40-80
    };
    
    const getBikeScore = (lat: number, lng: number) => {
      // All cities have moderate bike scores
      return Math.floor(Math.random() * 30) + 50; // 50-80
    };
    
    return {
      success: true,
      locationInfo: {
        coordinates,
        nearbyAmenities: amenities,
        walkScore: getWalkScore(coordinates.lat, coordinates.lng),
        transitScore: getTransitScore(coordinates.lat, coordinates.lng),
        bikeScore: getBikeScore(coordinates.lat, coordinates.lng)
      }
    };
  },
  
  // Search for properties by location
  searchByLocation: (coordinates: { lat: number; lng: number }, radius: number = 5000) => {
    // This would typically search the database for properties within radius
    // For now, return mock data
    return {
      success: true,
      properties: [], // Would be populated from property search
      total: 0,
      coordinates,
      radius
    };
  },
  
  // Get directions between two points
  getDirections: (origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) => {
    // Mock directions data
    const distance = Math.sqrt(
      Math.pow(destination.lat - origin.lat, 2) + 
      Math.pow(destination.lng - origin.lng, 2)
    ) * 111; // Rough conversion to km
    
    const duration = Math.floor(distance * 2); // Rough estimate in minutes
    
    return {
      success: true,
      directions: {
        origin,
        destination,
        distance: Math.round(distance * 1000), // in meters
        duration, // in minutes
        steps: [
          {
            instruction: 'Head northeast',
            distance: Math.round(distance * 500),
            duration: Math.floor(duration / 2)
          },
          {
            instruction: 'Arrive at destination',
            distance: Math.round(distance * 500),
            duration: Math.floor(duration / 2)
          }
        ]
      }
    };
  }
};

export default mockLocationServicesAPI;