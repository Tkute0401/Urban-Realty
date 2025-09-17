// src/components/common/AgentRoute.jsx
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const AgentRoute = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname || '/')}`);
      return;
    }
    if (user.role !== 'agent' && user.role !== 'admin') {
      router.replace('/');
    }
  }, [user, router, pathname]);

  if (!user || (user.role !== 'agent' && user.role !== 'admin')) {
    return null;
  }

  return children;
};

export default AgentRoute;