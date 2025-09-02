import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../services/axios';

// Generic fetcher using axios instance
const fetcher = async ({ url, method = 'get', params, data, config }) => {
	const response = await axios({ url, method, params, data, ...config });
	return response.data;
};

export function useApiQuery({ key, url, params, enabled = true, select, staleTime, cacheTime, refetchOnWindowFocus }) {
	return useQuery({
		queryKey: key,
		queryFn: () => fetcher({ url, params }),
		enabled,
		select,
		staleTime,
		cacheTime,
		refetchOnWindowFocus,
	});
}

export function useApiMutation({ url, method = 'post', invalidateKeys = [], onSuccess, onError }) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload) => fetcher({ url, method, data: payload }),
		onSuccess: (data, variables, context) => {
			if (invalidateKeys?.length) {
				invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
			}
			onSuccess?.(data, variables, context);
		},
		onError,
	});
}

export function useApiClient() {
	return useMemo(() => ({
		get: (url, params, config) => fetcher({ url, method: 'get', params, config }),
		post: (url, data, config) => fetcher({ url, method: 'post', data, config }),
		put: (url, data, config) => fetcher({ url, method: 'put', data, config }),
		patch: (url, data, config) => fetcher({ url, method: 'patch', data, config }),
		delete: (url, params, config) => fetcher({ url, method: 'delete', params, config }),
	}), []);
}

