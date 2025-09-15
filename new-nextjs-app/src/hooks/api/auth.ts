import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/services/api";

export function useProfileQuery(enabled: boolean = true) {
    return useQuery({
        queryKey: ["auth", "profile"],
        queryFn: async () => {
            const response = await api.auth.profile();
            return response.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
    });
}

export function useLoginMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["auth", "login"],
        mutationFn: async (payload: { email: string; password: string }) => {
            const response = await api.auth.login(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

export function useRegisterMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["auth", "register"],
        mutationFn: async (payload: { name: string; email: string; password: string }) => {
            const response = await api.auth.register(payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

