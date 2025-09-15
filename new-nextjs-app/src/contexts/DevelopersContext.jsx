import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import http from '@/lib/services/http';

const DevelopersContext = createContext();

export const DevelopersProvider = ({ children }) => {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearErrors = () => setError(null);
  

  const updateDeveloper = useCallback(async (id, formData, config) => {
  try {
    setLoading(true);
    const response = await axios.put(
      `/developers/${id}`,
      formData,
      config
    );
    console.log(response);
    
    getDevelopers();
    return response.data;
  } catch (err) {
    setError(err.response?.data?.message || err.message || 'Failed to update developer');
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

  const getDevelopers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/developers');
      console.log(response);
      setDevelopers(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch developers');
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeveloper = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/developers/${id}`);
      console.log(response);
      
      setDevelopers(response.data.data || response.data);
      console.log("developers:",developers);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch developer');
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(() => ({
    developers,
    loading,
    error,
    getDeveloper,
    updateDeveloper,
    clearErrors,
    getDevelopers
  }), [developers, loading, error, getDevelopers]);

  return (
    <DevelopersContext.Provider value={contextValue}>
      {children}
    </DevelopersContext.Provider>
  );
};

export const useDevelopers = () => {
  const context = useContext(DevelopersContext);
  if (!context) {
    throw new Error('useDevelopers must be used within a DevelopersProvider');
  }
  return context;
};