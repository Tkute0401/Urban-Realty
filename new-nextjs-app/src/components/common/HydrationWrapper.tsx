'use client';

import { ReactNode } from 'react';

interface HydrationWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * HydrationWrapper - Simplified to just pass through children
 * The conditional rendering was causing React error #310 by making hook calls conditional
 * Since we're using 'use client' throughout the app, we don't need this wrapper
 */
const HydrationWrapper = ({ children }: HydrationWrapperProps) => {
  return <>{children}</>;
};

export default HydrationWrapper;
