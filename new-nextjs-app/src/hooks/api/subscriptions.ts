import { useMutation, useQuery, UseMutationOptions, UseQueryOptions, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/services/api";

const queryKeys = {
    plans: ["subscriptions", "plans"] as const,
    current: (userId?: string) => ["subscriptions", "current", userId ?? "me"] as const,
    razorpayKey: ["razorpay", "key"] as const,
};

export function useSubscriptionPlans(options?: UseQueryOptions<any[], Error, any[], readonly ["subscriptions", "plans"]>) {
    return useQuery({
        queryKey: queryKeys.plans,
        queryFn: async () => {
            const res = await api.subscriptions.plans();
            // Handle the response which contains success:true, data: array
            const data = Array.isArray(res.data) ? res.data : [res.data];
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
            const res = await api.subscriptions.current(userId || "me");
            return res.data;
        },
        enabled: Boolean(userId),
        staleTime: 60 * 1000,
        ...options,
    });
}

export function useRazorpayKey(options?: UseQueryOptions<any, Error, any, readonly ["razorpay", "key"]>) {
    return useQuery({
        queryKey: queryKeys.razorpayKey,
        queryFn: async () => {
            const res = await api.subscriptions.razorpayKey();
            return res.data; // expose { key }
        },
        staleTime: 10 * 60 * 1000, // 10 minutes
        ...options,
    });
}

export function useCreateRazorpayOrderMutation(options?: UseMutationOptions<any, Error, { subscriptionId: string; billingCycle: string }>) {
    return useMutation({
        mutationFn: async ({ subscriptionId, billingCycle }) => {
            const res = await api.subscriptions.createRazorpayOrder({ subscriptionId, billingCycle });
            return res.data; // expose { order, subscription }
        },
        ...options,
    });
}

export function useVerifyRazorpayPaymentMutation(options?: UseMutationOptions<any, Error, { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }>) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (paymentData) => {
            const res = await api.subscriptions.verifyRazorpayPayment(paymentData);
            return res.data; // expose verification result
        },
        onSuccess: () => {
            // Invalidate subscription queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
        },
        ...options,
    });
}

export function useSubscribeMutation(options?: UseMutationOptions<any, Error, { userId: string; planId: string; paymentMethod: string; billingCycle?: string }>) {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ userId, planId, paymentMethod, billingCycle = "monthly" }) => {
            const res = await api.subscriptions.subscribe({ userId, planId, paymentMethod, billingCycle });
            return res.data;
        },
        onSuccess: () => {
            // Invalidate subscription queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
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

