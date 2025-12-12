import {feedInstance} from "@/api/apiClient.ts";
import {z} from "zod";
import {postResSchema} from "@/api/postClient.ts";


const connectionSchema = z.object({
    username: z.string(),
    email: z.string(),
    profile_pic: z.string(),
});

// Fetch posts for user feed (for-you)
export const fetchForYouPosts = async () => {
    const response = await feedInstance.get("/for-you");
    return response.data.map((post: unknown) => {
        const parsed = postResSchema.safeParse(post);
        if (!parsed.success) throw new Error("Invalid post format");
        return parsed.data;
    });
};

// Fetch project recommendations
export const fetchProjectRecommendations = async () => {
    const response = await feedInstance.get("/recommendations");
    return response.data.map((proj: unknown) => {
        const parsed = projectResSchema.safeParse(proj);
        if (!parsed.success) throw new Error("Invalid project format");
        return parsed.data;
    });
};

// Fetch suggested connections for a specific user
export const fetchSuggestedConnectionsForUser = async (username: string) => {
    const response = await feedInstance.get(`/${username}/suggested-connections`);
    return response.data
        .map((conn: unknown) => {
            const parsed = connectionSchema.safeParse(conn);
            return parsed.success ? parsed.data : null;
        })
        .filter(Boolean);
};

// Legacy endpoints (kept for backward compatibility)

// Fetch feed posts
export const fetchFeedPosts = async () => {
    const response = await feedInstance.get("/feed/posts");
    return response.data.map((post: unknown) => {
        const parsed = postResSchema.safeParse(post);
        if (!parsed.success) throw new Error("Invalid post format");
        return parsed.data;
    });
};

// Fetch feed projects
export const fetchFeedProjects = async () => {
    const response = await feedInstance.get("/feed/projects");
    return response.data.map((proj: unknown) => {
        const parsed = projectResSchema.safeParse(proj);
        if (!parsed.success) throw new Error("Invalid project format");
        return parsed.data;
    });
};

// Fetch suggested connections
export const fetchSuggestedConnections = async () => {
    const response = await feedInstance.get("/connections");
    return response.data
        .map((conn: unknown) => {
            const parsed = connectionSchema.safeParse(conn);
            return parsed.success ? parsed.data : null;
        })
        .filter(Boolean);
};