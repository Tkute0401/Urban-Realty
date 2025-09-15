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

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await api.admin.analytics();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

