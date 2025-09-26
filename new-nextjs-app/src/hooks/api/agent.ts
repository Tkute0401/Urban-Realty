import { useMutation, useQuery, UseQueryOptions, UseMutationOptions, QueryKey } from "@tanstack/react-query";
import { api } from "@/lib/services/api";

export function useAgentDashboard(params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentDashboard", params] as QueryKey,
		queryFn: () => api.agent.dashboard(params).then(r => r.data),
		staleTime: 2 * 60 * 1000,
		...options,
	});
}

export function useAgentAnalytics(params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentAnalytics", params] as QueryKey,
		queryFn: () => api.agent.analytics(params).then(r => r.data),
		staleTime: 5 * 60 * 1000,
		...options,
	});
}

export function useAgentLeads(params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentLeads", params] as QueryKey,
		queryFn: () => api.agent.leads(params).then(r => r.data),
		...options,
	});
}

export function useUpdateLeadStatus(options?: UseMutationOptions<any, Error, { leadId: string; status: string }>) {
	return useMutation<any, Error, { leadId: string; status: string }>({
		mutationFn: ({ leadId, status }) => api.agent.updateLead(leadId, { status }).then(r => r.data),
		...options,
	});
}

export function useAgentProperties(params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentProperties", params] as QueryKey,
		queryFn: () => api.agent.properties(params).then(r => r.data),
		...options,
	});
}

export function useDeleteProperty(options?: UseMutationOptions<any, Error, { propertyId: string }>) {
	return useMutation<any, Error, { propertyId: string }>({
		mutationFn: ({ propertyId }) => api.properties.delete(propertyId).then(r => r.data),
		...options,
	});
}

// Admin hooks for accessing any agent's data (admin only)
export function useAdminAgentDashboard(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["adminAgentDashboard", agentId, params] as QueryKey,
		queryFn: () => api.agent.adminDashboard(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		staleTime: 2 * 60 * 1000,
		...options,
	});
}

export function useAdminAgentAnalytics(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["adminAgentAnalytics", agentId, params] as QueryKey,
		queryFn: () => api.agent.adminAnalytics(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		staleTime: 5 * 60 * 1000,
		...options,
	});
}

export function useAdminAgentLeads(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["adminAgentLeads", agentId, params] as QueryKey,
		queryFn: () => api.agent.adminLeads(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		...options,
	});
}

export function useAdminAgentProperties(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["adminAgentProperties", agentId, params] as QueryKey,
		queryFn: () => api.agent.adminProperties(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		...options,
	});
}

