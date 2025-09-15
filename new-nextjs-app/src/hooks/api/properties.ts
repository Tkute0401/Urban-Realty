import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

export function usePropertiesQuery(params: Record<string, any>) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: async () => {
      const res = await api.properties.list(params);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 60 * 1000,
  });
}

