// Shared API types and normalized envelope

export type NormalizedApiResponse<TData = unknown> = {
  status: number;
  success: boolean;
  data: TData | null;
  message?: string;
  error?: string;
  raw?: unknown;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

