import { QueryClient } from '@tanstack/react-query'

// Create a single QueryClient instance that will be reused across the entire application
// This ensures the QueryClient is never recreated, preventing hook order issues
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

