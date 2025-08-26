import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import SubscriptionPrompt from '../components/Subscription/SubscriptionPrompt';

const useSubscriptionAccess = () => {
  const { user } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptConfig, setPromptConfig] = useState({
    feature: '',
    requiredPlan: '',
    currentPlan: 'free'
  });

  // Define subscription hierarchy
  const subscriptionLevels = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'enterprise': 3
  };

  const checkAccess = useCallback((requiredPlan, feature) => {
    if (!user) {
      // User not logged in - redirect to login
      return { hasAccess: false, action: 'login' };
    }

    const userLevel = subscriptionLevels[user.subscriptionStatus] || 0;
    const requiredLevel = subscriptionLevels[requiredPlan] || 0;

    if (userLevel < requiredLevel) {
      // Show subscription prompt
      setPromptConfig({
        feature,
        requiredPlan,
        currentPlan: user.subscriptionStatus || 'free'
      });
      setShowPrompt(true);
      return { hasAccess: false, action: 'upgrade' };
    }

    return { hasAccess: true, action: null };
  }, [user]);

  const closePrompt = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const handleUpgrade = useCallback((selectedPlan) => {
    // Navigate to subscription page or handle upgrade
    window.location.href = '/subscriptions';
  }, []);

  const SubscriptionPromptComponent = () => (
    <SubscriptionPrompt
      open={showPrompt}
      onClose={closePrompt}
      feature={promptConfig.feature}
      requiredPlan={promptConfig.requiredPlan}
      currentPlan={promptConfig.currentPlan}
      onUpgrade={handleUpgrade}
    />
  );

  return {
    checkAccess,
    closePrompt,
    SubscriptionPromptComponent,
    userSubscription: user?.subscriptionStatus || 'free'
  };
};

export default useSubscriptionAccess;