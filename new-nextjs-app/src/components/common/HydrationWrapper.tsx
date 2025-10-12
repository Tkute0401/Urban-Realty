'use client';

import { useState, useEffect, ReactNode } from 'react';

interface HydrationWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * HydrationWrapper prevents hydration mismatches by ensuring
 * components only render on the client side after hydration is complete.
 * This prevents React errors #418 and #423 in production builds.
 */
const HydrationWrapper = ({ children, fallback = null }: HydrationWrapperProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HydrationWrapper;
