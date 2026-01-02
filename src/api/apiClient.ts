import axios from "axios";

export const getAuthToken = (): string | null => {
    const authStore = localStorage.getItem("auth-store");
    if (authStore) {
        try {
            const parsed = JSON.parse(authStore);
            return parsed.state?.accessToken || null;
        } catch {
            return null;
        }
    }
    return null;
};

const attachInterceptors = (instance: ReturnType<typeof axios.create>) => {
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

    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error("Response Error:", error?.response?.data || error.message);
            return Promise.reject(error);
        }
    );
};



export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
});
attachInterceptors(axiosInstance);

// Specialized instances for cleaner URLs
export const authInstance = axios.create({
    baseURL: "http://localhost:8000/auth",
});
attachInterceptors(authInstance);

export const postInstance = axios.create({
    baseURL: "http://localhost:8000/posts",
});
attachInterceptors(postInstance);

export const projectInstance = axios.create({
    baseURL: "http://localhost:8000/projects",
});
attachInterceptors(projectInstance);

export const feedInstance = axios.create({
    baseURL: "http://localhost:8000/feed",
});
attachInterceptors(feedInstance);
