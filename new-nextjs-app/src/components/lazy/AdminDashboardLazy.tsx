// Lazy-loaded Admin Dashboard Component
import React, { Suspense } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load the actual AdminDashboard component
const AdminDashboard = React.lazy(() => import('@/components/admin/AdminDashboard'));

const AdminDashboardLazy: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" message="Loading Admin Dashboard..." />
          </div>
        </div>
      }
    >
      <AdminDashboard />
    </Suspense>
  );
};

export default AdminDashboardLazy;