import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { api } from '@/lib/services/api';

// Types
interface Project {
  _id: string;
  developer: {
    _id: string;
    name: string;
    logo?: string;
    website?: string;
  };
  name: string;
  description: string;
  shortDescription?: string;
  type: 'Residential' | 'Commercial' | 'Mixed-Use' | 'Industrial' | 'Hospitality' | 'Retail' | 'Office' | 'Other';
  status: 'Planning' | 'Under Construction' | 'Completed' | 'On Hold' | 'Cancelled';
  totalUnits?: number;
  totalArea?: number;
  unitTypes?: Array<{
    type: string;
    count: number;
    area: number;
    priceRange: {
      min: number;
      max: number;
    };
  }>;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    coordinates: {
      type: string;
      coordinates: [number, number];
    };
    landmarks?: string[];
  };
  launchDate?: string;
  possessionDate?: string;
  constructionStartDate?: string;
  estimatedCompletionDate?: string;
  pricePerSqFt?: number;
  startingPrice?: number;
  priceRange?: {
    min: number;
    max: number;
  };
  amenities?: Array<{
    name: string;
    description?: string;
    icon?: string;
  }>;
  features?: Array<{
    name: string;
    description?: string;
  }>;
  images?: Array<{
    url: string;
    publicId: string;
    caption?: string;
    isPrimary: boolean;
  }>;
  floorPlans?: Array<{
    url: string;
    publicId: string;
    unitType?: string;
    caption?: string;
  }>;
  brochures?: Array<{
    url: string;
    publicId: string;
    name: string;
    type: string;
  }>;
  virtualTours?: Array<{
    url: string;
    type: 'video' | '360' | 'virtual_reality';
    thumbnail?: string;
  }>;
  approvals?: Array<{
    name: string;
    number: string;
    issuingAuthority?: string;
    date?: string;
    status: 'Approved' | 'Pending' | 'Rejected';
  }>;
  reraNumber?: string;
  paymentPlans?: Array<{
    name: string;
    description?: string;
    percentage: number;
    timeline?: string;
  }>;
  contact?: {
    salesOffice?: {
      address?: string;
      phone?: string;
      email?: string;
    };
    siteOffice?: {
      address?: string;
      phone?: string;
    };
  };
  keywords?: string[];
  metaDescription?: string;
  isActive: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  views: number;
  inquiries: number;
  createdAt: string;
  updatedAt: string;
}

interface ProjectsContextType {
  projects: Project[];
  myProjects: Project[];
  project: Project | null;
  loading: boolean;
  error: string | null;
  clearErrors: () => void;
  getProjects: (filters?: any) => Promise<void>;
  getMyProjects: () => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  getProjectsByDeveloper: (developerId: string) => Promise<void>;
  createProject: (formData: FormData, config?: any) => Promise<any>;
  updateProject: (id: string, formData: FormData, config?: any) => Promise<any>;
  deleteProject: (id: string) => Promise<void>;
}

interface ProjectsProviderProps {
  children: ReactNode;
}

// Create context
const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<ProjectsProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearErrors = (): void => setError(null);

  const getProjects = useCallback(async (filters?: any): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.projects.list(filters);
      const data = response.data;
      const items = Array.isArray(data) ? data : (data?.items || []);
      setProjects(items);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyProjects = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.projects.getMyProjects();
      const data = response.data;
      setMyProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch my projects');
      setMyProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProject = useCallback(async (id: string): Promise<Project | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.projects.getById(id);
      const projectData = response.data;
      setProject(projectData);
      return projectData;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch project');
      setProject(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectsByDeveloper = useCallback(async (developerId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.projects.getByDeveloper(developerId);
      const data = response.data;
      setProjects(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch developer projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (formData: FormData, config?: any): Promise<any> => {
    try {
      setLoading(true);
      const response = await api.projects.create(formData);
      
      getMyProjects(); // Refresh my projects list
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getMyProjects]);

  const updateProject = useCallback(async (id: string, formData: FormData, config?: any): Promise<any> => {
    try {
      setLoading(true);
      const response = await api.projects.update(id, formData);
      
      getMyProjects(); // Refresh my projects list
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getMyProjects]);

  const deleteProject = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await api.projects.delete(id);
      
      // Remove from my projects list
      setMyProjects(prev => prev.filter(project => project._id !== id));
      
      // Remove from projects list if it exists there
      setProjects(prev => prev.filter(project => project._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value: ProjectsContextType = useMemo(() => ({
    projects,
    myProjects,
    project,
    loading,
    error,
    clearErrors,
    getProjects,
    getMyProjects,
    getProject,
    getProjectsByDeveloper,
    createProject,
    updateProject,
    deleteProject
  }), [
    projects,
    myProjects,
    project,
    loading,
    error,
    getProjects,
    getMyProjects,
    getProject,
    getProjectsByDeveloper,
    createProject,
    updateProject,
    deleteProject
  ]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = (): ProjectsContextType => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
