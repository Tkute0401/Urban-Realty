'use client';

import { ReactNode } from 'react';

interface HydrationWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * HydrationWrapper - Pass through children without conditional rendering
 * Conditional rendering based on mount state causes React error #310
 */
const HydrationWrapper = ({ children }: HydrationWrapperProps) => {
  // Simply return children without any conditional logic
  return <>{children}</>;
};

export default HydrationWrapper;
