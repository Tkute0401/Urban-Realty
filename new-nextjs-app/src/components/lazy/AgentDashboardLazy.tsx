// Lazy-loaded Agent Dashboard Component
import React, { Suspense } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';

// Lazy load the actual AgentDashboard component
const AgentDashboard = React.lazy(() => import('../../app/agent/AgentDashboard'));

const AgentDashboardLazy: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="large" message="Loading Agent Dashboard..." />
          </div>
        </div>
      }
    >
      <AgentDashboard />
    </Suspense>
  );
};

export default AgentDashboardLazy;