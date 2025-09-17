import { useMutation, useQuery, UseQueryOptions, UseMutationOptions, QueryKey } from "@tanstack/react-query";
import { api } from "@/lib/services/api";

export function useAgentDashboard(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentDashboard", agentId, params] as QueryKey,
		queryFn: () => api.agent.dashboard(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		staleTime: 2 * 60 * 1000,
		...options,
	});
}

export function useAgentAnalytics(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentAnalytics", agentId, params] as QueryKey,
		queryFn: () => api.agent.analytics(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		staleTime: 5 * 60 * 1000,
		...options,
	});
}

export function useAgentLeads(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentLeads", agentId, params] as QueryKey,
		queryFn: () => api.agent.leads(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		...options,
	});
}

export function useUpdateLeadStatus(options?: UseMutationOptions<any, Error, { leadId: string; status: string }>) {
	return useMutation<any, Error, { leadId: string; status: string }>({
		mutationFn: ({ leadId, status }) => api.agent.updateLead(leadId, { status }).then(r => r.data),
		...options,
	});
}

export function useAgentProperties(agentId: string | undefined, params?: Record<string, any>, options?: Partial<UseQueryOptions<any>>) {
	return useQuery({
		queryKey: ["agentProperties", agentId, params] as QueryKey,
		queryFn: () => api.agent.properties(agentId as string, params).then(r => r.data),
		enabled: Boolean(agentId),
		...options,
	});
}

export function useDeleteProperty(options?: UseMutationOptions<any, Error, { propertyId: string }>) {
	return useMutation<any, Error, { propertyId: string }>({
		mutationFn: ({ propertyId }) => api.properties.delete(propertyId).then(r => r.data),
		...options,
	});
}

