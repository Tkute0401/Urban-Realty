import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/services/api';

export function useDeveloperDashboard(params?: Record<string, any>, options?: any) {
  return useQuery({
    queryKey: ['developerDashboard', params],
    queryFn: async () => {
      const res = await api.developers.dashboard(params);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

export function useDeveloperAnalytics(params?: Record<string, any>, options?: any) {
  return useQuery({
    queryKey: ['developerAnalytics', params],
    queryFn: async () => {
      const res = await api.developers.analytics(params);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

export function useDeveloperProjects(params?: Record<string, any>, options?: any) {
  return useQuery({
    queryKey: ['developerProjects', params],
    queryFn: async () => {
      const res = await api.projects.getByDeveloper(params?.developerId || '');
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

export function useDeveloperInquiries(params?: Record<string, any>, options?: any) {
  return useQuery({
    queryKey: ['developerInquiries', params],
    queryFn: async () => {
      const res = await api.developers.inquiries(params);
      return res.data;
    },
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectData: any) => {
      const res = await api.projects.create(projectData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developerProjects'] });
      queryClient.invalidateQueries({ queryKey: ['developerDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['developerAnalytics'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.projects.update(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developerProjects'] });
      queryClient.invalidateQueries({ queryKey: ['developerDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['developerAnalytics'] });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (projectId: string) => {
      const res = await api.projects.delete(projectId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developerProjects'] });
      queryClient.invalidateQueries({ queryKey: ['developerDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['developerAnalytics'] });
    },
  });
}

export function useUpdateInquiry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await api.developers.updateInquiry(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developerInquiries'] });
      queryClient.invalidateQueries({ queryKey: ['developerDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['developerAnalytics'] });
    },
  });
}
