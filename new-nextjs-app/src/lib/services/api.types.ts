// Shared API types and helpers for normalized responses

export type ApiStatus = "success" | "error" | "fail";

export interface NormalizedApiResponse<TData> {
	status: ApiStatus;
	success: boolean;
	data: TData;
	message?: string;
}

export class ApiError extends Error {
	statusCode?: number;
	code?: string;
	responseBody?: unknown;

	constructor(message: string, options?: { statusCode?: number; code?: string; responseBody?: unknown }) {
		super(message);
		this.name = "ApiError";
		this.statusCode = options?.statusCode;
		this.code = options?.code;
		this.responseBody = options?.responseBody;
	}
}

export interface PaginatedResult<TItem> {
	items: TItem[];
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
}

