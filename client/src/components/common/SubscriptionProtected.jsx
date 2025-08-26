import React from 'react';
import useSubscriptionAccess from '../../hooks/useSubscriptionAccess';

const SubscriptionProtected = ({ 
  children, 
  requiredPlan, 
  feature, 
  fallback = null,
  showPrompt = true 
}) => {
  const { checkAccess, SubscriptionPromptComponent } = useSubscriptionAccess();

  const accessResult = checkAccess(requiredPlan, feature);

  if (accessResult.hasAccess) {
    return (
      <>
        {children}
        {showPrompt && <SubscriptionPromptComponent />}
      </>
    );
  }

  if (accessResult.action === 'login') {
    // Redirect to login or show login prompt
    return fallback || (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Login Required</h3>
        <p>Please log in to access this feature.</p>
        <button 
          onClick={() => window.location.href = '/login'}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    );
  }

  if (accessResult.action === 'upgrade' && showPrompt) {
    return (
      <>
        {fallback}
        <SubscriptionPromptComponent />
      </>
    );
  }

  return fallback;
};

export default SubscriptionProtected;