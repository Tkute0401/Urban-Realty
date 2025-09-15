import axios, { AxiosInstance } from "axios";

// SSR-safe token accessors
function getAccessToken(): string | null {
	if (typeof window === "undefined") return null;
	try {
		return window.localStorage.getItem("access_token");
	} catch {
		return null;
	}
}

function getBaseUrl(): string {
	// Prefer NEXT_PUBLIC_API_URL for browser, fallback to process.env on server
	const envUrl = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_API_URL as string | undefined) : (process.env.API_URL as string | undefined);
	return envUrl || "/api";
}

const http: AxiosInstance = axios.create({
	baseURL: getBaseUrl(),
	withCredentials: true,
});

http.interceptors.request.use((config) => {
	const token = getAccessToken();
	if (token) {
		config.headers = config.headers ?? {};
		(config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
	}
	return config;
});

http.interceptors.response.use(
	(response) => response,
	(error) => {
		// Allow consumers to handle uniformly
		return Promise.reject(error);
	}
);

export default http;

