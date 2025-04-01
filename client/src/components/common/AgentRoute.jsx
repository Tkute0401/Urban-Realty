// src/components/common/AgentRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AgentRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'agent' && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AgentRoute;