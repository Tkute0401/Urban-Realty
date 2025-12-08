'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import http from '@/lib/services/http';
import { Property, PropertyFilters } from '@/types/property';

interface PropertiesContextType {
  properties: Property[];
  featuredProperties: Property[];
  similarProperties: Property[];
  property: Property | null;
  agentProperties: Property[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  getProperties: (filters?: PropertyFilters) => Promise<void>;
  getFeaturedProperties: () => Promise<Property[]>;
  getSimilarProperties: (filters?: PropertyFilters) => Promise<Property[]>;
  getProperty: (id: string) => Promise<Property | null>;
  getAgentProperties: (user: any) => Promise<void>;
  addProperty: (propertyData: any) => Promise<Property>;
  setProperty: (property: Property | null) => void;
  clearError: () => void;
  refreshProperties: () => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export const PropertiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [property, setProperty] = useState<Property | null>(null);
  const [agentProperties, setAgentProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [lastFilters, setLastFilters] = useState<PropertyFilters>({});

  const getProperties = useCallback(async (filters: PropertyFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      setLastFilters(filters);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            queryParams.append(key, value.join(','));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
      
      console.log('🔍 Frontend: Query params:', queryParams.toString());

      const url = `/api/v1/properties?${queryParams.toString()}`;
      console.log('🔍 Frontend: Making API request to:', url);
      const response = await http.get(url);
      
      const data = response.data;
      console.log('🔍 Frontend: API response:', data);
      console.log('🔍 Frontend: Properties received:', data.data);
      console.log('🔍 Frontend: Pagination:', data.pagination);
      console.log('🔍 Frontend: Properties count:', data.data?.length || 0);
      console.log('🔍 Frontend: First property amenities:', data.data?.[0]?.amenities);
      console.log('🔍 Frontend: Response structure check:', {
        hasData: !!data.data,
        dataIsArray: Array.isArray(data.data),
        dataLength: data.data?.length,
        hasPagination: !!data.pagination
      });
      
      setProperties(data.data || []);
      setPagination({
        page: data.pagination?.currentPage || 1,
        limit: data.pagination?.limit || 12,
        total: data.pagination?.totalResults || 0,
        totalPages: data.pagination?.totalPages || 0
      });
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.get('/api/v1/properties/featured');
      const data = response.data;
      const properties = data.data || [];
      
      setFeaturedProperties(properties);
      return properties;
    } catch (err) {
      console.error('Error fetching featured properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured properties');
      setFeaturedProperties([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getSimilarProperties = useCallback(async (filters: PropertyFilters = {}) => {
    try {
      setError(null);
      
      const queryParams = new URLSearchParams();
      // Remove restrictive filters to get broader results
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.city) queryParams.append('city', filters.city);
      
      // Limit to 6 similar properties
      queryParams.append('limit', '6');
      
      console.log('🔍 Fetching similar properties with:', queryParams.toString());
      
      const url = `/api/v1/properties?${queryParams.toString()}`;
      const response = await http.get(url);
      const data = response.data;
      const properties = data.data || [];
      
      setSimilarProperties(properties);
      return properties;
    } catch (err) {
      console.error('Error fetching similar properties:', err);
      setSimilarProperties([]);
      return [];
    }
  }, []);

  const getProperty = useCallback(async (id: string) => {
    if (!id) return null;
    
    try {
      setLoading(true);
      setError(null);
  
      const response = await http.get(`/api/v1/properties/${id}`);
      const data = response.data;
      const propertyData = data.data || data.property || data;
      
      if (!propertyData) {
        throw new Error('Property not found');
      }
      
      setProperty(propertyData);
      return propertyData;
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(err instanceof Error ? err.message : 'Property not found');
      setProperty(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProperties = useCallback(async () => {
    await getProperties(lastFilters);
  }, [lastFilters, getProperties]);

  const addProperty = useCallback(async (propertyData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.post('/api/v1/properties', propertyData);
      const data = response.data;
      const newProperty = data.data || data.property || data;
      
      // Add the new property to the current list
      setProperties(prev => [newProperty, ...prev]);
      
      return newProperty;
    } catch (err) {
      console.error('Error creating property:', err);
      const { extractErrorMessage } = await import('@/lib/utils/extractErrorMessage');
      const errorMessage = extractErrorMessage(err, 'Failed to create property');
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAgentProperties = useCallback(async (user: any) => {
    if (!user || !user._id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await http.get(`/api/v1/properties/agent/${user._id}`);
      const data = response.data;
      const properties = data.data || data.properties || [];
      
      setAgentProperties(properties);
    } catch (err) {
      console.error('Error fetching agent properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch agent properties');
      setAgentProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    properties,
    featuredProperties,
    similarProperties,
    property,
    agentProperties,
    loading,
    error,
    pagination,
    getProperties,
    getFeaturedProperties,
    getSimilarProperties,
    getProperty,
    getAgentProperties,
    addProperty,
    setProperty,
    clearError,
    refreshProperties
  };

  return (
    <PropertiesContext.Provider value={value}>
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

