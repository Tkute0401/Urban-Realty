import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/services/api";

export function useProfileQuery(enabled: boolean = true) {
    console.log('🔧 useProfileQuery hook called with enabled:', enabled);
    
    return useQuery({
        queryKey: ["auth", "profile"],
        queryFn: async () => {
            console.log('🔧 useProfileQuery - Fetching user profile');
            try {
                const response = await api.auth.profile();
                console.log('🔧 useProfileQuery - Profile fetched successfully:', {
                    userId: response.data?.user?._id || response.data?.user?.id,
                    success: response.success
                });
                return response.data;
            } catch (error) {
                console.error('🔧 useProfileQuery - Error fetching profile:', error);
                throw error;
            }
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        retry: false, // Don't retry on auth failures
    });
}

export function useLoginMutation() {
    console.log('🔧 useLoginMutation hook called');
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["auth", "login"],
        mutationFn: async (payload: { email: string; password: string }) => {
            console.log('🔧 useLoginMutation - Attempting login with email:', payload.email);
            try {
                const response = await api.auth.login(payload);
                console.log('🔧 useLoginMutation - Login successful:', {
                    userId: response.data?.user?._id || response.data?.user?.id,
                    success: response.success
                });
                return response.data;
            } catch (error) {
                console.error('🔧 useLoginMutation - Login error:', error);
                throw error;
            }
        },
        onSuccess: () => {
            console.log('🔧 useLoginMutation - Invalidating auth queries after successful login');
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

export function useRegisterMutation() {
    console.log('🔧 useRegisterMutation hook called');
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: ["auth", "register"],
        mutationFn: async (payload: { name: string; email: string; password: string }) => {
            console.log('🔧 useRegisterMutation - Attempting registration with email:', payload.email);
            try {
                const response = await api.auth.register(payload);
                console.log('🔧 useRegisterMutation - Registration successful:', {
                    userId: response.data?.user?._id || response.data?.user?.id,
                    success: response.success
                });
                return response.data;
            } catch (error) {
                console.error('🔧 useRegisterMutation - Registration error:', error);
                throw error;
            }
        },
        onSuccess: () => {
            console.log('🔧 useRegisterMutation - Invalidating auth queries after successful registration');
            queryClient.invalidateQueries({ queryKey: ["auth"] });
        },
    });
}

