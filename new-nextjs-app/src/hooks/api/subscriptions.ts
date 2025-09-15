import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import { api } from "@/lib/services/api";

const queryKeys = {
    plans: ["subscriptions", "plans"] as const,
    current: (userId?: string) => ["subscriptions", "current", userId ?? "me"] as const,
};

export function useSubscriptionPlans(options?: UseQueryOptions<any[], Error, any[], readonly ["subscriptions", "plans"]>) {
    return useQuery({
        queryKey: queryKeys.plans,
        queryFn: async () => {
            const res = await api.subscriptions.plans();
            const data = Array.isArray((res.data as any)?.plans) ? (res.data as any).plans : (res.data as any);
            return data as any[];
        },
        staleTime: 5 * 60 * 1000,
        ...options,
    });
}

export function useCurrentSubscription(userId?: string, options?: UseQueryOptions<any, Error, any, readonly ["subscriptions", "current", string]>) {
    return useQuery({
        queryKey: queryKeys.current(userId),
        queryFn: async () => {
            if (!userId) return null;
            const res = await api.subscriptions.current(userId);
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 60 * 1000,
        ...options,
    });
}

export function useSubscribeMutation(options?: UseMutationOptions<any, Error, { userId: string; planId: string; paymentMethod: string }>) {
    return useMutation({
        mutationFn: async ({ userId, planId, paymentMethod }) => {
            const res = await api.subscriptions.subscribe({ userId, planId, paymentMethod });
            return res.data;
        },
        ...options,
    });
}

export function useCancelSubscriptionMutation(options?: UseMutationOptions<any, Error, { userId: string }>) {
    return useMutation({
        mutationFn: async ({ userId }) => {
            const res = await api.subscriptions.cancel(userId);
            return res.data;
        },
        ...options,
    });
}

export function useUpdateSubscriptionMutation(options?: UseMutationOptions<any, Error, { userId: string; planId: string }>) {
    return useMutation({
        mutationFn: async ({ userId, planId }) => {
            const res = await api.subscriptions.update({ userId, planId });
            return res.data;
        },
        ...options,
    });
}

