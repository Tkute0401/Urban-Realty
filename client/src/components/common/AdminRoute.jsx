// src/components/common/AdminRoute.jsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') {
    console.log(user.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;