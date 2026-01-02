import { feedInstance } from "@/api/apiClient";
import { ProjectResponse } from "@/entities/Project";
import { PostResponse } from "@/entities/Post";
import { UserResponse } from "@/entities/User";

export const fetchForYouPosts = async (username: string) => {
    const response = await feedInstance.get(`/for-you/posts`);
    return response.data.map((post: unknown) => {
        const parsed = PostResponse.safeParse(post);
        if (!parsed.success) {
            console.error("Invalid post format:", parsed.error);
            throw new Error("Invalid post format");
        }
        return parsed.data;
    });
};

export const fetchProjectRecommendations = async (username: string) => {
    const response = await feedInstance.get(`/rec/${username}`);
    return response.data
        .map((proj: unknown) => ProjectResponse.safeParse(proj))
        .filter((result: any) => result.success)
        .map((result: any) => result.data);
};

export const fetchSuggestedConnectionsForUser = async (username: string) => {
    const response = await feedInstance.get(`/suggested-connections/${username}`);
    return response.data
        .map((conn: unknown) => UserResponse.safeParse(conn))
        .filter((result: any) => result.success)
        .map((result: any) => result.data);
};

export const getTrendingPosts = async () => {
    const response = await feedInstance.get("/trending/posts");
    return response.data.map((post: unknown) => {
        const parsed = PostResponse.safeParse(post);
        if (!parsed.success) {
            console.error("Invalid post format:", parsed.error);
            throw new Error("Invalid post format");
        }
        return parsed.data;
    });
};
