// apiClient.ts
import axios from "axios";

// Replace this with your actual token fetch logic (e.g., from localStorage)
const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
};

// Attach interceptors
const attachInterceptors = (instance: ReturnType<typeof axios.create>) => {
    // Request Interceptor
    instance.interceptors.request.use(
        (config) => {
            const token = getAuthToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            console.error("Request Error:", error);
            return Promise.reject(error);
        }
    );

    // Response Interceptor
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("Response Error:", error?.response?.data || error.message);
            return Promise.reject(error);
        }
    );
};

// 🔧 Axios Instances

export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
});
attachInterceptors(axiosInstance);

export const authInstance = axios.create({
    baseURL: "http://localhost:8000/auth",
});
attachInterceptors(authInstance);

export const postInstance = axios.create({
    baseURL: "http://localhost:8000/post",
});
attachInterceptors(postInstance);

export const projectInstance = axios.create({
    baseURL: "http://localhost:8000/project",
});
attachInterceptors(projectInstance);

export const feedInstance = axios.create({
    baseURL: "http://localhost:8000/feed",
});
attachInterceptors(feedInstance);
