import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useSubscriptionAccess from '../../hooks/useSubscriptionAccess';
import SubscriptionPrompt from '../Subscription/SubscriptionPrompt';

const SubscriptionProtectedRoute = ({ 
  children, 
  requiredFeature, 
  fallbackPath = '/subscriptions',
  showPrompt = true 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const { hasAccess, getCurrentPlan, getRequiredPlan, getFeatureDisplayName } = useSubscriptionAccess();
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  // If user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no specific feature is required, just check if user is authenticated
  if (!requiredFeature) {
    return children;
  }

  // Check if user has access to the required feature
  if (hasAccess(requiredFeature)) {
    return children;
  }

  // If user doesn't have access and we should show prompt
  if (showPrompt) {
    const currentPlan = getCurrentPlan();
    const requiredPlan = getRequiredPlan(requiredFeature);
    const featureName = getFeatureDisplayName(requiredFeature);

    return (
      <>
        <SubscriptionPrompt
          open={true}
          onClose={() => setShowSubscriptionPrompt(false)}
          feature={featureName}
          requiredPlan={requiredPlan}
          currentPlan={currentPlan}
          onUpgrade={(plan) => {
            // Handle upgrade logic here
            console.log('Upgrading to plan:', plan);
          }}
        />
        {/* Don't render children when showing subscription prompt */}
        {null}
      </>
    );
  }

  // If we shouldn't show prompt, redirect to fallback path
  return <Navigate to={fallbackPath} state={{ from: location }} replace />;
};

export default SubscriptionProtectedRoute;