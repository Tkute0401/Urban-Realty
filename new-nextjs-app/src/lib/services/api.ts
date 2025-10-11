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
                login: (payload: { email: string; password: string }) => unwrap<{ token: string; user: any }>(http.post("/api/v1/auth/login", payload)),
                register: (payload: { name: string; email: string; password: string }) => unwrap<{ user: any }>(http.post("/api/v1/auth/register", payload)),
                profile: () => unwrap<any>(http.get("/api/v1/auth/me")),
                // Favorites
				favoritesList: () => unwrap<any[]>(http.get("/api/v1/auth/favorites")),
				addFavorite: (propertyId: string) => unwrap<any>(http.put(`/api/v1/auth/favorites/${propertyId}`, {})),
				removeFavorite: (propertyId: string) => unwrap<any>(http.delete(`/api/v1/auth/favorites/${propertyId}`)),
				favoriteStatus: (propertyId: string) => unwrap<{ isFavorite: boolean }>(http.get(`/api/v1/auth/favorites/${propertyId}/status`)),
				getFavoriteStatus: (propertyId: string) => unwrap<{ isFavorite: boolean }>(http.get(`/api/v1/auth/favorites/${propertyId}/status`)), 
				/**
				 * Toggle favorite state safely. If desiredState is provided, it enforces that state.
				 * If not provided, it tries PUT first and on 400 falls back to DELETE.
				 */
				toggleFavorite: async (propertyId: string, desiredState?: boolean) => {
					try {
						if (desiredState === true) {
							return await api.auth.addFavorite(propertyId);
						}
						if (desiredState === false) {
							return await api.auth.removeFavorite(propertyId);
						}
						// Unknown state: attempt PUT as default, then fallback to DELETE on 400
						else {
                                                        const res = await api.auth.addFavorite(propertyId);
						        return res;
                                                }
					} catch (err: any) {
						// If server returns 400 for duplicate add, try DELETE as fallback
						if (err?.statusCode === 400 || err?.options?.statusCode === 400) {
							return await api.auth.removeFavorite(propertyId);
						}
						throw err;
					}
				},
                // Recently viewed
                recentlyViewedList: () => unwrap<any[]>(http.get("/api/v1/auth/recently-viewed")),
                addRecentlyViewed: (propertyId: string) => unwrap<any>(http.post(`/api/v1/auth/recently-viewed/${propertyId}`, {})),
                // Profile updates
                updateProfile: (payload: any) => unwrap<any>(http.put("/api/v1/auth/update", payload)),
                changePassword: (payload: { currentPassword: string; newPassword: string }) => unwrap<any>(http.put("/api/v1/auth/password", payload)),
        },
        properties: {
                list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/properties", { params })),
                getById: (id: string) => unwrap<any>(http.get(`/api/v1/properties/${id}`)),
                create: (payload: any) => unwrap<any>(http.post("/api/v1/properties", payload)),
                update: (id: string, payload: any) => unwrap<any>(http.put(`/api/v1/properties/${id}`, payload)),
                delete: (id: string) => unwrap<any>(http.delete(`/api/v1/properties/${id}`)),
                featured: () => unwrap<any[]>(http.get("/api/v1/properties/featured")),
                searchSuggestions: (query: string) => unwrap<any>(http.get("/api/v1/properties/search-suggestions", { params: { query } })),
        },
        admin: {
                stats: () => unwrap<any>(http.get("/api/v1/admin/stats")),
                dashboard: () => unwrap<any>(http.get("/api/v1/admin/stats")), // Fixed: Use stats endpoint for dashboard data
                analytics: () => unwrap<any>(http.get("/api/v1/admin/analytics")),
                users: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/admin/users", { params })),
                properties: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/admin/properties", { params })),
                contacts: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/admin/contacts", { params })),
                contactStats: () => unwrap<any>(http.get("/api/v1/admin/contacts/stats")),
                getInquiry: (id: string) => unwrap<any>(http.get(`/api/v1/admin/inquiries/${id}`)),
                updateUser: (userId: string, payload: any) => unwrap<any>(http.put(`/api/v1/admin/users/${userId}`, payload)),
                updateUserStatus: (userId: string, payload: any) => unwrap<any>(http.patch(`/api/v1/admin/users/${userId}/status`, payload)),
                deleteUser: (userId: string) => unwrap<any>(http.delete(`/api/v1/admin/users/${userId}`)),
                deleteProperty: (propertyId: string) => unwrap<any>(http.delete(`/api/v1/admin/properties/${propertyId}`)),
                verifyAgent: (agentId: string) => unwrap<any>(http.put(`/api/v1/admin/agents/${agentId}/verify`, {})),
                settings: () => unwrap<any>(http.get("/api/v1/admin/settings")),
                updateSettings: (payload: any) => unwrap<any>(http.put("/api/v1/admin/settings", payload)),
                backup: () => unwrap<any>(http.post("/api/v1/admin/backup")),
                restore: (backupId: string) => unwrap<any>(http.post(`/api/v1/admin/restore/${backupId}`)),
                reports: (params?: Record<string, any>) => unwrap<any>(http.get("/api/v1/admin/reports", { params })),
                exportReport: (params?: Record<string, any>) => unwrap<any>(http.get("/api/v1/admin/reports/export", { params })),
                emailReport: (payload: any) => unwrap<any>(http.post("/api/v1/admin/reports/email", payload)),
                agents: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/admin/agents", { params })),
                media: (params?: Record<string, any>) => unwrap<any[]>(http.get("/api/v1/admin/media", { params })),
                uploadMedia: (formData: FormData, config?: any) => unwrap<any>(http.post("/api/v1/admin/media/upload", formData, config)),
                updateMedia: (id: string, payload: any) => unwrap<any>(http.put(`/api/v1/admin/media/${id}`, payload)),
                deleteMedia: (id: string) => unwrap<any>(http.delete(`/api/v1/admin/media/${id}`)),
        },
        // Inquiries APIs
        inquiries: {
            create: (payload: any) => unwrap<any>(http.post("/api/v1/inquiries", payload)),
            list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/inquiries", { params })),
            getById: (id: string) => unwrap<any>(http.get(`/api/v1/inquiries/${id}`)),
            update: (id: string, payload: any) => unwrap<any>(http.put(`/api/v1/inquiries/${id}`, payload)),
            delete: (id: string) => unwrap<any>(http.delete(`/api/v1/inquiries/${id}`)),
        },
        agent: {
                // Agent self-access endpoints (logged-in agent accessing their own data)
                dashboard: (params?: Record<string, any>) => unwrap<any>(http.get(`/api/v1/agent/dashboard`, { params })),
                analytics: (params?: Record<string, any>) => unwrap<any>(http.get(`/api/v1/agent/analytics`, { params })),
                leads: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get(`/api/v1/agent/leads`, { params })),
                properties: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get(`/api/v1/properties/agent/${params?.agentId || ''}`, { params })),
                updateLead: (leadId: string, payload: { status?: string }) => unwrap<any>(http.put(`/api/v1/contacts/${leadId}`, payload)),
                
                // Admin endpoints for accessing any agent's data (admin only)
                adminDashboard: (agentId: string, params?: Record<string, any>) => unwrap<any>(http.get(`/api/v1/agent/${agentId}/dashboard`, { params })),
                adminAnalytics: (agentId: string, params?: Record<string, any>) => unwrap<any>(http.get(`/api/v1/agent/${agentId}/analytics`, { params })),
                adminLeads: (agentId: string, params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get(`/api/v1/agent/${agentId}/leads`, { params })),
                adminProperties: (agentId: string, params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get(`/api/v1/agent/${agentId}/properties`, { params })),
        },
        subscriptions: {
                plans: () => unwrap<any[]>(http.get("/api/v1/subscriptions")),
                current: (userId: string) => unwrap<any>(http.get(`/api/v1/subscriptions/my-subscription`)),
                getMySubscription: () => unwrap<any>(http.get("/api/v1/subscriptions/my-subscription")),
                getBillingHistory: () => unwrap<any>(http.get("/api/v1/subscriptions/billing-history")),
                getUpcomingBilling: () => unwrap<any>(http.get("/api/v1/subscriptions/upcoming-billing")),
                subscribe: (payload: { userId: string; planId: string; paymentMethod: string; billingCycle: string }) =>
                        unwrap<any>(http.post(`/api/v1/subscriptions/subscribe`, { subscriptionId: payload.planId, paymentMethod: payload.paymentMethod, billingCycle: payload.billingCycle })),
                cancel: (userId: string) => unwrap<any>(http.put(`/api/v1/subscriptions/cancel`, {})),
                update: (payload: { userId: string; planId: string; billingCycle?: 'monthly' | 'yearly'; paymentMethod?: string }) =>
                        // Backend handles plan changes via subscribe endpoint; it cancels existing and creates a new pending/active subscription
                        unwrap<any>(
                                http.post(`/api/v1/subscriptions/subscribe`, {
                                        subscriptionId: payload.planId,
                                        billingCycle: payload.billingCycle ?? 'monthly',
                                        paymentMethod: payload.paymentMethod ?? 'card',
                                })
                        ),
                // Razorpay specific endpoints
                razorpayKey: () => unwrap<any>(http.get("/api/v1/subscriptions/razorpay/key")),
                createRazorpayOrder: (payload: { subscriptionId: string; billingCycle: string }) =>
                        unwrap<any>(http.post("/api/v1/subscriptions/razorpay/order", payload)),
                verifyRazorpayPayment: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
                        unwrap<any>(http.post("/api/v1/subscriptions/razorpay/verify", payload)),
                downloadInvoice: (subscriptionId: string) =>
                        unwrap<any>(http.get(`/api/v1/subscriptions/invoice/${subscriptionId}/download`, { responseType: 'blob' })),
        },
        projects: {
                list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/projects", { params })),
                getById: (id: string) => unwrap<any>(http.get(`/api/v1/projects/${id}`)),
                getMyProjects: () => unwrap<any>(http.get("/api/v1/projects/my-projects")),
                getByDeveloper: (developerId: string) => unwrap<any>(http.get(`/api/v1/projects/developer/${developerId}`)),
                create: (payload: any) => unwrap<any>(http.post("/api/v1/projects", payload)),
                update: (id: string, payload: any) => unwrap<any>(http.put(`/api/v1/projects/${id}`, payload)),
                delete: (id: string) => unwrap<any>(http.delete(`/api/v1/projects/${id}`)),
        },
        developers: {
                list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/developers", { params })),
                getById: (id: string) => unwrap<any>(http.get(`/api/v1/developers/${id}`)),
                getMyProfile: () => unwrap<any>(http.get("/api/v1/developers/profile/me")),
                create: (payload: any) => unwrap<any>(http.post("/api/v1/developers", payload)),
                update: (id: string, payload: any) => unwrap<any>(http.put(`/api/v1/developers/${id}`, payload)),
                delete: (id: string) => unwrap<any>(http.delete(`/api/v1/developers/${id}`)),
        },
        search: {
                suggestions: (query: string) => unwrap<any>(http.get("/api/v1/properties/search-suggestions", { params: { query } })),
        },
        contacts: {
                list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/api/v1/contacts", { params })),
                getById: (id: string) => unwrap<any>(http.get(`/api/v1/contacts/${id}`)),
                create: (payload: any) => unwrap<any>(http.post("/api/v1/contacts", payload)),
                update: (id: string, payload: any) => unwrap<any>(http.put(`/api/v1/contacts/${id}`, payload)),
                delete: (id: string) => unwrap<any>(http.delete(`/api/v1/contacts/${id}`)),
        },
        analytics: {
                track: (payload: { action: string; data: any }) => unwrap<any>(http.post("/api/v1/analytics/track", payload)),
                dashboard: (params?: Record<string, any>) => unwrap<any>(http.get("/api/v1/analytics/dashboard", { params })),
                reports: (params?: Record<string, any>) => unwrap<any>(http.get("/api/v1/analytics/reports", { params })),
        },
        health: {
                check: () => unwrap<any>(http.get("/api/v1/health")),
        },
};

export type ApiClient = typeof api;

