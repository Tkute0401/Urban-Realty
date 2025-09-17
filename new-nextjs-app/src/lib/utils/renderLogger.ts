'use client'

import React, { useEffect } from 'react';

// Environment flag to control debugging
const isDebugMode = process.env.NEXT_PUBLIC_DEBUG_RENDER === '1';

export const useRenderLogger = (componentName: string, props?: any) => {
  if (isDebugMode) {
    console.log(`🔧 ${componentName} rendering...`, props ? { props: Object.keys(props) } : '');
    
    useEffect(() => {
      console.log(`🔧 ${componentName} mounted on client side!`);
      
      return () => {
        console.log(`🔧 ${componentName} unmounted`);
      };
    }, [componentName]);
  }
};

export function withRenderLogger<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.ComponentType<P> {
  const WrappedComponent: React.FC<P> = (props: P) => {
    useRenderLogger(componentName, props);
    return React.createElement(Component, props);
  };
  
  WrappedComponent.displayName = `withRenderLogger(${componentName})`;
  return WrappedComponent;
}