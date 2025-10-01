'use client'

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import MapTest to ensure it only runs on client-side
const MapTest = dynamic(() => import('@/components/property/MapTest'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '18px'
    }}>
      Loading Map Test...
    </div>
  )
});

export default function MapTestPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading Map Test...
      </div>
    }>
      <MapTest />
    </Suspense>
  );
}