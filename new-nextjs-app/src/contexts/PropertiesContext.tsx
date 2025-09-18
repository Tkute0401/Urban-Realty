import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import http from '@/lib/services/http';

// Types
interface Property {
  _id: string;
  title?: string;
  buildingName?: string;
  description?: string;
  images?: Array<{ url: string; alt?: string }>;
  price?: number;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: 'apartment' | 'villa' | 'land' | 'commercial' | 'house';
  status?: 'For Sale' | 'For Rent' | 'Sold' | 'Rented';
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    locality?: string;
  };
  location?: {
    coordinates?: [number, number];
  };
  developer?: {
    _id: string;
    name: string;
  };
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
  pagination: Record<string, any>;
  agentProperties: Property[];
  getProperties: (params?: Record<string, any>) => Promise<void>;
  getFeaturedProperties: () => Promise<Property[]>;
  getProperty: (id: string) => Promise<Property | null>;
  getAgentProperties: (user: any) => Promise<void>;
  getDevelopers: (params?: Record<string, any>) => Promise<void>;
  setProperties: (properties: Property[]) => void;
  setFeaturedProperties: (properties: Property[]) => void;
  setProperty: (property: Property | null) => void;
  clearError: () => void;
}

const defaultContextValue: PropertiesContextType = {
  properties: [],
  featuredProperties: [],
  property: null,
  loading: false,
  error: null,
  cache: {},
  developers: [],
  pagination: {},
  agentProperties: [],
  getProperties: async () => {},
  getFeaturedProperties: async () => [],
  getProperty: async () => null,
  getAgentProperties: async () => {},
  getDevelopers: async () => {},
  setProperties: () => {},
  setFeaturedProperties: () => {},
  setProperty: () => {},
  clearError: () => {},
};

const PropertiesContext = createContext<PropertiesContextType>(defaultContextValue);

interface PropertiesProviderProps {
  children: ReactNode;
}

