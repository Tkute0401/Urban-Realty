// Property type definitions
export interface Property {
  _id: string;
  title: string;
  buildingName?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  description?: string;
  address?: {
    line1?: string;
    street?: string;
    city: string;
    locality?: string;
    state: string;
    zipCode?: string;
    country?: string;
  };
  location?: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
    formattedAddress?: string;
  };
  images?: Array<{ 
    url: string; 
    publicId?: string;
    width?: number;
    height?: number;
  }>;
  floorPlanImages?: Array<{
    url: string;
    publicId?: string;
    description?: string;
  }>;
  brochure?: {
    url: string;
    publicId?: string;
  };
  virtualTour?: {
    url: string;
    type: 'video' | '3d' | string;
  };
  projectDetails?: {
    projectArea?: string;
    totalUnits?: string;
    launchDate?: string;
    reraId?: string;
    configurations?: string;
  };
  amenities?: string[];
  highlights?: string[];
  nearbyLocalities?: {
    hasSchool?: boolean;
    school?: string;
    hasHospital?: boolean;
    hospital?: string;
    hasMall?: boolean;
    mall?: string;
    hasPark?: boolean;
    park?: string;
    hasTransport?: boolean;
    transport?: string;
  };
  developer?: {
    _id: string;
    name: string;
    logo?: { url: string };
  };
  agent?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    mobile?: string;
  };
  featured?: boolean;
  views?: number;
  similarProperties?: Property[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PropertyFilters {
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  city?: string;
  state?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

