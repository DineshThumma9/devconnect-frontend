import { authInstance } from "@/api/apiClient";

// Save user interests to backend
export const saveUserInterests = async (interests: string[]) => {
    const response = await authInstance.post("/users/interests", interests, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    return response.data;
};
