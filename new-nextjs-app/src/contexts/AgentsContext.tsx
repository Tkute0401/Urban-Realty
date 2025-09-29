import React, { createContext, useState, useContext, ReactNode } from 'react';
import { api } from '@/lib/services/api';

// Types
interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePhoto?: string;
  experience?: string;
  specialization?: string;
  createdAt: string;
  updatedAt: string;
}

interface AgentsContextType {
  agents: Agent[];
  loading: boolean;
  error: string | null;
  getAgents: () => Promise<void>;
}

interface AgentsProviderProps {
  children: ReactNode;
}

// Create context
const AgentsContext = createContext<AgentsContextType | undefined>(undefined);

export const AgentsProvider: React.FC<AgentsProviderProps> = ({ children }) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAgents = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.admin.agents();
      if (response.success) {
        setAgents(response.data || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const value: AgentsContextType = {
    agents,
    loading,
    error,
    getAgents
  };

  return (
    <AgentsContext.Provider value={value}>
      {children}
    </AgentsContext.Provider>
  );
};

export const useAgents = (): AgentsContextType => {
  const context = useContext(AgentsContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentsProvider');
  }
  return context;
};