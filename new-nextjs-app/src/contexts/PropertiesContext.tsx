import { createContext, useContext, useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
import { api } from '@/lib/services/api';
import type { Property } from '@/components/ui';


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
  getAgentProperties: (user: any) => Promise<any[]>;
  getDevelopers: (params?: Record<string, any>) => Promise<any[]>;
  setProperties: (properties: Property[]) => void;
  setFeaturedProperties: (properties: Property[]) => void;
  setProperty: (property: Property | null) => void;
  clearError: () => void;
  clearCache: () => void;
  // New alias with richer signature matching client app usage
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
  pagination: {},
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
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 PropertiesProvider rendering...');
  }
  
  // Initialize state with localStorage persistence
  const [properties, setProperties] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('urban-realty-properties');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [featuredProperties, setFeaturedProperties] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('urban-realty-featured-properties');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('urban-realty-cache');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [developers, setDevelopers] = useState([]);
  const [pagination, setPagination] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('urban-realty-pagination');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [agentProperties, setAgentProperties] = useState([]);
  
  // Add useEffect for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 PropertiesProvider mounted on client side!');
    }
    return () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 PropertiesProvider unmounted');
      }
    };
  }, []);

  // Persist properties to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && properties.length > 0) {
      localStorage.setItem('urban-realty-properties', JSON.stringify(properties));
    }
  }, [properties]);

  // Persist featured properties to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && featuredProperties.length > 0) {
      localStorage.setItem('urban-realty-featured-properties', JSON.stringify(featuredProperties));
    }
  }, [featuredProperties]);

  // Persist cache to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(cache).length > 0) {
      localStorage.setItem('urban-realty-cache', JSON.stringify(cache));
    }
  }, [cache]);

  // Persist pagination to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && Object.keys(pagination).length > 0) {
      localStorage.setItem('urban-realty-pagination', JSON.stringify(pagination));
    }
  }, [pagination]);

  // Initialize properties from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProperties = localStorage.getItem('urban-realty-properties');
      const savedFeatured = localStorage.getItem('urban-realty-featured-properties');
      const savedCache = localStorage.getItem('urban-realty-cache');
      const savedPagination = localStorage.getItem('urban-realty-pagination');
      
      if (savedProperties && properties.length === 0) {
        try {
          const parsed = JSON.parse(savedProperties);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProperties(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse saved properties:', e);
        }
      }
      
      if (savedFeatured && featuredProperties.length === 0) {
        try {
          const parsed = JSON.parse(savedFeatured);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFeaturedProperties(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse saved featured properties:', e);
        }
      }
      
      if (savedCache && Object.keys(cache).length === 0) {
        try {
          const parsed = JSON.parse(savedCache);
          if (typeof parsed === 'object' && parsed !== null) {
            setCache(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse saved cache:', e);
        }
      }
      
      if (savedPagination && Object.keys(pagination).length === 0) {
        try {
          const parsed = JSON.parse(savedPagination);
          if (typeof parsed === 'object' && parsed !== null) {
            setPagination(parsed);
          }
        } catch (e) {
          console.warn('Failed to parse saved pagination:', e);
        }
      }
    }
  }, []); // Only run on mount

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
      const response = await api.properties.list(backendParams);
      console.log('🔧 PropertiesContext - Properties response:', response.data);
      
      // Handle different response structures
      const responseData = response.data;
      let data = [];
      let paginationData = {};
      
      if (responseData && 'items' in responseData && Array.isArray(responseData.items)) {
        data = responseData.items;
        paginationData = {
          page: responseData.page,
          limit: responseData.pageSize,
          total: responseData.totalItems,
          pages: responseData.totalPages
        };
      } else if (responseData && 'data' in responseData && Array.isArray(responseData.data)) {
        data = responseData.data;
        paginationData = ('pagination' in responseData && responseData.pagination) || {};
      } else if (Array.isArray(responseData)) {
        data = responseData;
      } else {
        console.warn('🔧 PropertiesContext - Unexpected response format:', responseData);
        data = [];
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
  }, []); // Remove cache dependency to prevent infinite loops

  const getFeaturedProperties = useCallback(async () => {
    console.log('🔧 PropertiesContext - getFeaturedProperties called');
    try {
      setLoading(true);
      setError(null);
      console.log('🔧 PropertiesContext - Fetching featured properties');
      const response = await api.properties.featured();
      const responseData = response.data;
      const data = (responseData && 'items' in responseData && Array.isArray(responseData.items)) 
        ? responseData.items 
        : (responseData && 'data' in responseData && Array.isArray(responseData.data))
        ? responseData.data
        : Array.isArray(responseData) 
        ? responseData 
        : [];
      
      console.log('🔧 PropertiesContext - Featured properties response:', { 
        dataType: typeof data,
        isArray: Array.isArray(data),
        count: Array.isArray(data) ? data.length : 'N/A'
      });
      
      if (!Array.isArray(data)) {
        console.error('🔧 PropertiesContext - Invalid featured properties data format:', data);
        throw new Error('Received invalid properties data format');
      }
      
      console.log('🔧 PropertiesContext - Setting featured properties, count:', data.length);
      setFeaturedProperties(data);
      return data;
    } catch (err) {
      console.error('🔧 PropertiesContext - Error fetching featured properties:', err);
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
  
      const response = await api.properties.getById(id);
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
  }, []); // Remove cache dependency to prevent infinite loops

  const createProperty = useCallback(async (formData, config = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const finalConfig = {
        ...config,
        headers: {
          ...((config as any).headers || {}),
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

      const response = await api.properties.create(formDataToSend);
      
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

  // Aliased helper to match client app API: addProperty(data, imageFiles, extras)
  const addProperty = useCallback(async (
    data: Record<string, any>, 
    images: File[] = [], 
    extras: { floorPlans?: File[]; brochure?: File | null; virtualTour?: File | null } = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      // Normalize nested structures to strings where necessary (server expects FormData + JSON strings for objects)
      const normalized: Record<string, any> = { ...data };
      if (normalized.address && typeof normalized.address !== 'string') normalized.address = JSON.stringify(normalized.address);
      if (normalized.nearbyLocalities && typeof normalized.nearbyLocalities !== 'string') normalized.nearbyLocalities = JSON.stringify(normalized.nearbyLocalities);
      if (normalized.projectDetails && typeof normalized.projectDetails !== 'string') normalized.projectDetails = JSON.stringify(normalized.projectDetails);
      if (normalized.approvals && typeof normalized.approvals !== 'string') normalized.approvals = JSON.stringify(normalized.approvals);

      const formDataToSend = new FormData();
      Object.entries(normalized).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item as any));
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      // Append images and optional assets using keys aligned with client app
      images?.forEach(file => formDataToSend.append('images', file));
      extras.floorPlans?.forEach(file => formDataToSend.append('floorPlans', file));
      if (extras.brochure) formDataToSend.append('brochure', extras.brochure);
      if (extras.virtualTour) formDataToSend.append('virtualTour', extras.virtualTour);

      const response = await api.properties.create(formDataToSend);
      const newProperty = response.data?.data ?? response.data;
      setProperties(prev => [...prev, newProperty]);
      setCache({});
      return newProperty;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to create property';
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
          // Special handling for existingImages parity with client app
          if (key === 'existingImages') {
            (value as any[]).forEach((item: any) => {
              const payload = typeof item === 'string' ? item : JSON.stringify(item);
              formDataToSend.append('existingImages', payload);
            });
          } else if (key === 'images' || key === 'floorPlans') {
            (value as any[]).forEach((item: any) => formDataToSend.append(key, item));
          } else {
            (value as any[]).forEach((item: any) => formDataToSend.append(`${key}[]`, item));
          }
        } else if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, String(value));
        }
      });

      const response = await api.properties.update(id, formDataToSend);
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
      await api.properties.delete(id);
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
      const response = await api.developers.list();
      const responseData = response.data;
      const data = (responseData && 'items' in responseData && Array.isArray(responseData.items)) 
        ? responseData.items 
        : (responseData && 'data' in responseData && Array.isArray(responseData.data))
        ? responseData.data
        : Array.isArray(responseData) 
        ? responseData 
        : [];
      
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
  
      // Use the correct endpoint based on backend routes
      const response = await api.agent.properties({ agentId: user.id });
      console.log("Response in context:=",response);
      const responseData = response.data;
      const data = (responseData && 'items' in responseData && Array.isArray(responseData.items)) 
        ? responseData.items 
        : (responseData && 'data' in responseData && Array.isArray(responseData.data))
        ? responseData.data
        : Array.isArray(responseData) 
        ? responseData 
        : [];
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid properties data format');
      }
      
      setAgentProperties(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
      setAgentProperties([]); // Fix: was setting wrong state
      //throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProperty = useCallback(() => setProperty(null), []);
  const clearErrors = useCallback(() => setError(null), []);
  
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
    setPagination({});
  }, []);

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
    clearErrors,
    clearCache
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
    clearErrors,
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
