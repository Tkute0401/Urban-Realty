import axios, { AxiosInstance } from "axios";
import { getApiBaseUrl, getBrowserAccessToken } from "./api.config";

const http: AxiosInstance = axios.create({
        baseURL: getApiBaseUrl(),
        withCredentials: true,
});

http.interceptors.request.use((config) => {
        const token = getBrowserAccessToken();
        if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
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

