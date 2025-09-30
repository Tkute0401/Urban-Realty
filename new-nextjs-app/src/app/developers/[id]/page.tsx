'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DeveloperDetailsClient from '@/components/developer/DeveloperDetailsClient';
import { api } from '@/lib/services/api';

export default function DeveloperPage() {
  const params = useParams();
  const router = useRouter();
  const [developer, setDeveloper] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeveloper = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const id = params.id as string;
        console.log('🔍 Client-side fetchDeveloper - Fetching developer:', id);
        
        // Use the API client which already has the correct /api/v1 prefix
        const response = await api.developers.getById(id);
        
        console.log('🔍 Client-side fetchDeveloper - Response:', response);
        
        if (response.success && response.data) {
          setDeveloper(response.data);
        } else {
          setError('Developer not found');
        }
      } catch (err: any) {
        console.error('🔍 Client-side fetchDeveloper - Error:', err);
        setError(err.message || 'Failed to load developer');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDeveloper();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '50px', 
          height: '50px', 
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #ff5a3c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#666', fontSize: '16px' }}>Loading developer details...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: '1.5rem',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '72px', color: '#ff5a3c', margin: 0 }}>404</h1>
        <h2 style={{ fontSize: '24px', color: '#333', margin: 0 }}>Developer Not Found</h2>
        <p style={{ color: '#666', textAlign: 'center', maxWidth: '500px' }}>
          Sorry, the developer you are looking for could not be found. It might have been moved, deleted, or the URL was entered incorrectly.
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ff5a3c',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            Go to Homepage
          </button>
          <button
            onClick={() => router.push('/developers')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#ff5a3c',
              border: '2px solid #ff5a3c',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 500
            }}
          >
            Browse Developers
          </button>
        </div>
      </div>
    );
  }

  return <DeveloperDetailsClient developer={developer} />;
}
