import { axiosInstance } from "@/api/apiClient";
import { UserResponse } from "@/entities/User";
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



export const follow = async (usernameToFollow: string) => {

    const response = await axiosInstance.put(`/users/follow/${usernameToFollow}`)
    console.log("✅ Follow response:", response.data);
    return response.data;
}


export const unfollow = async (usernameToUnfollow: string) => {

    const response = await axiosInstance.put(`/users/unfollow/${usernameToUnfollow}`)
    console.log("✅ Unfollow response:", response.data);
    return response.data;
    
}


export const getFollowers = async (username: string) => {
    const response = await axiosInstance.get(`/users/followers/${username}`);
    const followers = response.data.map((follower: any) => {
        const res = UserResponse.safeParse(follower);
        return res.success ? res.data : null;
    }).filter((follower: any) => follower !== null);
    return followers;
}

export const getFollowings = async (username: string) => {
   const response = await axiosInstance.get(`/users/following/${username}`);
    const followings = response.data.map((following: any) => {
        const res = UserResponse.safeParse(following);
        return res.success ? res.data : null;
    }).filter((following: any) => following !== null);
    return followings;
}