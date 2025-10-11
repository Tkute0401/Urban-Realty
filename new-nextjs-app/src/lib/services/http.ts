import axios, { AxiosInstance } from "axios";
import { getApiBaseUrl, getBrowserAccessToken, addCacheBuster } from "./api.config";

const http: AxiosInstance = axios.create({
        withCredentials: true,
});

http.interceptors.request.use((config) => {
        // Dynamically set the base URL on each request
        config.baseURL = getApiBaseUrl();
        
        // Add cache buster for development
        if (config.url) {
                config.url = addCacheBuster(config.url);
        }
        
        const token = getBrowserAccessToken();
        if (token) {
                config.headers = { 
                        ...(config.headers as any), 
                        Authorization: `Bearer ${token}` 
                } as any;
        }
        return config;
});

http.interceptors.response.use(
        (response) => response,
        (error) => {
                // Handle 401 Unauthorized errors
                if (error.response?.status === 401) {
                        // Clear token and redirect to login
                        if (typeof window !== 'undefined') {
                                localStorage.removeItem('token');
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('user');
                                // Don't redirect if we're already on login page
                                if (!window.location.pathname.includes('/login')) {
                                        window.location.href = '/login';
                                }
                        }
                }
                return Promise.reject(error);
        }
);

export default http;

