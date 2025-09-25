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
                profile: () => unwrap<any>(http.get("/auth/me")),
                // Favorites
                favoritesList: () => unwrap<any[]>(http.get("/auth/favorites")),
                addFavorite: (propertyId: string) => unwrap<any>(http.put(`/auth/favorites/${propertyId}`, {})),
                removeFavorite: (propertyId: string) => unwrap<any>(http.delete(`/auth/favorites/${propertyId}`)),
                favoriteStatus: (propertyId: string) => unwrap<{ isFavorite: boolean }>(http.get(`/auth/favorites/${propertyId}/status`)), 
                // Recently viewed
                recentlyViewedList: () => unwrap<any[]>(http.get("/auth/recently-viewed")),
                addRecentlyViewed: (propertyId: string) => unwrap<any>(http.post(`/auth/recently-viewed/${propertyId}`, {})),
                // Profile updates
                updateProfile: (payload: any) => unwrap<any>(http.put("/auth/update", payload)),
                changePassword: (payload: { currentPassword: string; newPassword: string }) => unwrap<any>(http.put("/auth/password", payload)),
        },
        properties: {
                list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/properties", { params })),
                getById: (id: string) => unwrap<any>(http.get(`/properties/${id}`)),
                create: (payload: any) => unwrap<any>(http.post("/properties", payload)),
                update: (id: string, payload: any) => unwrap<any>(http.put(`/properties/${id}`, payload)),
                delete: (id: string) => unwrap<any>(http.delete(`/properties/${id}`)),
                featured: () => unwrap<any[]>(http.get("/properties/featured")),
        },
        admin: {
                stats: () => unwrap<any>(http.get("/admin/stats")),
                dashboard: () => unwrap<any>(http.get("/admin/stats")), // Fixed: Use stats endpoint for dashboard data
                analytics: () => unwrap<any>(http.get("/admin/analytics")),
                users: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/admin/users", { params })),
                properties: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/admin/properties", { params })),
                contacts: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/admin/contacts", { params })),
                updateUser: (userId: string, payload: any) => unwrap<any>(http.put(`/admin/users/${userId}`, payload)),
                deleteUser: (userId: string) => unwrap<any>(http.delete(`/admin/users/${userId}`)),
                deleteProperty: (propertyId: string) => unwrap<any>(http.delete(`/admin/properties/${propertyId}`)),
                verifyAgent: (agentId: string) => unwrap<any>(http.put(`/admin/agents/${agentId}/verify`, {})),
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
                plans: () => unwrap<any[]>(http.get("/subscriptions")),
                current: (userId: string) => unwrap<any>(http.get(`/subscriptions/my-subscription`)),
                subscribe: (payload: { userId: string; planId: string; paymentMethod: string; billingCycle: string }) =>
                        unwrap<any>(http.post(`/subscriptions/subscribe`, { subscriptionId: payload.planId, paymentMethod: payload.paymentMethod, billingCycle: payload.billingCycle })),
                cancel: (userId: string) => unwrap<any>(http.put(`/subscriptions/cancel`, {})),
                update: (payload: { userId: string; planId: string; billingCycle?: 'monthly' | 'yearly'; paymentMethod?: string }) =>
                        // Backend handles plan changes via subscribe endpoint; it cancels existing and creates a new pending/active subscription
                        unwrap<any>(
                                http.post(`/subscriptions/subscribe`, {
                                        subscriptionId: payload.planId,
                                        billingCycle: payload.billingCycle ?? 'monthly',
                                        paymentMethod: payload.paymentMethod ?? 'card',
                                })
                        ),
                // Razorpay specific endpoints
                razorpayKey: () => unwrap<any>(http.get("/subscriptions/razorpay/key")),
                createRazorpayOrder: (payload: { subscriptionId: string; billingCycle: string }) =>
                        unwrap<any>(http.post("/subscriptions/razorpay/order", payload)),
                verifyRazorpayPayment: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
                        unwrap<any>(http.post("/subscriptions/razorpay/verify", payload)),
        },
        developers: {
                list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/developers", { params })),
                getById: (id: string) => unwrap<any>(http.get(`/developers/${id}`)),
                create: (payload: any) => unwrap<any>(http.post("/developers", payload)),
                update: (id: string, payload: any) => unwrap<any>(http.put(`/developers/${id}`, payload)),
                delete: (id: string) => unwrap<any>(http.delete(`/developers/${id}`)),
        },
        contacts: {
                list: (params?: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/contacts", { params })),
                getById: (id: string) => unwrap<any>(http.get(`/contacts/${id}`)),
                create: (payload: any) => unwrap<any>(http.post("/contacts", payload)),
                update: (id: string, payload: any) => unwrap<any>(http.put(`/contacts/${id}`, payload)),
                delete: (id: string) => unwrap<any>(http.delete(`/contacts/${id}`)),
        },
        analytics: {
                track: (payload: { action: string; data: any }) => unwrap<any>(http.post("/analytics/track", payload)),
                dashboard: (params?: Record<string, any>) => unwrap<any>(http.get("/analytics/dashboard", { params })),
                reports: (params?: Record<string, any>) => unwrap<any>(http.get("/analytics/reports", { params })),
        },
        health: {
                check: () => unwrap<any>(http.get("/health")),
        },
};

export type ApiClient = typeof api;

