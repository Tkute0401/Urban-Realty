import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_CONFIG, getAuthToken, isServer } from './api.config';
import { ApiError, NormalizedApiResponse } from './api.types';

function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.REQUEST_TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }

    // Let browser/axios set proper boundary for multipart
    if (config.data instanceof FormData && config.headers) {
      delete (config.headers as Record<string, string>)['Content-Type'];
    }

    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (!error.response) {
        return Promise.reject(new ApiError('Network Error: Please check your internet connection', 0));
      }

      const status = error.response.status;
      const data: any = error.response.data;
      const message = data?.message || error.message || 'An error occurred';

      // Do not redirect on server; let UI handle 401
      if (status === 401 && !isServer) {
        try {
          localStorage.removeItem('token');
        } catch {}
      }

      return Promise.reject(new ApiError(message, status, data));
    }
  );

  return instance;
}

export const http = createAxiosInstance();

export async function httpGet<T = unknown>(url: string, params?: Record<string, unknown>): Promise<NormalizedApiResponse<T>> {
  const res = await http.get(url, { params });
  const data: any = res.data;
  return {
    status: res.status,
    success: typeof data === 'object' && data ? (data.success ?? true) : true,
    data: typeof data === 'object' && data && 'data' in data ? (data.data as T) : (data as T),
    message: typeof data === 'object' && data ? (data.message as string | undefined) : undefined,
    raw: data,
  };
}

export async function httpPost<T = unknown>(url: string, body?: unknown): Promise<NormalizedApiResponse<T>> {
  const res = await http.post(url, body);
  const data: any = res.data;
  return {
    status: res.status,
    success: typeof data === 'object' && data ? (data.success ?? true) : true,
    data: typeof data === 'object' && data && 'data' in data ? (data.data as T) : (data as T),
    message: typeof data === 'object' && data ? (data.message as string | undefined) : undefined,
    raw: data,
  };
}

export async function httpPut<T = unknown>(url: string, body?: unknown): Promise<NormalizedApiResponse<T>> {
  const res = await http.put(url, body);
  const data: any = res.data;
  return {
    status: res.status,
    success: typeof data === 'object' && data ? (data.success ?? true) : true,
    data: typeof data === 'object' && data && 'data' in data ? (data.data as T) : (data as T),
    message: typeof data === 'object' && data ? (data.message as string | undefined) : undefined,
    raw: data,
  };
}

export async function httpDelete<T = unknown>(url: string): Promise<NormalizedApiResponse<T>> {
  const res = await http.delete(url);
  const data: any = res.data;
  return {
    status: res.status,
    success: typeof data === 'object' && data ? (data.success ?? true) : true,
    data: typeof data === 'object' && data && 'data' in data ? (data.data as T) : (data as T),
    message: typeof data === 'object' && data ? (data.message as string | undefined) : undefined,
    raw: data,
  };
}

export async function httpPostForm<T = unknown>(url: string, formData: FormData): Promise<NormalizedApiResponse<T>> {
  const res = await http.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  const data: any = res.data;
  return {
    status: res.status,
    success: typeof data === 'object' && data ? (data.success ?? true) : true,
    data: typeof data === 'object' && data && 'data' in data ? (data.data as T) : (data as T),
    message: typeof data === 'object' && data ? (data.message as string | undefined) : undefined,
    raw: data,
  };
}

