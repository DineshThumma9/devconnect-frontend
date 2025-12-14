import { authInstance } from "@/api/apiClient";

// Save user interests to backend
export const saveUserInterests = async (interests: string[]) => {
    console.log("📤 Sending interests to backend:", interests);
    console.log("📤 Total interests:", interests.length);
    
    const response = await authInstance.post("/users/interests", 
        { interests }, // Send as object with interests property
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    
    console.log("✅ Backend response:", response.data);
    return response.data;
};
