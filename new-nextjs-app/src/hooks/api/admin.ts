import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: async () => {
      const res = await api.admin.dashboard();
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useAdminAnalytics(params?: Record<string, any>) {
  return useQuery({
    queryKey: ['adminAnalytics', params],
    queryFn: async () => {
      const res = await api.admin.analytics(params);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

