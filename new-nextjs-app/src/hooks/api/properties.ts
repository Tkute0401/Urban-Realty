import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/services/api';
import { PaginatedResult } from '@/lib/services/api.types';

export function usePropertiesQuery(params: Record<string, any>) {
  console.log('🔧 usePropertiesQuery hook called with params:', params);
  
  return useQuery({
    queryKey: ['properties', params],
    queryFn: async () => {
      console.log('🔧 usePropertiesQuery - Fetching properties with params:', params);
      try {
        const res = await api.properties.list(params);
        console.log('🔧 usePropertiesQuery - Fetched properties:', { 
          count: Array.isArray(res.data?.items) ? res.data.items.length : 'N/A',
          totalItems: res.data?.totalItems || 'N/A',
          success: res.success
        });
        return res.data;
      } catch (error) {
        console.error('🔧 usePropertiesQuery - Error fetching properties:', error);
        throw error;
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
}

