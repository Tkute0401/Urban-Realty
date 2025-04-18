// src/context/PropertiesContext.js
import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import axios from '../services/axios';

const PropertiesContext = createContext();

export const PropertiesProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState({});

  const getProperties = useCallback(async (params = {}) => {
    const cacheKey = JSON.stringify(params);
    
    if (cache[cacheKey]) {
      setProperties(cache[cacheKey]);
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      
      // Convert type parameter to backend expected format
      const backendParams = { ...params };
      if (params.type) {
        backendParams.propertyType = params.type;
        delete backendParams.type;
      }
      
      const response = await axios.get('/properties', { params: backendParams });
      const data = response.data?.data ?? response.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Received invalid properties data format');
      }
      
      setProperties(data);
      setCache(prev => ({ ...prev, [cacheKey]: data }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const getFeaturedProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/properties/featured');
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
  
      // Use relative URL here too
      const response = await axios.get(`/properties/${id}`);
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

  const createProperty = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newProperty = response.data?.data ?? response.data;
      setProperties(prev => [...prev, newProperty]);
      setCache({});
      return newProperty;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create property');
      throw err;
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
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
  
      // Use relative URL instead of absolute
      const response = await axios.put(`/properties/${id}`, formData, config);
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
      await axios.delete(`/properties/${id}`);
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

  const clearProperty = useCallback(() => setProperty(null), []);
  const clearErrors = useCallback(() => setError(null), []);

  const contextValue = useMemo(() => ({
    properties,
    featuredProperties,
    property,
    loading,
    error,
    getProperties,
    getFeaturedProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    clearProperty,
    clearErrors
  }), [
    properties,
    featuredProperties,
    property,
    loading,
    error,
    getProperties,
    getFeaturedProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
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