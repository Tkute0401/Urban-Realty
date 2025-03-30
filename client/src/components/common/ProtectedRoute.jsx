import { useContext } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  console.log('ProtectedRoute check:', { user, path: location.pathname });

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;