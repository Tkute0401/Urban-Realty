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
	},
	properties: {
		list: (params: Record<string, any>) => unwrap<PaginatedResult<any>>(http.get("/properties", { params })),
		getById: (id: string) => unwrap<any>(http.get(`/properties/${id}`)),
		create: (payload: any) => unwrap<any>(http.post("/properties", payload)),
	},
	admin: {
		stats: () => unwrap<any>(http.get("/admin/stats")),
		dashboard: () => unwrap<any>(http.get("/admin/dashboard")),
		analytics: () => unwrap<any>(http.get("/admin/analytics")),
	},
	subscriptions: {
		plans: () => unwrap<any[]>(http.get("/subscriptions/plans")),
	},
};

export type ApiClient = typeof api;

