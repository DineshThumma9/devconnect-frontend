import { z } from "zod";
import { authInstance } from "@/api/apiClient";
import { UserResponse } from "@/entities/User";


const LoginRequest = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    user: UserResponse
});

export const register = async (username: string, password: string, email: string, name?: string, profile_pic?: string) => {
    const body = { username, name, email, password, profile_pic };
    

    
    const res = await authInstance.post("/register", body);

    
    
    const parsed = LoginRequest.safeParse(res.data);
    
    if (!parsed.success) {
        console.error("❌ Validation failed:", parsed.error.errors);
        throw new Error("Response validation failed: " + JSON.stringify(parsed.error.errors));
    }
    
    return parsed.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
    const res = await authInstance.post("/login", data);
    

    
    if (res.status !== 200) {
        throw new Error("Login failed");
    }
    
    const parsed = LoginRequest.safeParse(res.data);
    
    if (!parsed.success) {
        throw new Error("Response validation failed: " + JSON.stringify(parsed.error.errors));
    }
    
    return parsed.data;
};