export const PropertiesProvider: React.FC<PropertiesProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});
  const [developers, setDevelopers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [agentProperties, setAgentProperties] = useState([]);

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
      
      // Convert parameters to backend expected format
      const backendParams: Record<string, any> = { 
        ...params,
        page: params.page || 1,
        limit: params.limit || 12
      };
      
      // Handle status filter
      if (params.status) {
        backendParams.status = params.status === 'BUY' ? 'For Sale' : 'For Rent';
      } else {
        delete backendParams.status;
      }
      
      // Handle type filter
      if (params.type) {
        backendParams.propertyType = params.type;
        delete backendParams.type;
      }
      
      // Handle developer filter
      if (params.developer) {
        backendParams.developer = params.developer;
      }
      
      // Remove empty filters
      Object.keys(backendParams).forEach(key => {
        if (backendParams[key] === '' || 
            (Array.isArray(backendParams[key]) && backendParams[key].length === 0)) {
          delete backendParams[key];
        }
      });
      console.log("Backend Params:=",backendParams);
      const response = await http.get('/properties', { params: backendParams });
      const { data, pagination: paginationData } = response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid properties data format');
      }
      
      setProperties(data);
      setPagination(paginationData);
      setCache(prev => ({ 
        ...prev, 
        [cacheKey]: {
          properties: data,
          pagination: paginationData
        } 
      }));
    } catch (err) {
      console.error('API Error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      setError(err.response?.data?.message || err.message || 'Failed to fetch properties');
      setProperties([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const getFeaturedProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get('/properties/featured');
      const data = response.data?.data ?? response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid properties data format');
      }
      
      setFeaturedProperties(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch featured properties');
      setFeaturedProperties([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProperty = useCallback(async (id) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (cache[id]) {
        setProperty(cache[id]);
        return cache[id];
      }
  
      const response = await http.get(`/properties/${id}`);
      const propertyData = response.data?.data ?? response.data;
      
      if (!propertyData) {
        throw new Error('Received empty property data');
      }
      
      setProperty(propertyData);
      setCache(prev => ({ ...prev, [id]: propertyData }));
      return propertyData;
    } catch (err) {
      setError(err.response?.data?.message || 'Property not found');
      setProperty(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const createProperty = useCallback(async (formData, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalConfig = {
        ...config,
        headers: {
          ...(config.headers || {}),
          'Content-Type': 'multipart/form-data'
        }
      };

      // Convert nested objects to JSON strings for FormData
      if (formData.address) {
        formData.address = JSON.stringify(formData.address);
      }
      if (formData.nearbyLocalities) {
        formData.nearbyLocalities = JSON.stringify(formData.nearbyLocalities);
      }
      if (formData.projectDetails) {
        formData.projectDetails = JSON.stringify(formData.projectDetails);
      }
      if (formData.approvals) {
        formData.approvals = JSON.stringify(formData.approvals);
      }

      // Create FormData and append all fields
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item));
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await http.post('/properties', formDataToSend, finalConfig);
      
      const newProperty = response.data?.data ?? response.data;
      setProperties(prev => [...prev, newProperty]);
      setCache({}); // Clear cache since we added a new property
      return newProperty;
    } catch (err) {
      const errorData = err.response?.data;
      let errorMsg = 'Failed to create property';
      
      if (errorData) {
        if (errorData.error) {
          errorMsg = errorData.error;
        } else if (errorData.message) {
          errorMsg = errorData.message;
        } else if (errorData.errors) {
          errorMsg = Object.values(errorData.errors).join(', ');
        }
      }
      
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProperty = useCallback(async (id, formData) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      // Convert nested objects to JSON strings for FormData
      if (formData.address) {
        formData.address = JSON.stringify(formData.address);
      }
      if (formData.nearbyLocalities) {
        formData.nearbyLocalities = JSON.stringify(formData.nearbyLocalities);
      }
      if (formData.projectDetails) {
        formData.projectDetails = JSON.stringify(formData.projectDetails);
      }
      if (formData.approvals) {
        formData.approvals = JSON.stringify(formData.approvals);
      }

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item));
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await http.put(`/properties/${id}`, formDataToSend, config);
      const responseData = response.data?.data || response.data || response;
      
      if (!responseData) {
        throw new Error('No response data received');
      }

      if (responseData.success !== undefined && !responseData.success) {
        throw new Error(responseData.message || 'Update failed');
      }

      setProperty(responseData);
      setProperties(prev => prev.map(p => p._id === id ? responseData : p));
      setCache(prev => ({ ...prev, [id]: responseData }));
      
      return {
        data: responseData,
        status: response.status,
        message: responseData.message || 'Property updated successfully'
      };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                      err.response?.data?.message || 
                      err.message || 
                      'Failed to update property';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProperty = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await http.delete(`/properties/${id}`);
      setProperties(prev => prev.filter(p => p._id !== id));
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[id];
        return newCache;
      });
      if (property?._id === id) {
        setProperty(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete property');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [property]);

  const getDevelopers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await http.get('/developers');
      const data = response.data?.data ?? response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid developers data format');
      }
      
      setDevelopers(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch developers');
      setDevelopers([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAgentProperties = useCallback(async (user) => {
    try {
      console.log("User in context:=",user);
      setLoading(true);
      setError(null);
  
      const response = await http.get(`/properties/agent/${user.id}`);
      console.log("Response in context:=",response);
      const data = response.data?.data ?? response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid properties data format');
      }
      
      setAgentProperties(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
      setProperties([]);
      //throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProperty = useCallback(() => setProperty(null), []);
  const clearErrors = useCallback(() => setError(null), []);

  const contextValue = useMemo(() => ({
    properties,
    featuredProperties,
    agentProperties,
    property,
    loading,
    error,
    cache: {},
    pagination,
    developers,
    getProperties,
    getFeaturedProperties,
    getAgentProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getDevelopers,
    setProperties: (props: Property[]) => setProperties(props),
    setFeaturedProperties: (props: Property[]) => setFeaturedProperties(props),
    setProperty: (prop: Property | null) => setProperty(prop),
    clearProperty,
    clearError: () => setError(null),
    clearErrors
  }), [
    properties,
    featuredProperties,
    agentProperties,
    property,
    loading,
    error,
    pagination,
    developers,
    getProperties,
    getFeaturedProperties,
    getAgentProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    getDevelopers,
    clearProperty,
    clearErrors
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