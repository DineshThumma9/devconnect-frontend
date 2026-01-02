import { axiosInstance } from "@/api/apiClient";
import { UserResponse } from "@/entities/User";
import useInitStore from "@/store/initStore";

export const saveUserInterests = async (interests: string[]) => {
    const { user_email } = useInitStore.getState();
    
    const response = await axiosInstance.put("/users/update", {
        email: user_email,
        interests
    });
    
    return response.data;
};

export const follow = async (usernameToFollow: string) => {
    const response = await axiosInstance.put(`/users/follow/${usernameToFollow}`);
    return response.data;
};

export const unfollow = async (usernameToUnfollow: string) => {
    const response = await axiosInstance.put(`/users/unfollow/${usernameToUnfollow}`);
    return response.data;
};

export const getFollowers = async (username: string) => {
    const response = await axiosInstance.get(`/users/followers/${username}`);
    return response.data
        .map((follower: any) => UserResponse.safeParse(follower))
        .filter((result: any) => result.success)
        .map((result: any) => result.data);
};

export const getFollowings = async (username: string) => {
    const response = await axiosInstance.get(`/users/following/${username}`);
    return response.data
        .map((following: any) => UserResponse.safeParse(following))
        .filter((result: any) => result.success)
        .map((result: any) => result.data);
};