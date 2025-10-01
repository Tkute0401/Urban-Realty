import React from 'react';

const EnvTest = () => {
  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Environment Variable Test</h3>
      <p><strong>API Key Found:</strong> {mapplsApiKey ? 'Yes' : 'No'}</p>
      <p><strong>API Key Length:</strong> {mapplsApiKey?.length || 0}</p>
      <p><strong>API Key Preview:</strong> {mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'N/A'}</p>
      <p><strong>Node Environment:</strong> {process.env.NODE_ENV}</p>
      <p><strong>All MAPPLS env vars:</strong> {JSON.stringify(Object.keys(process.env).filter(key => key.includes('MAPPLS')))}</p>
    </div>
  );
};

export default EnvTest;
