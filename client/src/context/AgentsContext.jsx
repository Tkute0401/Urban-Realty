// src/context/AgentsContext.js
import { createContext, useState, useEffect } from 'react';
import axios from '../services/axios';

const AgentsContext = createContext();

export const AgentsProvider = ({ children }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/agents');
      if (response.data.success) {
        setAgents(response.data.data || []);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AgentsContext.Provider value={{ agents, loading, error, getAgents }}>
      {children}
    </AgentsContext.Provider>
  );
};

export const useAgents = () => {
  const context = useContext(AgentsContext);
  if (!context) {
    throw new Error('useAgents must be used within an AgentsProvider');
  }
  return context;
};