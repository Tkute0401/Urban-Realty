import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { api } from '@/lib/services/api';

// Types
interface Developer {
  _id: string;
  userId?: string; // Added userId field for user connection
  name: string;
  email?: string;
  phone?: string;
  profilePhoto?: string;
  logo?: string; // Add logo property
  description?: string;
  foundedYear?: number;
  website?: string;
  location?: string;
  headquarters?: {
    city?: string;
    state?: string;
    country?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  completedProjects?: number;
  ongoingProjects?: number;
  upcomingProjects?: number;
  flagshipProjects?: Array<{
    name?: string;
    description?: string;
  }>;
  team?: Array<{
    name?: string;
    designation?: string;
    image?: {
      url?: string;
      publicId?: string;
    };
  }>;
  specializations?: Array<{
    name?: string;
    description?: string;
  }>;
  awards?: Array<{
    name?: string;
    year?: number;
    category?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface DevelopersContextType {
  developers: Developer[];
  myDeveloperProfile: Developer | null;
  loading: boolean;
  error: string | null;
  clearErrors: () => void;
  createDeveloper: (formData: FormData, config?: any) => Promise<any>;
  updateDeveloper: (id: string, formData: FormData, config?: any) => Promise<any>;
  getDevelopers: () => Promise<void>;
  getMyDeveloperProfile: () => Promise<void>;
  getDeveloper: (id: string) => Promise<Developer>;
}

interface DevelopersProviderProps {
  children: ReactNode;
}

// Create context
const DevelopersContext = createContext<DevelopersContextType | undefined>(undefined);

export const DevelopersProvider: React.FC<DevelopersProviderProps> = ({ children }) => {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [myDeveloperProfile, setMyDeveloperProfile] = useState<Developer | null>(null);
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

  const getMyDeveloperProfile = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.developers.getMyProfile();
      console.log(response);
      setMyDeveloperProfile(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch developer profile');
      setMyDeveloperProfile(null);
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
      const data = response.data;
      const items = Array.isArray(data) ? data : (data?.items || []);
      setDevelopers(items);
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
    myDeveloperProfile,
    loading,
    error,
    clearErrors,
    createDeveloper,
    updateDeveloper,
    getDevelopers,
    getMyDeveloperProfile,
    getDeveloper
  }), [developers, myDeveloperProfile, loading, error, createDeveloper, updateDeveloper, getDevelopers, getMyDeveloperProfile, getDeveloper]);

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