import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { api } from '@/lib/services/api';

// Types
interface Developer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  description?: string;
  establishedYear?: number;
  website?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

interface DevelopersContextType {
  developers: Developer[];
  loading: boolean;
  error: string | null;
  clearErrors: () => void;
  createDeveloper: (formData: FormData, config?: any) => Promise<any>;
  updateDeveloper: (id: string, formData: FormData, config?: any) => Promise<any>;
  getDevelopers: () => Promise<void>;
  getDeveloper: (id: string) => Promise<Developer>;
}

interface DevelopersProviderProps {
  children: ReactNode;
}

// Create context
const DevelopersContext = createContext<DevelopersContextType | undefined>(undefined);

export const DevelopersProvider: React.FC<DevelopersProviderProps> = ({ children }) => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearErrors = (): void => setError(null);

  const createDeveloper = useCallback(async (formData: FormData, config?: any): Promise<any> => {
    try {
      setLoading(true);
      const response = await api.developers.create(formData);
      console.log(response);
      
      getDevelopers();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create developer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDeveloper = useCallback(async (id: string, formData: FormData, config?: any): Promise<any> => {
    try {
      setLoading(true);
      const response = await api.developers.update(id, formData);
      console.log(response);
      
      getDevelopers();
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update developer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getDevelopers = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.developers.list();
      console.log(response);
      setDevelopers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch developers');
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDeveloper = useCallback(async (id: string): Promise<Developer> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.developers.getById(id);
      console.log(response);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch developer');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: DevelopersContextType = useMemo(() => ({
    developers,
    loading,
    error,
    clearErrors,
    createDeveloper,
    updateDeveloper,
    getDevelopers,
    getDeveloper
  }), [developers, loading, error, createDeveloper, updateDeveloper, getDevelopers, getDeveloper]);

  return (
    <DevelopersContext.Provider value={value}>
      {children}
    </DevelopersContext.Provider>
  );
};

export const useDevelopers = (): DevelopersContextType => {
  const context = useContext(DevelopersContext);
  if (!context) {
    throw new Error('useDevelopers must be used within a DevelopersProvider');
  }
  return context;
};