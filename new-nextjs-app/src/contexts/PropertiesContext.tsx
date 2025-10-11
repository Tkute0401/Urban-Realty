'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import http from '@/lib/services/http';

interface Property {
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
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  images?: Array<{ url: string; alt?: string; caption?: string }>;
  projectDetails?: {
    launchDate?: string;
    possessionDate?: string;
    developer?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  amenities?: string[];
  highlights?: string[];
  floorPlan?: {
    image: string;
    description: string;
  };
  nearbyPlaces?: Array<{
    name: string;
    type: string;
    distance: string;
  }>;
  similarProperties?: Property[];
}

interface Developer {
  _id: string;
  name: string;
  logo?: { url: string };
  headquarters?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

interface PropertiesContextType {
  properties: Property[];
  featuredProperties: Property[];
  property: Property | null;
  loading: boolean;
  error: string | null;
  cache: Record<string, any>;
  developers: Developer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  agentProperties: Property[];
  getProperties: (params?: Record<string, any>) => Promise<void>;
  getFeaturedProperties: () => Promise<Property[]>;
  getProperty: (id: string) => Promise<Property | null>;
  getAgentProperties: (user: any) => Promise<any[]>;
  getDevelopers: (params?: Record<string, any>) => Promise<any[]>;
  setProperties: (properties: Property[]) => void;
  setFeaturedProperties: (properties: Property[]) => void;
  setProperty: (property: Property | null) => void;
  clearError: () => void;
  clearCache: () => void;
  addProperty?: (
    data: Record<string, any>, 
    images?: File[], 
    extras?: { floorPlans?: File[]; brochure?: File | null; virtualTour?: File | null }
  ) => Promise<any>;
}

const defaultContextValue: PropertiesContextType = {
  properties: [],
  featuredProperties: [],
  property: null,
  loading: false,
  error: null,
  cache: {},
  developers: [],
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  },
  agentProperties: [],
  getProperties: async () => {},
  getFeaturedProperties: async () => [],
  getProperty: async () => null,
  getAgentProperties: async () => [],
  getDevelopers: async () => [],
  setProperties: () => {},
  setFeaturedProperties: () => {},
  setProperty: () => {},
  clearError: () => {},
  clearCache: () => {},
};

const PropertiesContext = createContext<PropertiesContextType>(defaultContextValue);

interface PropertiesProviderProps {
  children: ReactNode;
}

export const PropertiesProvider: React.FC<PropertiesProviderProps> = ({ children }) => {
  // Initialize state with proper SSR handling
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<string, any>>({});
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [agentProperties, setAgentProperties] = useState<Property[]>([]);

  // Load from localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProperties = localStorage.getItem('urban-realty-properties');
        const savedFeatured = localStorage.getItem('urban-realty-featured-properties');
        const savedCache = localStorage.getItem('urban-realty-cache');
        const savedPagination = localStorage.getItem('urban-realty-pagination');
        
        if (savedProperties) {
          const parsed = JSON.parse(savedProperties);
          if (Array.isArray(parsed)) {
            setProperties(parsed);
          }
        }
        
        if (savedFeatured) {
          const parsed = JSON.parse(savedFeatured);
          if (Array.isArray(parsed)) {
            setFeaturedProperties(parsed);
          }
        }
        
        if (savedCache) {
          const parsed = JSON.parse(savedCache);
          if (typeof parsed === 'object' && parsed !== null) {
            setCache(parsed);
          }
        }
        
        if (savedPagination) {
          const parsed = JSON.parse(savedPagination);
          if (typeof parsed === 'object' && parsed !== null) {
            setPagination(parsed);
          }
        }
      } catch (err) {
        console.warn('Failed to load data from localStorage:', err);
      }
    }
  }, []);

  // Persist to localStorage on client side only
  useEffect(() => {
    if (typeof window !== 'undefined' && properties.length > 0) {
      localStorage.setItem('urban-realty-properties', JSON.stringify(properties));
    }
  }, [properties]);

  useEffect(() => {
    if (typeof window !== 'undefined' && featuredProperties.length > 0) {
      localStorage.setItem('urban-realty-featured-properties', JSON.stringify(featuredProperties));
    }
  }, [featuredProperties]);

  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(cache).length > 0) {
      localStorage.setItem('urban-realty-cache', JSON.stringify(cache));
    }
  }, [cache]);

  useEffect(() => {
    if (typeof window !== 'undefined' && pagination.total > 0) {
      localStorage.setItem('urban-realty-pagination', JSON.stringify(pagination));
    }
  }, [pagination]);

  const getProperties = useCallback(async (params: Record<string, any> = {}) => {
    const cacheKey = JSON.stringify(params);
    
    if (cache[cacheKey]) {
      setProperties(cache[cacheKey].properties);
      setPagination(cache[cacheKey].pagination);
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            if (value.length > 0) {
              queryParams.append(key, value.join(','));
            }
      } else {
            queryParams.append(key, value.toString());
          }
        }
      });

      const url = `/api/v1/properties?${queryParams.toString()}`;
      console.log('🔧 PropertiesContext: Making API request to:', url);
      
      const response = await http.get(url);
      
      console.log('🔧 PropertiesContext: API response status:', response.status);
      console.log('🔧 PropertiesContext: API response data:', response.data);
      
      const data = response.data;
      
      setProperties(data.data || []);
      setPagination({
        page: data.pagination?.currentPage || 1,
        limit: data.pagination?.limit || 12,
        total: data.total || 0,
        totalPages: data.pagination?.totalPages || 0
      });
      
      setCache(prev => ({ 
        ...prev, 
        [cacheKey]: {
          properties: data.data || [],
          pagination: {
            page: data.pagination?.currentPage || 1,
            limit: data.pagination?.limit || 12,
            total: data.total || 0,
            totalPages: data.pagination?.totalPages || 0
          }
        } 
      }));
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      setProperties([]);
      setPagination({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      });
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const getFeaturedProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = '/api/v1/properties/featured';
      console.log('🔧 PropertiesContext: Making featured properties API request to:', url);
      
      const response = await http.get(url);
      
      console.log('🔧 PropertiesContext: Featured properties API response status:', response.status);
      console.log('🔧 PropertiesContext: Featured properties API response data:', response.data);
      
      const data = response.data;
      const properties = data.data || data.properties || data || [];
      
      if (!Array.isArray(properties)) {
        throw new Error('Invalid properties data format');
      }
      
      setFeaturedProperties(properties);
      return properties;
    } catch (err) {
      console.error('Error fetching featured properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured properties');
      setFeaturedProperties([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProperty = useCallback(async (id: string) => {
    if (!id) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      if (cache[id]) {
        setProperty(cache[id]);
        return cache[id];
      }
  
      const response = await http.get(`/api/v1/properties/${id}`);
      
      console.log('🔧 PropertiesContext: Property API response data:', response.data);
      
      const data = response.data;
      const propertyData = data.data || data.property || data;
      
      if (!propertyData) {
        throw new Error('Property data not found');
      }
      
      setProperty(propertyData);
      setCache(prev => ({ ...prev, [id]: propertyData }));
      return propertyData;
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(err instanceof Error ? err.message : 'Property not found');
      setProperty(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const getDevelopers = useCallback(async (params: Record<string, any> = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await http.get(`/api/v1/developers?${queryParams.toString()}`);
      
      const data = response.data;
      const developers = data.developers || data || [];
      
      if (!Array.isArray(developers)) {
        throw new Error('Invalid developers data format');
      }
      
      setDevelopers(developers);
      return developers;
    } catch (err) {
      console.error('Error fetching developers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch developers');
      setDevelopers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAgentProperties = useCallback(async (user: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await http.get(`/api/v1/agent/properties?agentId=${user.id}`);
      
      const data = response.data;
      const properties = data.properties || data || [];
      
      if (!Array.isArray(properties)) {
        throw new Error('Invalid properties data format');
      }
      
      setAgentProperties(properties);
      return properties;
    } catch (err) {
      console.error('Error fetching agent properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      setAgentProperties([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProperty = useCallback(async (
    data: Record<string, any>, 
    images: File[] = [], 
    extras: { floorPlans?: File[]; brochure?: File | null; virtualTour?: File | null } = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      
      // Add basic property data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'object' && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      // Add images
      images.forEach(file => formData.append('images', file));
      
      // Add extras
      if (extras.floorPlans) {
        extras.floorPlans.forEach(file => formData.append('floorPlans', file));
      }
      if (extras.brochure) {
        formData.append('brochure', extras.brochure);
      }
      if (extras.virtualTour) {
        formData.append('virtualTour', extras.virtualTour);
      }

      const response = await http.post('/api/v1/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const result = response.data;
      const newProperty = result.property || result;
      
      setProperties(prev => [...prev, newProperty]);
      setCache({}); // Clear cache since we added a new property
      return newProperty;
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err instanceof Error ? err.message : 'Failed to create property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProperty = useCallback(() => setProperty(null), []);
  const clearError = useCallback(() => setError(null), []);
  
  const clearCache = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('urban-realty-properties');
      localStorage.removeItem('urban-realty-featured-properties');
      localStorage.removeItem('urban-realty-cache');
      localStorage.removeItem('urban-realty-pagination');
    }
    setProperties([]);
    setFeaturedProperties([]);
    setCache({});
    setPagination({
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0
    });
  }, []);

  const contextValue = useMemo(() => ({
    properties,
    featuredProperties,
    agentProperties,
    property,
    loading,
    error,
    cache,
    pagination,
    developers,
    getProperties,
    getFeaturedProperties,
    getAgentProperties,
    getProperty,
    getDevelopers,
    addProperty,
    setProperties,
    setFeaturedProperties,
    setProperty,
    clearProperty,
    clearError,
    clearCache
  }), [
    properties,
    featuredProperties,
    agentProperties,
    property,
    loading,
    error,
    cache,
    pagination,
    developers,
    getProperties,
    getFeaturedProperties,
    getAgentProperties,
    getProperty,
    getDevelopers,
    addProperty,
    clearProperty,
    clearError,
    clearCache
  ]);

  return (
    <PropertiesContext.Provider value={contextValue}>
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
};
