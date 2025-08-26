import { useState } from 'react';
import useSubscriptionAccess from './useSubscriptionAccess';
import SubscriptionPrompt from '../components/Subscription/SubscriptionPrompt';

const useApiErrorHandler = () => {
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState(null);
  const { getCurrentPlan, getRequiredPlan, getFeatureDisplayName } = useSubscriptionAccess();

  const handleApiError = (error, feature = null) => {
    // Check if it's a subscription-related error (403 with subscription message)
    if (error.response?.status === 403) {
      const errorMessage = error.response?.data?.message || '';
      
      // Check if the error message contains subscription-related keywords
      const subscriptionKeywords = [
        'subscription',
        'plan',
        'upgrade',
        'access denied',
        'requires',
        'basic',
        'premium',
        'enterprise'
      ];

      const isSubscriptionError = subscriptionKeywords.some(keyword => 
        errorMessage.toLowerCase().includes(keyword.toLowerCase())
      );

      if (isSubscriptionError) {
        // Extract the required plan from the error message
        let requiredPlan = 'basic'; // default
        if (errorMessage.includes('basic')) requiredPlan = 'basic';
        else if (errorMessage.includes('premium')) requiredPlan = 'premium';
        else if (errorMessage.includes('enterprise')) requiredPlan = 'enterprise';

        // Extract feature name from error message or use provided feature
        let featureName = feature;
        if (!featureName) {
          // Try to extract feature name from error message
          const featureMatch = errorMessage.match(/requires a \w+ subscription or higher\. Your current plan/);
          if (featureMatch) {
            featureName = 'This feature';
          }
        }

        setSubscriptionError({
          feature: featureName || 'This feature',
          requiredPlan,
          currentPlan: getCurrentPlan(),
          message: errorMessage
        });
        setShowSubscriptionPrompt(true);
        return true; // Indicates this was a subscription error
      }
    }

    // For other errors, you might want to show a generic error message
    console.error('API Error:', error);
    return false; // Indicates this was not a subscription error
  };

  const SubscriptionPromptComponent = () => {
    if (!showSubscriptionPrompt || !subscriptionError) return null;

    return (
      <SubscriptionPrompt
        open={showSubscriptionPrompt}
        onClose={() => {
          setShowSubscriptionPrompt(false);
          setSubscriptionError(null);
        }}
        feature={subscriptionError.feature}
        requiredPlan={subscriptionError.requiredPlan}
        currentPlan={subscriptionError.currentPlan}
        onUpgrade={(plan) => {
          // Handle upgrade logic here
          console.log('Upgrading to plan:', plan);
          setShowSubscriptionPrompt(false);
          setSubscriptionError(null);
        }}
      />
    );
  };

  return {
    handleApiError,
    SubscriptionPromptComponent,
    showSubscriptionPrompt,
    subscriptionError
  };
};

export default useApiErrorHandler;