import http from "./http";
import { ApiError, NormalizedApiResponse, PaginatedResult } from "./api.types";

async function unwrap<T>(promise: Promise<{ data: any; status: number }>): Promise<NormalizedApiResponse<T>> {
	try {
		const { data, status } = await promise;
		// Normalize common envelopes
		if (data && typeof data === "object" && ("data" in data || "success" in data || "status" in data)) {
			const successProp = Boolean((data as any).success ?? (status >= 200 && status < 300));
			return {
				status: successProp ? "success" : "fail",
				success: successProp,
				data: (data as any).data ?? data,
				message: (data as any).message,
			};
		}
		return { status: "success", success: true, data } as NormalizedApiResponse<T>;
	} catch (err: any) {
		const message = err?.response?.data?.message || err?.message || "Request failed";
		throw new ApiError(message, {
			statusCode: err?.response?.status,
			responseBody: err?.response?.data,
		});
	}
}

export const api = {
	auth: {
		login: (payload: { email: string; password: string }) => unwrap<{ token: string; user: any }>(http.post("/auth/login", payload)),
		register: (payload: { name: string; email: string; password: string }) => unwrap<{ user: any }>(http.post("/auth/register", payload)),
		profile: () => unwrap<any>(http.get("/auth/profile")),
		// Favorites
		favoritesList: () => unwrap<any[]>(http.get("/auth/favorites")),
		addFavorite: (propertyId: string) => unwrap<any>(http.put(`/auth/favorites/${propertyId}`, {})),
		removeFavorite: (propertyId: string) => unwrap<any>(http.delete(`/auth/favorites/${propertyId}`)),
		favoriteStatus: (propertyId: string) => unwrap<{ favorited: boolean }>(http.get(`/auth/favorites/${propertyId}/status`)),
		// Recently viewed
		recentlyViewedList: () => unwrap<any[]>(http.get("/auth/recently-viewed")),
		addRecentlyViewed: (propertyId: string) => unwrap<any>(http.post(`/auth/recently-viewed/${propertyId}`, {})),
	},
	properties: {
		list: (params: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/properties", { params })),
		getById: (id: string) => unwrap<any>(http.get(`/properties/${id}`)),
		create: (payload: any) => unwrap<any>(http.post("/properties", payload)),
		delete: (id: string) => unwrap<any>(http.delete(`/properties/${id}`)),
	},
	admin: {
		stats: () => unwrap<any>(http.get("/admin/stats")),
		dashboard: () => unwrap<any>(http.get("/admin/dashboard")),
		analytics: () => unwrap<any>(http.get("/admin/analytics")),
	},
	agent: {
		// Agent dashboard & analytics
		dashboard: (agentId: string, params?: Record<string, any>) => unwrap<any>(http.get(`/agent/${agentId}/dashboard`, { params })),
		analytics: (agentId: string, params?: Record<string, any>) => unwrap<any>(http.get(`/agent/${agentId}/analytics`, { params })),
		// Agent leads
		leads: (agentId: string, params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get(`/agent/${agentId}/leads`, { params })),
		updateLead: (leadId: string, payload: { status?: string }) => unwrap<any>(http.put(`/contacts/${leadId}`, payload)),
		// Agent properties
		properties: (agentId: string, params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get(`/agent/${agentId}/properties`, { params })),
	},
	subscriptions: {
		plans: () => unwrap<any[]>(http.get("/subscriptions/plans")),
		current: (userId: string) => unwrap<any>(http.get(`/subscriptions/${userId}`)),
		subscribe: (payload: { userId: string; planId: string; paymentMethod: string }) =>
			unwrap<any>(http.post(`/subscriptions/${payload.userId}/subscribe`, { planId: payload.planId, paymentMethod: payload.paymentMethod })),
		cancel: (userId: string) => unwrap<any>(http.post(`/subscriptions/${userId}/cancel`, {})),
		update: (payload: { userId: string; planId: string }) =>
			unwrap<any>(http.post(`/subscriptions/${payload.userId}/update`, { planId: payload.planId })),
	},
};

export type ApiClient = typeof api;

