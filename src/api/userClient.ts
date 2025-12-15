import { axiosInstance } from "@/api/apiClient";
import useInitStore from "@/store/initStore";

// Get token for debugging
const getAuthToken = (): string | null => {
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

// Save user interests to backend
export const saveUserInterests = async (interests: string[]) => {
    const token = getAuthToken();
    const { user_email } = useInitStore.getState();
    
    console.log("📤 Sending interests to backend:", interests);
    console.log("📤 Total interests:", interests.length);
    console.log("👤 User email from store:", user_email);
    console.log("🔑 Access token exists:", !!token);
    console.log("🔑 Token preview:", token ? token.substring(0, 20) + "..." : "No token");
    
    // Include email in request body in case backend needs it
    const requestBody = {
        email: user_email,
        interests
    };
    
    // Log the full request configuration
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    };
    
    console.log("📋 Request config:", {
        url: "/users/update",
        method: "PUT",
        headers: config.headers,
        data: requestBody
    });
    
    const response = await axiosInstance.put("/users/update", 
        requestBody,
        config
    );
    
    console.log("✅ Backend response:", response.data);
    return response.data;
};
